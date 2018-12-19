package com.xmbl.ops.controller.user;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.model.user.AppUser;
import com.xmbl.ops.service.user.AppUserService;
import com.xmbl.ops.web.api.bean.PageData;
import com.xmbl.ops.web.api.bean.Route;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;


/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-11 -- 16:38
 * @Version 1.0
 * @Description
 */
@Slf4j
@RequestMapping(value = Route.PATH + Route.User.PATH)
@Controller
public class AppUserController extends AbstractController {

    @Autowired
    private AppUserService AppUserService;

    /**
     * 列表
     * @return
     */
    @GetMapping(value = Route.User.TO_USER_LIST)
    public String to_user_list(){
        return "user/appuser/list";
    }

    @GetMapping(value = Route.User.TO_USER_SAVE_OR_UPDATE)
    public String to_user_saveOredit(){
        return "user/appuser/saveOrUpdate";
    }

    /**
     * 数据
     * @return
     */
    @PostMapping(value = Route.User.USER_LIST)
    @ResponseBody
    public Object userList(){
        PageData pageData = this.getPageData();
        try{
            String userkey = pageData.getString("userkey");
            int pageNumber = pageData.getPageNumber();
            int pageSize = pageData.getPageSize();
            List<AppUser> userList = AppUserService.findAll(userkey,pageNumber,pageSize);
            long count = AppUserService.count(userkey);
            PageData pd = new PageData();
            pd.put("rows",userList);
            pd.put("total",count);
            return pd;
        }catch (Exception e){
            log.error(e.getMessage());
        }
        return null;
    }


}
