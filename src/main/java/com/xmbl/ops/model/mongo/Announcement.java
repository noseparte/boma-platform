package com.xmbl.ops.model.mongo;

import lombok.Data;
import org.bson.types.ObjectId;

import java.util.Date;

@Data
public class Announcement {
	private ObjectId _id;
	private String content;//公告内容
	private Integer type; //公告类型
	private Long index;//服务器id
	private String name;//服务器名
	private Date createTime;//发送时间
	private Long createAt;
	private Integer status;//发送状态  0 成功 1待发送 2正在发送 -1 发送失败  -2 网络超时
	private String operator;//操作人
	private Date updateTime;
	private Long updateAt;
	private String createTimeStr;
	private String typeStr;
	private String statusStr;
	
	public Announcement(){
		super();
	}
	
	public Announcement(Long index, Integer type, String content, Date create_time, String operator){
		this.index= index;
		this.type= type;
		this.content= content;
		this.status = 1;
		this.createTime= create_time;
		this.createAt= create_time.getTime();
		this.operator= operator;
		this.updateTime= new Date();
		this.updateAt= System.currentTimeMillis();
	}
}
