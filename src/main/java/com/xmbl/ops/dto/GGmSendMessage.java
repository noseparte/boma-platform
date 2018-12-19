package com.xmbl.ops.dto;

import lombok.Data;

@Data
public class GGmSendMessage {
	
	public Integer messageType;              // 消息类型
    public String msg;                      // 消息内容

	
	public GGmSendMessage() {
		super();
	}
}
