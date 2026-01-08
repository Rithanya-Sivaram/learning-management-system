package net.breezeware.learning.management.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopicDto {

    @Schema(example = "1", description = "The ID of the topic.")
    private long id;

    @Schema(example = "Introduction to Java", description = "The name of the topic.")
    private String name;

    @Schema(example = "Basic concepts of Java programming", description = "Description of the topic.")
    private String description;

    @Schema(example = "40", description = "Duration in minutes")
    private long duration;

    @Schema(example = "1", description = "The course ID this topic belongs to")
    private long courseId;
}