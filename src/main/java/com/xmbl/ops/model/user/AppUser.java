package com.xmbl.ops.model.user;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11:28
 * @Version 1.0
 * @Description 学生管理
 */
@Data
@Document(collection = "bm_app_user")
public class AppUser extends GeneralBean {

    // 用户id(原先老账号accountid)
    private String accountid;
    // 用户账号 （登录账号）
    private String userkey;
    // 用户密码
    private String password;
    // 游戏玩家姓名
    private String playername = "";
    // 手机号码
    private String mobile;
    // 手机号码是否激活
    private boolean mobile_activate = Boolean.FALSE;
    // 账号状态（1--启用;2--禁用）
    private Integer status;
    // 登录次数
    private Integer logincnt = 0;

}
