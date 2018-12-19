package com.xmbl.ops.model.course;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11:45
 * @Version 1.0
 * @Description     课程类型
 */
@Data
@Document(collection = "bm_edu_course_type")
public class CourseType extends GeneralBean {

    // ------------------------------------------------- params
    private String courseName;              //课程名称
    private int courseType;                 //课程类型 1.精品 2.VIP



}
