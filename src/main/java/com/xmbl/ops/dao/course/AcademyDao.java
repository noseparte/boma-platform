package com.xmbl.ops.dao.course;

import com.xmbl.ops.model.course.AcademyEntity;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;

public interface AcademyDao {

    List<AcademyEntity> findAll(String academyName, int pageNumber, int pageSize);

    long findCountByQuery(Query countQuery);
}
