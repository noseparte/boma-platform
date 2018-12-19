package com.xmbl.ops.dto;

import lombok.Data;

@Data
public class RpcServer {

	private String id;
	
	private String name;
	
	private Integer Index;
	
	private String rpcIp;
	
	private Integer rpcPort;
	
	private String frontEndIp;
	
	private Integer frontEndPort;
	
	public RpcServer() {
		super();
	}
}
