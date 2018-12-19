package com.xmbl.ops.model.payment;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;

import java.util.Date;

/**
 * Copyright © 2017 noseparte(Libra) © Like the wind, like rain
 * @Author Noseparte
 * @Compile 2017年11月3日 -- 下午3:17:40
 * @Version 1.0
 * @Description	提现记录
 */
@Data
public class TransferRecord extends GeneralBean{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private int userId; 					//用户ID	
	private String orderNo;					//订单编号
	private int thirdPayId;					//第三方支付ID
	private Double tansferBefore;			//订单交易前
	private Double tansferAmount;			//交易金额
	private Double tansferEnd;				//订单交易后
	private Date tansferTime;				//提现时间
	private int orderState;					//订单状态
	private String remark;					//备注
	
	public TransferRecord() {
		super();
	}
	
	public TransferRecord(int userId, String orderNo, int thirdPayId, Double tansferBefore,
			Double tansferAmount, Double tansferEnd, Date tansferTime, int orderState, String remark) {
		super();
		this.userId = userId;
		this.orderNo = orderNo;
		this.thirdPayId = thirdPayId;
		this.tansferBefore = tansferBefore;
		this.tansferAmount = tansferAmount;
		this.tansferEnd = tansferEnd;
		this.tansferTime = tansferTime;
		this.orderState = orderState;
		this.remark = remark;
	}

	
	
	
	
}
