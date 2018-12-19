package com.xmbl.ops.model.mongo;

import lombok.Data;

import java.util.Date;

@Data
public class Files {
    private String _id;//唯一id
	private String name;//文件名
	private String pathUrl;//文件路径
	private String type;//类型
	private Date createTime;//时间
	private Long createAt;
	private Integer status;//状态  0 正常  -1 删除  
	private String operator;//操作人
	private Date updateTime;
	private Long updateAt;
	private String createTimeStr;
	private String statusStr;
	
	public Files(){
		super();
	}
	
	public Files(String id, String name,
			String pathUrl, String type,Integer status, Date create_time, String operator){
		this._id = id;
    	this.name = name;
    	this.pathUrl = pathUrl;
    	this.type = type;
    	this.status = status;
    	this.createTime= create_time;
		this.createAt= create_time.getTime();
    	this.updateTime = new Date();
    	this.updateAt = System.currentTimeMillis();
    	this.operator = operator;
	}
	public Files(String name,
			String pathUrl, String type, Integer status, Date create_time, String operator){
    	this.name = name;
    	this.pathUrl = pathUrl;
    	this.type = type;
    	this.status = status;
    	this.createTime= create_time;
		this.createAt= create_time.getTime();
    	this.updateTime = new Date();
    	this.updateAt = System.currentTimeMillis();
    	this.operator = operator;
	}
	
    public Files(String id, Integer status, String operator) {
    	this._id = id;
    	this.status = status;
    	this.updateTime = new Date();
    	this.updateAt = System.currentTimeMillis();
    	this.operator = operator;
    }
	
	
}
