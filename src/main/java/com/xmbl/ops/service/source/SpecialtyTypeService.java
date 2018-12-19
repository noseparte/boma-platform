package com.xmbl.ops.service.source;

import com.xmbl.ops.dao.course.SpecialtyTypeDao;
import com.xmbl.ops.model.course.SpecialtyType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile 2018-11-13 -- 11:52
 * @Version 1.0
 * @Description
 */
@Service
@Transactional
public class SpecialtyTypeService {

    @Autowired
    private SpecialtyTypeDao specialtyTypeDao;

    public List<SpecialtyType> getAll(String type, int pageNumber, int pageSize) {
        return specialtyTypeDao.getAll(type,pageNumber,pageSize);
    }

    public long count(String type) {
        return specialtyTypeDao.count(type);
    }

    public void add(SpecialtyType specialtyType) {
        specialtyTypeDao.add(specialtyType);
    }

    public void delete(String id) {
        specialtyTypeDao.delete(id);
    }

    public SpecialtyType findById(String id) {
        return specialtyTypeDao.findById(id);
    }

    public void update(Query query, Update update) {
        specialtyTypeDao.update(query,update);
    }
}
