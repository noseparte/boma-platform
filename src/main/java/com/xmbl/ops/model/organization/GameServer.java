package com.xmbl.ops.model.organization;

import lombok.Data;

import java.util.Date;
@Data
public class GameServer {
    private Long id;

    private Long serverid;

    private String servername;

    private String serverip;

    private String serverport;

    private Date creattime;

    private Byte status;
    
    private String statusForStr;
    
    private Date updatetime;

    private String operator;

    public GameServer() {
    	super();
    }
   
    public GameServer(Long serverid, String servername, String serverip, String serverport,
            Date creattime, Byte status, String operator) {
    	this.serverid = serverid;
    	this.servername = servername;
    	this.serverip = serverip;
    	this.serverport =  serverport;
    	this.creattime = creattime;
    	this.status = status;
    	this.updatetime = new Date();
    	this.operator = operator;
    }
    
    public GameServer(Long id, Long serverid, String servername, String serverip, String serverport,
            Date creattime, Byte status, String operator) {
    	this.id = id;
    	this.serverid = serverid;
    	this.servername = servername;
    	this.serverip = serverip;
    	this.serverport =  serverport;
    	this.creattime = creattime;
    	this.status = status;
    	this.updatetime = new Date();
    	this.operator = operator;
    }
    public GameServer(Long id, Byte status, String operator) {
    	this.id = id;
    	this.status = status;
    	this.updatetime = new Date();
    	this.operator = operator;
    }
}