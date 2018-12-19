package com.xmbl.ops.controller.user;

import com.alibaba.fastjson.JSONObject;
import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.dto.ResponseResult;
import com.xmbl.ops.service.user.UpdatePwdService;
import com.xmbl.ops.util.Md5PasswordEncoder;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  UpdatePwdController 
 * @创建时间:  2018年1月19日 下午3:56:28
 * @修改时间:  2018年1月19日 下午3:56:28
 * @类说明: 修改密码controller
 */
@Controller
@RequestMapping(value="/api/user")
public class UpdatePwdController  extends AbstractController{
	
	private static Logger LOGGER = LoggerFactory.getLogger(UpdatePwdController.class);
	
	@Autowired
	private UpdatePwdService updatePwdService;
	/**
	 * userkey oldpassword newpassword newpassword2
	 * @param jsonData
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "/updatePwd", method=RequestMethod.POST)
	public ResponseResult updatePwd(String jsonData) {
		try {
			LOGGER.info("修改密码开始");
			Assert.isTrue(StringUtils.isNotBlank(jsonData), "jsonData不允许为空");
			JSONObject response = (JSONObject) JSONObject.parse(jsonData);
			String userkey = (String) response.get("userkey");
			Assert.isTrue(StringUtils.isNotBlank(userkey), "手机号或邮箱账号不允许为空");
			String oldpassword = (String) response.get("oldpassword");
			Assert.isTrue(StringUtils.isNotBlank(oldpassword), "原密码不允许为空");
			String newpassword = (String) response.get("newpassword");
			Assert.isTrue(StringUtils.isNotBlank(newpassword), "修改密码不允许为空");
			String newpassword2 = (String) response.get("newpassword2");
			Assert.isTrue(StringUtils.isNotBlank(newpassword2), "确认修改密码不允许为空");
			Assert.isTrue(newpassword.equals(newpassword2), "两次密码输入不一致");
			oldpassword = Md5PasswordEncoder.encode(oldpassword);
			newpassword = Md5PasswordEncoder.encode(newpassword);
			// 基本验证通过
			ResponseResult responseResult  = updatePwdService.updatePwd(userkey,oldpassword,newpassword);
			LOGGER.info(JSONObject.toJSONString(responseResult));
			Assert.isTrue("ok".equals(responseResult.getMsg()), "修改密码失败");
			LOGGER.info("修改密码成功");
			return responseResult;
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("修改密码出错啦！",e.getMessage());
			return errorJson(e.getMessage());
		}
	}
}
