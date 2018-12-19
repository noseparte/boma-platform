package com.xmbl.ops.controller.app.user;

import com.xmbl.ops.constant.EnvConstant;
import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.model.user.AppUser;
import com.xmbl.ops.model.user.UserInfoData;
import com.xmbl.ops.service.user.AppUserService;
import com.xmbl.ops.service.user.UserInfoDataService;
import com.xmbl.ops.web.api.bean.PageData;
import com.xmbl.ops.web.api.bean.Response;
import com.xmbl.ops.web.api.bean.Route;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile --
 * @Version 1.0
 * @Description
 */
@RestController
@Slf4j
@RequestMapping(Route.PATH + Route.APP_PATH)
public class AppLoginController extends AbstractController {

    @Autowired
    private AppUserService appUserService;
    @Autowired
    private UserInfoDataService userInfoDataService;

    /**
     * 用户登录
     *
     * @param userkey
     * @param password
     * @return
     */
    @RequestMapping
    public Response login(
            @RequestParam(value = "userkey",required = true) String userkey,
            @RequestParam(value = "passowrd",required = true) String password){
        Response response = this.getResponse();
        try{

            return response.success();
        }catch (Exception e){
            return response.failure();
        }
    }


    /**
     * 第三方登录
     *
     * @param openId
     * @param openType
     * @return
     */
    @PostMapping(value = Route.OPEN_LOGIN)
    public Response open_login(@RequestParam("openId") String openId,@RequestParam("openType") String openType) {
        log.info("infoMsg:---  第三方登录开始");
        Response reponse = this.getResponse();
        PageData pd = new PageData();
        int result = 0;
        try {
            if(StringUtils.trim(openId).equals("") || StringUtils.isBlank(openType)) {
                return reponse.failure("Getting user openId failed");
            }
            UserInfoData info = userInfoDataService.open_login(openId,openType);
            if(info == null) {
                result = EnvConstant.Normal;
                pd.put("state", result);
                pd.put("info", "未绑定");
            }else {
                result = EnvConstant.Unusual;
                AppUser user = appUserService.findById(info.getUserkey());
                pd.put("state", result);
                pd.put("info", "已绑定");
                pd.put("uid", user.getAccountid());
                pd.put("phone", user.getMobile());
            }
            log.info("infoMsg:---  第三方登录结束");
            return reponse.success(pd);
        } catch (Exception e) {
            log.error("errorMsg:--- 第三方登录失败." + e.getMessage());
            return reponse.failure(e.getMessage());
        }

    }


    /**
     * 手机号绑定
     *
     * @param openId
     * @param openType
     * @param phone
     * @param verifyCode
     * @return
     */
    @RequestMapping(value=Route.BIND_USER_PHONE)
    public Response bind_user_phone(@RequestParam("openId") String openId,@RequestParam("openType") String openType,
                                    @RequestParam("phone") String phone,@RequestParam("verifyCode") int verifyCode) {
        log.info("infoMsg:--- 手机号绑定开始");
        Response reponse = this.getResponse();
        PageData pd = new PageData();
        try {
            AppUser entity = appUserService.findOne(phone);
            if(null == entity) {
                boolean result = appUserService.bind_phone(phone, verifyCode);
                if(result) {
                    AppUser user = appUserService.findOne(phone);
                    userInfoDataService.bind_open_account(user.getAccountid(),openId,openType);
                    pd.put("uid", entity.getAccountid());
                    pd.put("phone", entity.getMobile());
                }
            }else {
                userInfoDataService.bind_open_account(entity.getAccountid(),openId,openType);
                pd.put("uid", entity.getAccountid());
                pd.put("phone", entity.getMobile());
            }
            log.info("infoMsg:--- 手机号绑定结束");
            return reponse.success(pd);
        } catch (Exception e) {
            log.error("errorMsg:--- 手机号绑定失败" + e.getMessage());
            return reponse.failure(e.getMessage());
        }
    }

    /**
     * 用户绑定第三方账号
     *
     * @param userkey
     * @param openId
     * @param openType
     * @return
     */
    @RequestMapping(value=Route.BIND_OPEN_ACCOUNT)
    public Response bind_open_account(@RequestParam("userkey") String userkey,
                                      @RequestParam("openId") String openId,@RequestParam("openType") String openType) {
        log.info("infoMsg:--- 用户绑定第三方账户开始");
        Response reponse = this.getResponse();
        try {
            userInfoDataService.bind_open_account(userkey,openId,openType);
            log.info("infoMsg:--- 用户绑定第三方账户结束");
            return reponse.success();
        } catch (Exception e) {
            log.error("errorMsg:--- 用户绑定" + openType + "失败" + e.getMessage());
            return reponse.failure(e.getMessage());
        }


    }




}





