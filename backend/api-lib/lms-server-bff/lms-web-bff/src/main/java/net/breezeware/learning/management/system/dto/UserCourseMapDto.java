package net.breezeware.learning.management.system.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCourseMapDto {

    @Schema(example = "1", description = "The ID of the user course mapping.")
    private long id;

    @Schema(example = "1", description = "The course ID")
    private long courseId;

    @Schema(example = "c38b2827-d3d4-4fc1-b508-90b7f96c58c9", description = "The user unique ID")
    private UUID userId;

    @Schema(example = "ENROLLED", description = "Status of user course enrollment")
    private String status;
}