package net.breezeware.learning.management.system.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import net.breezeware.dynamo.generics.crud.dao.GenericRepository;
import net.breezeware.learning.management.system.entity.Topic;

@Repository
public interface TopicRepository extends GenericRepository<Topic> {

    List<Topic> findByCourseId(long courseId);
}