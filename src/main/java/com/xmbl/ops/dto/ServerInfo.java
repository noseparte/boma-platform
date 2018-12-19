package com.xmbl.ops.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ServerInfo {

	private String _id;
	
	private Integer serverId; //服务器id
	
	private String name;  //服务器名
	
	private Long registerPlayerCount;//注册玩家数量
	
	private Long onlinePlayerCount; // 在线玩家数量
	
	private Long flushPlayerCount; // 缓存玩家数量
	
	private Long sceneCount;   // 存在场景数量  
	
	private Date createTime;
	    
	private Long createAt;
	
	private String createTimeStr;
	
	public ServerInfo() {
		super();
	}
}
