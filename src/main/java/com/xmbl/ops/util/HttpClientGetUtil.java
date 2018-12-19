package com.xmbl.ops.util;

import net.sf.json.JSONObject;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLDecoder;

@Component
public class HttpClientGetUtil {
	private static final Logger LOGGER = LoggerFactory.getLogger(HttpClientGetUtil.class);
	/**
	 * 通过httpGet请求获取响应对象
	 * 
	 * @param url
	 * @return
	 */
	@SuppressWarnings("deprecation")
	public static String getHttpClientGet(String url) {
		
	        //get请求返回结果
	        JSONObject jsonResult = null;
	        try {
	            DefaultHttpClient client = new DefaultHttpClient();
	            //发送get请求
	            HttpGet request = new HttpGet(url);
	            HttpResponse response = client.execute(request);
	 
	            /**请求发送成功，并得到响应**/
	            if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
	                /**读取服务器返回过来的json字符串数据**/
	                String strResult = EntityUtils.toString(response.getEntity());
	                /**把json字符串转换成json对象**/
	                jsonResult = JSONObject.fromObject(strResult);
	                url = URLDecoder.decode(url, "UTF-8");
	                return strResult;
	            } else {
	            	LOGGER.error("get请求提交失败:" + url);
	            	return null;
	            }
	        } catch (IOException e) {
	        	LOGGER.error("get请求提交失败:" + url, e);
	        }
	        return null;
	}

}
