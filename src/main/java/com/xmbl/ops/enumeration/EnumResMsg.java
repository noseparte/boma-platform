package com.xmbl.ops.enumeration;

public enum EnumResMsg {
	SERVER_WRONG_TEXT("网络有点慢，一会就好"),
	REQ_URL("reqUrl:"),
	REMOTE_URL("remoteUrl:"),
	SERVER_DECRYPT_MSG("91xuexibao.com");
	private String msg;

	private EnumResMsg(String msg) {
		this.msg = msg;
	}

	public String value() {
		return msg;
	}
}
