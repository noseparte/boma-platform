package com.xmbl.ops.dto;

import com.xmbl.ops.util.DateUtils;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

/**
 * 服务器在线实时状态
 * 
 * @author sunbenbao
 *
 */
public class GPServerInfo implements Serializable {

	private static final long serialVersionUID = 594838870390262675L;

	//服务器id
	@Setter
	@Getter
	private Integer ServerId; 
	
	 //服务器名
	@Setter
	@Getter
	private String ServerName; 
	
	// 启动时间
	@Setter
	@Getter
	private long StartTick;
	
	// 帧率:每秒有多少个画面或有多少次请求,就有多少个帧率
	@Setter
	@Getter
	private int Fps;
	
	// 内存 B，KB，MB，GB，TB，PB，EB，ZB，YB 使用单位kb
	@Setter
	@Getter
	private long Memory;
	
	// cpu Hz（赫）、kHz（千赫）、MHz（兆赫）、GHz（吉赫）
	// 占总cpu百分比
	@Setter
	@Getter
	private float Cpu;
	
	// 线程
	@Setter
	@Getter
	private double Thread;
	
	// cpu占比字符串 如:5.4%
	@Getter
	@Setter
	private String cpuStr;
	
	// startTick 时间
	@Getter
	@Setter
	private String startTickForJavaDateStr;
	
	// 0 正常(绿)  1 本地未配置服务器(黄)  2 远端rpc没有响应数据 （橙） 3 调用远端rpc异常响应(本地代码或远橙rpc服务器不存在等异常报错)(红)  
	@Getter
	@Setter
	private String status = "0";
	// getter and setter
	
	/**
	 * 获取cpu百分比占用
	 */
	public void setCpuStr() {
		if (this.Cpu<0) {
			this.cpuStr = "0%";
		} else {
			StringBuffer sb = new StringBuffer();
			sb.append(this.Cpu).append("%");
			this.cpuStr = sb.toString();
		}
	}

	/**
	 * 获取startTick 转 java 时间
	 */
	public void setStartTickForJavaDateStr() {
		long javaDateTimeMillis = DateUtils.getJavaCurrentTimeMillisByCCurrentTimeMillis(this.StartTick);
		Date date = DateUtils.getDateByDateTimeMillis(javaDateTimeMillis);
		if (date != null) {// 传值无误
			String formatDateStr = DateUtils.formatDate(date);
			this.startTickForJavaDateStr = formatDateStr;
		} else {
			this.startTickForJavaDateStr = "";
		}
	}
	
//	public static void main (String[] args) {
//		long javaDateTimeMillis = DateUtils.getJavaCurrentTimeMillisByCCurrentTimeMillis(636408614619855119l);
//		Date date = DateUtils.getDateByDateTimeMillis(javaDateTimeMillis,"yyyy-MM-dd HH:mm:ss");
//		if (date != null) {// 传值无误
//			String formatDateStr = DateUtils.formatDate(date);
//			System.out.println(formatDateStr);
//		}
//	}
	
}
