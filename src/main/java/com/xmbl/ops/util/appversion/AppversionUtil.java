package com.xmbl.ops.util.appversion;

import com.xmbl.ops.enumeration.EnumAppProject;
import com.xmbl.ops.enumeration.EnumAppProjectChannel;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  appversionUtil 
 * @创建时间:  2018年3月5日 下午6:33:19
 * @修改时间:  2018年3月5日 下午6:33:19
 * @类说明:
 */
public class AppversionUtil {
	
	/**
	 * 获取app版本项目名
	 * 
	 * @param projectCode 项目码
	 * @return
	 */
	public static String getAppProjectDesc(String projectCode) {
		for (EnumAppProject enumAppProject : EnumAppProject.values()){
			if (enumAppProject.getCode().equals(projectCode)) {
				return enumAppProject.getDesc();
			}
		}
		return "";
	}
	
	/**
	 * 获取项目版本渠道信息
	 * @param projectChannelCode
	 * @return
	 */
	public static String getAppProjectChannelDesc(String projectChannelCode) {
		for (EnumAppProjectChannel enumAppProjectChannel : EnumAppProjectChannel.values()){
			if (enumAppProjectChannel.getCode().equals(projectChannelCode)) {
				return enumAppProjectChannel.getDesc();
			}
		}
		return "";
	}
	
	
}
