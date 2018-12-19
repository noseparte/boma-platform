package com.xmbl.ops.controller.data;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.service.data.LoginRecordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-11 -- 16:50
 * @Version 1.0
 * @Description     用户登录
 */
@Slf4j
@Controller
@RequestMapping
public class LoginRecordController extends AbstractController {

    @Autowired
    private LoginRecordService LoginRecordService;
}
