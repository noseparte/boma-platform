package com.xmbl.ops.service.organization;


import com.xmbl.ops.dao.organization.IRoleDao;
import com.xmbl.ops.dao.organization.IRoleResourceDao;
import com.xmbl.ops.model.organization.ResourcesRole;
import com.xmbl.ops.model.organization.Role;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class RoleService {

	@Resource
	IRoleDao roleDao;

	@Resource
	IRoleResourceDao roleResourceDao;
	
	public Role getRoleById(Long id) {
		Role role = roleDao.getRoleById(id);
		return role;
	}
	
	public Role getRoleSignById(String roleSign) {
		Role role = roleDao.getRoleBySign(roleSign);
		return role;
	}
	
	public long searchCount(Integer status) {
		return roleDao.searchCount(status);
	}

	public List<Role> searchList(Integer status) {
		List<Role> roleList = roleDao.searchList(status);
		
		for(int i=0;i<roleList.size();i++)
		{
	  long id=roleList.get(i).getId();
	  long integer=roleResourceDao.searchCount(id);
       if( integer >0 )
    	   roleList.get(i).setHasRole(1);
       else
    	   roleList.get(i).setHasRole(0);
		}

		return roleList;
	}
	
	 public boolean isExistRoleSign(String roleSign ) 
	   {
		   Role role = roleDao.getRoleBySign(roleSign);
		   if(role == null)
			   return false;
		   return true;
	   }
	 
	 public boolean isExistRoleName(String roleName ) 
	   {
		   Role role = roleDao.selectByRoleName(roleName);
		   if(role == null)
			   return false;
		   return true;
	   }
	 
	 public boolean isExistDescription(String description ) 
	   {
		   Role role = roleDao.selectByDescription(description);
		   if(role == null)
			   return false;
		   return true;
	   } 

	 public Role insertSelective(Role role) {
			return roleDao.insertSelective(role);
		}   
	 public boolean updateRole(Role role) {
		 int updateNum = roleDao.updateIfNecessary(role);
			if (updateNum == 1) {
				return true;
			} else {
				return false;
			}
	 }
	public boolean deleteRole(Long id)
	{
		if(roleDao.delete(id)==1)
			return true;
		else
			return false;
	}
	public boolean deleteResource(Integer id)
	{
		if(roleResourceDao.delete(id)>=1)
			return true;
		else
			return false;
	}

	public ResourcesRole insertResourcesByRole(ResourcesRole resourcesrole)
	{
		return roleResourceDao.insert(resourcesrole);
	}

}
