package com.xmbl.ops.dao.course.impl;

import com.xmbl.ops.dao.base.EntityMongoDaoImpl;
import com.xmbl.ops.dao.course.SpecialtyTypeDao;
import com.xmbl.ops.model.course.SpecialtyType;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 11:25
 * @Version 1.0
 * @Description
 */
@Repository
public class SpecialtyTypeDaoImpl extends EntityMongoDaoImpl<SpecialtyType> implements SpecialtyTypeDao {
    @Override
    public List<SpecialtyType> getAll(String type, int pageNumber, int pageSize) {
        Query query = new Query();
        if(StringUtils.isNotBlank(type) && !StringUtils.trim(type).equals("")){
            query.addCriteria(Criteria.where("type").is(Integer.parseInt(type)));
        }
        pageList(query,pageNumber,pageSize);
        return this.getMongoTemplate().find(query,SpecialtyType.class);
    }

    @Override
    public long count(String type) {
        Query query = new Query();
        if(StringUtils.isNotBlank(type) && !StringUtils.trim(type).equals("")){
            query.addCriteria(Criteria.where("type").is(Integer.parseInt(type)));
        }
        return this.getMongoTemplate().count(query,SpecialtyType.class);
    }

    @Override
    public void add(SpecialtyType specialtyType) {
        this.getMongoTemplate().save(specialtyType);
    }

    @Override
    public void delete(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        this.getMongoTemplate().remove(query,SpecialtyType.class);
    }

    @Override
    public SpecialtyType findById(String id) {
        return this.getMongoTemplate().findById(id,SpecialtyType.class);
    }

    @Override
    public void update(Query query, Update update) {
        this.getMongoTemplate().updateFirst(query,update,SpecialtyType.class);
    }
}
