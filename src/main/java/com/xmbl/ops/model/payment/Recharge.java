package com.xmbl.ops.model.payment;

import lombok.Data;

import java.util.Date;

@Data
public class Recharge {
    private String id;//自己平台的订单号

    private String channel;//渠道
    
    private String appid;//appId
    
	private Integer serverIndex;//游戏区服
	
	private String accountId;//平台账号id
	
	private String diviceId;//设备ID
	
	private String phoneType;//手机系统类型-ios,android
	
	private String clientVersion;//客户端版本号
	
    private String orderId;//第三方订单id
    
    private Integer amount;//充值金额
    
    private Integer payAmount;//实际充值金额
    
	private String orderStatus;	//必须	订单状态，TRADE_SUCCESS 代表成功
	
	private String payFee;	    //必须	第三方支付金额,单位为分,即0.01 米币。
	
	private String goodsCode;	//必须	商品代码
	
	private String goodsName;	//必须	商品名称
	
	private String goodsCount;	//必须	商品数量
	
	private String payTime;	//必须	支付时间,格式 yyyy-MM-dd HH:mm:ss
    
	private String uid;//第三方账号id
	
	private Integer status;//订单状态0成功 -1失败 -2 游戏服务器网络异常 
	
	private Date createTime;//创建时间
	
	private Long createStamp;
	
	public Recharge(String rechargeId, String accountId,Integer serverIndex,String  channel,String  uid,String  diviceId,String  phoneType, String clientVersion, XmOrder xmorder) {
		this.id = rechargeId;
		this.accountId = accountId;
		this.serverIndex = serverIndex;
		this.channel = channel;
		this.uid = uid;
		this.appid = xmorder.getAppId();
		this.orderId = xmorder.getOrderId();
		this.amount = Integer.valueOf(xmorder.getPayFee());
		this.payAmount = Integer.valueOf(xmorder.getPayFee());
		this.orderStatus = xmorder.getOrderId();
		this.payFee = xmorder.getOrderId();
		this.goodsCode = xmorder.getProductCode();
		this.goodsName = xmorder.getProductName();
		this.goodsCount = xmorder.getProductCount();
		this.payTime = xmorder.getPayTime();
		
		this.diviceId = diviceId;
		this.phoneType = phoneType;
		this.clientVersion = clientVersion;
		this.status = 1;
		this.createTime = new Date();
		this.createStamp = System.currentTimeMillis();
	}
			
}
