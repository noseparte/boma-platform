package com.xmbl.ops.service.source;

import com.xmbl.ops.dao.course.SpecialtyDao;
import com.xmbl.ops.model.course.SpecialtyEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 11:51
 * @Version 1.0
 * @Description
 */
@Service
@Transactional
public class SpecialtyService {

    @Autowired
    private SpecialtyDao specialtyDao;

    public List<SpecialtyEntity> getAll(Integer specialtyCode, int pageNumber, int pageSize) {
        return specialtyDao.getAll(specialtyCode,pageNumber,pageSize);
    }

    public long count(Integer specialtyCode) {
        return specialtyDao.count(specialtyCode);
    }
}
