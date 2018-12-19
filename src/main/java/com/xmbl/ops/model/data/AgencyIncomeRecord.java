package com.xmbl.ops.model.data;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11:52
 * @Version 1.0
 * @Description     代理收入情况
 */
@Data
@Document(collection = "bm_data_agency_inome_record")
public class AgencyIncomeRecord extends GeneralBean {

}
