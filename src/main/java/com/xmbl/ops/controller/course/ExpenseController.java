package com.xmbl.ops.controller.course;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.service.source.ExpenseService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-11 -- 16:47
 * @Version 1.0
 * @Description     费用
 */
@Slf4j
@Controller
@RequestMapping
public class ExpenseController extends AbstractController {

    @Autowired
    private ExpenseService expenseService;
}
