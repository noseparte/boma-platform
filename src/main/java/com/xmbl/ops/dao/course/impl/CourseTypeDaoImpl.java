package com.xmbl.ops.dao.course.impl;

import com.xmbl.ops.dao.base.EntityMongoDaoImpl;
import com.xmbl.ops.dao.course.CourseTypeDao;
import com.xmbl.ops.model.course.CourseType;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 11:24
 * @Version 1.0
 * @Description
 */
@Repository
public class CourseTypeDaoImpl extends EntityMongoDaoImpl<CourseType> implements CourseTypeDao {
    @Override
    public List<CourseType> getAll(String type, int pageNumber, int pageSize) {
        Query query = new Query();
        if(StringUtils.isNotBlank(type) && !StringUtils.trim(type).equals("")){
            query.addCriteria(Criteria.where("courseType").is(Integer.parseInt(type)));
        }
        pageList(query,pageNumber,pageSize);
        return this.getMongoTemplate().find(query,CourseType.class);
    }

    @Override
    public long count(String type) {
        Query query = new Query();
        if(StringUtils.isNotBlank(type) && !StringUtils.trim(type).equals("")){
            query.addCriteria(Criteria.where("courseType").is(Integer.parseInt(type)));
        }
        return this.getMongoTemplate().count(query,CourseType.class);
    }
}
