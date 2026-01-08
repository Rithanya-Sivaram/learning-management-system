package net.breezeware.learning.management.system.entity;

import java.util.UUID;

import net.breezeware.dynamo.generics.crud.entity.GenericEntity;
import net.breezeware.dynamo.usermanagement.entity.User;

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
import jakarta.validation.constraints.Size;

/**
 * Entity class representing a Course in the LMS schema. Mapped to the "course"
 * table in the "lms_svc" schema.
 */
@Entity
@Table(name = "course", schema = "lms_svc",
        indexes = { @Index(name = "idx_course_unique_id", columnList = "unique_id"),
            @Index(name = "idx_course_name", columnList = "name") })
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class Course extends GenericEntity {

    @Schema(example = "Google", description = "The name of the course.")
    @NotBlank(message = "Course name cannot be blank")
    @Size(max = 255, message = "Course name must be at most 255 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Schema(example = "29e9b2c0-2040-4c4e-8320-5c62067db1ad", description = "The unique identifier of the course.")
    @Column(name = "unique_id", nullable = false, unique = true)
    private UUID uniqueId;

    @Schema(example = "A description or additional information about the learning pathway.",
            description = "A description or additional information about the course.")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Schema(example = "Course/29e9b2c0-2040-4c4e-8320-5c62067db1ad.png", description = "The photoKey of the course.")
    @Column(name = "photo_key")
    private String photoKey;

    @Schema(description = "The status of the course, e.g., 'published', 'deleted'.")
    @Column(name = "status")
    private String status;

    @Schema(example = "c38b2827-d3d4-4fc1-b508-90b7f96c58c9", description = "The author of the course.")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", referencedColumnName = "unique_id", nullable = false)
    private User author;
}
