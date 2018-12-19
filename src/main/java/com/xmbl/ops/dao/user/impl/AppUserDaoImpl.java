package com.xmbl.ops.dao.user.impl;

import com.xmbl.ops.dao.base.EntityMongoDaoImpl;
import com.xmbl.ops.dao.user.AppUserDao;
import com.xmbl.ops.model.user.AppUser;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 15:19
 * @Version 1.0
 * @Description
 */
@Repository
public class AppUserDaoImpl extends EntityMongoDaoImpl<AppUser> implements AppUserDao {
    @Override
    public List<AppUser> findAll(String userkey, int pageNumber, int pageSize) {
        Query query = new Query();
        if(StringUtils.isNotBlank(userkey) && !StringUtils.trim(userkey).equals("")){
            query.addCriteria(Criteria.where("userkey").is(userkey));
        }
        query.skip((pageNumber - 1) * pageSize).limit(pageSize);
        return this.getMongoTemplate().find(query,AppUser.class);
    }

    @Override
    public long count(String userkey) {
        Query query = new Query();
        if(StringUtils.isNotBlank(userkey) && !StringUtils.trim(userkey).equals("")){
            query.addCriteria(Criteria.where("userkey").is(userkey));
        }
        return this.getMongoTemplate().count(query,AppUser.class);
    }

    @Override
    public AppUser findById(String userkey) {
        Query query = new Query().addCriteria(Criteria.where("userkey").is(userkey));
        return this.getMongoTemplate().findOne(query,AppUser.class);
    }

    @Override
    public AppUser findByPhone(String phone) {
        Query query = new Query().addCriteria(Criteria.where("mobile").is(phone));
        return this.getMongoTemplate().findOne(query,AppUser.class);
    }

    @Override
    public boolean bind_phone(String phone, int verifyCode) {
        return false;
    }
}
