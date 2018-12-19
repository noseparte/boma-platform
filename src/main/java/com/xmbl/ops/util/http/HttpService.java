package com.xmbl.ops.util.http;

import java.util.Map;


public class HttpService {
	/**
	 * 以下包括：发送手机消息、建立索引、搜索、发送短信、根据经纬度坐标逆查询等服务的请求地址
	 */
	// 推送答案接口
	private static final String PUSH_MSG = "http://service.91xuexibao.com:3000/api/srv/msg/post?";// 正式环境
	// private static final String PUSH_MSG =
	// "http://service.taofangfei.com:3000/api/srv/msg/post?";// 测试环境
	// 建立索引接口
	// CREATE_INDEX注释原因：禁止实习生操作更新题库
//	private static final String CREATE_INDEX = "http://service.91xuexibao.com:3000/api/srv/search/update?";
	private static final String CREATE_INDEX = "";
	
	
	// private static final String CREATE_INDEX =
	// "http://192.168.1.230:3002/api/srv/search/update?";
	// 搜索接口
	private static final String SEARCH_INDEX = "http://service.91xuexibao.com:3000/api/srv/search/create?";
	// private static final String SEARCH_INDEX =
	// "http://192.168.1.230:3002/api/srv/search/create?";
	// 发短信接口
	private static final String SEND_SMS = "http://utf8.sms.webchinese.cn/?";
	// 地理信息解析接口
	private static final String LBS_LAT_LON = "http://api.map.baidu.com/geocoder/v2/?";

	private static final String REPLY_TO_USER = "http://webapi.91xuexibao.com:3000/api/reply/createOPS/?";

	// private static final String REPLY_TO_USER =
	// "http://192.168.1.231:3000/api/reply/createOPS/?";
	// 发送运营消息（订单、运营活动、回帖）--v1.5
	private static final String PUSH_MSG_OPS = "http://service.91xuexibao.com:3000/api/srv/msg/ops?";// 测试环境
	// private static final String PUSH_MSG_OPS =
	// "http://192.168.1.230:30002/api/srv/msg/ops?";// 测试环境
    ///api/srv/msg/race
	//private static final String PUSH_MSG_OPS = "http://192.168.1.143:3000/api/srv/msg/race?";// 测试环境
	// 发送运营消息（订单、运营活动、回帖）--v2.0
//	private static final String PUSH_MSG_OPS_v2 = "http://service.91xuexibao.com:3000/api/srv/msg/race";// 测试环境
	private static final String PUSH_MSG_OPS_v2 = "http://service.91xuexibao.com:80/api/srv/msg/race";// 测试环境
	//发送新音频通知--v2.0
	private static final String PUSH_MSG_OPS_Audio_v2 = "http://service.91xuexibao.com:3000/api/srv/msg/ops?";// 测试环境
	/**
	 * 根据经纬度信息逆查询用户地理位置 得到json表达式
	 * 
	 * @param sParaTemp
	 * @return
	 * @throws Exception
	 */
	public static String ReplyToUser(Map<String, String> sParaTemp)
			throws Exception {
		return HttpSubmit.sendPostOrGetInfo(sParaTemp, REPLY_TO_USER, "POST");// POST方式请求
	}

	/**
	 * 根据经纬度信息逆查询用户地理位置 得到json表达式
	 * 
	 * @param sParaTemp
	 * @return
	 * @throws Exception
	 */
	public static String getAreaInfo(Map<String, String> sParaTemp)
			throws Exception {
		return HttpSubmit.sendPostOrGetInfo(sParaTemp, LBS_LAT_LON, "GET");// GET方式请求
	}

	/**
	 * 向客户端手机发送异步消息
	 * 
	 * @param sParaTemp
	 * @return
	 * @throws Exception
	 */
	public static String pushMsgToUser(Map<String, String> sParaTemp)
			throws Exception {
		return HttpSubmit.sendPostOrGetInfo(sParaTemp, PUSH_MSG, "POST");// POST方式请求
	}

	/**
	 * 向客户端手机发送运营消息--V1.5
	 * 
	 * @param sParaTemp
	 * @return
	 * @throws Exception
	 */
	public static String pushOPSMsgToUser(Map<String, String> sParaTemp)
			throws Exception {
		return HttpSubmit.sendPostOrGetInfo(sParaTemp, PUSH_MSG_OPS, "POST");// POST方式请求
	}
	/**
	 * 向客户端手机发送运营消息--V2
	 * 
	 * @param sParaTemp
	 * @return
	 * @throws Exception
	 */
	public static String pushOPSMsgToUserV2(Map<String, String> sParaTemp)
			throws Exception {
		return HttpSubmit.sendPostOrGetInfo(sParaTemp, PUSH_MSG_OPS_v2, "POST");// POST方式请求
		
	}
	/**
	 * 向客户端手机发送新音频推送通知--V2
	 * 
	 * @param sParaTemp
	 * @return
	 * @throws Exception
	 */
	public static String pushOPSMsgToAudioUserV2(Map<String, String> sParaTemp)
			throws Exception {
		return HttpSubmit.sendPostOrGetInfo(sParaTemp, PUSH_MSG_OPS_Audio_v2, "POST");// POST方式请求
		
	}
	/**
	 * 建立索引
	 * 
	 * @param sParaTemp
	 * @return
	 * @throws Exception
	 */
	public static String createIndex(Map<String, String> sParaTemp)
			throws Exception {
		return HttpSubmit.sendPostOrGetInfo(sParaTemp, CREATE_INDEX, "POST");// POST方式请求
	}

	/**
	 * 调用查询接口
	 * 
	 * @param sParaTemp
	 * @return
	 * @throws Exception
	 */
	public static String searchIndex(Map<String, String> sParaTemp)
			throws Exception {
		return HttpSubmit.sendPostOrGetInfo(sParaTemp, SEARCH_INDEX, "POST");// POST方式请求
	}

	/**
	 * 发送kpi短信
	 * 
	 * @param sParaTemp
	 * @return
	 * @throws Exception
	 */
	public static String sendSMSInfo(Map<String, String> sParaTemp)
			throws Exception {
		return HttpSubmit.sendPostOrGetInfo(sParaTemp, SEND_SMS, "GET");// GET方式请求
	}
}
