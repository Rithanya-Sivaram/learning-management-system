package net.breezeware.learning.management.system.service.api;

import java.util.List;

import net.breezeware.learning.management.system.dto.UserDto;

/**
 * Service interface for managing users associated with courses. Provides
 * operations for retrieving learners.
 */
public interface CourseUserService {

    /**
     * Retrieves all users who are learners in the system.
     * @return a list of {@link UserDto} objects representing learners
     */
    List<UserDto> retrieveLearners();

    void createUser(String email);
}
