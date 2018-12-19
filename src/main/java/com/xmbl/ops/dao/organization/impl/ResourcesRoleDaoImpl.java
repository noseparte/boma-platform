package com.xmbl.ops.dao.organization.impl;

import com.xmbl.ops.dao.base.EntityDaoMPDBImpl;
import com.xmbl.ops.dao.organization.IResourcesRoleDao;
import com.xmbl.ops.model.organization.ResourcesRole;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ResourcesRoleDaoImpl extends EntityDaoMPDBImpl<ResourcesRole> implements IResourcesRoleDao {
	protected void initDao() {
		// do nothing
	}

	
	@Override
	public List<ResourcesRole> getAllList(String role){
	  Map<String, Object> para = new HashMap<String, Object>();
	  para.put("role", role);
		return getSqlSessionTemplate().selectList(getNameSpace() + ".getAllList", para);
	}


	@Override
	public Integer hasAuthentic(Integer role, Integer resourceId) {
	    Map<String, Object> para = new HashMap<String, Object>();
	    para.put("roleId", role);
	    para.put("rescId", resourceId);
	    Integer count = getSqlSessionTemplate().selectOne(getNameSpace() + ".hasAuthentic", para);
	    return count;        
	}
	
	@Override
	public Integer deleteResourceRole(Integer rescId){
		 Map<String, Object> para = new HashMap<String, Object>();
		 para.put("rescId", rescId);
			return getSqlSessionTemplate().delete(getNameSpace() + ".deleteResourceRole", para);
	}
}

