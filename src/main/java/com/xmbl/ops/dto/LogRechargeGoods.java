package com.xmbl.ops.dto;

import lombok.Data;

import java.util.Date;

/**
 * 充值统计-商品消费统计情况
 * @author sunbenbao
 *
 */
@Data
public class LogRechargeGoods {
	 private String _id;//唯一id
	 private String date;//日期
	 private Date javaDate;// java 日期时间
	 private Long tick; //c#时间戳
	 private Integer scale1;//商品1数量
	 private Integer scale2;//商品2数量
	 private Integer scale3;//商品3数量
	 private Integer scale4;//商品4数量
	 private Integer scale5;//商品5数量
	 private Integer scale6;//商品6数量
}
