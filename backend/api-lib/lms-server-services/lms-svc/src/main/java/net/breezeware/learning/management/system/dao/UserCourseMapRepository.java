package net.breezeware.learning.management.system.dao;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import net.breezeware.dynamo.generics.crud.dao.GenericRepository;
import net.breezeware.learning.management.system.entity.UserCourseMap;

@Repository
public interface UserCourseMapRepository extends GenericRepository<UserCourseMap> {

    List<UserCourseMap> findByUserUniqueId(UUID userId);

    List<UserCourseMap> findByCourseId(long courseId);

    Optional<UserCourseMap> findByCourseIdAndUserUniqueId(long courseId, UUID userId);
}