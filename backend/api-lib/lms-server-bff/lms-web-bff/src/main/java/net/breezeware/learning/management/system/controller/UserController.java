package net.breezeware.learning.management.system.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.breezeware.learning.management.system.dto.UserDto;
import net.breezeware.learning.management.system.service.api.CourseUserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "User Controller", description = "APIs for managing users and learner data")
@RestController
@RequestMapping("/api/users")
@Slf4j
@RequiredArgsConstructor
public class UserController {

    private final CourseUserService userService;

    @GetMapping("/learners")
    @Operation(summary = "Retrieve all learners", description = "Fetches a list of all users who are learners.")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "Learners retrieved successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = UserDto.class))),
                @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content) })
    public List<UserDto> retrieveLearners() {
        log.info("Entering retrieveLearners()");
        List<UserDto> userDtos = userService.retrieveLearners();
        log.info("Leaving retrieveLearners()");
        return userDtos;
    }

    @PostMapping("/user/{email}")
    @Operation(summary = "Add User", description = "Add User")
    @ApiResponses(
            value = {
                @ApiResponse(responseCode = "200", description = "User Created successfully",
                        content = @Content(mediaType = "application/json",
                                schema = @Schema(implementation = UserDto.class))),
                @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content) })
    public void createUser(@PathVariable("email") String email) {
        log.info("Entering createUser()");
        userService.createUser(email);
        log.info("Leaving createUser()");
    }
}
