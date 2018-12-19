package com.xmbl.ops.interceptor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;


@Scope("prototype")
public class HandleAuthenticationInterceptor extends HandlerInterceptorAdapter {
	private static Logger logger = LoggerFactory.getLogger("xmbl_log");
	private static Logger perSlowLogger = LoggerFactory.getLogger("performance_slow_xmbl_log");
	private static Logger performanceLogger = LoggerFactory.getLogger("performance_xmbl_log");
	private static Integer CONTENT_LENGTH_LIMIT = 200 * 1024;
	
//	@Override
//	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
//		Long startTime = System.currentTimeMillis();
//		request.setAttribute("requestStartTime", startTime);
//		try {
//			int contentLength = request.getContentLength();
//			if (Integer.compare(contentLength, CONTENT_LENGTH_LIMIT) > 0) {
//				logger.info("请求超长,path:{}", new Object[] { request.getRequestURI()});
//				response.addHeader("location", CgiJumpController.ERROR_HTML_LOCATION + EnumResCode.ILLEGAL_REQUEST_ERROR.value());
//				response.setStatus(302);
//				return false;
//			}
//			printArgs(request);
//			Map<String, String> params = new HashMap<>();
//			Enumeration<String> paramNames = request.getParameterNames();
//			while(paramNames.hasMoreElements()) {
//				String key = paramNames.nextElement();
//				params.put(key, request.getParameter(key));
//			}
//			// 家校群APP ID：2
//			String appid = params.get("appid");
//			if(appid == null || Integer.parseInt(appid) != 2) {
//				if(appid == null) {
//					logger.error("appid验证出错,appid is null");
//				} else {
//					logger.error("appid验证出错,appid:{}", appid);
//				}
//				response.addHeader("location", CgiJumpController.ERROR_HTML_LOCATION + EnumResCode.ILLEGAL_APPID_ERROR.value());
//				response.setStatus(302);
//				return false;
//			}
//			if(!TencentSignUtil.veryfy(params, request.getParameter("sign"))) {
//				response.addHeader("location", CgiJumpController.ERROR_HTML_LOCATION + EnumResCode.ILLEGAL_SIGNATURE_ERROR.value());
//				response.setStatus(302);
//				return false;
//			}
//			logger.info("数字签名校验通过,path:{}", request.getRequestURI());
//			return true;
//		} catch (Exception e) {
//			logger.error("HandleAuthenticationInterceptor出错", e);
//			response.addHeader("location", CgiJumpController.ERROR_HTML_LOCATION + EnumResCode.ILLEGAL_SIGNATURE_ERROR.value());
//			response.setStatus(302);
//			return false;
//		}
//	}
//
//	@Override
//	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object obj, ModelAndView mav) throws Exception {
//		Long startTime = (Long) request.getAttribute("requestStartTime");
//		Long endTime = System.currentTimeMillis();
//		Long executeTime = endTime - startTime;
//		logger.info(EnumResMsg.REQ_URL.value() + request.getRequestURI() + ", invocation time: " + executeTime + "ms.");
//		Map<String, String[]> requestParams = request.getParameterMap();
//		ConcurrentHashMap<String, String> params = new ConcurrentHashMap<String, String>();
//		for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext();) {
//			String name = (String) iter.next();
//			String[] values = (String[]) requestParams.get(name);
//			String valueStr = "";
//			for (int i = 0; i < values.length; i++) {
//				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
//			}
//			params.put(name, valueStr);
//			
//		}
//		if (executeTime > 500) {
//			perSlowLogger.info("用户访问接口{},参数{}", request.getRequestURI(), params.toString());
//			perSlowLogger.info(EnumResMsg.REQ_URL.value() + request.getRequestURI() + ", invocation time: " + executeTime + "ms.");
//		}
//		performanceLogger.info("用户访问接口{},参数{}", request.getRequestURI(), params.toString());
//		performanceLogger.info(EnumResMsg.REQ_URL.value() + request.getRequestURI() + ", invocation time: " + executeTime + "ms.");
//	}
//
//	private void printArgs(HttpServletRequest request) {
//		Map<String, String[]> requestParams = request.getParameterMap();
//		ConcurrentHashMap<String, String> params = new ConcurrentHashMap<String, String>();
//		for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext();) {
//			String name = (String) iter.next();
//			String[] values = (String[]) requestParams.get(name);
//			String valueStr = "";
//			for (int i = 0; i < values.length; i++) {
//				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
//			}
//			params.put(name, valueStr);
//		}
//		logger.info("用户访问接口{},参数{}", request.getRequestURI(), params.toString());
//		if(request.getHeader("Referer") != null)
//			logger.info("Referer:{}", request.getHeader("Referer"));
//	}

}
