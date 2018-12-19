package com.xmbl.ops.model.mongo;

import lombok.Data;
import org.bson.types.ObjectId;

@Data
public class PlayerMgr {
	 private ObjectId _id;//唯一id
	 private Long playerId;//玩家playerId
	 private String name;//玩家昵称
	 private Long login ;//登陆时间
	 private Long logoff; //下线时间
	 private Long loginTimes;//登陆次数
	 private Long loginTime;//在线时长
	  
	 private String logoffStr;
	 private String loginStr;
	 
	 private int sid;
	 private int csId;
	 private int ll;
	 private int ls;
	 private int ladderSore;
	 private String avatar;
	
	 private Long createTick;
	 private String li;
	 private String lf;
	 private String ct;
	 
	 public PlayerMgr(){
		 super();
	 }
} 
	
