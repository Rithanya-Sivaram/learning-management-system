package net.breezeware.learning.management.system.service.api;

import java.util.List;

import net.breezeware.learning.management.system.dto.TopicDto;
import net.breezeware.learning.management.system.entity.Topic;

import jakarta.transaction.Transactional;

/**
 * Service interface for managing topics within courses. Defines operations for
 * creating, updating, retrieving, and deleting topics.
 */
public interface TopicService {

    /**
     * Creates a new topic.
     * @param  topicDto the data transfer object containing topic details
     * @return          the created {@link Topic} entity
     */
    @Transactional
    Topic createTopic(TopicDto topicDto);

    /**
     * Updates an existing topic by its ID.
     * @param  topicId  the ID of the topic to update
     * @param  topicDto the data transfer object containing updated topic details
     * @return          the updated {@link Topic} entity
     */
    @Transactional
    Topic updateTopic(long topicId, TopicDto topicDto);

    /**
     * Deletes a topic by its ID.
     * @param topicId the ID of the topic to delete
     */
    void deleteTopic(long topicId);

    /**
     * Retrieves a topic by its ID.
     * @param  topicId the ID of the topic to retrieve
     * @return         the {@link TopicDto} representing the topic
     */
    TopicDto getTopicById(long topicId);

    /**
     * Retrieves all topics associated with a specific course.
     * @param  courseId the ID of the course
     * @return          a list of {@link TopicDto} objects belonging to the course
     */
    List<TopicDto> getTopicsByCourseId(long courseId);
}
