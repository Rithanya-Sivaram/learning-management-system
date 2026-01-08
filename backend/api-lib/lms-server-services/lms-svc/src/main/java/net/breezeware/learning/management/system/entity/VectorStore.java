package net.breezeware.learning.management.system.entity;

import org.hibernate.annotations.Array;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import net.breezeware.dynamo.generics.crud.entity.GenericEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

/**
 * Entity class representing a Vector Store in the lms schema. This class
 * is mapped to the "vector_store" table in the "lms" schema. It stores
 * vector embeddings along with associated content and references.
 */
@Entity
@Table(name = "vector_store", schema = "lms_svc")
@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VectorStore extends GenericEntity {


    /**
     * The unique identifier of the VectorStore.
     */
    @Column(name = "unique_id", unique = true, nullable = false)
    private UUID uniqueId;

    /**
     * The content associated with the vector embedding.
     */
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * The vector embedding stored as an array of floats. This uses a custom SQL
     * type (VECTOR) for handling embeddings. The length is set to 1536 to
     * accommodate high-dimensional vectors.
     */
    @Column(name = "embedding", nullable = false)
    @JdbcTypeCode(SqlTypes.VECTOR)
    @Array(length = 1536)
    private float[] embedding;

    /**
     * A reference to an external entity or resource associated with the embedding.
     */
    @Column(name = "reference", nullable = false)
    private UUID reference;

}
