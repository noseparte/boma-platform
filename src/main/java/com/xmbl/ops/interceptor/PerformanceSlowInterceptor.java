package com.xmbl.ops.interceptor;

import com.xmbl.ops.enumeration.EnumResMsg;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Scope("prototype")
public class PerformanceSlowInterceptor extends HandlerInterceptorAdapter {
	private static Logger logger = LoggerFactory.getLogger("xmbl_log");
	private static Logger perSlowLogger = LoggerFactory.getLogger("performance_slow_xmbl_log");
	private static Logger performanceLogger = LoggerFactory.getLogger("performance_xmbl_log");

	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		Long startTime = System.currentTimeMillis();
		request.setAttribute("requestStartTime", startTime);
		printArgs(request);
		return true;
	}
	
	private void printArgs(HttpServletRequest request) {
		Map<String, String[]> requestParams = request.getParameterMap();
		ConcurrentHashMap<String, String> params = new ConcurrentHashMap<String, String>();
		for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
			}
			params.put(name, valueStr);

		}
		logger.info("用户访问接口{},参数{}", request.getRequestURI(), params.toString());
	}
	
	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object obj, ModelAndView mav) throws Exception {
		Long startTime = (Long) request.getAttribute("requestStartTime");
		Long endTime = System.currentTimeMillis();
		Long executeTime = endTime - startTime;
		logger.info(EnumResMsg.REQ_URL.value() + request.getRequestURI() + ", invocation time: " + executeTime + "ms.");
		Map<String, String[]> requestParams = request.getParameterMap();
		ConcurrentHashMap<String, String> params = new ConcurrentHashMap<String, String>();
		for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
			}
			params.put(name, valueStr);
			
		}
		if (executeTime > 500) {
			perSlowLogger.info("用户访问接口{},参数{}", request.getRequestURI(), params.toString());
			perSlowLogger.info(EnumResMsg.REQ_URL.value() + request.getRequestURI() + ", invocation time: " + executeTime + "ms.");
		}
		performanceLogger.info("用户访问接口{},参数{}", request.getRequestURI(), params.toString());
		performanceLogger.info(EnumResMsg.REQ_URL.value() + request.getRequestURI() + ", invocation time: " + executeTime + "ms.");
	}

}
