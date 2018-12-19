package com.xmbl.ops.model.course;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11:44
 * @Version 1.0
 * @Description     专业类型
 */
@Data
@Document(collection = "bm_edu_specialty_type")
public class SpecialtyType extends GeneralBean {

    @Field(value = "edu_level")
    private String eduLevel;
    private String code;
    private int sort;
    private int type;               //类型
    private int state;

    public SpecialtyType() {
    }

    public SpecialtyType(String eduLevel, String code, int sort, int type, int state) {
        this.eduLevel = eduLevel;
        this.code = code;
        this.sort = sort;
        this.type = type;
        this.state = state;
    }
}

