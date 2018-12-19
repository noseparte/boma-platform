package com.xmbl.ops.model.user;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11:32
 * @Version 1.0
 * @Description     报名材料
 */
@Data
@Document(collection = "bm_app_materials")
public class ApplicationMaterials extends GeneralBean {

    private String userkey;
    private String specialtyId;                   //专业ID
    private String specialty_type;                //专业类型
    private String course_level;                  //层次ID
    private Integer status;                  	  //用户状态

}
