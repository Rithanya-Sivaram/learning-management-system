package net.breezeware.learning.management.system.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import net.breezeware.learning.management.system.dto.CourseDto;
import net.breezeware.learning.management.system.dto.TopicDto;
import net.breezeware.learning.management.system.entity.Course;
import net.breezeware.learning.management.system.service.api.CourseService;
import net.breezeware.learning.management.system.service.api.TopicService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Course Controller", description = "APIs for managing courses and learner enrollments")
@RestController
@RequestMapping("/api/courses")
@Slf4j
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final TopicService topicService;

    @PostMapping
    @Operation(summary = "Create a new course",
            description = "Creates a course with metadata and optional file upload.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Course created successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = Course.class))),
                @ApiResponse(responseCode = "400", description = "Invalid input",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(responseCode = "500", description = "Internal Server Error",
                        content = @Content(mediaType = "application/json")) })
    public ResponseEntity<Course> createCourse(
            @Parameter(description = "Course thumbnail or related file", required = true)
            @RequestPart("file") MultipartFile file,
            @Parameter(description = "Course metadata", required = true) CourseDto courseDto) {
        log.info("Entering createCourse()");
        Course savedCourse = courseService.createCourse(file, courseDto);
        log.info("Leaving createCourse()");
        return ResponseEntity.ok(savedCourse);
    }

    @PutMapping("/{course-id}")
    @Operation(summary = "Update an existing course",
            description = "Updates course details and optionally updates file.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Course updated successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = Course.class))),
                @ApiResponse(responseCode = "404", description = "Course not found",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(responseCode = "400", description = "Invalid input",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(responseCode = "500", description = "Internal Server Error",
                        content = @Content(mediaType = "application/json")) })
    public ResponseEntity<Course> updateCourse(@PathVariable("course-id") long courseId,
            @Parameter(description = "Updated file (optional)")
            @RequestPart(value = "file", required = false) MultipartFile file,
            @Parameter(description = "Updated course metadata") CourseDto courseDto) {
        log.info("Entering updateCourse()");
        Course savedCourse = courseService.updateCourse(courseId, file, courseDto);
        log.info("Leaving updateCourse()");
        return ResponseEntity.ok(savedCourse);
    }

    @GetMapping
    @Operation(summary = "Retrieve all courses", description = "Fetches the list of all available courses.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Courses retrieved successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = CourseDto.class))),
                @ApiResponse(responseCode = "500", description = "Internal Server Error",
                        content = @Content(mediaType = "application/json")) })
    public List<CourseDto> getAllCourses() {
        log.info("Entering getAllCourses()");
        List<CourseDto> courses = courseService.getAllCourses();
        log.info("Leaving getAllCourses()");
        return courses;
    }

    @GetMapping("/all-course/{user-id}")
    @Operation(summary = "Retrieve all courses for Learners",
            description = "Fetches the list of all available courses.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Courses retrieved successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = CourseDto.class))),
                @ApiResponse(responseCode = "500", description = "Internal Server Error",
                        content = @Content(mediaType = "application/json")) })
    public List<CourseDto> getAllCoursesForLearners(@PathVariable("user-id") UUID userId) {
        log.info("Entering getAllCoursesForLearners()");
        List<CourseDto> courses = courseService.getAllCoursesForLearners(userId);
        log.info("Leaving getAllCoursesForLearners()");
        return courses;
    }

    @GetMapping("/{course-id}")
    @Operation(summary = "Retrieve course by ID", description = "Fetches details of a course by its ID.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Course retrieved successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = CourseDto.class))),
                @ApiResponse(responseCode = "404", description = "Course not found",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(responseCode = "500", description = "Internal Server Error",
                        content = @Content(mediaType = "application/json")) })
    public CourseDto getCourseById(@PathVariable("course-id") long id) {
        log.info("Entering getCourseById()");
        CourseDto courseDto = courseService.getCourseById(id);
        log.info("Leaving getCourseById()");
        return courseDto;
    }

    @DeleteMapping("/{course-id}")
    @Operation(summary = "Delete a course", description = "Deletes a course by its ID.")
    @ApiResponses(value = { @ApiResponse(responseCode = "204", description = "Course deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Course not found",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "500", description = "Internal Server Error",
                content = @Content(mediaType = "application/json")) })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable("course-id") long id) {
        log.info("Entering deleteCourse()");
        courseService.deleteCourse(id);
        log.info("Leaving deleteCourse()");
    }

    @GetMapping("/course/{course-id}")
    @Operation(summary = "Retrieve topics of a course", description = "Fetches all topics associated with a course.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Topics retrieved successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = TopicDto.class))),
                @ApiResponse(responseCode = "404", description = "Course not found",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(responseCode = "500", description = "Internal Server Error",
                        content = @Content(mediaType = "application/json")) })
    public List<TopicDto> getTopicsByCourseId(@PathVariable("course-id") long courseId) {
        log.info("Entering getTopicsByCourseId()");
        List<TopicDto> topics = topicService.getTopicsByCourseId(courseId);
        log.info("Leaving getTopicsByCourseId()");
        return topics;
    }

    @PostMapping("/{course-id}/{user-id}")
    @Operation(summary = "Enroll a learner into a course", description = "Enrolls a learner into the given course.")
    @ApiResponses(value = { @ApiResponse(responseCode = "200", description = "Learner enrolled successfully"),
        @ApiResponse(responseCode = "404", description = "Course or User not found",
                content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "500", description = "Internal Server Error",
                content = @Content(mediaType = "application/json")) })
    public void enrollCourse(@PathVariable("course-id") long courseId, @PathVariable("user-id") UUID userId) {
        log.info("Entering enrollCourse()");
        courseService.enrollCourse(courseId, userId);
        log.info("Leaving enrollCourse()");
    }

    @GetMapping("/{user-id}/enrolled")
    @Operation(summary = "Retrieve learner's enrolled courses",
            description = "Fetches all courses a learner is enrolled in.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Enrolled courses retrieved successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = CourseDto.class))),
                @ApiResponse(responseCode = "404", description = "User not found",
                        content = @Content(mediaType = "application/json")),
                @ApiResponse(responseCode = "500", description = "Internal Server Error",
                        content = @Content(mediaType = "application/json")) })
    public List<CourseDto> learnerEnrolledCourses(@PathVariable("user-id") UUID userId) {
        log.info("Entering learnerEnrolledCourses()");
        List<CourseDto> courseDtos = courseService.learnersEnrolledCourses(userId);
        log.info("Leaving learnerEnrolledCourses()");
        return courseDtos;
    }
}
