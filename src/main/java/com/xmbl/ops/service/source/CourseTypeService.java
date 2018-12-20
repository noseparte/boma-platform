package com.xmbl.ops.service.source;

import com.xmbl.ops.dao.course.CourseTypeDao;
import com.xmbl.ops.model.course.CourseType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 11:40
 * @Version 1.0
 * @Description
 */
@Service
@Transactional
public class CourseTypeService {

    @Autowired
    private CourseTypeDao courseTypeDao;

    public List<CourseType> getAll(String type, int pageNumber, int pageSize) {
        return courseTypeDao.getAll(type,pageNumber,pageSize);
    }

    public long count(String type) {
        return courseTypeDao.count(type);
    }

    public void add(CourseType course) {
        courseTypeDao.add(course);
    }

    public void delete(String id) {
        courseTypeDao.delete(id);
    }

    public CourseType findById(String id) {
        return  courseTypeDao.findById(id);
    }

    public void update(Query query, Update update) {
        courseTypeDao.update(query,update);
    }
}
