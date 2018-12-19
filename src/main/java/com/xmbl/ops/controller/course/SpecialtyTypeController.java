package com.xmbl.ops.controller.course;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.model.course.SpecialtyType;
import com.xmbl.ops.service.source.SpecialtyTypeService;
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
 * @Compile 208-11-11 -- 16:46
 * @Version 1.0
 * @Description 专业类型
 */
@Slf4j
@Controller
@RequestMapping(Route.PATH + Route.Course.PATH)
public class SpecialtyTypeController extends AbstractController {

    @Autowired
    private SpecialtyTypeService SpecialtyTypeService;

    @GetMapping(Route.Course.TO_SPECIALTY_TYPE_LIST_VIEW)
    public String toSpecialtyTypeView() {
        return "/course/specialty/type/list";
    }

    @GetMapping(Route.Course.TO_SPECIALTY_TYPE_ADD_VIEW)
    public String toSpecialtyTypeAddView() {
        return "/course/specialty/type/add";
    }

    @GetMapping(Route.Course.GET_SPECIALTY_TYPE_EDIT)
    public ModelAndView getSpecialtyTypeEdit() {
        PageData pageData = this.getPageData();
        PageData pd = new PageData();
        ModelAndView mv = this.getModelAndView();
        try {
            String id = pageData.getString("id");
            SpecialtyType type = SpecialtyTypeService.findById(id);
            pd.put("id", id);
            pd.put("eduLevel", type.getEduLevel());
            pd.put("code", type.getCode());
            pd.put("sort", type.getSort());
            pd.put("type", type.getType());
            pd.put("state", type.getState());
            mv.addObject("pd",pd);
            mv.setViewName("/course/specialty/type/edit");
            return mv;
        } catch (Exception e) {
            log.error("获取专业类型列表失败，errorMsg,{}", e.getMessage());
            return null;
        }
    }

    @PostMapping(Route.Course.GET_SPECIALTY_TYPE_LIST)
    @ResponseBody
    public Object getSpecialtyTypeList() {
        PageData pageData = this.getPageData();
        try {
            String type = pageData.getString("type");
            int pageNumber = pageData.getPageNumber();
            int pageSize = pageData.getPageSize();

            List<SpecialtyType> specialtyTypeList = SpecialtyTypeService.getAll(type, pageNumber, pageSize);
            long count = SpecialtyTypeService.count(type);

            PageData data = new PageData();
            data.put("rows", specialtyTypeList);
            data.put("total", count);
            return data;
        } catch (Exception e) {
            log.error("获取专业类型列表失败，errorMsg,{}", e.getMessage());
            return null;
        }
    }

    @PostMapping(Route.Course.SPECIALTY_TYPE_ADD)
    @ResponseBody
    public Response addSpecialtyType() {
        PageData pageData = this.getPageData();
        Response response = this.getResponse();
        try {
            String eduLevel = pageData.getString("eduLevel");
            String code = pageData.getString("code");
            Integer type = pageData.getInteger("type");
            Integer sort = pageData.getInteger("sort");
            Integer state = pageData.getInteger("state");
            SpecialtyType specialtyType = new SpecialtyType(eduLevel, code, sort, type, state);
            SpecialtyTypeService.add(specialtyType);
            return response.success();
        } catch (Exception e) {
            log.error("新增专业类型失败，errorMsg,{}", e.getMessage());
            return response.failure(e.getMessage());
        }
    }


    @PostMapping(Route.Course.SPECIALTY_TYPE_DELETE)
    @ResponseBody
    public Response deleteSpecialtyType() {
        PageData pageData = this.getPageData();
        Response response = this.getResponse();
        try {
            String IDS = pageData.getString("IDS");
            String[] params = IDS.split(",");
            for(String id : params){
                SpecialtyTypeService.delete(id);
            }
            return response.success();
        } catch (Exception e) {
            log.error("新增专业类型失败，errorMsg,{}", e.getMessage());
            return response.failure(e.getMessage());
        }
    }


    @PostMapping(Route.Course.SPECIALTY_TYPE_EDIT)
    @ResponseBody
    public Response editSpecialtyType() {
        PageData pageData = this.getPageData();
        Response response = this.getResponse();
        try {
            String id = pageData.getString("id");
            String eduLevel = pageData.getString("eduLevel");
            String code = pageData.getString("code");
            String sort = pageData.getString("sort");
            String type = pageData.getString("type");
            String state = pageData.getString("state");
            Query query = new Query();
            query.addCriteria(Criteria.where("_id").is(id));
            Update update = new Update();
            update.set("eduLevel",eduLevel);
            update.set("code",code);
            update.set("eduLevel",eduLevel);
            update.set("sort",sort);
            update.set("type",type);
            update.set("state",state);
            SpecialtyTypeService.update(query,update);
            return response.success();
        } catch (Exception e) {
            log.error("新增专业类型失败，errorMsg,{}", e.getMessage());
            return response.failure(e.getMessage());
        }
    }


}
