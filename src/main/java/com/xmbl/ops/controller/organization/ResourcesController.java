package com.xmbl.ops.controller.organization;

import com.alibaba.fastjson.JSONObject;
import com.xmbl.ops.constant.SessionConstant;
import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.dto.ResponseResult;
import com.xmbl.ops.enumeration.EnumResCode;
import com.xmbl.ops.model.organization.Resources;
import com.xmbl.ops.service.organization.ResourcesService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;


/**
 * @author zhengjun
 *
 */
@Controller
@RequestMapping(value = "/resources")
public class ResourcesController extends AbstractController {
	
	@Autowired
	protected ResourcesService resourcesService;
	
	@RequestMapping(value = "/listJson")
	public @ResponseBody ResponseResult getResourceListJson(HttpServletRequest request,Integer roleId ) {
		try {
			if( roleId == null || StringUtils.isEmpty(roleId.toString())) {
				List<Resources> list = resourcesService.getAllList(null,true);
				
				JSONObject result=new JSONObject();
				result.put("directoryList", list);
				return successJson(result);
			}
			List<Resources> list = resourcesService.getAllList(roleId, false);
			return successJson(list);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "获取菜单失败"); 
	}
	
	@RequestMapping(value = "/list")
	public String getResourceList(HttpServletRequest request, ModelMap model) {
		try {
			List<Resources> list = resourcesService.getAllList(null,false);
			
			model.addAttribute("resourcesList", list);
			return "management/Resources";
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	@RequestMapping(value = "/commitEdit")
	public @ResponseBody ResponseResult commitEdit(HttpServletRequest request, Integer id,String name, String resKey, String icon , String resUrl, 
			Integer parentId, Integer type, Byte status, String description) {
		try {
			if( StringUtils.isEmpty(name)) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "菜单名称不能为空！");
			} 
			if( StringUtils.isEmpty(resKey)) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "菜单标识不能为空！");
			}
			if( StringUtils.isEmpty(icon)) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "菜单图标不能为空！");
			}
			if( type == null || StringUtils.isEmpty(type.toString())) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "菜单类型不能为空！");
			}			
			if(type ==2 && StringUtils.isEmpty(resUrl)) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "菜单url不能为空！");
			}
			if( status == null || StringUtils.isEmpty(status.toString())) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "是否隐藏不能为空！");
			}
			HttpSession session = request.getSession();
			String userKey = (String) session.getAttribute(SessionConstant.USER_NAME);
			if(parentId != null) {
				Resources parentResource = resourcesService.getResourcesById(parentId);
				Integer parentLevel = parentResource.getLevel();
				if(parentLevel >= 3 && type == 0) { //父节点是第三层且type是目录
					return errorJson(EnumResCode.SERVER_ERROR.value(), "目录最多为3层！");
				}
			}
			resourcesService.commitEdit(userKey, id, name, resUrl, resKey, icon,parentId, status, type, description);
			return successJson();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "更新菜单失败！");
	}	
	
	@RequestMapping(value = "/delete")
	public @ResponseBody ResponseResult deleteResources(HttpServletRequest request, Integer[] rescId ) {
		try {		
			boolean AllDeleteResourcesSuccess = true;
			boolean deleteResourceSuccess ;
		    int index = 0;	
		    Integer deleteFlag = 1;
			List<Integer> resourcesIdList = new ArrayList<Integer>();
			for(int i=0;i<rescId.length;i++) {
				resourcesIdList.add(rescId[i]);
			}
		    while(index < resourcesIdList.size()) {
		    	List<Integer> ChildIdlist = resourcesService.searchChildId(resourcesIdList.get(index));
		    	resourcesIdList.addAll(ChildIdlist);
		    	index ++;
		    }
		    
		    Integer[] finalArray = new Integer[resourcesIdList.size()];
	        resourcesIdList.toArray(finalArray);
			for(int i=0;i<finalArray.length;i++){
			    if (finalArray[i] == null ) {
				   return errorJson(EnumResCode.SERVER_ERROR.value(), "id参数异常");
			    }
			    resourcesService.deleteResourceRole(finalArray[i]);
			    deleteResourceSuccess = resourcesService.deleteResource(finalArray[i], deleteFlag );
			    if(deleteResourceSuccess == false){
				    AllDeleteResourcesSuccess = false;	
			    }
		    }
			if(AllDeleteResourcesSuccess) {
				return successJson();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "删除资源失败");
	}
}
