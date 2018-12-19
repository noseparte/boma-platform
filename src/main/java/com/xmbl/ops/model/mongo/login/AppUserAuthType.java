package com.xmbl.ops.model.mongo.login;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  appUserAuthType 
 * @创建时间:  2018年5月30日 下午4:32:51
 * @修改时间:  2018年5月30日 下午4:32:51
 * @类说明: app 用户授权类型字典
 * 
 * 备注: 
 * 		1.评论      ：玩家可以在游戏中发表评论
 * 		2.创建比赛  ：玩家可以在游戏中创建比赛	
 * 		3.上传关卡  ：玩家可以在游戏中上传关卡
 * 		4.上传关卡集：玩家可以在游戏中上传关卡集
 * 		5.创建挑战  ：玩家可以在游戏中创建挑战
 * 		6.推荐功能  ：玩家可以在游戏中对关卡进行推荐
 */
@Data
@Document(collection="app_user_auth_type")
public class AppUserAuthType {
	@Id
	private String id;
	// 创建人
	@Field("create_by")
	private String create_by;
	// 创建时间
	@Field("create_date")
	private Date create_date;
	// 修改人
	@Field("update_by")
	private String update_by;
	// 修改时间
	@Field("update_date")
	private Date update_date;
	// 授权类型编号 1 2 3 4 5 6 做正整数验证，可以设置标号。该编号决定在授权列表上的排序 值越小越靠前
	@Field("show_num")
	private Integer show_num;
	// 授权类型名称 (目前支持的类别: 评论 创建比赛 上传关卡 上传关卡集 创建挑战 推荐功能)支持模糊查询 
	@Field("name")
	private String name;
	// 默认状态 -1 删除  0 禁用 1开启 
	// 玩家刚创建游戏账号，默认开启前4种功能 期限为永久（评论、创建比赛、上传关卡、上传关卡集)
	// 创建比赛、推荐功能默认为禁止，期限为永久
	@Field("default_status")
	private Integer default_status = 0;
	
	public AppUserAuthType(String create_by, Date create_date, String update_by, Date update_date, Integer show_num,
			String name, Integer default_status) {
		super();
		this.create_by = create_by;
		this.create_date = create_date;
		this.update_by = update_by;
		this.update_date = update_date;
		this.show_num = show_num;
		this.name = name;
		this.default_status = default_status;
	}
	
	
}
