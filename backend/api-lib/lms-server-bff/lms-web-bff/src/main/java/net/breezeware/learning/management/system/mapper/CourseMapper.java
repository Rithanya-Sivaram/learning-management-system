package net.breezeware.learning.management.system.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import net.breezeware.learning.management.system.dto.CourseDto;
import net.breezeware.learning.management.system.entity.Course;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "author", ignore = true)
    Course courseDtoToCourse(CourseDto courseDto);

    @Mapping(target = "learnersEnrolled", ignore = true)
    @Mapping(target = "authorId", source = "author.uniqueId")
    CourseDto courseToCourseDto(Course course);
}
