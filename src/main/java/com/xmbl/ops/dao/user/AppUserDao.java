package com.xmbl.ops.dao.user;

import com.xmbl.ops.model.user.AppUser;

import java.util.List;

public interface AppUserDao {
    List<AppUser> findAll(String userkey, int pageNumber, int pageSize);

    long count(String userkey);

    AppUser findById(String userkey);

    AppUser findByPhone(String phone);

    boolean bind_phone(String phone, int verifyCode);
}
