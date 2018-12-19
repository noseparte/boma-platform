package com.xmbl.ops.model.course;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-09 -- 16:07
 * @Version 1.0
 * @Description 费用
 */
@Data
@Document(collection = "bm_edu_expense")
public class ExpenseEntity extends GeneralBean {

    // ----------------------------------------------------- params
    private String cost;                         // 费用
    private int periods;                         // 1.全款或期数
    private double per_price;                    // 每期多少钱

    private String coure_type_id;                // 课程类型
    private String specialtyId;                  // 专业id
    private String academyId;                    // 院校id
    private String specialty_type_id;            // 课程类型
}
