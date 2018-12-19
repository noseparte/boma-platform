package com.xmbl.ops.util;

import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class UUIDTool {  
  
    public UUIDTool() {  
    }  
    /**  
     * 自动生成32位的UUid，对应数据库的主键id进行插入用。  
     * @return  
     */  
    public static String getUUID() {  
        /*UUID uuid = UUID.randomUUID();  
        String str = uuid.toString();  
        // 去掉"-"符号  
        String temp = str.substring(0, 8) + str.substring(9, 13)  
                + str.substring(14, 18) + str.substring(19, 23)  
                + str.substring(24);  
        return temp;*/  
          
        return UUID.randomUUID().toString().replace("-", "");  
    }  
  
  
    public static void main(String[] args) {  
//      String[] ss = getUUID(10);  
        for (int i = 0; i < 10; i++) {  
            System.out.println("ss[" + i + "]=====" + getUUID());  
        }  
    }  
    public static Map<String, String[]> parseQueryString(String queryString)
    {
    	Map<String, String[]> map=  new HashMap<String, String[]>();

    	String[] params = queryString.split("&");  
    	for (String param : params)  
    	{  
    		String name = param.split("=")[0];  
    		String[] value = param.split("=")[1].split(",");  
    		map.put(name, value);  
    	}  
    	return map;  
    }
    //request.getParameterMap() 转换为 Map<String, Object>
    public static Map<String, Object> getQueryParams(HttpServletRequest request) {
    	Map<String, String[]> map;
    	if (request.getMethod().equalsIgnoreCase("POST")) {
    		map = request.getParameterMap();
    	} else {
    		//为GET请求时就获取其请求参数的那段信息
    		String s = request.getQueryString();
    		if (StringUtils.isBlank(s)) {
    			return new HashMap<String, Object>();
    		}
    		try {
    			//将得到的HTML数据用UTF-8转码
    			s = URLDecoder.decode(s, "UTF-8");
    		} catch (UnsupportedEncodingException e) {

    		}
    		map = parseQueryString(s);
    	}


    	Map<String, Object> params = new HashMap<String, Object>(map.size());
    	int len;
    	for (Map.Entry<String, String[]> entry : map.entrySet()) {
    		len = entry.getValue().length;
    		if (len == 1) {
    			params.put(entry.getKey(), entry.getValue()[0]);
    		} else if (len > 1) {
    			params.put(entry.getKey(), entry.getValue());
    		}
    	}
    	return params;
    }
}  
