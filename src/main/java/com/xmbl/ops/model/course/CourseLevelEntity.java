package com.xmbl.ops.model.course;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile --
 * @Version 1.0
 * @Description     课程层次
 */
@Data
@Document(collection = "bm_edu_course_level")
public class CourseLevelEntity extends GeneralBean {

    private int level;                          //层级
    private String levelName;                   //层级名称
    private String levelCode;                   //层级编号
    private String levelDec;                    //层级描述


}
