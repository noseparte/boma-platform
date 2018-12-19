package com.xmbl.ops.dto;

import lombok.Data;

import java.util.Date;

@Data
public class Account {
	private String id;
	
	private String channel;
	
	private String appid;
	
	private Integer serverIndex;
	
	private String uid;
	
	private String accessToken;
	
	private String password;
	
	private Date loginTime;
	
	private Long loginStamp;
	
    private Date registerTime;
	
	private Long registerStamp;
	
	private String gserverIp;
	
	private String gserverPort;
	
	private String frontEndIp;
	
	private String frontEndPort;
	
	public Account(){
		super();
	}
	
	public Account(String channel, String appid, String uid, Integer serverIndex) {
		this.channel = channel;
		this.appid = appid;
		this.serverIndex = serverIndex;
		this.uid = uid;
		this.loginTime = new Date();
		this.loginStamp = System.currentTimeMillis();
	}
	
	public Account(String id, String accessToken) {
		this.id = id;
		this.accessToken = accessToken;
	}
	
	public Account(String id, String accessToken, String ip, String port,String frontEndIp, String frontEndPort) {
		this.id = id;
		this.accessToken = accessToken;
		this.gserverIp = ip;
		this.gserverPort = port;
		this.frontEndIp = frontEndIp;
		this.frontEndPort = frontEndPort;
	}
	
	public Account(String id, String accessToken, String ip, String port) {
		this.id = id;
		this.accessToken = accessToken;
		this.gserverIp = ip;
		this.gserverPort = port;
	}
	
	public Account(String channel, String appid, String uid,String  password, Integer serverIndex) {
		this.channel = channel;
		this.appid = appid;
		this.serverIndex = serverIndex;
		this.uid = uid;
		this.password = password;
		this.loginTime = new Date();
		this.loginStamp = System.currentTimeMillis();
		this.registerTime = new Date();
		this.registerStamp = System.currentTimeMillis();
	}
}
