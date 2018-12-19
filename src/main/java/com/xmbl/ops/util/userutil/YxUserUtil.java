package com.xmbl.ops.util.userutil;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名: UserUtil
 * @创建时间: 2018年3月7日 上午11:25:06
 * @修改时间: 2018年3月7日 上午11:25:06
 * @类说明: 游戏短账号和游戏长账号之间转换
 */
public class YxUserUtil {

	private static Logger LOGGER = LoggerFactory.getLogger(YxUserUtil.class);

	/**
	 * 游戏服 短用户id号 转 长用户id号
	 * @param shortUserId 短用户id号
	 * @param substrlastnum 短用户id截取后面几位 eg截取"54321"字符串的后面4位 则传入substrlastnum = 4
	 * <span>100000000000020  --> 100020</span>
	 * @return
	 */
	public static String shortUserIdToLongUserId(String shortUserId,int substrlastnum) {
		try {
			Assert.isTrue(shortUserId.length() >= (substrlastnum+1), "短用户id号不能少于" + (substrlastnum+1) + "位");
			// 截取后面几位后获取前面字符串
			String substrPreStr = shortUserId.substring(0,shortUserId.length() - substrlastnum);
			// 截取后面几位，获取字符串
			String substrNextStr = shortUserId.substring(shortUserId.length() - substrlastnum);
			String longUserId = substrPreStr +StringUtils.repeat("0", 9) + substrNextStr;
			return longUserId;
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("短用户id号转长用户id号出错啦,报错信息为:{}",e.getMessage());
			return "";
		}
	}

	/**
	 * 游戏服 长用户id号 转 短用户id号
	 * @param longUserId 游戏服务器长用户id号
	 * @param substrlastnum 长用户id号截取后面几位的字符长度 
	 * @return
	 */
	public static String longUserIdToShortUserId(String longUserId,int substrlastnum ) {
		try {
			Assert.isTrue(longUserId.length() >= (substrlastnum+1+9), "长用户id号不能少于" + (substrlastnum+1+9) + "位");
			// 截取开始
			// 截取后面几位，获取字符串
			String substrNextStr = longUserId.substring(longUserId.length() - substrlastnum);
			// 截取前面的几位服务器id
			String substrPreStr = longUserId.substring(0,longUserId.length() - substrlastnum-9);
			String shortUserIdStr = substrPreStr + substrNextStr;
			return shortUserIdStr;
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("用户id号转长用户id号出错啦,报错信息为:{}",e.getMessage());
			return "";
		}

	}

	public static void main(String[] args) {
		
		LOGGER.info("短用户id号转长用户id号");
		String longUserId = shortUserIdToLongUserId("7701021",5);
		LOGGER.info(longUserId);
		LOGGER.info(""+longUserId.equals("7700000000001021"));
		LOGGER.info("长用户id号转短用户id号");
		String shortUserId = longUserIdToShortUserId("7700000000001021",5);
		LOGGER.info(shortUserId);
		LOGGER.info(""+shortUserId.equals("7701021"));
	}
}
