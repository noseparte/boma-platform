package com.xmbl.ops.dao.course;

import com.xmbl.ops.model.course.SpecialtyEntity;

import java.util.List;

public interface SpecialtyDao {
    List<SpecialtyEntity> getAll(Integer specialtyCode, int pageNumber, int pageSize);

    long count(Integer specialtyCode);
}
