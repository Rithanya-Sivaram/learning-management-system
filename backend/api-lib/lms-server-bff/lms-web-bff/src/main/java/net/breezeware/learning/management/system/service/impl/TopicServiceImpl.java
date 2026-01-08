package net.breezeware.learning.management.system.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import net.breezeware.dynamo.generics.crud.service.GenericService;
import net.breezeware.dynamo.utils.exception.DynamoException;
import net.breezeware.learning.management.system.dao.CourseRepository;
import net.breezeware.learning.management.system.dao.TopicRepository;
import net.breezeware.learning.management.system.dao.VectorStoreRepository;
import net.breezeware.learning.management.system.dto.EmbeddingDto;
import net.breezeware.learning.management.system.dto.TopicDto;
import net.breezeware.learning.management.system.entity.Course;
import net.breezeware.learning.management.system.entity.Topic;
import net.breezeware.learning.management.system.mapper.TopicMapper;
import net.breezeware.learning.management.system.service.api.EmbeddingService;
import net.breezeware.learning.management.system.service.api.TopicService;

import lombok.extern.slf4j.Slf4j;

import jakarta.transaction.Transactional;

/**
 * Implementation of the {@link TopicService}. Provides functionality to create,
 * update, retrieve, and delete topics, while also updating embeddings in the
 * vector store repository.
 */
@Service
@Slf4j
public class TopicServiceImpl extends GenericService<Topic> implements TopicService {

    private final TopicRepository topicRepository;
    private final CourseRepository courseRepository;
    private final TopicMapper topicMapper;
    private final VectorStoreRepository vectorStoreRepository;
    private final EmbeddingService embeddingService;

    public TopicServiceImpl(TopicRepository topicRepository, CourseRepository courseRepository, TopicMapper topicMapper,
            VectorStoreRepository vectorStoreRepository, EmbeddingService embeddingService) {
        super(topicRepository);
        this.topicRepository = topicRepository;
        this.courseRepository = courseRepository;
        this.topicMapper = topicMapper;
        this.vectorStoreRepository = vectorStoreRepository;
        this.embeddingService = embeddingService;
    }

    /**
     * Creates a new topic, associates it with a course, and updates embeddings.
     * @param  topicDto the data for the topic to create
     * @return          the saved {@link Topic}
     */
    @Transactional
    @Override
    public Topic createTopic(TopicDto topicDto) {
        log.info("Entering createTopic()");
        try {
            Course course = courseRepository.findById(topicDto.getCourseId())
                    .orElseThrow(() -> new DynamoException("Course not found with ID: " + topicDto.getCourseId(),
                            HttpStatus.NOT_FOUND));

            Topic topic = topicMapper.topicDtoToTopic(topicDto);
            topic.setCourse(course);

            Topic savedTopic = create(topic);

            refreshCourseEmbeddings(course);

            log.info("Leaving createTopic()");
            return savedTopic;
        } catch (Exception e) {
            log.error("Error while creating topic: {}", e.getMessage(), e);
            throw new DynamoException("Failed to create topic: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Updates an existing topic and refreshes embeddings.
     * @param  topicId  the ID of the topic to update
     * @param  topicDto the updated topic data
     * @return          the updated {@link Topic}
     */
    @Transactional
    @Override
    public Topic updateTopic(long topicId, TopicDto topicDto) {
        log.info("Entering updateTopic()");
        try {
            Topic existingTopic = retrieveById(topicId).orElseThrow(
                    () -> new DynamoException("Topic not found with ID: " + topicId, HttpStatus.NOT_FOUND));

            existingTopic.setName(topicDto.getName());
            existingTopic.setDescription(topicDto.getDescription());
            existingTopic.setDuration(topicDto.getDuration());

            Topic updatedTopic = update(existingTopic);

            Course course = courseRepository.findById(topicDto.getCourseId())
                    .orElseThrow(() -> new DynamoException("Course not found with ID: " + topicDto.getCourseId(),
                            HttpStatus.NOT_FOUND));

            refreshCourseEmbeddings(course);

            log.info("Leaving updateTopic()");
            return updatedTopic;
        } catch (Exception e) {
            log.error("Error while updating topic: {}", e.getMessage(), e);
            throw new DynamoException("Failed to update topic: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Deletes a topic by ID and refreshes embeddings.
     * @param topicId the ID of the topic to delete
     */
    @Transactional
    @Override
    public void deleteTopic(long topicId) {
        log.info("Entering deleteTopic()");
        try {
            Topic topic = topicRepository.findById(topicId).orElseThrow(
                    () -> new DynamoException("Topic not found with ID: " + topicId, HttpStatus.NOT_FOUND));

            delete(topic.getId());

            refreshCourseEmbeddings(topic.getCourse());

            log.info("Leaving deleteTopic()");
        } catch (Exception e) {
            log.error("Error while deleting topic with ID: {}", topicId, e);
            throw new DynamoException("Failed to delete topic: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Retrieves a topic by its ID.
     * @param  topicId the ID of the topic
     * @return         the {@link TopicDto} of the requested topic
     */
    @Override
    public TopicDto getTopicById(long topicId) {
        log.info("Entering getTopicById()");
        try {
            Topic topic = topicRepository.findById(topicId).orElseThrow(
                    () -> new DynamoException("Topic not found with ID: " + topicId, HttpStatus.NOT_FOUND));

            TopicDto topicDto = topicMapper.topicToTopicDto(topic);
            log.info("Leaving getTopicById()");
            return topicDto;
        } catch (Exception e) {
            log.error("Error while fetching topic with ID: {}", topicId, e);
            throw new DynamoException("Failed to fetch topic: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Retrieves all topics for a given course.
     * @param  courseId the ID of the course
     * @return          a list of {@link TopicDto}
     */
    @Override
    public List<TopicDto> getTopicsByCourseId(long courseId) {
        log.info("Entering getTopicsByCourseId()");
        List<Topic> topics = topicRepository.findByCourseId(courseId);
        List<TopicDto> topicDtos = topics.stream().map(topicMapper::topicToTopicDto).collect(Collectors.toList());
        log.info("Leaving getTopicsByCourseId()");
        return topicDtos;
    }

    /**
     * Rebuilds the embedding for a course based on all its topics.
     * @param course the course whose embeddings should be refreshed
     */
    private void refreshCourseEmbeddings(Course course) {
        log.info("Entering refreshCourseEmbeddings()");
        vectorStoreRepository.deleteByReference(course.getUniqueId());

        List<Topic> topics = topicRepository.findByCourseId(course.getId());

        String topicsString = topics.stream().map(topic -> topic.getName() + ": " + topic.getDescription())
                .collect(Collectors.joining(" "));

        EmbeddingDto embeddingDto = new EmbeddingDto(
                course.getName() + " " + course.getDescription() + " " + topicsString, course.getUniqueId());

        embeddingService.documentEmbedding(embeddingDto);
        log.info("Leaving refreshCourseEmbeddings()");
    }
}
