package com.xmbl.ops.dao.user;

import com.xmbl.ops.dao.base.IEntityDao;
import com.xmbl.ops.model.user.User;


public interface IUserDao extends IEntityDao<User>{

	User addUser(User user);
	
	int updateUser(User user);
	
	int updateUserBind(User user);
	
	int updateUserPassword(User user);
	
	int updateUserValidatecode(User user);
	
	User getUserByUserkey(String userkey);
	
	User getUserByUserkey(String userkey, String password);
	
	User getUserByVerify(String userkey, String password, String validatecode);

	Integer updatePwd(String userkey, String oldpassword,
                      String newpassword);
}
