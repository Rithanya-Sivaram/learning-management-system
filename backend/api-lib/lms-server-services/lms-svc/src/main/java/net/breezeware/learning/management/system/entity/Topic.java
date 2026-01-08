package net.breezeware.learning.management.system.entity;

import net.breezeware.dynamo.generics.crud.entity.GenericEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "topic", schema = "lms_svc",
        indexes = { @Index(name = "idx_topic_course_id", columnList = "course_id"),
            @Index(name = "idx_topic_name", columnList = "name") })
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Topic extends GenericEntity {

    @Schema(example = "Introduction to Java", description = "The name of the topic.")
    @NotBlank(message = "Topic name cannot be blank")
    @Size(max = 255, message = "Topic name must be at most 255 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Schema(example = "Basic concepts of Java programming", description = "Description of the topic.")
    @NotBlank(message = "Description cannot be blank")
    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Schema(example = "40", description = "Duration in minutes")
    @Positive(message = "Duration must be greater than zero")
    @Column(name = "duration", nullable = false)
    private long duration;

    @Schema(example = "1", description = "The unique identifier of the Course")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", referencedColumnName = "id", nullable = false)
    private Course course;
}
