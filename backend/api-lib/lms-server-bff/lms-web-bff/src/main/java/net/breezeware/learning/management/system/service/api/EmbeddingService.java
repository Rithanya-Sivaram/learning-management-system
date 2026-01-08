package net.breezeware.learning.management.system.service.api;

import net.breezeware.learning.management.system.dto.EmbeddingDto;

/**
 * Service interface for handling embeddings and chat responses. Defines methods
 * for embedding document content and generating chat responses.
 */
public interface EmbeddingService {

    /**
     * Generates embeddings for the given document and stores them in the vector
     * store.
     * @param embeddingDto The embeddingDto to generate embeddings for.
     */
    void documentEmbedding(EmbeddingDto embeddingDto);

    /**
     * Creates a chat response for a given input message.
     * @param  message The user-provided input message.
     * @return         A ChatResponse containing the generated response.
     */
    String createChatResponse(String message);
}
