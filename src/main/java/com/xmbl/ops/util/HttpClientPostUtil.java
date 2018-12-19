package com.xmbl.ops.util;

import com.alibaba.fastjson.JSONObject;
import com.xmbl.ops.dto.PostMethodResponse;
import com.xmbl.ops.dto.ResponseBodyResult;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.RequestEntity;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class HttpClientPostUtil {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(HttpClientPostUtil.class);

	/**
	 * httpClient 发送post请求json数据
	 * 
	 * @param url
	 *            url路径
	 * @param paramStr
	 *            json字符串
	 * @return
	 */
	public static ResponseBodyResult<PostMethodResponse> httpClientPost(String url, String paramStr) {
		ResponseBodyResult<PostMethodResponse> responseBodyResult = new ResponseBodyResult<PostMethodResponse>();
		PostMethodResponse postMethodResponse = new PostMethodResponse();
		
		long pushTimeB = System.currentTimeMillis();
		LOGGER.info(StringUtils.repeat("*", 50));
		LOGGER.info("httpClient 发送post请求json数据 开始...");

		HttpClient httpClient = new HttpClient();
		// 设置连接超时时间(单位毫秒)
		httpClient.getHttpConnectionManager().getParams()
				.setConnectionTimeout(60 * 1000);
		// 设置读取超时时间(单位毫秒)
		httpClient.getHttpConnectionManager().getParams()
				.setSoTimeout(60 * 1000);
		PostMethod method = new PostMethod(url);
		String info = "";
		String result = "";
		try {
			RequestEntity entity = new StringRequestEntity(paramStr,
					"application/json", "UTF-8");
			method.setRequestEntity(entity);
			httpClient.executeMethod(method);
			result = method.getResponseBodyAsString();
			LOGGER.info("返回报文：" + result);
			int code = method.getStatusCode();
			LOGGER.info("返回报文code：" + code);
			if (code == HttpStatus.SC_OK) {
				JSONObject resObj = JSONObject.parseObject(result);
				String result1= resObj.getString("Result");
				String content1 = resObj.getString("Content");
				postMethodResponse.setResult(result1);
				postMethodResponse.setContent(content1);
				if (result1=="1") {
					responseBodyResult.setSuccessMsg("返回报文成功!");
				} else {
					responseBodyResult.setSuccessMsg("返回报文失败!");
				}
				responseBodyResult.setT(postMethodResponse);
			} else {
				LOGGER.error("接口返回失败  httpStatusCode=" + code);
				postMethodResponse.setResult("2");
				postMethodResponse.setContent("调用接口网络异常");
				responseBodyResult.setErrorMsg("调用接口网络异常!");
				responseBodyResult.setT(postMethodResponse);
			}

		} catch (Exception ex) {
			responseBodyResult.setErrorMsg("内部接口报文发送异常 !"+ex.getMessage());
			postMethodResponse.setResult("2");
			postMethodResponse.setContent("调用接口内部接口发送异常");
			responseBodyResult.setT(postMethodResponse);
//			ex.printStackTrace();
		} finally {
			if (method != null) {
				method.releaseConnection();
			}
		}
		long pushTimeE = System.currentTimeMillis();
		LOGGER.info("httpClient 发送post请求json数据结束:用时:["
				+ (pushTimeE - pushTimeB) + "ms]");
		LOGGER.info(StringUtils.repeat("*", 50));
		return responseBodyResult;
	}

	/**
	 * httpClient 发送post请求参数方式
	 * 
	 * @param url
	 * @param paramMap
	 * @return
	 */
	public static ResponseBodyResult<PostMethodResponse> httpClientPost(String url, Map<String, Object> paramMap) {
		
		ResponseBodyResult<PostMethodResponse> responseBodyResult = new ResponseBodyResult<PostMethodResponse>();
		PostMethodResponse postMethodResponse = new PostMethodResponse();
		long pushTimeB = System.currentTimeMillis();
		LOGGER.info(StringUtils.repeat("*", 25));
		LOGGER.info("httpClient 发送post请求参数方式 开始...");
		
		HttpClient httpClient = new HttpClient();
		// 设置连接超时时间(单位毫秒)
		httpClient.getHttpConnectionManager().getParams()
				.setConnectionTimeout(60 * 1000);
		// 设置读取超时时间(单位毫秒)
		httpClient.getHttpConnectionManager().getParams()
				.setSoTimeout(60 * 1000);
		PostMethod method = new PostMethod(url);
		String result ="";
		try {
			for (String paramStr : paramMap.keySet()) {
				// map.keySet()返回的是所有key的值
				Object paramObject = paramMap.get(paramStr);// 得到每个key多对用value的值
				method.setParameter(paramStr, String.valueOf(paramObject));
				LOGGER.info(paramStr + StringUtils.repeat("*", 25)
						+ paramObject);
			}
			result = method.getResponseBodyAsString();
			LOGGER.info("返回报文：" + result);
			int code = method.getStatusCode();
			LOGGER.info("返回报文code：" + code);
			if (code == HttpStatus.SC_OK) {
				JSONObject resObj = JSONObject.parseObject(result);
				String result1= resObj.getString("Result");
				String content1 = resObj.getString("Content");
				postMethodResponse.setResult(result1);
				postMethodResponse.setContent(content1);
				if (result1=="1") {
					responseBodyResult.setSuccessMsg("返回报文成功!");
				} else {
					responseBodyResult.setErrorMsg("返回报文失败!");
				}
				responseBodyResult.setT(postMethodResponse);
			} else {
				LOGGER.error("接口返回失败  httpStatusCode=" + code);
				postMethodResponse.setResult("2");
				postMethodResponse.setContent("调用接口网络异常");
				responseBodyResult.setErrorMsg("调用接口网络异常!");
				responseBodyResult.setT(postMethodResponse);
			}
		} catch (Exception ex) {
			LOGGER.error("内部接口报文发送异常:" + ex.getMessage());
			responseBodyResult.setErrorMsg("内部接口报文发送异常 !"+ex.getMessage());
			postMethodResponse.setResult("2");
			postMethodResponse.setContent("调用接口内部接口发送异常");
			responseBodyResult.setT(postMethodResponse);
//			ex.printStackTrace();
		} finally {
			if (method != null) {
				method.releaseConnection();
			}
		}
		
		long pushTimeE = System.currentTimeMillis();
		LOGGER.info("httpClient 发送post请求参数方式 结束:用时:["
				+ (pushTimeE - pushTimeB) + "ms]");
		LOGGER.info(StringUtils.repeat("*", 25));
		return responseBodyResult;
	}

}
