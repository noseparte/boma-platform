package com.xmbl.ops.dao.base;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import javax.annotation.Resource;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public class EntityMongoDaoImpl<Entity> implements IEntityDao<Entity> {

    protected Logger log = LoggerFactory.getLogger(getClass());
    protected Class<Entity> entityClass;
    @Resource
    private MongoTemplate mongoTemplate;

    public EntityMongoDaoImpl() {
        super();
        entityClass = (Class<Entity>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }

    public String getNameSpace() {
        return entityClass.getName();
    }

    @Override
    public int delete(Object id) {
        throw new UnsupportedOperationException();
    }

    @Override
    public int[] delete(Object[] ids) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Entity insert(Entity entity) {
        try {
            getMongoTemplate().insert(entity);
            return entity;
        } catch (Exception e) {
            throw new UnsupportedOperationException();
        }
    }

    @Override
    public Entity[] insert(Entity[] entity) {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<Entity> getAllList() {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<Entity> getAllList(Long pageIndex, Integer pageSize) {
        throw new UnsupportedOperationException();
    }

    @Override
    public List<Object> getAllIdList() {
        throw new UnsupportedOperationException();
    }

    @Override
    public Entity getById(Object id) {
        return mongoTemplate.findOne(new Query(Criteria.where("_id").is(id)), entityClass);
    }

    @Override
    public List<Entity> getListByIds(List<Object> ids) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Map<Object, Entity> getMapsByIds(Object[] ids) {
        throw new UnsupportedOperationException();
    }

    @Override
    public Map<Object, Entity> getMapsByIds(List<Object> ids) {
        throw new UnsupportedOperationException();
    }

    @Override
    public int update(Entity entity) {
        throw new UnsupportedOperationException();
    }

    @Override
    public int updateIfNecessary(Entity entity) {
        throw new UnsupportedOperationException();
    }

    @Override
    public int[] update(Entity[] entity) {
        throw new UnsupportedOperationException();
    }

    @Override
    public int[] updateIfNecessary(Entity[] entity) {
        throw new UnsupportedOperationException();
    }

    public MongoTemplate getMongoTemplate() {
        return mongoTemplate;
    }

    public void setMongoTemplate(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public long getAllPageCount() {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public Query pageList(Query query, int pageNumber, int pageSize) {
        return new Query().skip((pageNumber - 1)*pageSize).limit(pageSize);
    }

    @Override
    public Entity insertSelective(Entity entity) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Entity[] insertSelective(Entity[] entity) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void insertBatch(List<Entity> entity) {
        throw new UnsupportedOperationException();

    }




}
