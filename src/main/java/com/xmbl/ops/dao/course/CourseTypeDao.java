package com.xmbl.ops.dao.course;

import com.xmbl.ops.model.course.CourseType;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.util.List;

public interface CourseTypeDao {
    List<CourseType> getAll(String type, int pageNumber, int pageSize);

    long count(String type);

    void add(CourseType course);

    void delete(String id);

    CourseType findById(String id);

    void update(Query query, Update update);
}
