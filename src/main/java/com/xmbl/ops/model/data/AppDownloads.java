package com.xmbl.ops.model.data;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-06 -- 11:48
 * @Version 1.0
 * @Description     下载量
 */
@Data
@Document(collection = "bm_data_app_downloads")
public class AppDownloads extends GeneralBean {



}
