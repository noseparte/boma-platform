package com.xmbl.ops.service.user;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.dao.user.IUserDao;
import com.xmbl.ops.dto.ResponseResult;
import com.xmbl.ops.model.user.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.annotation.Resource;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  UpdatePwdService 
 * @创建时间:  2018年1月19日 下午4:07:37
 * @修改时间:  2018年1月19日 下午4:07:37
 * @类说明:
 */
@Service
public class UpdatePwdService extends AbstractController{
	
	private static Logger LOGGER = LoggerFactory.getLogger(UpdatePwdService.class);
	
	@Resource
	IUserDao userDao;
	
	/**
	 * 修改密码
	 * @param userkey 用户账号
	 * @param oldpassword 用户旧密码
	 * @param password 用户要修改的密码
	 * @param password2 用户要修改的密码确认
	 * @return
	 */
	public ResponseResult updatePwd(String userkey, String oldpassword,
			String newpassword) {
		// 1.查询用户是否存在
		try {
			User user = userDao.getUserByUserkey(userkey);
			Assert.isTrue(user != null, "用户账号不存在");
			String pwd = user.getPassword();
			Assert.isTrue(oldpassword.equals(pwd), "用户密码不正确");
			// 用户账号密码都正确，开始修改密码
			Integer count = userDao.updatePwd( userkey, oldpassword, newpassword);
			Assert.isTrue(count > 0, "修改密码失败");
			return successJson("修改密码成功");
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
			return errorJson(e.getMessage());
		}
	}

}
