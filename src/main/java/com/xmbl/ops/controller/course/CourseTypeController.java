package com.xmbl.ops.controller.course;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.model.course.CourseType;
import com.xmbl.ops.service.source.CourseTypeService;
import com.xmbl.ops.web.api.bean.PageData;
import com.xmbl.ops.web.api.bean.Response;
import com.xmbl.ops.web.api.bean.Route;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

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

    @GetMapping(Route.Course.TO_COURSE_TYPE_LIST_ADD)
    public String toCourseTypeAdd(){
        return "/course/type/add";
    }

    @GetMapping(Route.Course.TO_COURSE_TYPE_LIST_EDIT)
    public ModelAndView toCourseTypeEdit(){
        ModelAndView mv = this.getModelAndView();
        PageData pageData = this.getPageData();
        PageData pd = new PageData();
        try{
            String id = pageData.getString("id");
            CourseType course = courseTypeService.findById(id);
            pd.put("id",id);
            pd.put("courseName",course.getCourseName());
            pd.put("status",course.getStatus());
            pd.put("courseType",course.getCourseType());
            mv.addObject("pd",pd);
            mv.setViewName("/course/type/edit");
        } catch (Exception e){
            log.error(e.getMessage());
        }
        return mv;
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

    @PostMapping(Route.Course.ADD_COURSE_TYPE)
    @ResponseBody
    public Response addCourseType(){
        PageData pageData = this.getPageData();
        Response response = this.getResponse();
        try{
            String courseName = pageData.getString("courseName");
            int courseType = pageData.getInteger("courseType");
            int status = pageData.getInteger("status");
            CourseType course = new CourseType(courseName,courseType,status);
            courseTypeService.add(course);
            return response.success();
        }catch (Exception e){
            log.error("获取课程类型列表失败，errorMsg,{}",e.getMessage());
            return response.failure(e.getMessage());
        }
    }

    @PostMapping(Route.Course.DELETE_COURSE_TYPE)
    @ResponseBody
    public Response deleteCourseType(){
        PageData pageData = this.getPageData();
        Response response = this.getResponse();
        try{
            String IDS = pageData.getString("IDS");
            String[] parmas = IDS.split(",");
            for(String id : parmas){
                courseTypeService.delete(id);
            }
            return response.success();
        }catch (Exception e){
            log.error("获取课程类型列表失败，errorMsg,{}",e.getMessage());
            return response.failure(e.getMessage());
        }
    }

    @PostMapping(Route.Course.EDIT_COURSE_TYPE)
    @ResponseBody
    public Response editCourseType(){
        PageData pageData = this.getPageData();
        Response response = this.getResponse();
        try{
            String id = pageData.getString("id");
            String courseName = pageData.getString("courseName");
            int courseType = pageData.getInteger("courseType");
            int status = pageData.getInteger("status");
            Query query = new Query();
            query.addCriteria(Criteria.where("_id").is(id));
            Update update = new Update();
            update.set("courseName",courseName);
            update.set("courseType",courseType);
            update.set("status",status);
            courseTypeService.update(query,update);
            return response.success();
        }catch (Exception e){
            log.error("获取课程类型列表失败，errorMsg,{}",e.getMessage());
            return response.failure(e.getMessage());
        }
    }


}
