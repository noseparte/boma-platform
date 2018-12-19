package com.xmbl.ops.dao.base;

import org.springframework.data.mongodb.core.query.Query;

import java.util.List;
import java.util.Map;

public interface IEntityDao<T> {

	/**
	 * 新增entity
	 * @param entity  entity不能为null,否则抛出参数异常
	 * @return 带着id的entity对象,失败为null
	 */
	public T insert(T entity);
	
	/**
	 * 新增entity
	 * @param entity  entity不能为null,否则抛出参数异常
	 * @return 带着id的entity对象,失败为null
	 */
	public T insertSelective(T entity);
	
	/**
	 * 删除entity
	 * @param id  id不能为null,否则抛出参数异常
	 * @return  执行成功 1,失败 0
	 */
	public int delete(Object id);

	/**
	 * 更新entity
	 * @param entity    entity和它的id不能为null,否则抛出参数异常
	 * @return  执行成功 1,失败 0
	 */
	public int update(T entity);

	/**
	 * 批量新增entity
	 * @param entity  entity数组不能为null或者数量为空,否则抛出参数异常
	 * @return 带着id的entity对象数组,失败为null
	 */
	public T[] insert(T[] entity);
	
	/**
	 * 批量新增entity
	 * @param entity  entity数组不能为null或者数量为空,否则抛出参数异常
	 * @return 带着id的entity对象数组,失败为null
	 */
	public T[] insertSelective(T[] entity);
	
	/**
	 * 批量新增entity
	 * @param entity  entity数组不能为null或者数量为空,否则抛出参数异常
	 * @return 带着id的entity对象数组,失败为null
	 */
	public void insertBatch(List<T> entity);
	
	/**
	 * 批量删除entity
	 * @param id[]  id数组不能为null或者数量为空,否则抛出参数异常
	 * @return  执行成功 1,失败 0
	 */
	public int[] delete(Object[] id);

	/**
	 * 批量更新entity
	 * @param entity[]    entity数组不能为null或者数量为空,否则抛出参数异常
	 * @return  执行成功 1,失败 0
	 */
	public int[] update(T[] entity);
	
	/**
	 * 更新实体，实体为null的属性不用更新
	 * @param entity entity不能为null，否则抛出参数异常
	 * @return
	 */
	public int updateIfNecessary(T entity);
	
	/**
	 * 批量更新实体，实体为null的属性不用更新
	 * @param entitys entity不能为null或者数量不能为空，否则抛出参数异常
	 */
	public int[] updateIfNecessary(T[] entitys);
	
	/**
	 * 根据id查找entity对象
	 * @param id 不能为null,否则抛出参数异常
	 * @return  实体对象,没有结果为null
	 */
	public T getById(Object id);

	/**
	 * 根据idlist查找entity对象list(顺序要求一致)
	 * @param ids   ids不能为null或者空的集合,否则抛出参数异常
	 * @return 对象的list, 没有结果为null
	 */
	public List<T> getListByIds(List<Object> ids);
	
	/**
	 * 根据id数组查找map对象数组,key = id,value = 实体对象
	 * @param ids ids不能为null或者空的数据,否则抛出参数异常
	 */
	public Map<Object,T> getMapsByIds(Object[] ids);
	
	/**
	 * 根据idlist查找map对象,key = id,value = 实体对象
	 * @param ids   ids不能为null或者空的集合,否则抛出参数异常
	 * @return 对象的list, 没有结果为null
	 */
	public Map<Object,T> getMapsByIds(List<Object> ids);
	
	/**
	 * 查找所有的entity对象
	 * 注（此方法只适用于数据记录最多达到3000的数据实体，其它太多的数据实体不适合使用此方法）
	 * (主要是后端service使用此方法)
	 * @return 对象的list, 没有结果为null
	 */
	public List<T> getAllList();
	
	/**
	 * 查找所有的entity对象
	 * (主要是后端service使用此方法)
	 * 注（此方法只适用于数据记录最多达到3000的数据实体，其它太多的数据实体不适合使用此方法）
	 * @return 对象的list, 没有结果为null
	 */
	public List<Object> getAllIdList();	
	
	/**
	 * 查找所有对象,并返回分页对象
	 * (主要是后端service使用此方法)
	 * 注（此方法只适用于数据记录最多达到3000的数据实体，其它太多的数据实体不适合使用此方法）
	 * @param pageIndex pageIndex必须大于0,否则抛出参数异常
	 * @param pageSize  pageSize必须大于0,否则抛出参数异常
	 * @return 分页对象,没有结果为null
	 */
	public List<T> getAllList(Long pageIndex, Integer pageSize);

	long getAllPageCount();

	Query pageList(Query query,int pageNumber,int pageSize);
}
