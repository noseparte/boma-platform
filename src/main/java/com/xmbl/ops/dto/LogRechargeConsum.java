package com.xmbl.ops.dto;

import lombok.Data;

import java.util.Date;

/**
 * 充值统计-金额消费统计情况
 * @author sunbenbao
 *
 */
@Data
public class LogRechargeConsum {
	private String _id;// 唯一id
	private Long tick; // c#时间戳
	private String date;// 日期
	private Date javaDate;// java 日期时间
	private String type;// 消费类型
	private String number;// 金额数/充值人数
	private String unit;
//	private Long totalRecharge;// 总充值
//	private Long todayRecharge;// 今日充值数
//	private Integer todayRechargePlayerNum;// 充值人数
}
