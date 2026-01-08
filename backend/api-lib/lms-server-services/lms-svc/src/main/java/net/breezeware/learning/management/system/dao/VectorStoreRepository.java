package net.breezeware.learning.management.system.dao;

import java.util.List;
import java.util.UUID;

import net.breezeware.learning.management.system.entity.VectorStore;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import net.breezeware.dynamo.generics.crud.dao.GenericRepository;

import jakarta.transaction.Transactional;

/**
 * Repository interface for managing VectorStore entities. Provides standard
 * CRUD operations and additional custom queries.
 */
@Repository
public interface VectorStoreRepository extends GenericRepository<VectorStore> {

    /**
     * Finds relevant documents based on vector similarity. Uses PostgreSQL's vector
     * operations to calculate the distance.
     * @param  embedding The query embedding for similarity search.
     * @return           A list of VectorStore entities ordered by relevance.
     */
    @Query(value = "SELECT *, embedding <=> CAST(:embedding AS vector) AS distance " + "FROM lms_svc.vector_store "
            + "ORDER BY distance", nativeQuery = true)
    List<VectorStore> findRelevantDocuments(@Param("embedding") float[] embedding);

    /**
     * Deletes VectorStore entities with the specified reference.
     * @param reference The reference ID to match for deletion.
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM VectorStore vs WHERE vs.reference = :reference")
    void deleteByReference(@Param("reference") UUID reference);
}
