package net.breezeware.learning.management.system.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import net.breezeware.learning.management.system.dto.TopicDto;
import net.breezeware.learning.management.system.service.api.TopicService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Topic Controller", description = "APIs for managing topics in a course")
@RestController
@RequestMapping("/api/topics")
@Slf4j
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    @Operation(summary = "Create a new topic", description = "Creates a new topic and returns its details.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Topic created successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = TopicDto.class))),
                @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content),
                @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content) })
    public TopicDto createTopic(@RequestBody TopicDto topicDto) {
        log.info("Entering createTopic()");
        var createdTopic = topicService.createTopic(topicDto);
        TopicDto response = topicService.getTopicById(createdTopic.getId());
        log.info("Leaving createTopic()");
        return response;
    }

    @PutMapping("/{topic-id}")
    @Operation(summary = "Update an existing topic",
            description = "Updates a topic by its ID and returns updated details.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Topic updated successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = TopicDto.class))),
                @ApiResponse(responseCode = "404", description = "Topic not found", content = @Content),
                @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content),
                @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content) })
    public TopicDto updateTopic(
            @Parameter(description = "ID of the topic to update", required = true) @PathVariable("topic-id") long id,
            @RequestBody TopicDto topicDto) {
        log.info("Entering updateTopic()");
        var updatedTopic = topicService.updateTopic(id, topicDto);
        TopicDto response = topicService.getTopicById(updatedTopic.getId());
        log.info("Leaving updateTopic()");
        return response;
    }

    @DeleteMapping("/{topic-id}")
    @Operation(summary = "Delete a topic", description = "Deletes a topic by its ID.")
    @ApiResponses(value = { @ApiResponse(responseCode = "204", description = "Topic deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Topic not found", content = @Content),
        @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content) })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTopic(
            @Parameter(description = "ID of the topic to delete", required = true) @PathVariable("topic-id") long id) {
        log.info("Entering deleteTopic()");
        topicService.deleteTopic(id);
        log.info("Leaving deleteTopic()");
    }

    @GetMapping("/{topic-id}")
    @Operation(summary = "Get topic details", description = "Fetches details of a topic by its ID.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Topic retrieved successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = TopicDto.class))),
                @ApiResponse(responseCode = "404", description = "Topic not found", content = @Content),
                @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content) })
    @Parameter(description = "ID of the topic to retrieve", required = true)
    public TopicDto getTopicById(@PathVariable("topic-id") long id) {
        log.info("Entering getTopicById()");
        TopicDto topicDto = topicService.getTopicById(id);
        log.info("Leaving getTopicById()");
        return topicDto;
    }
}
