package com.xmbl.ops.dao.course.impl;

import com.xmbl.ops.dao.base.EntityMongoDaoImpl;
import com.xmbl.ops.dao.course.AcademyDao;
import com.xmbl.ops.model.course.AcademyEntity;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 11:15
 * @Version 1.0
 * @Description
 */
@Repository
public class AcademyDaoImpl extends EntityMongoDaoImpl<AcademyEntity> implements AcademyDao {

    @Override
    public List<AcademyEntity> findAll(String academyName, int pageNumber, int pageSize) {
        Query query = new Query();
        if(StringUtils.isNotBlank(academyName) && !StringUtils.trim(academyName).equals("")){
            query.addCriteria(Criteria.where("academyName").is(academyName));
        }
        query.skip((pageNumber - 1) * pageSize).limit(pageSize);
        return this.getMongoTemplate().find(query,AcademyEntity.class,"bm_edu_cademy");
    }

    @Override
    public long findCountByQuery(Query countQuery) {
        return this.getMongoTemplate().count(countQuery,AcademyEntity.class);
    }
}
