package com.xmbl.ops.dao.user.impl;

import com.xmbl.ops.dao.base.EntityMongoDaoImpl;
import com.xmbl.ops.dao.user.UserInfoDataDao;
import com.xmbl.ops.model.user.UserInfoData;
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
public class UserInfoDataDaoImpl extends EntityMongoDaoImpl<UserInfoData> implements UserInfoDataDao {
    @Override
    public void bind_open_account(String userkey, String openId, String openType) {
        new UserInfoData();
    }

    @Override
    public UserInfoData open_login(String openId, String openType) {
        return null;
    }
}
