package com.xmbl.ops.service.organization;

import com.xmbl.ops.dao.organization.impl.UserLogDaoImpl;
import com.xmbl.ops.model.organization.UserLog;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class UserLogService {
	
	@Resource
	UserLogDaoImpl userLogDao;

	
	public long searchCount(String username, Date startDate, Date endDate) {
		return userLogDao.searchCount(username, startDate, endDate);
	}
	
	public List<UserLog> searchList(String username, Date startDate, Date endDate,
			Long page, int limit) {
		List<UserLog> userLogList = userLogDao.searchList(username, startDate, endDate,
				page, limit);
		return userLogList;
	}
	
	public UserLog insertUserLog(UserLog userlog){
	   UserLog userlogs= userLogDao.addUserLog(userlog);
	   return userlogs;
   }

	public int updateIfNecessary(UserLog userlog) {
		int count= userLogDao.updateUserLog(userlog);
		return count;
	}

}