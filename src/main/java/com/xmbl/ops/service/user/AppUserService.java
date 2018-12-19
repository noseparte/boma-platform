package com.xmbl.ops.service.user;

import com.xmbl.ops.dao.user.AppUserDao;
import com.xmbl.ops.model.user.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 15:58
 * @Version 1.0
 * @Description
 */
@Service
@Transactional
public class AppUserService  {

    @Autowired
    private AppUserDao appUserDao;

    public List<AppUser> findAll(String userkey, int pageNumber, int pageSize) {
        return appUserDao.findAll(userkey,pageNumber,pageSize);
    }

    public long count(String userkey) {
        return appUserDao.count(userkey);
    }

    public AppUser findById(String userkey) {
        return appUserDao.findById(userkey);
    }

    public AppUser findOne(String phone) {
        return  appUserDao.findByPhone(phone);
    }

    public boolean bind_phone(String phone, int verifyCode) {
        return appUserDao.bind_phone(phone,verifyCode);
    }
}
