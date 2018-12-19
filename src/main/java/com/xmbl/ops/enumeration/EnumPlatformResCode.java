package com.xmbl.ops.enumeration;

public enum EnumPlatformResCode {
	SUCCESSFUL					(0, "请求执行成功"),
	PARAMETER_FORMAT_ERROR		(100, "缺少参数/参数格式不正确"),
	PASSWORD_ERROR		        (101, "账号密码错误"),
	ILLEGAL_REQUEST_ERROR		(200, "请求非法"),
	INEXISTENT_CMD_ERROR		(300, "命令字不存在"),
	ILLEGAL_APPID_ERROR			(301, "appid不存在，非法"),
	ILLEGAL_SIGNATURE_ERROR		(302, "签名校验不通过"),
	SYSTEM_INTERNAL_ERROR		(500, "系统内部错误，请稍后再试"),
	LOGIN_INTERNAL_ERROR		(501, "登录失败"),
	SYSTEM_BUSY_ERROR			(503, "系统繁忙，请稍后再试");

	private EnumPlatformResCode(int status, String description) {
		this.status = status;
		this.description = description;
	}
	
	private int status;
	private String description;

	public int value() {
		return status;
	}
	public String getDescription() {
		return description;
	}
}
