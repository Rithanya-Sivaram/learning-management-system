package net.breezeware.learning.management.system.dao;

import org.springframework.stereotype.Repository;

import net.breezeware.dynamo.generics.crud.dao.GenericRepository;
import net.breezeware.learning.management.system.entity.Course;

@Repository
public interface CourseRepository extends GenericRepository<Course> {
}
