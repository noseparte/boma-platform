package com.xmbl.ops.dao.course.impl;

import com.xmbl.ops.dao.base.EntityMongoDaoImpl;
import com.xmbl.ops.dao.course.SpecialtyDao;
import com.xmbl.ops.model.course.SpecialtyEntity;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 11:22
 * @Version 1.0
 * @Description
 */
@Repository
public class SpecialtyDaoImpl extends EntityMongoDaoImpl<SpecialtyEntity> implements SpecialtyDao {

    @Override
    public List<SpecialtyEntity> getAll(Integer specialtyCode, int pageNumber, int pageSize) {
        Query query = new Query();
        query.addCriteria(Criteria.where("specialtyCode").is(specialtyCode));
        pageList(query,pageNumber,pageSize);
        return this.getMongoTemplate().find(query,SpecialtyEntity.class);
    }

    @Override
    public long count(Integer specialtyCode) {
        Query query = new Query();
        query.addCriteria(Criteria.where("specialtyCode").is(specialtyCode));
        return this.getMongoTemplate().count(query,SpecialtyEntity.class);
    }
}


