package com.xmbl.ops.util;

import com.xmbl.ops.enumeration.EnumReportCauseCode;
import com.xmbl.ops.enumeration.EnumReportCode;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  ReportUtil 
 * @创建时间:  2017年12月27日 上午11:20:51
 * @修改时间:  2017年12月27日 上午11:20:51
 * @类说明: 举报工具类
 */
@Component
public class ReportUtil {

	/**
	 * 是否存在某报告码
	 * @param numcode
	 * @return
	 */
	public static boolean isExsitReportCode(String numcode) {
		if (StringUtils.isBlank(numcode)) {
			return false;
		}
		for (EnumReportCode enumReportCode : EnumReportCode.values()) {
			if (numcode.equals(enumReportCode.getNumcode())) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 获取举报报告码信息
	 * @return
	 */
	public static EnumReportCode getReportCodeInfo(String numcode) {
		if (StringUtils.isBlank(numcode)) {
			return null;
		}
		for (EnumReportCode enumReportCode : EnumReportCode.values()) {
			if (numcode.equals(enumReportCode.getNumcode())) {
				return enumReportCode;
			}
		}
		return null;
	}
	
	public static String getReportCodeInfoDesc(String numcode) {
		if (StringUtils.isBlank(numcode)) {
			return "未知举报类型";
		}
		for (EnumReportCode enumReportCode : EnumReportCode.values()) {
			if (numcode.equals(enumReportCode.getNumcode())) {
				return enumReportCode.getDesc();
			}
		}
		return "未知举报类型";
	}
	
	/**
	 * 是否存在举报原因码
	 * @param numcode
	 * @return
	 */
	public static boolean isExsitReportCauseCode(String numcode) {
		if (StringUtils.isBlank(numcode)) {
			return false;
		}
		for (EnumReportCauseCode enumReportCauseCode : EnumReportCauseCode.values()) {
			if (numcode.equals(enumReportCauseCode.getNumcode())) {
				return true;
			}
		}
		return false;
	}
	
	/**
	 * 获取举报原因信息
	 * @return
	 */
	public static EnumReportCauseCode getReportCauseCodeInfo(String numcode) {
		if (StringUtils.isBlank(numcode)) {
			return null;
		}
		for (EnumReportCauseCode enumReportCauseCode : EnumReportCauseCode.values()) {
			if (numcode.equals(enumReportCauseCode.getNumcode())) {
				return enumReportCauseCode;
			}
		}
		return null;
	}
	
	public static String getReportCauseCodeInfoDesc(String numcode) {
		if (StringUtils.isBlank(numcode)) {
			return "未知举报原因";
		}
		for (EnumReportCauseCode enumReportCauseCode : EnumReportCauseCode.values()) {
			if (numcode.equals(enumReportCauseCode.getNumcode())) {
				return enumReportCauseCode.getDesc();
			}
		}
		return "未知举报原因";
	}
}
