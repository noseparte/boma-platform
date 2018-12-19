package com.xmbl.ops.model.data;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11:51
 * @Version 1.0
 * @Description     代理转发记录
 */
@Data
@Document(collection = "bm_data_agency_transpond_record")
public class AgencyTranspondRecord extends GeneralBean {
}
