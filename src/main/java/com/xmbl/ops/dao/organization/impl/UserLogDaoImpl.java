package com.xmbl.ops.dao.organization.impl;

import com.xmbl.ops.dao.base.EntityDaoMPDBImpl;
import com.xmbl.ops.dao.organization.IUserLogDao;
import com.xmbl.ops.model.organization.UserLog;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Repository
public class UserLogDaoImpl extends EntityDaoMPDBImpl<UserLog> implements IUserLogDao {
	
	@Override
	public long searchCount(String userKey, Date startDate, Date endDate) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userKey", userKey);
		para.put("startDate", startDate);
		para.put("endDate", endDate);
		long count = getSqlSessionTemplate().selectOne(getNameSpace() + ".searchCount", para);
		return count;
	}
	
	@Override
	public List<UserLog> searchList(String userKey,  Date startDate, Date endDate,
			Long page, int limit) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("offset", page);
		para.put("limit", limit);
		para.put("userKey", userKey);
		para.put("startDate", startDate);
		para.put("endDate", endDate);
		List<UserLog> results = getSqlSessionTemplate().selectList(getNameSpace() + ".searchList", para);
		return results;
	}

	@Override
	public UserLog addUserLog(UserLog userLog){
		//插入新成员
		UserLog userLogs=insertSelective(userLog);
		return userLogs;
	}

	@Override
	public int updateUserLog(UserLog userLog) {
		//更新成员
		int count=updateIfNecessary(userLog);
		return count;
	}
}
