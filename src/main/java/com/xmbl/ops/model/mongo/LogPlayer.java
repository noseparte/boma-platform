package com.xmbl.ops.model.mongo;

import lombok.Data;

import java.util.Date;

@Data
public class LogPlayer {
		//唯一id
	 	private String _id;
	 	//日期
	 	private String date;
	 	 //c#时间戳
	 	private Long tick;
	 	// java 日期时间
	 	private Date javaDate;
	 	//注册总人数
		private Long totalRegister;
		//今日注册人数
		private Long todayRegister;
		//今日登陆人数
		private Long todayLogin;
		//1日留存
		private String day1; 
		// 1日留存百分数
		private String day1Str;
		//2日留存
		private String day2; 
		// 2日留存百分数
		private String day2Str;
		//3日留存
		private String day3; 
		// 3日留存百分数
		private String day3Str;
		//4日留存
		private String day4; 
		// 4日留存百分数
		private String day4Str;
		 //5日留存
		private String day5;
		// 1日留存百分数
		private String day5Str;
		//6日留存
		private String day6; 
		// 1日留存百分数
		private String day6Str;
		//7日留存
		private String day7; 
		// 7日留存百分数
		private String day7Str;
		 //30日留存
		private String day30;
		// 30日留存百分数
	    private String day30Str;
	    
	    // ###
	    // 日留存setter方法
	    public void setDayNStr() {
	    	if (this.day1!=null && !"".equals(this.day1)) {
	    		this.day1Str = Double.parseDouble(this.day1) * 100 + "";
	    	} else {
	    		this.day1Str = "0";
	    	}
	    	if (this.day2!=null && !"".equals(this.day2)) {
	    		this.day2Str = Double.parseDouble(this.day2) * 100 + "";
	    	} else {
	    		this.day2Str = "0";
	    	}
	    	if (this.day3!=null && !"".equals(this.day3)) {
	    		this.day3Str = Double.parseDouble(this.day3) * 100 + "";
	    	} else {
	    		this.day3Str = "0";
	    	}
	    	if (this.day4!=null && !"".equals(this.day4)) {
	    		this.day4Str = Double.parseDouble(this.day4) * 100 + "";
	    	} else {
	    		this.day4Str = "0";
	    	}
	    	if (this.day5!=null && !"".equals(this.day5)) {
	    		this.day5Str = Double.parseDouble(this.day5) * 100 + "";
	    	} else {
	    		this.day5Str = "0";
	    	}
	    	if (this.day6!=null && !"".equals(this.day6)) {
	    		this.day6Str = Double.parseDouble(this.day6) * 100 + "";
	    	} else {
	    		this.day6Str = "0";
	    	}
	    	if (this.day7!=null && !"".equals(this.day7)) {
	    		this.day7Str = Double.parseDouble(this.day7) * 100 + "";
	    	} else {
	    		this.day7Str = "0";
	    	}
	    	if (this.day30!=null && !"".equals(this.day30)) {
	    		this.day30Str = Double.parseDouble(this.day30) * 100 + "";
	    	} else {
	    		this.day30Str = "0";
	    	}
	    }
}
