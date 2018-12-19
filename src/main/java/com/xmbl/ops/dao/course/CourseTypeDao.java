package com.xmbl.ops.dao.course;

import com.xmbl.ops.model.course.CourseType;

import java.util.List;

public interface CourseTypeDao {
    List<CourseType> getAll(String type, int pageNumber, int pageSize);

    long count(String type);
}
