package com.xmbl.ops.model.course;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11:43
 * @Version 1.0
 * @Description     专业管理expense
 */
@Data
@Document(collection = "bm_edu_specialty")
public class SpecialtyEntity extends GeneralBean {

    // ---------------------------------------------------------------------- params
    private String specialtyName;                       //专业名称
    private int specialtyCode;                          //专业编号
    private String specialtyDec;                        //专业描述
    private Date applyTime;                             //报名时间
    private String examTime;                            //考试时间
    private String checkWeb;                            //查询网站
    private String period;                              //周期

    // 0 正常 1 暂停
    private int specialtyState;                         //专业状态
    private Date applyEndTime;                          //报名截止时间

    private String academyId;                           //院校id



}
