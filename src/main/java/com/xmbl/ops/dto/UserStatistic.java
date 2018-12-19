package com.xmbl.ops.dto;

import lombok.Data;

@Data
public class UserStatistic {
	//唯一id
 	private String _id;
 	//日期
 	private String date;
 	// 类型 0 1 2
 	private String type;
 	// 注册人数
 	private Long number;

 	// 	//注册总人数
//	private Long totalRegister;
//	//今日注册人数
//	private Long todayRegister;
//	//今日登陆人数
//	private Long todayLogin;
}
