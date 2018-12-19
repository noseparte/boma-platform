package com.xmbl.ops.dao.organization;

import com.xmbl.ops.dao.base.IEntityDao;
import com.xmbl.ops.model.organization.UserInfo;

import java.util.Date;
import java.util.List;



public interface IUserInfoDao extends IEntityDao<UserInfo>{
	public static final String USER_KEY = "userKey";
	public static final String USER_MOBILE = "userMobile";

	/**
	 * 用户登录检验
	 */
	public UserInfo selectByUserAndPassword(String username, String password);
	
	long searchCount(String username, String role, String groupName, String teamId,
			String status, Date startDate, Date endDate);

	long searchTeamIdCount(long teamId);
	
	List<UserInfo> searchList(String username, String role, String groupName, String teamId,
					String status, Date startDate, Date endDate, Long page, int limit);

	List<UserInfo> searchList(String username, String role, String groupName, String teamId,
			String status);
	
	List<UserInfo> searchLimitList(long id, int limit);
	
	List<UserInfo> searchList();

	/**
	 * 更新用户信息
	 * @param id
	 * @param userKey
	 * @param mobile
	 * @param password
	 * @return
	 */
	
	public UserInfo selectByUserMobile(String UserMobile);
	
	public UserInfo selectOneByUserKey(String UserKey);
	
	public UserInfo selectByUserKey(String UserKey);
	
	public UserInfo selectByUserId(Integer id);
	
	public List<UserInfo> getUsersListByTeamId(Long teamId);
	
	public UserInfo addUserInfo(UserInfo userinfo);
	
	public int updateUserInfo(UserInfo userinfo);
	
	public int updateUserInfoPassword(Integer id, String password, String operatorName);
	
	public int updateUserInfoByUserKey(UserInfo userinfo);
	
}
