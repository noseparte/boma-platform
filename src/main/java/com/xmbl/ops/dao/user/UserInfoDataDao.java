package com.xmbl.ops.dao.user;

import com.xmbl.ops.model.user.UserInfoData;

public interface UserInfoDataDao {
    void bind_open_account(String userkey, String openId, String openType);

    UserInfoData open_login(String openId, String openType);
}
