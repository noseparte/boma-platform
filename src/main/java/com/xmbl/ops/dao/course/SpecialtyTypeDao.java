package com.xmbl.ops.dao.course;

import com.xmbl.ops.model.course.SpecialtyType;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import java.util.List;

public interface SpecialtyTypeDao {

    List<SpecialtyType> getAll(String type, int pageNumber, int pageSize);

    long count(String type);

    void add(SpecialtyType specialtyType);

    void delete(String id);

    SpecialtyType findById(String id);

    void update(Query query, Update update);
}
