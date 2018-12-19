package com.xmbl.ops.util.http;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;

import java.util.Map;

/* *
 *类名：AlipaySubmit
 *功能：支付宝各接口请求提交类
 *详细：构造支付宝各接口表单HTML文本，获取远程HTTP数据
 *版本：3.2
 *日期：2011-03-17
 *说明：
 *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 *该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
 */

public class HttpSubmit {

    /**
     * 生成要请求给支付宝的参数数组
     * @param sParaTemp 请求前的参数数组
     * @return 要请求的参数数组
     */
    private static Map<String, String> buildRequestPara(Map<String, String> sParaTemp) {
        //除去数组中的空值和签名参数
        Map<String, String> sPara = HttpCore.paraFilter(sParaTemp);
        return sPara;
    }

    /**
     * MAP类型数组转换成NameValuePair类型
     * @param properties  MAP类型数组
     * @return NameValuePair类型数组
     */
    private static NameValuePair[] generatNameValuePair(Map<String, String> properties) {
        NameValuePair[] nameValuePair = new NameValuePair[properties.size()];
        int i = 0;
        for (Map.Entry<String, String> entry : properties.entrySet()) {
            nameValuePair[i++] = new NameValuePair(entry.getKey(), entry.getValue());
        }

        return nameValuePair;
    }

    /**
     * 构造模拟远程HTTP的POST请求，获取支付宝的返回XML处理结果
     * @param sParaTemp 请求参数数组
     * @param gateway 网关地址
     * @return 支付宝返回XML处理结果
     * @throws Exception
     */
    public static String sendPostOrGetInfo(Map<String, String> sParaTemp, String gateway, String strMethod) throws Exception {
        //待请求参数数组
        Map<String, String> sPara = buildRequestPara(sParaTemp);

        HttpProtocolHandler httpProtocolHandler = HttpProtocolHandler.getInstance();

        HttpRequest request = new HttpRequest(HttpResultType.BYTES);
        //设置编码集
        request.setCharset(HttpConfig.input_charset);
        request.setMethod(strMethod);
        //如果是GET请求，设置请求字符串，如果是POST请求，设置Post请求参数：        
        if(strMethod.equals(HttpRequest.METHOD_GET))
        	request.setQueryString(HttpCore.createLinkString(sParaTemp));
        else
            request.setParameters(generatNameValuePair(sPara));
        request.setUrl(gateway);

        HttpResponse response = httpProtocolHandler.execute(request);
        if (response == null) {
            return null;
        }
        
        String strResult = response.getStringResult();

        return strResult;
    }
    
/**
 * RPC接口
 * @param sParaTemp
 * @param gateway
 * @param strMethod
 * @return
 * @throws Exception
 */
    public static String sendPostOrGetInfo_RPC(Map<String, String> sParaTemp, String gateway, String strMethod) throws Exception {
        //待请求参数数组
        Map<String, String> sPara = buildRequestPara(sParaTemp);
        PostMethod post = new PostMethod(gateway);  
        post.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");     
        post.setRequestBody(generatNameValuePair(sPara));  
        post.releaseConnection();  
        HttpMethod method =post;
        method.getParams().setContentCharset("UTF-8");
        HttpClient httpClient = new HttpClient(); 
        int intResult=httpClient.executeMethod(method);  
        
        if (intResult != 200) {
            return null;
        }       
        String strResult = method.getResponseBodyAsString();

        return strResult;
    }

}
