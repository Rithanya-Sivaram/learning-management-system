package net.breezeware.learning.management.system.dto;

import java.util.UUID;

import lombok.Data;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class UserDto {

    /**
     * The unique identifier for the User.
     */
    @Schema(example = "4c2bb19c-854d-4320-b257-bae33e1fe279", description = "The unique identifier for the user")
    private UUID uniqueId;

    /**
     * User's first name.
     */
    @Schema(example = "John", description = "User's first name.")
    private String firstName;

    /**
     * User's last name.
     */
    @Schema(example = "Doe", description = "User's last name.")
    private String lastName;

    /**
     * User's email.
     */
    @Schema(example = "John@examble.com", description = "User's email.")
    private String email;

    @Schema(example = "Active", description = "User's Status")
    private String status;

}
