package net.breezeware.learning.management.system.service.impl;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.SystemPromptTemplate;
import org.springframework.ai.converter.ListOutputConverter;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import net.breezeware.dynamo.generics.crud.service.GenericService;
import net.breezeware.dynamo.utils.exception.DynamoException;
import net.breezeware.learning.management.system.dao.VectorStoreRepository;
import net.breezeware.learning.management.system.dto.EmbeddingDto;
import net.breezeware.learning.management.system.entity.VectorStore;
import net.breezeware.learning.management.system.service.api.EmbeddingService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmbeddingServiceImpl extends GenericService<VectorStore> implements EmbeddingService {

    private final OpenAiEmbeddingModel openAiEmbeddingClient;
    private final VectorStoreRepository vectorStoreRepository;
    private final OpenAiChatModel openAiChatModel;

    public EmbeddingServiceImpl(OpenAiEmbeddingModel openAiEmbeddingClient, VectorStoreRepository vectorStoreRepository,
            OpenAiChatModel openAiChatModel) {
        super(vectorStoreRepository);
        this.openAiEmbeddingClient = openAiEmbeddingClient;
        this.vectorStoreRepository = vectorStoreRepository;
        this.openAiChatModel = openAiChatModel;
    }

    /**
     * Generates embeddings for the given document and saves them to the
     * VectorStore.
     * @param embeddingDto The embeddingDto to generate embeddings for.
     */
    @Override
    public void documentEmbedding(EmbeddingDto embeddingDto) {
        try {
            // Extract document details
            UUID referenceId = embeddingDto.getReferenceId();
            String content = embeddingDto.getContent();

            if (referenceId == null || content == null || content.isEmpty()) {
                log.error("Document ID or content cannot be null or empty for embedding.");
                throw new DynamoException("Document ID or content cannot be null or empty for embedding.",
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Generate embeddings using the AI model
            float[] embedding = openAiEmbeddingClient.embed(content);
            if (embedding == null || embedding.length == 0) {
                log.error("Embedding generation failed for the document with ID: {}", referenceId);
                throw new DynamoException("Embedding generation failed for the document.",
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Create a new VectorStore entity with the document's embedding
            VectorStore vectorStore = VectorStore.builder().uniqueId(UUID.randomUUID()).reference(referenceId)
                    .content(content).embedding(embedding).build();

            // Save the generated embeddings in the VectorStore
            create(vectorStore);
            log.info("VectorStore successfully loaded with data for Document ID: {}", referenceId);

        } catch (Exception ex) {
            log.error("Error occurred while embedding document ID: {}. Details: {}", embeddingDto.getReferenceId(),
                    ex.getMessage(), ex);
            throw new DynamoException("Error embedding document" + ex, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Creates a chat response based on the user message and relevant documents.
     * @param  message The user message.
     * @return         The chat response based on the input message and relevant
     *                 documents.
     */
    @Override
    public String createChatResponse(String message) {
        try {
            // Retrieve relevant documents based on the query embedding
            List<VectorStore> documents = findRelevantDocumentsByQueryEmbedding(message);

            if (documents.isEmpty()) {
                log.warn("No relevant documents found for the message: {}", message);
            }

            // Concatenate the content of all relevant documents
            String concatenatedDocuments =
                    documents.stream().map(VectorStore::getContent).collect(Collectors.joining(System.lineSeparator()));

            // Construct the system message with the concatenated document content
            String template = """
                    You are here to provide accurate answers based on the information from the DOCUMENTS section.
                    If you are unsure about something or no document is available,
                    reply politely that you don't know the answer and mention who you are.
                    DOCUMENTS: {documents}
                    """;

            Message systemMessage =
                    new SystemPromptTemplate(template).createMessage(Map.of("documents", concatenatedDocuments));

            UserMessage userMessage = new UserMessage(message);

            // Configure OpenAI chat options
            OpenAiChatOptions openAiChatOptions = OpenAiChatOptions.builder().build();

            // Create a prompt and call the chat model
            Prompt prompt = new Prompt(List.of(systemMessage, userMessage), openAiChatOptions);

            Generation generation = openAiChatModel.call(prompt).getResult();

            ListOutputConverter listOutputConverter = new ListOutputConverter(new DefaultConversionService());

            List<String> list = listOutputConverter.convert(generation.getOutput().getContent());

            log.info("Generated chat response successfully.");

            return list.toString();

        } catch (Exception ex) {
            log.error("Error generating chat response for message: {}. Details: {}", message, ex.getMessage(), ex);
            throw new DynamoException("Error creating chat response" + ex, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * Finds relevant documents based on the query embedding for a given message.
     * @param  message The user message to search for relevant documents.
     * @return         A list of relevant documents.
     */
    public List<VectorStore> findRelevantDocumentsByQueryEmbedding(String message) {
        try {
            log.info("Finding relevant documents for the message: {}", message);

            // Generate the embedding for the query
            SearchRequest request = SearchRequest.query(message);
            float[] queryEmbedding = openAiEmbeddingClient.embed(request.getQuery());

            if (queryEmbedding == null || queryEmbedding.length == 0) {
                log.error("Failed to generate embedding for the query: {}", message);
                throw new IllegalStateException("Embedding generation failed for query.");
            }

            // Set up the search request with similarity threshold and top k results
            // double similarityThreshold = 1 - request.getSimilarityThreshold();
            // int topK = request.getTopK();

            // Query the VectorStore repository for relevant documents
            List<VectorStore> relevantDocuments = vectorStoreRepository.findRelevantDocuments(queryEmbedding);

            log.info("Found {} relevant documents for the query.", relevantDocuments.size());
            return relevantDocuments;

        } catch (Exception ex) {
            log.error("Error finding relevant documents for message: {}. Details: {}", message, ex.getMessage(), ex);
            throw new DynamoException("Error finding relevant documents" + ex, HttpStatus.INTERNAL_SERVER_ERROR);

        }

    }
}
