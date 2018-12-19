package com.xmbl.ops.dao.data.impl;

import com.xmbl.ops.dao.base.EntityMongoDaoImpl;
import com.xmbl.ops.dao.data.MessageDao;
import com.xmbl.ops.model.data.Message;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile --
 * @Version 1.0
 * @Description
 */
@Component
@Transactional
public class MessageDaoImpl extends EntityMongoDaoImpl<Message> implements MessageDao {


    @Override
    public void save(Message message) {
        this.getMongoTemplate().save(message);
    }
}
