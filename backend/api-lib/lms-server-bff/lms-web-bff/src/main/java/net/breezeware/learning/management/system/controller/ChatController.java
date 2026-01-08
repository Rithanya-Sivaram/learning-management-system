package net.breezeware.learning.management.system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.breezeware.learning.management.system.service.api.EmbeddingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Chat Controller", description = "APIs for handling chat-related operations using embeddings")
@RestController
@RequestMapping("/api/chat")
@Slf4j
@RequiredArgsConstructor
public class ChatController {

    private final EmbeddingService embeddingService;

    @GetMapping
    @Operation(summary = "Generate a chat response.",
            description = "Generates a chat response based on the user's prompt using embedding services.")
    @Parameter(name = "prompt", description = "The user's input or question for the chat system.", required = true,
            in = ParameterIn.QUERY, example = "Explain polymorphism in Java.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Success Payload",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = String.class))),
                @ApiResponse(
                        responseCode = "400", description = "Bad Request",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = String.class))),
                @ApiResponse(responseCode = "500", description = "Internal Server Error",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = String.class))) })
    public String chat(@RequestParam String prompt) {
        log.info("Entering chat() with prompt: {}", prompt);
        String response = embeddingService.createChatResponse(prompt);
        log.info("Leaving chat()");
        return response;
    }
}
