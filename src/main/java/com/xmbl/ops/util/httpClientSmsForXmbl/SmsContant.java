package com.xmbl.ops.util.httpClientSmsForXmbl;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  SmsContant 
 * @创建时间:  2018年1月2日 下午5:06:13
 * @修改时间:  2018年1月2日 下午5:06:13
 * @类说明: 短信通知模板常量类
 */
public class SmsContant {
	public static String SMS_CLIENT_URL = PropertyUtil.getProperty("conf/env.properties", "sms.client.url");
	public static String SMS_CLIENT_APPID = PropertyUtil.getProperty("conf/env.properties", "sms.client.appId");
	public static String SMS_CLIENT_TEMPLATEID = PropertyUtil.getProperty("conf/env.properties", "sms.client.templateId");
	public static String SMS_CLIENT_STATISTIC_APPID = PropertyUtil.getProperty("conf/env.properties", "sms.client.statistic.appId");
	public static String SMS_CLIENT_STATISTIC_TEMPLATEID = PropertyUtil.getProperty("conf/env.properties", "sms.client.statistic.templateId");
	public static String SMS_CLIENT_STATISTIC_RECIPIENT = PropertyUtil.getProperty("conf/env.properties", "sms.client.statistic.recipient");
	
}
