package com.xmbl.ops.dao.organization.impl;

import com.xmbl.ops.dao.base.EntityDaoMPDBImpl;
import com.xmbl.ops.dao.organization.IRoleResourceDao;
import com.xmbl.ops.model.organization.ResourcesRole;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;


@Repository
public class ResourceRoleDaoImpl extends EntityDaoMPDBImpl<ResourcesRole> implements IRoleResourceDao{

	@Override
	public long searchCount(Long id) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("id", id);

		long count = getSqlSessionTemplate().selectOne(
				getNameSpace() + ".searchCount", para);
		return count;
	}



}
