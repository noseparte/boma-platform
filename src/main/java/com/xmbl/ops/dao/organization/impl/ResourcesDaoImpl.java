package com.xmbl.ops.dao.organization.impl;

import com.xmbl.ops.dao.base.EntityDaoMPDBImpl;
import com.xmbl.ops.dao.organization.IResourcesDao;
import com.xmbl.ops.model.organization.Resources;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ResourcesDaoImpl extends EntityDaoMPDBImpl<Resources> implements IResourcesDao {

	@Override
	public List<Resources> getAllList(String role){
	  Map<String, Object> para = new HashMap<String, Object>();
	  para.put("role", role);
		return getSqlSessionTemplate().selectList(getNameSpace() + ".getAllList", para);
	}
	
	@Override
	public List<Resources> getResourcesbyRoleSign(String roleSign){
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("roleSign", roleSign);

		List<Resources> results = getSqlSessionTemplate().selectList(getNameSpace() + ".getResourcesbyRoleSign", para);
		return results;
	}
	@Override
	public Resources getResourcesById(Integer id){
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("id", id);

		Resources result = getSqlSessionTemplate().selectOne(getNameSpace() + ".getResourcesById", para);
		return result;
	}
	

	@Override
	public List<Resources> getResourceAllList(){
	  Map<String, Object> para = new HashMap<String, Object>();
	    return getSqlSessionTemplate().selectList(getNameSpace() + ".selectAllList", para);
	}    

	@Override
	public Integer getMaxPid(Integer parentId){
		Integer pid=null;
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("parentId", parentId);
		pid =	getSqlSessionTemplate().selectOne(getNameSpace() + ".getMaxParentId", para);
	    return pid;
	}  
	
	public List<Integer> searchChildId(Integer rescId){
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("rescId", rescId);
		List<Integer> ChildList = getSqlSessionTemplate().selectList(getNameSpace() + ".getChildId", para);
		return ChildList;
	}
	
	public Integer deleteResource(Integer rescId, Integer deleteFlag) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("rescId", rescId);
		para.put("deleteFlag", deleteFlag);
		Integer result = getSqlSessionTemplate().update(getNameSpace() + ".updateResource", para);
		return result;
	}
}

