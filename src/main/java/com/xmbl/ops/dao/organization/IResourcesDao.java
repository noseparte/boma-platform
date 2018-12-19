package com.xmbl.ops.dao.organization;

import com.xmbl.ops.dao.base.IEntityDao;
import com.xmbl.ops.model.organization.Resources;

import java.util.List;

public interface IResourcesDao extends IEntityDao<Resources>   {


	List<Resources> getAllList(String role);
	
	List<Resources> getResourcesbyRoleSign(String roleSign);

	Resources getResourcesById(Integer id);	
	
    List<Resources> getResourceAllList();

	Integer getMaxPid(Integer parentid);

}
