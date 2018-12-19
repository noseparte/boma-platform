package com.xmbl.ops.model.mongo;

import lombok.Data;

import java.util.Date;

@Data
public class LogRecharge {
	 private String _id;//唯一id
	 private String date;//日期
	 private Date javaDate;// java 日期时间
	private Long totalRecharge;//总充值
	private Long todayRecharge;//今日充值数
	private Integer todayRechargePlayerNum;//充值人数
	private Integer scale1;//商品1数量
	private Integer scale2;//商品2数量
	private Integer scale3;//商品3数量
	private Integer scale4;//商品4数量
	private Integer scale5;//商品5数量
	private Integer scale6;//商品6数量
	private Long tick; //c#时间戳
}
