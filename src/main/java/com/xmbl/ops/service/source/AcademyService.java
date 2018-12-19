package com.xmbl.ops.service.source;

import com.xmbl.ops.dao.course.AcademyDao;
import com.xmbl.ops.model.course.AcademyEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 11:27
 * @Version 1.0
 * @Description
 */
@Slf4j
@Service
@Transactional
public class AcademyService {

    @Autowired
    private AcademyDao academyDao;

    public List<AcademyEntity> findAll(String academyName, int pageNumber, int pageSize) {
        return academyDao.findAll(academyName,pageNumber,pageSize);
    }

    public long findCountByQuery(Query countQuery) {
        return academyDao.findCountByQuery(countQuery);
    }
}
