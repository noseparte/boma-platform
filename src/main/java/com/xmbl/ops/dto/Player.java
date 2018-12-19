package com.xmbl.ops.dto;

import lombok.Data;

@Data
public class Player {
	
	private Long  playerId;
	
	private String playName;
	
	private Long id;                         // 角色ID
	private String name;                     // 角色名称
	private Integer clazz;                   // 角色职业
	private Integer sex;                         // 角色性别
	private Integer accountId;                   // 账号ID
	private Integer serverId;                    // 服务器ID
	private Integer isDeleted;                   // 角色删除标示
	private Boolean isNew;                   // 角色新建标示    

    //这些数据是会变化的， 需要更新
	private Integer fightingForce;               // 角色战斗力
	private Integer level;                       // 角色等级
	private Integer rebirthLevel;                // 角色转生等级
	private Integer sceneId;                     // 所在场景
	private Integer militaryRank;                // 军衔
	private Integer achievementLevel;            // 成就等级
	private Boolean online;                  // 在线标示
	private String activePetName;            // 当前宠物名称
	
	public Player() {
		super();
	}
	
	public Player(Long Id,String Name,Integer Clazz) {
		this.id = Id;
		this.name = Name;
		this.clazz = Clazz;
	}
	
	public Player(Long playerId, String playName, Integer Clazz, Integer Sex,Integer AccountId,Integer ServerId
			,Integer IsDeleted ) {
		this.playerId = playerId;
		this.playName = playName;
		this.clazz = Clazz;
		this.sex = Sex;
		this.accountId = AccountId;
		this.serverId = ServerId;
		this.isDeleted = IsDeleted;
	}
}
