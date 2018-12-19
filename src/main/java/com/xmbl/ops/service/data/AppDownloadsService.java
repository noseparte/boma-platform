package com.xmbl.ops.service.data;

import com.xmbl.ops.dao.data.AppDownloadsDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 16:21
 * @Version 1.0
 * @Description
 */
@Service
@Transactional
public class AppDownloadsService {

    @Autowired
    private AppDownloadsDao appDownloadsDao;
}
