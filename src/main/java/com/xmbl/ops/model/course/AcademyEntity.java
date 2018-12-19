package com.xmbl.ops.model.course;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11::41
 * @Version 1.0
 * @Description     院校管理
 */
@Data
@Document(collection = "bm_edu_cademy")
public class AcademyEntity extends GeneralBean {

    private String academyName;                   //院校名称
    private String academyCode;                   //院校编号
    private String academyDec;                    //院校简介
    private String academyAddress;                //院校地址
    private String academyUrl;                    //院校图片
    private String academyPhone;                  //院校电话
    private int academyState;                     //院校状态


}
