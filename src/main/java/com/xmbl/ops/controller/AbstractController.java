package com.xmbl.ops.controller;

import com.xmbl.ops.constant.SessionConstant;
import com.xmbl.ops.dto.ResponseResult;
import com.xmbl.ops.enumeration.EnumResCode;
import com.xmbl.ops.web.api.bean.PageData;
import com.xmbl.ops.web.api.bean.Response;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.UnsupportedEncodingException;

public abstract class AbstractController {

	 /**
     * 获取当前用户名称
     * @return
     */
    public String getUserName() {
        try {
            HttpSession session = this.getRequest().getSession();
            return (String) session.getAttribute(SessionConstant.USER_NAME);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
	
	public ModelAndView getModelAndView() {
		return new ModelAndView();
	}
	
	public Response getResponse() {
		return new Response();
	}

	/**
	 * 得到PageData
	 */
	public PageData getPageData() {
		try {
			return new PageData(this.getRequest());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 得到request对象
	 */
	public HttpServletRequest getRequest() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		return request;
	}
	
	
	protected ResponseResult successJson(Object data) {
		ResponseResult result = new ResponseResult();
		result.setStatus(EnumResCode.SUCCESSFUL.value());
		result.setMsg("ok");
		result.setResult(data);
		return result;
	}
	protected ResponseResult DatatoJson(Object data) {
		ResponseResult result = new ResponseResult();
		result.setResult(data);
		return result;
	}
	protected ResponseResult successSaveJson(Object data) {
		ResponseResult result = new ResponseResult();
		result.setStatus(EnumResCode.SERVER_SUCCESS.value());
		result.setMsg("ok");
		result.setResult(data);
		return result;
	}
	
	protected ResponseResult successSaveJson() {
		return successJson(null);
	}
	
	protected ResponseResult successJson() {
		return successJson(null);
	}

	protected ResponseResult errorJson(int status, String message) {
		ResponseResult result = new ResponseResult();
		result.setStatus(status);
		result.setMsg(message);
		return result;
	}
	
	protected ResponseResult errorJson(Object data) {
		ResponseResult result = new ResponseResult();
		result.setStatus(EnumResCode.SERVER_ERROR.value());
		result.setMsg("error");
		result.setResult(data);
		return result;
	}
	
	protected ResponseResult errorJson(String message) {
		ResponseResult result = new ResponseResult();
		result.setStatus(EnumResCode.SERVER_ERROR.value());
		result.setMsg(message);
		return result;
	}
	
}
