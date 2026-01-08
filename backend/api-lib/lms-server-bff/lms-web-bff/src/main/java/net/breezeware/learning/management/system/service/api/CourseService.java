package net.breezeware.learning.management.system.service.api;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import net.breezeware.learning.management.system.dto.CourseDto;
import net.breezeware.learning.management.system.entity.Course;

import jakarta.transaction.Transactional;

/**
 * Service interface for managing {@link Course} entities. Provides operations
 * for creating, updating, retrieving, deleting, and enrolling learners in
 * courses.
 */
public interface CourseService {

    /**
     * Creates a new course with the given details and optional file.
     * @param  file      optional {@link MultipartFile} representing the course
     *                   image or related file
     * @param  courseDto the course details to create
     * @return           the created {@link Course} entity
     */
    @Transactional
    Course createCourse(MultipartFile file, CourseDto courseDto);

    /**
     * Updates an existing course with the given details and optional file.
     * @param  courseId  the ID of the course to update
     * @param  file      optional {@link MultipartFile} representing the course
     *                   image or related file
     * @param  courseDto the updated course details
     * @return           the updated {@link Course} entity
     */
    @Transactional
    Course updateCourse(long courseId, MultipartFile file, CourseDto courseDto);

    /**
     * Deletes a course by its ID.
     * @param id the ID of the course to delete
     */
    void deleteCourse(long id);

    /**
     * Retrieves a course by its ID.
     * @param  id the ID of the course to retrieve
     * @return    the {@link CourseDto} containing course details
     */
    CourseDto getCourseById(long id);

    /**
     * Retrieves all courses in the system.
     * @return a list of {@link CourseDto} objects representing all courses
     */
    List<CourseDto> getAllCourses();

    List<CourseDto> getAllCoursesForLearners(UUID userId);

    /**
     * Enrolls a learner in a course.
     * @param courseId the ID of the course to enroll in
     * @param userId   the UUID of the learner to enroll
     */
    void enrollCourse(long courseId, UUID userId);

    /**
     * Retrieves all courses in which a learner is enrolled.
     * @param  userId the UUID of the learner
     * @return        a list of {@link CourseDto} objects representing enrolled
     *                courses
     */
    List<CourseDto> learnersEnrolledCourses(UUID userId);
}
