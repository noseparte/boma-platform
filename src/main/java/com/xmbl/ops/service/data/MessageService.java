package com.xmbl.ops.service.data;

import com.xmbl.ops.dao.data.MessageDao;
import com.xmbl.ops.model.data.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile --
 * @Version 1.0
 * @Description
 */
@Service
public class MessageService {

    @Autowired
    private MessageDao messageDao;

    public void save(Message message) {
        messageDao.save(message);
    }
}
