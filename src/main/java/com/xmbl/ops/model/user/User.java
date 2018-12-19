package com.xmbl.ops.model.user;

import lombok.Data;

import java.util.Date;
import java.util.UUID;
/**
 * 备注: 登录服务器app用户表 请使用com.xmbl.ops.model.mongo.login.AppUser 表
 * 
 */
@Data
public class User {
	
	private String id;
	
    private String accountid;
    
    private String createid;

    private String password;

    private String userkey;

    private Integer validatecode;

    private String type;

    private Integer status;

    private Date createtime;

    private Date updatetime;

	private String accessToken;
	
    private String serverid;
    
    private Integer logincnt = 0;
    
    public User(){
    	super();
    }
    
    public User(String userkey,String password,Integer validatecode,String type){
    	this.accountid = UUID.randomUUID().toString();
    	this.userkey = userkey;
    	this.password = password;
    	this.type = type ;
    	this.validatecode = validatecode;
    	this.createtime = new Date();
    	this.updatetime = new Date();
    	this.status = 0 ;
    }
    
    public User(String userkey,String password,Integer validatecode,String type, Integer status){
    	this.accountid = UUID.randomUUID().toString();
    	this.userkey = userkey;
    	this.password = password;
    	this.type = type ;
    	this.validatecode = validatecode;
    	this.createtime = new Date();
    	this.updatetime = new Date();
    	this.status = status ;
    }
    public User(String userkey,String password,String type, Integer status){
    	this.accountid = UUID.randomUUID().toString();
    	this.userkey = userkey;
    	this.password = password;
    	this.type = type ;
    	this.createtime = new Date();
    	this.updatetime = new Date();
    	this.status = status ;
    }
    public User(String userkey,String password,String type){
    	this.accountid = UUID.randomUUID().toString();
    	this.userkey = userkey;
    	this.password = password;
    	this.type = type ;
    	this.createtime = new Date();
    	this.updatetime = new Date();
    	this.status = 0 ;
    }
    public User(String userkey,String password){
    	this.userkey = userkey;
    	this.password = password;
    }
    
    public User(String accountid,String userkey,String password,String type){
    	this.accountid = accountid;
    	this.userkey = userkey;
    	this.password = password;
    	this.type = type ;
    	this.updatetime = new Date();
    }
}