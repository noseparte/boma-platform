package com.xmbl.ops.util;

import ch.qos.logback.classic.Logger;
import com.cloopen.rest.sdk.CCPRestSmsSDK;
import lombok.Data;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.HashMap;
import java.util.Set;

@Data
public class SendSMSSDKUtil {
	private static Logger log = (Logger) LoggerFactory.getLogger("send_sms");

	private static String cloopen_SID = "8aaf07085dcad420015dcff42dc401e1";
	private static String cloopen_TOKEN = "e8e62e9580504292bfab64568358c8ba";
	private static String cloopen_APPID = "8aaf07085dcad420015dcff42f4f01e8";
	private static String cloopen_sandbox_url = "sandboxapp.cloopen.com";
	private static String cloopen_sandbox_port = "8883";
	private static String cloopen_url = "app.cloopen.com";
	private static String cloopen_port = "8883";
	
	public void setCloopen_SID(String cloopen_SID) {
		SendSMSSDKUtil.cloopen_SID = cloopen_SID;
		cloopen_SID = SendSMSSDKUtil.cloopen_SID;
	}
	public void setCloopen_TOKEN(String cloopen_TOKEN) {
		SendSMSSDKUtil.cloopen_TOKEN = cloopen_TOKEN;
		cloopen_TOKEN = SendSMSSDKUtil.cloopen_TOKEN;
	}

	public void setCloopen_APPID(String cloopen_APPID) {
		SendSMSSDKUtil.cloopen_APPID = cloopen_APPID;
		cloopen_APPID = SendSMSSDKUtil.cloopen_APPID;
	}
	public void setCloopen_sandbox_url(String cloopen_sandbox_url) {
		SendSMSSDKUtil.cloopen_sandbox_url = cloopen_sandbox_url;
	}
	public void setCloopen_sandbox_port(String cloopen_sandbox_port) {
		SendSMSSDKUtil.cloopen_sandbox_port = cloopen_sandbox_port;
	}
	public void setCloopen_url(String cloopen_url) {
		SendSMSSDKUtil.cloopen_url = cloopen_url;
	}
	public void setCloopen_port(String cloopen_port) {
		SendSMSSDKUtil.cloopen_port = cloopen_port;
	}
	private static int MaxThreadNum = 20;


	//发送短信
	/*
	 * 参数：mobile mouldID message time
	 * @mobile  手机号
	 * @mouldID 短信模板id
	 * @message  内容
	 * @time     有效时间（分钟）
	 */
	public static void sendMsgByMobile(final String mobile,final String mouldID,final String message,final String time) throws Exception {	
//		new Thread(){
//		public void run(){
			try{
				sendMsg(mobile,mouldID, message,time);
			}catch(Exception e){
				e.printStackTrace();
			}
//		}
//	  }.start();
	}
	
	
	private static void sendMsg(String mobile, String mouldID, String message, String time) throws Exception {
		HashMap<String, Object> result = null;
		//每2秒发一次
//		Thread.sleep(2000);
//		Map<String, String> sParaTemp = null;
//		String  resultMsg=null;
//	    sParaTemp = new HashMap<String, String> ();
//		sParaTemp.put("mobile", mobile);
//		sParaTemp.put("mouldID", mouldID);
		//初始化SDK
		CCPRestSmsSDK restAPI = new CCPRestSmsSDK();

		restAPI.init(cloopen_url, cloopen_port);

		restAPI.setAccount(cloopen_SID, cloopen_TOKEN);

		restAPI.setAppId(cloopen_APPID);

		result = restAPI.sendTemplateSMS(mobile,mouldID ,new String[]{message,time});
		
		System.out.println("SDKTestGetSubAccounts result=" + result);
		if("000000".equals(result.get("statusCode"))){
			//正常返回输出data包体信息（map）
			HashMap<String,Object> data = (HashMap<String, Object>) result.get("data");
			Set<String> keySet = data.keySet();
			for(String key:keySet){
				Object object = data.get(key);
				System.out.println(key +" = "+object);
			}
		}else{
			//异常返回输出错误码和错误信息
			System.out.println("错误码=" + result.get("statusCode") +" 错误信息= "+result.get("statusMsg"));
		}
		log.info("时间："+new Date()+"send_sms_log:"+"SMS_URL: "+cloopen_url+"[mobile]:"+mobile+"[message]"+message+"--successfully"+"{resultMsg:"+result+"}"); 
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		try {
			sendMsgByMobile("18756977291","1111","xiaoxi","20");
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		HashMap<String, Object> result = null;

		//初始化SDK
		CCPRestSmsSDK restAPI = new CCPRestSmsSDK();
		
		//******************************注释*********************************************
		//*初始化服务器地址和端口                                                       *
		//*沙盒环境（用于应用开发调试）：restAPI.init("sandboxapp.cloopen.com", "8883");*
		//*生产环境（用户应用上线使用）：restAPI.init("app.cloopen.com", "8883");       *
		//*******************************************************************************
		restAPI.init("app.cloopen.com", "8883");
//		restAPI.init("sandboxapp.cloopen.com", "8883");
		//******************************注释*********************************************
		//*初始化主帐号和主帐号令牌,对应官网开发者主账号下的ACCOUNT SID和AUTH TOKEN     *
		//*ACOUNT SID和AUTH TOKEN在登陆官网后，在“应用-管理控制台”中查看开发者主账号获取*
		//*参数顺序：第一个参数是ACOUNT SID，第二个参数是AUTH TOKEN。                   *
		//*******************************************************************************
		restAPI.setAccount("8aaf07085dcad420015dcff42dc401e1", "e8e62e9580504292bfab64568358c8ba");
		
		
		//******************************注释*********************************************
		//*初始化应用ID                                                                 *
		//*测试开发可使用“测试Demo”的APP ID，正式上线需要使用自己创建的应用的App ID     *
		//*应用ID的获取：登陆官网，在“应用-应用列表”，点击应用名称，看应用详情获取APP ID*
		//*******************************************************************************
		restAPI.setAppId("8aaf07085dcad420015dcff42f4f01e8");
		
		
		//******************************注释****************************************************************
		//*调用发送模板短信的接口发送短信                                                                  *
		//*参数顺序说明：                                                                                  *
		//*第一个参数:是要发送的手机号码，可以用逗号分隔，一次最多支持100个手机号                          *
		//*第二个参数:是模板ID，在平台上创建的短信模板的ID值；测试的时候可以使用系统的默认模板，id为1。    *
		//*系统默认模板的内容为“【云通讯】您使用的是云通讯短信模板，您的验证码是{1}，请于{2}分钟内正确输入”*
		//*第三个参数是要替换的内容数组。																														       *
		//**************************************************************************************************
		
		//**************************************举例说明***********************************************************************
		//*假设您用测试Demo的APP ID，则需使用默认模板ID 1，发送手机号是13800000000，传入参数为6532和5，则调用方式为           *
		//*result = restAPI.sendTemplateSMS("13800000000","1" ,new String[]{"6532","5"});																		  *
		//*则13800000000手机号收到的短信内容是：【云通讯】您使用的是云通讯短信模板，您的验证码是6532，请于5分钟内正确输入     *
		//*********************************************************************************************************************
//		result = restAPI.sendTemplateSMS("15201116104","198518" ,new String[]{"1231","5分钟"});
		result = restAPI.sendTemplateSMS("18756977291","198518" ,new String[]{"1231","5分钟"});
		
		System.out.println("SDKTestGetSubAccounts result=" + result);
		if("000000".equals(result.get("statusCode"))){
			//正常返回输出data包体信息（map）
			HashMap<String,Object> data = (HashMap<String, Object>) result.get("data");
			Set<String> keySet = data.keySet();
			for(String key:keySet){
				Object object = data.get(key);
				System.out.println(key +" = "+object);
			}
		}else{
			//异常返回输出错误码和错误信息
			System.out.println("错误码=" + result.get("statusCode") +" 错误信息= "+result.get("statusMsg"));
		}
	}
	
}
