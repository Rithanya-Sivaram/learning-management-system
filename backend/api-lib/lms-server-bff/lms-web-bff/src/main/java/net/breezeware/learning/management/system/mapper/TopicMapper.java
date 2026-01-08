package net.breezeware.learning.management.system.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import net.breezeware.learning.management.system.dto.TopicDto;
import net.breezeware.learning.management.system.entity.Topic;

@Mapper(componentModel = "spring")
public interface TopicMapper {

    @Mapping(target = "course", ignore = true)
    Topic topicDtoToTopic(TopicDto topicDto);

    @Mapping(target = "courseId", source = "course.id")
    TopicDto topicToTopicDto(Topic topic);
}