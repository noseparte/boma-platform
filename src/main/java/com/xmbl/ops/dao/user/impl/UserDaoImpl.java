package com.xmbl.ops.dao.user.impl;

import com.xmbl.ops.dao.base.EntityDaoMPDBImpl;
import com.xmbl.ops.dao.user.IUserDao;
import com.xmbl.ops.model.user.User;
import com.xmbl.ops.util.Md5PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;



@Repository
public class UserDaoImpl extends EntityDaoMPDBImpl<User> implements IUserDao {
	
	@Override
	public User addUser(User user){
		//插入新成员
		User users=insertSelective(user);
		return users;
	}

	@Override
	public int updateUser(User user) {
		//更新成员
		int count=updateIfNecessary(user);
		return count;
	}
	
	public int updateUserBind(User user) {
		//更新绑定账号密码
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userkey", user.getUserkey());
		para.put("password", user.getPassword());
		para.put("type", user.getType());
		para.put("accountid", user.getAccountid());
		para.put("updateTime", new Date());
		int count = getSqlSessionTemplate().update(getNameSpace() + ".updateUserBind", para);
		return count;
	}
	
	public int updateUserPassword(User user) {
		//更新密码
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userkey", user.getUserkey());
		para.put("password", user.getPassword());
		para.put("updatetime", new Date());
		int count = getSqlSessionTemplate().update(getNameSpace() + ".updateUserPassword", para);
		return count;
	}
	
	
	public int updateUserValidatecode(User user) {
		//更新验证码
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userkey", user.getUserkey());
		para.put("password", user.getPassword());
		para.put("type", user.getType());
		para.put("validatecode", user.getValidatecode());
		para.put("updatetime", new Date());
		int count = getSqlSessionTemplate().update(getNameSpace() + ".updateUserValidatecode", para);
		return count;
	}
	
	
	public User getUserByVerify(String userkey, String password ,String validatecode) {
		String tmp;
		User userinfo = null;
		try {
			tmp = Md5PasswordEncoder.encode(password);
			Map<String, Object> para = new HashMap<String, Object>();
			para.put("userkey", userkey);
			para.put("password", tmp);
			para.put("validatecode", validatecode);
			userinfo = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectByVerify", para);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return userinfo;
	}
	
	public User getUserByUserkey(String userkey) {
		User userinfo = null;
		try {
			Map<String, Object> para = new HashMap<String, Object>();
			para.put("userkey", userkey);
			userinfo = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectByUserkey", para);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return userinfo;
	}
	
	public User getUserById(String accountid) {
		User userinfo = null;
		try {
			Map<String, Object> para = new HashMap<String, Object>();
			para.put("accountid", accountid);
			userinfo = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectById", para);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return userinfo;
	}
	
	public User getUserByUserkey(String userkey,String password) {
		User userinfo = null;
		try {
			Map<String, Object> para = new HashMap<String, Object>();
			para.put("userkey", userkey);
			para.put("password", password);
			userinfo = getSqlSessionTemplate().selectOne(getNameSpace() + ".selectByUserkey", para);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return userinfo;
	}

	public boolean deleteByPrimaryKey(String accountid) {
		try {
			Map<String, Object> para = new HashMap<String, Object>();
			para.put("accountid", accountid);
			int count = getSqlSessionTemplate().delete(getNameSpace() + ".deleteByPrimaryKey", para);
			return count >0;
		} catch (Exception e){
			e.printStackTrace();
		}
		return false;
	}

	public boolean updateUserForLogin(String userkey) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userkey", userkey);
		int count = getSqlSessionTemplate().update(getNameSpace() + ".updateUserForLogin", para);
		return count >0;
	}

	public boolean updateByUserkeyAndServerId(String newUserkey,
			String newpassword, User youkeUserinfo) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("newUserkey", newUserkey);
		para.put("newpassword", newpassword);
		para.put("accountid", youkeUserinfo.getAccountid());
		para.put("logincnt", youkeUserinfo.getLogincnt());
		para.put("serverid", youkeUserinfo.getServerid());
		int count = getSqlSessionTemplate().update(getNameSpace() + ".updateByUserkeyAndServerId", para);
		return count >0 ;
	}

	@Override
	public Integer updatePwd(String userkey, String oldpassword,
			String newpassword) {
		Map<String, Object> para = new HashMap<String, Object>();
		para.put("userkey", userkey);
		para.put("oldpassword", oldpassword);
		para.put("newpassword", newpassword);
		int count = getSqlSessionTemplate().update(getNameSpace() + ".updatePwd", para);
		return count ;
	}

}
