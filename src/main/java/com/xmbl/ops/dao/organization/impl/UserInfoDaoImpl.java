package com.xmbl.ops.dao.organization.impl;

import com.xmbl.ops.dao.base.EntityDaoMPDBImpl;
import com.xmbl.ops.dao.organization.IUserInfoDao;
import com.xmbl.ops.model.organization.UserInfo;
import com.xmbl.ops.util.Md5PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Repository
public class UserInfoDaoImpl extends EntityDaoMPDBImpl<UserInfo> implements IUserInfoDao {
	
	/**
	 * 用户登录检验
	 * @throws Exception 
	 */
	@Override
	public UserInfo selectByUserAndPassword(String userKey, String password) {
		String tmp;
		UserInfo userinfo = null;
		try {
			tmp = Md5PasswordEncoder.encode(password);
			Map<String, Object> para = new HashMap<String, Object>();
			para.put("userKey", userKey);
			para.put("password", tmp);
			userinfo = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectByUserAndPassword", para);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return userinfo;
	}

	/**
	 * 用户登录检验
	 * @throws Exception 
	 */
	@Override
	public UserInfo selectByUserId(Integer id) {
		
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("id", id);
		UserInfo userinfo = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectByUserId", para);
		return userinfo;
	}
	/**
	 * 用户登录检验
	 * @throws Exception 
	 */
	@Override
	public UserInfo selectByUserKey(String userKey) {
		
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userKey", userKey);
		
		UserInfo userinfo = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectByUserKey", para);
		return userinfo;
	}
	
	/**
	 * 用户登录检验
	 * @throws Exception 
	 */
	@Override
	public UserInfo selectByUserMobile(String userMobile) {
		
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userMobile", userMobile);	
		UserInfo userinfo = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectByUserMobile", para);
		return userinfo;
	}
	
	@Override
	public UserInfo selectOneByUserKey(String userKey) {
		
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userKey", userKey);	
		UserInfo userinfo = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectOneByUserkey", para);
		return userinfo;
	}
	
	
	@Override
	public long searchCount(String userKey, String role, String groupName, String teamId,
			String status, Date startDate, Date endDate) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userKey", userKey);
		para.put("role", role);
		para.put("groupName", groupName);
		para.put("teamId", teamId);
		para.put("status", status);
		para.put("startDate", startDate);
		para.put("endDate", endDate);
		long count = getSqlSessionTemplate().selectOne(getNameSpace() + ".searchCount", para);
		return count;
	}
	
	@Override
	public long searchTeamIdCount(long teamId) {
		Map<String, Object> para = new HashMap<String, Object>();
	
		para.put("teamId", teamId);
	
		long count = getSqlSessionTemplate().selectOne(getNameSpace() + ".searchTeamIdCount", para);
		return count;
	}
	/**
	 * 用户列表
	 * @throws Exception 
	 */
	@Override
	public List<UserInfo> searchList(String userKey, String role,
			String groupName, String teamId, String status, Date startDate, Date endDate,
			Long page, int limit) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("offset", page);
		para.put("limit", limit);
		para.put("userKey", userKey);
		para.put("role", role);
		para.put("groupName", groupName);
		para.put("teamId", teamId);
		para.put("status", status);
		para.put("startDate", startDate);
		para.put("endDate", endDate);
		List<UserInfo> results = getSqlSessionTemplate().selectList(getNameSpace() + ".searchList", para);
		return results;
	}
	/**
	 * 用户列表
	 * @throws Exception 
	 */
	@Override
	public List<UserInfo> searchList() {
		Map<String, Object> para = new HashMap<String, Object>();		
		List<UserInfo> results = getSqlSessionTemplate().selectList(getNameSpace() + ".searchList", para);
		return results;
	}
	@Override
	public List<UserInfo> searchList(String userKey, String role,
			String groupName, String teamId, String status) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userKey", userKey);
		para.put("role", role);
		para.put("groupName", groupName);
		para.put("teamId", teamId);
		para.put("status", status);
		List<UserInfo> results = getSqlSessionTemplate().selectList(getNameSpace() + ".searchList", para);
		return results;
	}
	
	@Override
	public List<UserInfo> searchLimitList(long id, int limit) {
		Map<String, Object> para = new HashMap<String, Object>();		
		para.put("id", id);
		para.put("limit", limit);
		List<UserInfo> results = getSqlSessionTemplate().selectList(getNameSpace() + ".searchLimitList", para);
		return results;
	}
	
	@Override
	public List<UserInfo> getUsersListByTeamId(Long teamId){
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("teamId", teamId);
		List<UserInfo> results = getSqlSessionTemplate().selectList(getNameSpace() + ".getUsersListByTeamId", para);
		return results;
	}

	@Override
	public UserInfo addUserInfo(UserInfo userinfo){
		//插入新成员
		UserInfo userinfos=insertSelective(userinfo);
		return userinfos;
	}

	@Override
	public int updateUserInfo(UserInfo userinfo) {
		//更新成员
		int count=updateIfNecessary(userinfo);
		return count;
	}
	@Override
	public int updateUserInfoPassword(Integer id, String password, String operatorName) {
		//重置密码
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("id", id);
		para.put("password", password);
		para.put("updateTime", new Date());
		para.put("operator", operatorName);
		int count = getSqlSessionTemplate().update(getNameSpace() + ".updateUserInfoPassword", para);
		return count;
	}
	
	@Override
	public int updateUserInfoByUserKey(UserInfo userinfo) {
		//补充银行信息
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userKey", userinfo.getUserKey());
		para.put("userName", userinfo.getUserName());
		para.put("password", userinfo.getPassword());
//		para.put("idNumber", userinfo.getIdNumber());
//		para.put("bank", userinfo.getBank());
//		para.put("province", userinfo.getProvince());
//		para.put("city", userinfo.getCity());
//		para.put("county", userinfo.getCounty());
//		para.put("bankSubbranch", userinfo.getBankSubbranch());
//		para.put("bankCard", userinfo.getBankCard());
		para.put("updateTime", new Date());
		para.put("operator", userinfo.getOperator());
		int count = getSqlSessionTemplate().update(getNameSpace() + ".updateUserInfoByUserKey", para);
		return count;
	}
	
}
