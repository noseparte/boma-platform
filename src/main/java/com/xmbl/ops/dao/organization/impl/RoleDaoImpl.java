package com.xmbl.ops.dao.organization.impl;

import com.xmbl.ops.dao.base.EntityDaoMPDBImpl;
import com.xmbl.ops.dao.organization.IRoleDao;
import com.xmbl.ops.model.organization.Role;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class RoleDaoImpl extends EntityDaoMPDBImpl<Role> implements IRoleDao {
	@Override
	public long searchCount(Integer status) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("status", status);

		long count = getSqlSessionTemplate().selectOne(
				getNameSpace() + ".searchCount", para);
		return count;
	}

	@Override
	public List<Role> searchList(Integer status) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("status", status);
		List<Role> results = getSqlSessionTemplate().selectList(getNameSpace() + ".searchList", para);
		return results;
	}




	@Override
	public Role selectByRoleName(String roleName) {
		   Map<String, Object> para = new HashMap<String, Object>();
		   para.put("roleName", roleName);
		   Role role = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectByRoleName", para);
		   return role;
	}

	@Override
	public Role selectByDescription(String description) {
	       Map<String, Object> para = new HashMap<String, Object>();
		   para.put("description", description);
		   Role role = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectByDescription", para);
		   return role;
	}

	@Override
	public Role getRoleBySign(String roleSign){
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("roleSign", roleSign);

		Role role = getSqlSessionTemplate().selectOne(getNameSpace() + ".getRoleBySign", para);
		return role;
	}
 

	@Override
	public long searchResourceById(Long id) {
		Map<String, Object> para = new HashMap<String, Object>();
		   para.put("id", id);
		   long count = getSqlSessionTemplate().selectOne(getNameSpace() + ".searchResourceById", para);
		   return count;
		
	}

	@Override
	public Role getRoleById(Long id) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("id", id);

		Role role = getSqlSessionTemplate().selectOne(getNameSpace() + ".getRoleById", para);
		return role;

	}

	
}


