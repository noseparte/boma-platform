package com.xmbl.ops.controller.organization;


import com.xmbl.ops.constant.SessionConstant;
import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.dto.ResponseResult;
import com.xmbl.ops.enumeration.EnumResCode;
import com.xmbl.ops.model.organization.ResourcesRole;
import com.xmbl.ops.model.organization.Role;
import com.xmbl.ops.service.organization.RoleService;
import com.xmbl.ops.util.HasAdminRight;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;


@Controller
@RequestMapping(value = "/role")
public class RoleController extends AbstractController {

	@Autowired
	protected RoleService roleService;
	
	@RequestMapping(value = "/roleList")
	public String roleSearch(HttpServletRequest request, ModelMap model, Integer status) {
		try {
			HttpSession session = request.getSession();
			String groupName = (String) session.getAttribute(SessionConstant.GROUP_NAME);
			List<Role> roleList = roleService.searchList(status);
			model.addAttribute("roleList", roleList);
			if(HasAdminRight.hasAdminRight(groupName)) { //只有管理员可以访问
				return "management/roleManagement";
			} else { //如果是非超级管理员输入url，则会页面丢失
				return "404";
			}
		}catch(Exception e) {
			return "404";
		}
	}
	
	@RequestMapping(value = "/addRole")
	public @ResponseBody ResponseResult addRole(HttpServletRequest request, String roleName, String roleSign, String description, Byte status) {
		try {
			if (StringUtils.isNotEmpty(roleName)) {
				if (roleService.isExistRoleName(roleName) == true) {
					return errorJson(EnumResCode.SERVER_ERROR.value(), "角色名称已存在");
				}
			} else {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "角色名称不能为空");
			}
			if (StringUtils.isNotEmpty(roleSign)) {
				if (roleService.isExistRoleSign(roleSign) == true) {
					return errorJson(EnumResCode.SERVER_ERROR.value(), "角色key已存在");
				}
			} else {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "角色key不能为空");
			}
			if (status == null) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "status不能为空");
			}
			HttpSession session = request.getSession();
			String operator = (String) session.getAttribute(SessionConstant.USER_NAME);
			Role role = new Role(roleName, roleSign, description, status,  operator, new Date());
			role = roleService.insertSelective(role);
			if(role != null)
				return successJson();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "新增角色失败");
	}
	
	@RequestMapping(value = "/updateRole")
	public @ResponseBody ResponseResult updateRole(HttpServletRequest request, Long id, String roleName, String roleSign, String description, Byte status) {
		try {
			if(id==null) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "id参数异常");
			}
			Role realrole = roleService.getRoleById(id);
			if (StringUtils.isNotEmpty(roleName)) {
				if(!roleName.equals(realrole.getRoleName())){
				    if ( roleService.isExistRoleName(roleName) == true) { 
					   return errorJson(EnumResCode.SERVER_ERROR.value(), "角色名称已存在");
				     }
				}
			} else {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "角色名称不能为空");
			}
			if (StringUtils.isNotEmpty(roleSign)) {
				if(!roleSign.equals(realrole.getRoleSign())){
				    if (roleService.isExistRoleSign(roleSign) == true) {
					    return errorJson(EnumResCode.SERVER_ERROR.value(), "角色key已存在");
				    }
				}
			} else {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "角色key不能为空");
			}
			if (status ==null) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "status不能为空");
			}
			HttpSession session = request.getSession();
			String operator = (String) session.getAttribute(SessionConstant.USER_NAME);
			
			Role role = new Role(id ,roleName, roleSign, description, status, operator, new Date());
			boolean updateSuccess = roleService.updateRole(role);
			if(updateSuccess)
				return successJson();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "更新角色失败");
	}
	
	//删除角色
	@RequestMapping(value = "/deleteRole")
	public @ResponseBody ResponseResult deleteRole(HttpServletRequest request, Long[] id ) {
		try {		
			boolean isDeleteRoleSuccess = true;
			boolean deleteRoleSuccess ;
			for(int i=0;i<id.length;i++){
				if (id[i] == null ) {
					return errorJson(EnumResCode.SERVER_ERROR.value(), "id参数异常");
				}
				deleteRoleSuccess = roleService.deleteRole(id[i]);
				if(deleteRoleSuccess ==false){
					isDeleteRoleSuccess = false;	
				}
			}
			if(isDeleteRoleSuccess){
				return successJson();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "删除角色失败");
	}
	//分配权限	
	@RequestMapping(value = "/authentic")
	public @ResponseBody ResponseResult setRoleAuthentic(HttpServletRequest request, Integer roleId,Integer[] resId ) {
		try {
			boolean isInsertAllSuccess = true;
			if(roleId == null ) return errorJson(EnumResCode.SERVER_ERROR.value(), "roleId参数异常");
			roleService.deleteResource( roleId);//删除原来的权限
			for(int i=0;i<resId.length;i++) {
				ResourcesRole resourcesrole = new ResourcesRole(roleId , resId[i]);
				resourcesrole = roleService.insertResourcesByRole(resourcesrole);
				if(resourcesrole == null) isInsertAllSuccess= false;
			}
			if(isInsertAllSuccess == true) return successJson();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "设定菜单权限失败");
	}	

	@RequestMapping(value = "/getRoleList")
	public @ResponseBody ResponseResult getRoleList(HttpServletRequest request, Integer filter ) {
		try{
			List<Map<String, Object>> result = new ArrayList<>();
			List<Role> roleList = roleService.searchList(0);
			for(int i = 0; i < roleList.size(); i++) {
				if(roleList.get(i) != null) {
					Map<String, Object> map = new HashMap<>();
					map.put("id",roleList.get(i).getRoleSign());
					map.put("name", roleList.get(i).getRoleName());
					result.add(map);
				}
			}
			return successJson(result);
		
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "获取角色失败");
	}
}
