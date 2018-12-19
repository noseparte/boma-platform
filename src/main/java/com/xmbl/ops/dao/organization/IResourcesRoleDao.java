package com.xmbl.ops.dao.organization;

import com.xmbl.ops.dao.base.IEntityDao;
import com.xmbl.ops.model.organization.ResourcesRole;

import java.util.List;

public interface IResourcesRoleDao extends IEntityDao<ResourcesRole>   {

	List<ResourcesRole> getAllList(String role);

    Integer hasAuthentic(Integer role, Integer resourceId);
    
    Integer deleteResourceRole(Integer rescId);

}
