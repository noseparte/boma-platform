package com.xmbl.ops.dao.organization;

import com.xmbl.ops.dao.base.IEntityDao;
import com.xmbl.ops.model.organization.ResourcesRole;



public interface IRoleResourceDao extends IEntityDao<ResourcesRole>{
	
	public long searchCount(Long id);


}
