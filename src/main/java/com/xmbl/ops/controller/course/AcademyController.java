package com.xmbl.ops.controller.course;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.model.course.AcademyEntity;
import com.xmbl.ops.service.source.AcademyService;
import com.xmbl.ops.web.api.bean.PageData;
import com.xmbl.ops.web.api.bean.Route;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
 * @Compile 2018-11-11 -- 16:43
 * @Version 1.0
 * @Description     院校管理
 */
@Slf4j
@Controller
@RequestMapping(value = Route.PATH + Route.Course.PATH)
public class AcademyController extends AbstractController {

    @Autowired
    private AcademyService academyService;

    @GetMapping(value = Route.Course.GET_ACAGEMY_VIEW)
    public String getAcademyView(){
        return "/course/academy/list";
    }
    @GetMapping(value = Route.Course.TO_ACAGEMY_ADD)
    public String toAcademyAddView(){
        return "/course/academy/add";
    }

    /**
     *
     * @return
     */
    @PostMapping(value = Route.Course.GET_ACAGEMY_LIST)
    @ResponseBody
    public Object getAcademyList(){
        PageData pageData = this.getPageData();
        try {
            String academyName = pageData.getString("name");
            int pageNumber = pageData.getPageNumber();
            int pageSize = pageData.getPageSize();

            List<AcademyEntity> academyEntities = academyService.findAll(academyName,pageNumber,pageSize);

            Query countQuery = new Query();
            if (StringUtils.isNotBlank(academyName) && !StringUtils.trim(academyName).equals("")) {
                countQuery.addCriteria(Criteria.where("academyName").is(academyName));
            }
            long count = academyService.findCountByQuery(countQuery);

            PageData data = new PageData();
            data.put("total", count);
            data.put("rows", academyEntities);
            log.info("infoMsg:--- 获取奖励机制列表结束");
            return data;
        } catch (Exception e){
            return null;
        }
    }

    /**
     * UEditor编辑器初始化
     * @return
     */
    @RequestMapping(value = Route.Course.UEDITOR_LOADING)
    public String ueditor_loading() {
        log.info("ueditor编辑器初始化");
        return "ueditor/controller";
    }

}
