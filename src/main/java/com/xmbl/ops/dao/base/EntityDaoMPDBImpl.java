package com.xmbl.ops.dao.base;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.query.Query;

import javax.annotation.Resource;
import java.lang.reflect.ParameterizedType;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SuppressWarnings("unchecked")
public class EntityDaoMPDBImpl<Entity> implements IEntityDao<Entity> {

	protected Logger log = LoggerFactory.getLogger(getClass());
	@Resource
	private SqlSessionTemplate sqlSessionTemplate;

	public EntityDaoMPDBImpl() {
		super();
		entityClass = (Class<Entity>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
	}

	protected Class<Entity> entityClass;

	public String getNameSpace() {
		return entityClass.getName();
	}

	@Override
	public int delete(Object id) {
		return sqlSessionTemplate.delete(getNameSpace() + ".delete", id);
	}

	@Override
	public int[] delete(Object[] ids) {
		int[] result = new int[ids.length];
		result[0] = sqlSessionTemplate.update(getNameSpace() + ".deletes", ids);
		return result;
	}

	@Override
	public Entity insert(Entity entity) {
		int result = sqlSessionTemplate.insert(getNameSpace() + ".insert", entity);
		if (result > 0) {
			return entity;
		}
		return null;
	}

	@Override
	public Entity[] insertSelective(Entity[] entity) {
		int[] results = new int[entity.length];
		for (int i = 0; i < entity.length; i++) {
			results[i] = sqlSessionTemplate.insert(getNameSpace() + ".insertSelective", entity[i]);
		}
		return entity;
	}
	
	@Override
	public Entity insertSelective(Entity entity) {
		int result = sqlSessionTemplate.insert(getNameSpace() + ".insertSelective", entity);
		if (result > 0) {
			return entity;
		}
		return null;
	}
	
	@Override
	public Entity[] insert(Entity[] entity) {
		int[] results = new int[entity.length];
		for (int i = 0; i < entity.length; i++) {
			results[i] = sqlSessionTemplate.insert(getNameSpace() + ".insert", entity[i]);
		}
		return entity;
	}
	
	@Override
	public void insertBatch(List<Entity> entity) {
		sqlSessionTemplate.insert(getNameSpace() + ".insertBatch", entity);
		
	}

	@Override
	public List<Entity> getAllList() {
		return (List<Entity>) sqlSessionTemplate.selectList(getNameSpace() + ".getAllList");
	}

	@Override
	public List<Entity> getAllList(Long offset, Integer limit) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("offset", offset);
		para.put("limit", limit);
		List<Entity> results = sqlSessionTemplate.selectList(getNameSpace() + ".getAllPage", para);
		return results;
	}

	@Override
	public List<Object> getAllIdList() {
		return sqlSessionTemplate.selectList(getNameSpace() + ".getAllIdList");
	}

	@Override
	public Entity getById(Object id) {
		return (Entity) sqlSessionTemplate.selectOne(getNameSpace() + ".getById", id);
	}

	@Override
	public List<Entity> getListByIds(List<Object> ids) {
		return (List<Entity>) sqlSessionTemplate.selectList(getNameSpace() + ".getListByIds", ids);
	}

	@Override
	public Map<Object, Entity> getMapsByIds(Object[] ids) {
		return (Map<Object, Entity>) sqlSessionTemplate.selectMap(getNameSpace() + ".getArrayByIds", ids, "uid");
	}

	@Override
	public Map<Object, Entity> getMapsByIds(List<Object> ids) {
		return (Map<Object, Entity>) sqlSessionTemplate.selectMap(getNameSpace() + ".getListByIds", ids, "uid");
	}

	@Override
	public int update(Entity entity) {
		return sqlSessionTemplate.update(getNameSpace() + ".update", entity);
	}

	@Override
	public int updateIfNecessary(Entity entity) {
		return sqlSessionTemplate.update(getNameSpace() + ".updateIfNecessary", entity);
	}

	@Override
	public int[] update(Entity[] entity) {
		int[] results = new int[entity.length];
		for (int i = 0; i < entity.length; i++) {
			results[i] = sqlSessionTemplate.update(getNameSpace() + ".update", entity[i]);

		}
		return results;
	}

	@Override
	public int[] updateIfNecessary(Entity[] entity) {
		int[] results = new int[entity.length];
		for (int i = 0; i < entity.length; i++) {
			results[i] = sqlSessionTemplate.update(getNameSpace() + ".updateIfNecessary", entity[i]);

		}
		return results;
	}
	

	
	@Override
	public long getAllPageCount() {
		return (long) sqlSessionTemplate.selectOne(getNameSpace() + ".getAllPageCount");
	}

	@Override
	public Query pageList(Query query, int pageNumber, int pageSize) {
		return new Query().skip((pageNumber - 1)*pageSize).limit(pageSize);
	}

	public SqlSessionTemplate getSqlSessionTemplate() {
		return this.sqlSessionTemplate;
	}

	public void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate1111) {
		this.sqlSessionTemplate = sqlSessionTemplate1111;
	}

}
