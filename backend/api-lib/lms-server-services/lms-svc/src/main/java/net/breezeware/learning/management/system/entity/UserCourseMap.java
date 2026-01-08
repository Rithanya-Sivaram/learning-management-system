package net.breezeware.learning.management.system.entity;

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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Entity class representing the mapping between a User and a Course. This table
 * stores enrollment information and status for each user-course pair.
 */
@Entity
@Table(name = "user_course_map", schema = "lms_svc")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserCourseMap extends GenericEntity {

    @Schema(example = "1", description = "The course associated with the enrollment")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", referencedColumnName = "id", nullable = false)
    private Course course;

    @Schema(example = "c38b2827-d3d4-4fc1-b508-90b7f96c58c9", description = "The user associated with the enrollment")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", referencedColumnName = "unique_id", nullable = false)
    private User user;

    @Schema(example = "ENROLLED", description = "Status of the user's enrollment in the course")
    @Column(name = "status", nullable = false)
    private String status;
}
