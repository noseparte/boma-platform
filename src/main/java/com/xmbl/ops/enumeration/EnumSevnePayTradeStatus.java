package com.xmbl.ops.enumeration;

public enum EnumSevnePayTradeStatus {
	TRADE_FINISHED		(1, "交易成功", "true"),
	TRADE_SUCCESS		(2, "支付成功", "true"),
	WAIT_BUYER_PAY		(3, "交易创建", "true"),
	TRADE_CLOSED		(4, "交易关闭", "false");

	private EnumSevnePayTradeStatus(int id, String status, String description) {
		this.id = id;
		this.status = status;
		this.description = description;
	}
	
	private int id;
	private String status;
	private String description;
	
	public int value() {
		return id;
	}
	public String getStatus() {
		return status;
	}
	public String getDescription() {
		return description;
	}
}
