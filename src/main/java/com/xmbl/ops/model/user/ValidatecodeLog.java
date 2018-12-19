package com.xmbl.ops.model.user;

import lombok.Data;

import java.util.Date;
@Data
public class ValidatecodeLog {
    private Long id;

    private String userkey;

    private String type;

    private Integer code;

    private Date createtime;

    private Date updatetime;
    public ValidatecodeLog(){
    	super();
    }
    public ValidatecodeLog(String userkey,Integer code,String type){
    	this.userkey = userkey;
    	this.type = type ;
    	this.code = code;
    	this.createtime = new Date();
    	this.updatetime = new Date();
    }
}