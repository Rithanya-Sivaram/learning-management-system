package net.breezeware.learning.management.system.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object (DTO) for the {@code Course} entity. Used to transfer
 * course data between layers (Controller ↔ Service ↔ Repository).
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseDto {

    @Schema(description = "The internal numeric ID of the course.", example = "1")
    private long id;

    @Schema(description = "The unique UUID identifier of the course.", example = "29e9b2c0-2040-4c4e-8320-5c62067db1ad")
    private UUID uniqueId;

    @Schema(description = "The name of the course.", example = "Google Cloud Fundamentals")
    private String name;

    @Schema(description = "A detailed description or additional information about the course.",
            example = "This course provides an introduction to Google Cloud services and architecture.")
    private String description;

    @Schema(description = "The storage key or relative path to the course's thumbnail or cover image.",
            example = "Course/29e9b2c0-2040-4c4e-8320-5c62067db1ad.png")
    private String photoKey;

    @Schema(description = "The current status of the course (e.g., ACTIVE, INACTIVE, ARCHIVED).", example = "ACTIVE")
    private String status;

    @Schema(description = "The UUID identifier of the author/instructor who created the course.",
            example = "c38b2827-d3d4-4fc1-b508-90b7f96c58c9")
    private UUID authorId;

    @Schema(description = "The total number of learners currently enrolled in the course.", example = "125")
    private long learnersEnrolled;

    @Schema(description = "The status of learners currently enrolled in the course.", example = "true")
    private boolean isEnrolled;
}
