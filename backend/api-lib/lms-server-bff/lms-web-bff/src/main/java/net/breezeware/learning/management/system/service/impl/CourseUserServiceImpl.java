package net.breezeware.learning.management.system.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import net.breezeware.dynamo.usermanagement.cognito.service.CognitoService;
import net.breezeware.dynamo.usermanagement.dto.SignedUpUserData;
import net.breezeware.dynamo.usermanagement.dto.UserViewResponse;
import net.breezeware.dynamo.usermanagement.entity.User;
import net.breezeware.dynamo.usermanagement.service.UserService;
import net.breezeware.dynamo.usermanagent.service.UserManagementService;
import net.breezeware.learning.management.system.dto.UserDto;
import net.breezeware.learning.management.system.service.api.CourseUserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of the {@link CourseUserService}. Provides functionality for
 * retrieving learners based on user role.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CourseUserServiceImpl implements CourseUserService {

    private final UserService userService;

    private final UserManagementService userManagementService;

    private final CognitoService cognitoService;

    @Value("${aws.cognito.user-pool.id}")
    private String userPoolId;

    /**
     * Retrieves all users with the role "learner" and maps them to {@link UserDto}.
     * @return a list of learners as {@link UserDto}.
     */
    @Override
    public List<UserDto> retrieveLearners() {
        log.info("Entering retrieveLearners()");

        List<User> users = userService.retrieveUsersByRole(List.of("learner"));
        List<UserDto> learners = new ArrayList<>();

        users.forEach(user -> {
            UserDto userDto = new UserDto();
            userDto.setUniqueId(user.getUniqueId());
            userDto.setEmail(user.getEmail());
            userDto.setFirstName(user.getFirstName());
            userDto.setLastName(user.getLastName());
            userDto.setStatus(user.getStatus());
            learners.add(userDto);
        });

        log.info("Leaving retrieveLearners()");
        return learners;
    }

    @Override
    public void createUser(String email) {
        log.info("Entering createUser()");
        UserViewResponse userViewResponse = cognitoService.retrieveUserByEmail(email);

        log.info("{}", userViewResponse);

        SignedUpUserData signedUpUserData = new SignedUpUserData();
        signedUpUserData.setIdmUniqueUserId(userViewResponse.getIdmUserId());
        signedUpUserData.setIdmId(userPoolId);
        signedUpUserData.setFirstName(userViewResponse.getFirstName());
        signedUpUserData.setLastName(userViewResponse.getLastName());
        signedUpUserData.setEmail(userViewResponse.getEmail());
        signedUpUserData.setPhoneNumber(userViewResponse.getPhoneNumber());
        signedUpUserData.setOrganization("breezeware");
        signedUpUserData.setRoles(List.of("learner"));
        signedUpUserData.setGroups(List.of("lms"));
        signedUpUserData.setIdmUserStatus("approved");

        userManagementService.createUser(signedUpUserData);

        cognitoService.addUserGroups(userViewResponse.getIdmUserName(), List.of("lms"), List.of("learner"));

        log.info("Leaving createUser()");
    }

}
