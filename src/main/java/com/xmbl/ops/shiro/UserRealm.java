package com.xmbl.ops.shiro;

import com.xmbl.ops.constant.SessionConstant;
import com.xmbl.ops.model.organization.UserInfo;
import com.xmbl.ops.service.organization.ResourcesRoleService;
import com.xmbl.ops.service.organization.RoleService;
import com.xmbl.ops.service.organization.UserInfoService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class UserRealm extends AuthorizingRealm {

	private static Logger logger = LoggerFactory.getLogger("session_expired_log");
	@Autowired
	private UserInfoService userInfoService;
	@Autowired
	private RoleService roleService;
	
	@Autowired
	private ResourcesRoleService resourcesRoleService;
	
	/**
	 * 只有需要验证权限时才会调用, 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用.在配有缓存的情况下，只加载一次.
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		String currentUsername = (String) super.getAvailablePrincipal(principals);

		UserInfo userInfo = userInfoService.getUserInfoByKey(currentUsername);
		// 为当前用户设置角色和权限
		SimpleAuthorizationInfo simpleAuthorInfo = new SimpleAuthorizationInfo();

		if (null != userInfo) {
			//验证角色
			String roleSign = userInfo.getGroupname();
			simpleAuthorInfo.addRole(roleSign);				
			logger.info("授权成功:{}",simpleAuthorInfo.getRoles());
			return simpleAuthorInfo;
		}
		logger.info("授权失败");
		return null;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken) throws AuthenticationException {
		UsernamePasswordToken token = (UsernamePasswordToken) authcToken;
		UserInfo userInfo = userInfoService.getUserInfoByKey(token.getUsername());

		if (null != userInfo) {
			AuthenticationInfo authcInfo = new SimpleAuthenticationInfo(userInfo.getUserKey(), userInfo.getPassword(), UserRealm.class.getName());
//			this.setSession(SessionConstant.ID_NUMBER, userInfo.getIdNumber());
			this.setSession(SessionConstant.USER_NAME, userInfo.getUserKey());
			this.setSession(SessionConstant.GROUP_NAME, userInfo.getGroupname());
			
//			this.setSession(SessionConstant.TEAM_ID, userInfo.getTeamId());
			logger.info("认证成功:{}",authcInfo.getCredentials());
			return authcInfo;
		} else {
			logger.info("认证失败");
			return null;
		}
	}

	private void setSession(Object key, Object value) {
		Subject currentUser = SecurityUtils.getSubject();
		if (null != currentUser) {
			Session session = currentUser.getSession();
			if (null != session) {
				session.setAttribute(key, value);
			}
		}
	}
}
