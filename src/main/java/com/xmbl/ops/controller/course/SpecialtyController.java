package com.xmbl.ops.controller.course;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.model.course.SpecialtyEntity;
import com.xmbl.ops.service.source.SpecialtyService;
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
 * @Compile 2018-11-11 -- 16:44
 * @Version 1.0
 * @Description     专业
 */
@Slf4j
@Controller
@RequestMapping(Route.PATH + Route.Course.PATH)
public class SpecialtyController extends AbstractController {

    @Autowired
    private SpecialtyService specialtyService;

    @GetMapping(Route.Course.TO_SPECIALTY_LIST_VIEW)
    public String toSpecialtyView(){
        return "/course/specialty/list";
    }

    @PostMapping(Route.Course.GET_SPECIALTY_LIST)
    @ResponseBody
    public Object getSpecialtyTypeList(){
            PageData pageData = this.getPageData();
            try{
                Integer specialtyCode = pageData.getInteger("specialtyCode");
                int pageNumber = pageData.getPageNumber();
                int pageSize = pageData.getPageSize();

                List<SpecialtyEntity> specialtyList = specialtyService.getAll(specialtyCode,pageNumber,pageSize);
                long count = specialtyService.count(specialtyCode);

                PageData data = new PageData();
                data.put("rows",specialtyList);
            data.put("total",count);
            return data;
        }catch (Exception e){
            log.error("获取专业列表失败，errorMsg,{}",e.getMessage());
            return null;
        }
    }



}
