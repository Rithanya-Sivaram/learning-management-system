package net.breezeware.learning.management.system.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import net.breezeware.dynamo.aws.s3.exception.DynamoS3Exception;
import net.breezeware.dynamo.aws.s3.service.api.S3Service;
import net.breezeware.dynamo.generics.crud.service.GenericService;
import net.breezeware.dynamo.usermanagement.entity.User;
import net.breezeware.dynamo.usermanagement.service.UserService;
import net.breezeware.dynamo.utils.exception.DynamoException;
import net.breezeware.learning.management.system.dao.CourseRepository;
import net.breezeware.learning.management.system.dao.UserCourseMapRepository;
import net.breezeware.learning.management.system.dao.VectorStoreRepository;
import net.breezeware.learning.management.system.dto.CourseDto;
import net.breezeware.learning.management.system.dto.EmbeddingDto;
import net.breezeware.learning.management.system.entity.Course;
import net.breezeware.learning.management.system.entity.UserCourseMap;
import net.breezeware.learning.management.system.mapper.CourseMapper;
import net.breezeware.learning.management.system.service.api.CourseService;
import net.breezeware.learning.management.system.service.api.EmbeddingService;

import lombok.extern.slf4j.Slf4j;

import jakarta.transaction.Transactional;

/**
 * Implementation of the {@link CourseService} interface. Handles business logic
 * for managing courses, including file uploads, embeddings, and learner
 * enrollments.
 */
@Service
@Slf4j
public class CourseServiceImpl extends GenericService<Course> implements CourseService {

    private final CourseRepository courseRepository;
    private final VectorStoreRepository vectorStoreRepository;
    private final EmbeddingService embeddingService;
    private final UserService userService;
    private final CourseMapper courseMapper;
    private final S3Service s3Service;
    private final UserCourseMapRepository userCourseMapRepository;

    @Value("${aws.s3.bucket}")
    String bucketName;

    @Value("${document.cdn-url}")
    String documentCdnUrl;

    public CourseServiceImpl(CourseRepository courseRepository, VectorStoreRepository vectorStoreRepository,
            EmbeddingService embeddingService, UserService userService, CourseMapper courseMapper, S3Service s3Service,
            UserCourseMapRepository userCourseMapRepository) {
        super(courseRepository);
        this.courseRepository = courseRepository;
        this.vectorStoreRepository = vectorStoreRepository;
        this.embeddingService = embeddingService;
        this.userService = userService;
        this.courseMapper = courseMapper;
        this.s3Service = s3Service;
        this.userCourseMapRepository = userCourseMapRepository;
    }

    /**
     * Creates a new course, validates file format, uploads image to S3, persists
     * course details, and generates embeddings.
     * @param  file      the course cover image
     * @param  courseDto the data transfer object containing course details
     * @return           the saved {@link Course} entity
     */
    @Transactional
    @Override
    public Course createCourse(MultipartFile file, CourseDto courseDto) {
        log.info("Entering createCourse()");
        try {
            if (isValidImage(file)) {
                throw new DynamoException("Uploaded file has an invalid format", HttpStatus.BAD_REQUEST);
            }

            User author = userService.retrieveUser(courseDto.getAuthorId())
                    .orElseThrow(() -> new DynamoException("User not found with ID: " + courseDto.getAuthorId(),
                            HttpStatus.NOT_FOUND));

            courseDto.setUniqueId(UUID.randomUUID());

            String[] parts = file.getContentType().split("/");
            String photoKey = "Course/%s.%s".formatted(UUID.randomUUID(), parts[1]);
            uploadObjectInS3(photoKey, file);

            Course course = courseMapper.courseDtoToCourse(courseDto);
            course.setAuthor(author);
            course.setPhotoKey(photoKey);
            course.setStatus("published");

            Course savedCourse = create(course);

            EmbeddingDto embeddingDto = new EmbeddingDto(savedCourse.getName() + " " + savedCourse.getDescription(),
                    savedCourse.getUniqueId());
            embeddingService.documentEmbedding(embeddingDto);

            log.info("Leaving createCourse()");
            return savedCourse;
        } catch (Exception e) {
            log.error("Error while creating course: {}", e.getMessage(), e);
            throw new DynamoException("Failed to create course: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Updates an existing course, regenerates embeddings, and uploads new file if
     * provided.
     * @param  courseId  the ID of the course to update
     * @param  file      optional new cover image
     * @param  courseDto the updated course details
     * @return           the updated {@link Course} entity
     */
    @Transactional
    @Override
    public Course updateCourse(long courseId, MultipartFile file, CourseDto courseDto) {
        log.info("Entering updateCourse(courseId={})", courseId);
        try {
            Course existingCourse = retrieveById(courseId).orElseThrow(
                    () -> new DynamoException("Course not found with ID: " + courseId, HttpStatus.NOT_FOUND));

            vectorStoreRepository.deleteByReference(existingCourse.getUniqueId());

            existingCourse.setName(courseDto.getName());
            existingCourse.setDescription(courseDto.getDescription());

            if (courseDto.getAuthorId() != null) {
                User author = userService.retrieveUser(courseDto.getAuthorId())
                        .orElseThrow(() -> new DynamoException("User not found with ID: " + courseDto.getAuthorId(),
                                HttpStatus.NOT_FOUND));
                existingCourse.setAuthor(author);
            }

            if (file != null && !file.isEmpty()) {
                if (isValidImage(file)) {
                    throw new DynamoException("Uploaded file has an invalid format", HttpStatus.BAD_REQUEST);
                }

                String[] parts = file.getContentType().split("/");
                String photoKey = "Course/%s.%s".formatted(UUID.randomUUID(), parts[1]);
                uploadObjectInS3(photoKey, file);
                existingCourse.setPhotoKey(photoKey);
            }

            Course updatedCourse = update(existingCourse);

            EmbeddingDto embeddingDto = new EmbeddingDto(updatedCourse.getName() + " " + updatedCourse.getDescription(),
                    updatedCourse.getUniqueId());
            embeddingService.documentEmbedding(embeddingDto);

            log.info("Leaving updateCourse()");
            return updatedCourse;
        } catch (Exception e) {
            log.error("Error while updating course with ID {}: {}", courseId, e.getMessage(), e);
            throw new DynamoException("Failed to update course: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Deletes a course by marking its status as deleted and removing associated
     * embeddings.
     * @param id the ID of the course to delete
     */
    @Transactional
    @Override
    public void deleteCourse(long id) {
        log.info("Entering deleteCourse(id={})", id);
        try {
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new DynamoException("Course not found with ID: " + id, HttpStatus.NOT_FOUND));

            course.setStatus("deleted");
            update(course);

            vectorStoreRepository.deleteByReference(course.getUniqueId());

            log.info("Leaving deleteCourse()");
        } catch (Exception e) {
            log.error("Error while deleting course with ID {}: {}", id, e.getMessage(), e);
            throw new DynamoException("Failed to delete course: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Retrieves a course by its ID.
     * @param  id the ID of the course to retrieve
     * @return    the {@link CourseDto} representing the course
     */
    @Override
    public CourseDto getCourseById(long id) {
        log.info("Entering getCourseById(id={})", id);
        try {
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new DynamoException("Course not found with ID: " + id, HttpStatus.NOT_FOUND));
            CourseDto courseDto = courseMapper.courseToCourseDto(course);
            courseDto.setPhotoKey(documentCdnUrl + courseDto.getPhotoKey());

            log.info("Leaving getCourseById()");
            return courseDto;
        } catch (Exception e) {
            log.error("Error while fetching course with ID {}: {}", id, e.getMessage(), e);
            throw new DynamoException("Failed to fetch course: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Retrieves all non-deleted courses.
     * @return a list of {@link CourseDto}
     */
    @Override
    public List<CourseDto> getAllCourses() {
        log.info("Entering getAllCourses()");
        List<CourseDto> courseDtos = new ArrayList<>();
        try {
            List<Course> courses = courseRepository.findAll();
            courses.forEach(course -> {
                if (!"deleted".equalsIgnoreCase(course.getStatus())) {
                    CourseDto dto = courseMapper.courseToCourseDto(course);
                    dto.setPhotoKey(documentCdnUrl + dto.getPhotoKey());
                    dto.setLearnersEnrolled(userCourseMapRepository.findByCourseId(course.getId()).size());
                    courseDtos.add(dto);
                }

            });
            log.info("Leaving getAllCourses()");
            return courseDtos;
        } catch (Exception e) {
            log.error("Error while retrieving courses: {}", e.getMessage(), e);
            throw new DynamoException("Failed to retrieve courses: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public List<CourseDto> getAllCoursesForLearners(UUID userId) {
        log.info("Entering getAllCoursesForLearners()");

        User user = userService.retrieveUser(userId)
                .orElseThrow(() -> new DynamoException("User not found with ID: " + userId, HttpStatus.NOT_FOUND));

        List<CourseDto> courseDtos = new ArrayList<>();
        try {
            List<Course> courses = courseRepository.findAll();
            courses.forEach(course -> {
                if (!"deleted".equalsIgnoreCase(course.getStatus())) {
                    CourseDto dto = courseMapper.courseToCourseDto(course);
                    dto.setPhotoKey(documentCdnUrl + dto.getPhotoKey());
                    dto.setLearnersEnrolled(userCourseMapRepository.findByCourseId(course.getId()).size());
                    Optional<UserCourseMap> userCourseMap =
                            userCourseMapRepository.findByCourseIdAndUserUniqueId(course.getId(), user.getUniqueId());

                    if (userCourseMap.isPresent()) {
                        dto.setEnrolled(true);
                    }

                    courseDtos.add(dto);
                }

            });
            log.info("Leaving getAllCoursesForLearners()");
            return courseDtos;
        } catch (Exception e) {
            log.error("Error while retrieving courses: {}", e.getMessage(), e);
            throw new DynamoException("Failed to retrieve courses: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Enrolls a user in a course.
     * @param courseId the ID of the course
     * @param userId   the ID of the user
     */
    @Transactional
    @Override
    public void enrollCourse(long courseId, UUID userId) {
        log.info("Entering enrollCourse(courseId={}, userId={})", courseId, userId);
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new DynamoException("Course not found with ID: " + courseId, HttpStatus.NOT_FOUND));

        User user = userService.retrieveUser(userId)
                .orElseThrow(() -> new DynamoException("User not found with ID: " + userId, HttpStatus.NOT_FOUND));

        UserCourseMap userCourseMap = new UserCourseMap();
        userCourseMap.setCourse(course);
        userCourseMap.setUser(user);
        userCourseMap.setStatus("enrolled");

        userCourseMapRepository.save(userCourseMap);
        log.info("Leaving enrollCourse()");
    }

    /**
     * Retrieves all courses a learner is enrolled in.
     * @param  userId the unique ID of the learner
     * @return        a list of {@link CourseDto}
     */
    @Override
    public List<CourseDto> learnersEnrolledCourses(UUID userId) {
        log.info("Entering learnersEnrolledCourses(userId={})", userId);
        try {
            User user = userService.retrieveUser(userId)
                    .orElseThrow(() -> new DynamoException("User not found with ID: " + userId, HttpStatus.NOT_FOUND));

            List<UserCourseMap> courses = userCourseMapRepository.findByUserUniqueId(user.getUniqueId());
            List<CourseDto> courseDtos = new ArrayList<>();

            courses.forEach(userCourseMap -> {
                Course course = courseRepository.findById(userCourseMap.getCourse().getId()).get();
                if (!"deleted".equalsIgnoreCase(course.getStatus())) {
                    CourseDto dto = courseMapper.courseToCourseDto(course);
                    dto.setPhotoKey(documentCdnUrl + dto.getPhotoKey());
                    dto.setLearnersEnrolled(userCourseMapRepository.findByCourseId(course.getId()).size());
                    courseDtos.add(dto);
                }

            });

            log.info("Leaving learnersEnrolledCourses()");
            return courseDtos;
        } catch (Exception e) {
            log.error("Error while fetching enrolled courses for user {}: {}", userId, e.getMessage(), e);
            throw new DynamoException("Failed to fetch enrolled courses: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Uploads a course cover image to S3.
     * @param photoKey the key under which the file will be stored
     * @param file     the file to upload
     */
    private void uploadObjectInS3(String photoKey, MultipartFile file) {
        log.info("Entering uploadObjectInS3(photoKey={})", photoKey);
        try {
            s3Service.uploadObject(bucketName, photoKey, file.getBytes());
            log.info("Leaving uploadObjectInS3()");
        } catch (DynamoS3Exception | IOException e) {
            throw new DynamoException("Error while uploading document '%s'".formatted(file.getOriginalFilename()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Validates if the uploaded file is an accepted image type.
     * @param  file the file to validate
     * @return      true if valid image, false otherwise
     */
    private boolean isValidImage(MultipartFile file) {
        String contentType = Objects.requireNonNull(file.getContentType());
        return !"image/svg+xml".equalsIgnoreCase(contentType)
                && !MediaType.IMAGE_GIF_VALUE.equalsIgnoreCase(contentType)
                && !MediaType.IMAGE_PNG_VALUE.equalsIgnoreCase(contentType)
                && !MediaType.IMAGE_JPEG_VALUE.equalsIgnoreCase(contentType);
    }
}
