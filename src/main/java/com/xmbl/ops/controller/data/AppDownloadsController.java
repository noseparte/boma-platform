package com.xmbl.ops.controller.data;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.service.data.AppDownloadsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-11 -- 16:48
 * @Version 1.0
 * @Description     下载量
 */
@Slf4j
@Controller
@RequestMapping
public class AppDownloadsController extends AbstractController {

    @Autowired
    private AppDownloadsService AppDownloadsService;
}
