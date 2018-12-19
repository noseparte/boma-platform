package com.xmbl.ops.util;

import ch.qos.logback.classic.Logger;
import com.xmbl.ops.util.http.HttpSubmit;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
public class SendSmsUtil {
	private static Logger log = (Logger) LoggerFactory.getLogger("send_sms_log");
	public static String sms_url = "http://msgs.91xuexibao.com/api/srv2/msg/sms";
	public static String sms_extension ="[学习宝]";
	
	public static String SMS_URL = "http://msgs.91xuexibao.com/api/srv2/msg/sms";
	public static String SMS_EXTENSION ="[学习宝]";
	
	public void setSms_url(String sms_url) {
		SendSmsUtil.sms_url = sms_url;
		SMS_URL = SendSmsUtil.sms_url;
	}
	
	public void setSms_extension(String sms_extension) {
		SendSmsUtil.sms_extension = sms_extension;
		SMS_EXTENSION = SendSmsUtil.sms_extension;
	}
	

	
	/*
	 * 参数：mobile  message
	 * 
	 */
	public static void sendMsgByMobile(final String mobile,final String message) throws Exception {	
		sendMsg(mobile, message);
	}
	
	
	private static void sendMsg(String mobile, String message) throws Exception {
		//每2秒发一次
		Thread.sleep(2000);
		Map<String, String> sParaTemp = null;
		String  resultMsg=null;
	    sParaTemp = new HashMap<String, String> ();
		sParaTemp.put("mobile", mobile);
		sParaTemp.put("message", message+SMS_EXTENSION);
//		sParaTemp.put("ext", "1");
		resultMsg=HttpSubmit.sendPostOrGetInfo_RPC(sParaTemp, SMS_URL, "POST");
		log.info("时间："+new Date()+"send_sms_log:"+"SMS_URL: "+sms_url+"[mobile]:"+mobile+"[message]"+message+"--successfully"+"{resultMsg:"+resultMsg+"}"); 
	}
	
	 public static void main(String[] args) {
		 String mobile = "15201116104";
		 String message = "22";
		 try {
			sendMsgByMobile(mobile,message);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	 }
	
}
