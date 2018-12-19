package com.xmbl.ops.model.organization;

import lombok.Data;

import java.util.Date;
@Data
public class UserLog {
    private Long id;

    private String loginName;

    private String loginIp;

    private Date createtime;

    private Date updatetime;

    private String operation;

    private Byte logLevel;
    
    public UserLog(){
 		super();
 	}
    public UserLog(String loginName, String loginIp,Date createtime, Date updatetime, String operation, Byte logLevel){
    	this.loginName = loginName;
    	this.loginIp = loginIp;
    	this.createtime = new Date();
    	this.updatetime = new Date();
    	this.operation = operation;
    	this.logLevel = logLevel;
 	}
}