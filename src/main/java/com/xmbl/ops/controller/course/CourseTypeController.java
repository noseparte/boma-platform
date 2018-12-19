package com.xmbl.ops.controller.course;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.model.course.CourseType;
import com.xmbl.ops.service.source.CourseTypeService;
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
 * @Compile 2018-11-11 -- 16:45
 * @Version 1.0
 * @Description     课程类型
 */
@Slf4j
@Controller
@RequestMapping(Route.PATH + Route.Course.PATH)
public class CourseTypeController extends AbstractController {

    @Autowired
    private CourseTypeService courseTypeService;

    @GetMapping(Route.Course.TO_COURSE_TYPE_LIST_VIEW)
    public String toCourseTypeView(){
        return "/course/type/list";
    }

    @PostMapping(Route.Course.GET_COURSE_TYPE_LIST)
    @ResponseBody
    public Object getCourseTypeList(){
        PageData pageData = this.getPageData();
        try{
            String type = pageData.getString("type");
            int pageNumber = pageData.getPageNumber();
            int pageSize = pageData.getPageSize();

            List<CourseType> courseTypeList = courseTypeService.getAll(type,pageNumber,pageSize);
            long count = courseTypeService.count(type);

            PageData data = new PageData();
            data.put("rows",courseTypeList);
            data.put("total",count);
            return data;
        }catch (Exception e){
            log.error("获取课程类型列表失败，errorMsg,{}",e.getMessage());
            return null;
        }
    }


}
