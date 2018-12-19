package com.xmbl.ops.service.source;

import com.xmbl.ops.dao.course.ExpenseDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 11:41
 * @Version 1.0
 * @Description
 */
@Service
@Transactional
public class ExpenseService {

    @Autowired
    private ExpenseDao expenseDao;
}
