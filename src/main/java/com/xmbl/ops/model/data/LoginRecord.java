package com.xmbl.ops.model.data;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11:46
 * @Version 1.0
 * @Description     用户日常活跃
 */
@Data
@Document(collection = "bm_data_login_record")
public class LoginRecord extends GeneralBean {


}
