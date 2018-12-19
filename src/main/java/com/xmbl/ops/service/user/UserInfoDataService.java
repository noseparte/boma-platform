package com.xmbl.ops.service.user;

import com.xmbl.ops.dao.user.UserInfoDataDao;
import com.xmbl.ops.model.user.UserInfoData;
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
public class UserInfoDataService {

    @Autowired
    private UserInfoDataDao userInfoDataDao;

    public void bind_open_account(String userkey, String openId, String openType) {
        userInfoDataDao.bind_open_account(userkey,openId,openType);
    }

    public UserInfoData open_login(String openId, String openType) {
        return userInfoDataDao.open_login(openId,openType);
    }
}
