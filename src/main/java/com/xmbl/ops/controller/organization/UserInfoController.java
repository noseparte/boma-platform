package com.xmbl.ops.controller.organization;

import com.xmbl.ops.constant.GroupNameConstant;
import com.xmbl.ops.constant.SessionConstant;
import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.dto.ResponseResult;
import com.xmbl.ops.enumeration.EnumAuthStatus;
import com.xmbl.ops.enumeration.EnumResCode;
import com.xmbl.ops.model.organization.UserInfo;
import com.xmbl.ops.service.organization.UserInfoService;
import com.xmbl.ops.util.HasAdminRight;
import com.xmbl.ops.util.Md5PasswordEncoder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;
@Controller
@RequestMapping(value = "/user")
public class UserInfoController extends AbstractController {
	private static final int limit = 30;

	private static final String passwordKey = "123456";

	@Autowired
	protected UserInfoService userInfoService;

	@RequestMapping(value = "/userInfoList")
	public String userInfoList(HttpServletRequest request, ModelMap model, String userKey, String groupName ,String role, String teamId,
			String status , Long page) throws Exception {
		HttpSession session = request.getSession();
		String operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
		UserInfo userinfo = null;
		if (StringUtils.isNotEmpty(operatorName)) {
			userinfo = userInfoService.getUserInfoByKey(operatorName);
		}
		try {
			if (userinfo != null) {
				page = page == null || page < 0 ? 0 : page;
				long totalNum = userInfoService.searchCount(userKey, role, groupName, teamId, status, null, null);
				long totalPageNum = totalNum / limit;
				if (totalNum > totalPageNum * limit)
					totalPageNum++;
				if (page >= totalPageNum && totalPageNum != 0)
					page = totalPageNum - 1;
				long start = page * limit;
				List<UserInfo> userInfoList = userInfoService.searchList(userKey, role, groupName, teamId, status, null, null, start,
						limit);
				model.addAttribute("userKey", userKey);
				model.addAttribute("groupName", groupName);
				model.addAttribute("role", role);
				model.addAttribute("teamId", teamId);
				model.addAttribute("status", status);
				model.addAttribute("userInfoList", userInfoList);
				model.addAttribute("page", page);
				model.addAttribute("totalNum", totalNum);
				model.addAttribute("totalpage", totalPageNum);
				return "management/userInfoList";
			}
			return "index";
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}


	@RequestMapping(value = "/addUserInfo")
	public @ResponseBody
	ResponseResult addUserInfo(HttpServletRequest request, ModelMap model, String userKey, String userName, String password,
			String groupName, Byte status, Long orgId) {
		try {
			status =(byte) EnumAuthStatus.VALID.getId();
			Date date = new Date();
			HttpSession session = request.getSession();
			String operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
			if (StringUtils.isNotEmpty(userKey)) {
				if (userInfoService.isExistUserKey(userKey) == true) {
					return errorJson(EnumResCode.SERVER_ERROR.value(), "账号已存在");
				}
			} else {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "账号不能为空");
			}
			if (StringUtils.isNotEmpty(password)) {
				password = Md5PasswordEncoder.encode(password);
			} else {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "密码不能为空");
			}
			if(!groupName.equals(GroupNameConstant.ADMIN)) {
				UserInfo userinfo = new UserInfo(userKey, userName, null, password, null, groupName, status, null, date, date, operatorName);
				userinfo = userInfoService.insertUserInfo(userinfo);
				if (userinfo != null) {
					return successJson(userinfo);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "创建用户失败");
	}

	@RequestMapping(value = "/updateUserInfo")
	public @ResponseBody
	ResponseResult editUserInfo(HttpServletRequest request, ModelMap model, Integer id, String userKey, String userName, String password,
								String groupName, Byte status) {
		try {
			Date date = new Date();
			HttpSession session = request.getSession();
			String operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
			if (StringUtils.isNotEmpty(password)) {
				password = Md5PasswordEncoder.encode(password);
			}
			UserInfo userinfo = new UserInfo(id, userKey, userName, null, password, null, groupName, status, null, date, date, operatorName);
			int updateNum = userInfoService.updateIfNecessary(userinfo);
			if (updateNum == 1) {
				userinfo = userInfoService.getUserInfoById(userinfo.getId());
				return successJson(userinfo);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "更新用户失败");
	}

	@RequestMapping(value = "/getUserInfoByUserKey")
	public String getUserInfoByUserKey(HttpServletRequest request, ModelMap model) throws Exception {
		HttpSession session = request.getSession();
		String operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
		UserInfo userinfo = null;
		userinfo = userInfoService.getOneUserInfoByKey(operatorName);
		if (userinfo != null) {
			model.addAttribute("userinfo", userinfo);
			return "management/editUserInfo";
		}
		return null;
	}

	@RequestMapping(value = "/updateBankUserInfo")
	public @ResponseBody
	ResponseResult updateBankUserInfo(HttpServletRequest request, ModelMap model, String userKey, String userName,String password, String passwordNew,
			String passwordNew2) {
		try {
			HttpSession session = request.getSession();
			String operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
			String groupName = (String) session.getAttribute(SessionConstant.GROUP_NAME);
			String newPassword = "";
			String oldIdNumber = "";
			UserInfo userinfos = userInfoService.getOneUserInfoByKey(operatorName);
			UserInfo userinfo = null;
			if (StringUtils.isEmpty(userKey) || StringUtils.isEmpty(userName)) {
				return errorJson(EnumResCode.SERVER_ERROR.value(), "姓名不能为空");
			}
			if (StringUtils.isNotEmpty(password)) {
				password = Md5PasswordEncoder.encode(password);
				if (password.equals(userinfos.getPassword())) {
					if (StringUtils.isNotEmpty(passwordNew) && StringUtils.isNotEmpty(passwordNew2)) {
						if (passwordNew.equals(passwordNew2)) {
							newPassword = Md5PasswordEncoder.encode(passwordNew);
						}
					} else {
						return errorJson(EnumResCode.SERVER_ERROR.value(), "新密码不能为空");
					}
				} else {
					return errorJson(EnumResCode.SERVER_ERROR.value(), "原密码输入错误");
				}
			}
			if (userinfos != null) {
			    operatorName="";
		  		if(HasAdminRight.hasAdminRight(groupName)) {
	    			 operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
		  			 userinfo= new UserInfo(operatorName, userName, null, null, null, null, null,
							 null, null, newPassword, new Date(), operatorName);
		 			int updateNum = userInfoService.updateUserInfoByUserKey(userinfo);
		 			if (updateNum == 1) {
		 				userinfo = userInfoService.getOneUserInfoByKey(operatorName);
		 				return successSaveJson(userinfo);
		 			}
		  		}else{
		  			oldIdNumber=userinfos.getIdNumber();
		  			if(StringUtils.isNotEmpty(oldIdNumber)){
		  				operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
			  			 userinfo= new UserInfo(operatorName, userName, null, null,
								 null, null, null,
								 null, null, newPassword, new Date(), operatorName);
			 			int updateNum = userInfoService.updateUserInfoByUserKey(userinfo);
			 			if (updateNum == 1) {
			 				userinfo = userInfoService.getOneUserInfoByKey(operatorName);
			 				return successSaveJson(userinfo);
			 			}
		  			}else{
		  				operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
			  			 userinfo= new UserInfo(operatorName, userName, null, null, null, null, null,
								 null, null, newPassword, new Date(), operatorName);
			 			int updateNum = userInfoService.updateUserInfoByUserKey(userinfo);
			 			if (updateNum == 1) {
			 				userinfo = userInfoService.getOneUserInfoByKey(operatorName);
			 				return successJson(userinfo);
			 			}
		  			}

		  		}
			}else{
				return errorJson(EnumResCode.SERVER_ERROR.value(), "登陆账号不存在");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "补充用户信息失败");
	}

	/*
	 * 重置密码 为1234
	 */
	@RequestMapping(value = "/updateUserPassword")
	public @ResponseBody
	ResponseResult editUserPassword(HttpServletRequest request, ModelMap model, Integer id) {
		try {
			HttpSession session = request.getSession();
			String operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
			int updateNum = userInfoService.updatePassword(id, Md5PasswordEncoder.encode(passwordKey), operatorName);
			if (updateNum == 1)return successJson();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "重置密码失败");
	}

	/*
	 * 重置密码 为123456
	 */
	@RequestMapping(value = "/updateRecognitionUserPassword")
	public @ResponseBody
	ResponseResult updateRecognitionUserPassword(HttpServletRequest request, ModelMap model, Integer id) {
		try {
			HttpSession session = request.getSession();
			String operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
			int updateNum = userInfoService.updatePassword(id, Md5PasswordEncoder.encode(passwordKey), operatorName);
			if (updateNum == 1)return successJson();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return errorJson(EnumResCode.SERVER_ERROR.value(), "重置密码失败");
	}
	
}
