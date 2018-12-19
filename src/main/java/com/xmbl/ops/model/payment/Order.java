package com.xmbl.ops.model.payment;

import lombok.Data;

import java.util.Date;

@Data
public class Order {
    private String id;//自己平台的订单号

    private String channel;//渠道
    
    private String appId;//appId
    
	private Integer serverIndex;//游戏区服
	
	private String accountId;//平台账号id
	
	private String playerId;//游戏玩家id
	
	private String diviceId;//设备ID
	
	private String phoneType;//手机系统类型-ios,android
	
	private String clientVersion;//客户端版本号
	
    private String orderId;//第三方订单id
    
    private String amount;//充值金额
    
    private String payAmount;//实际充值金额
    
	private String orderStatus;	//必须	订单状态，TRADE_SUCCESS 代表成功
	
	private String payFee;	    //必须	第三方支付金额,单位为分,即0.01 米币。
	
	private String goodsCode;	//必须	商品代码
	
	private String goodsName;	//必须	商品名称
	
	private String goodsCount;	//必须	商品数量
	
	private String payTime;	//必须	支付时间,格式 yyyy-MM-dd HH:mm:ss
    
	private Integer status;//订单状态  0 支付成功   1待支付,  -1支付失败   -2 游戏服务器网络异常 
	
	private Date createTime;//创建时间
	
	private Long createStamp;
	
	private String description;	

	private String extraDesc;	
	
	private String operater;
	
	private Date updateTime;
	
	private Long updateStamp;
	
	private Long validTime;
	
	public Order(){
		super();
	}
	public Order(String rechargeId,String accountId,String playerId,String channel,String product_id,String price,String prodName,String description,String extra_desc){
		this.id = rechargeId;
		this.accountId = accountId;
		this.playerId = playerId;
		this.channel = channel;
		this.goodsCode = product_id;
		this.goodsName = prodName;
		this.payAmount = price;
		this.description = description;
		this.extraDesc =  extra_desc;
		this.status = 1;
		this.createTime = new Date();
		this.createStamp = System.currentTimeMillis();
		this.operater = "方块王国";
		this.updateTime = new Date();
		this.updateStamp = System.currentTimeMillis();
		this.validTime = 3600L;
		
	}
}
