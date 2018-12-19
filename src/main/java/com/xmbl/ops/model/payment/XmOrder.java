package com.xmbl.ops.model.payment;

import lombok.Data;

import java.util.Map;

@Data
public class XmOrder {
	private String appId;	//必须	游戏ID
	private String cpOrderId;	//必须	开发商订单ID
	private String cpUserInfo;	//可选	开发商透传信息
	private String uid;	//必须	用户ID
	private String orderId;	//必须	游戏平台订单ID
	private String orderStatus;	//必须	订单状态，TRADE_SUCCESS 代表成功
	private String payFee;	//必须	支付金额,单位为分,即0.01 米币。
	private String productCode;	//必须	商品代码
	private String productName;	//必须	商品名称
	private String productCount;	//必须	商品数量
	private String payTime;	//必须	支付时间,格式 yyyy-MM-dd HH:mm:ss
	private String orderConsumeType;	//可选	订单类型：10：普通订单11：直充直消订单
	private String partnerGiftConsume;	//可选	使用游戏券金额 （如果订单使用游戏券则有,long型），如果有则参与签名
	private String signature;	//必须	签名,签名方法见后面说明
	
	public XmOrder(){
		super();
	}
	public XmOrder(Map<String, String> order) {
		// TODO Auto-generated constructor stub
		this.appId = order.get("appId");
		this.cpOrderId = order.get("cpOrderId");
		this.cpUserInfo = order.get("cpUserInfo");
		this.uid = order.get("uid");
		this.orderId = order.get("orderId");
		this.orderStatus = order.get("orderStatus");
		this.payFee = order.get("payFee");
		this.productCode = order.get("productCode");
		this.productName = order.get("productName");
		this.productCount = order.get("productCount");
		this.payTime = order.get("payTime");
		this.orderConsumeType = order.get("orderConsumeType");
		this.partnerGiftConsume = order.get("partnerGiftConsume");
		this.signature = order.get("signature");
	}
}
