package com.xmbl.ops.model.mongo.login;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  AppUserAuth 
 * @创建时间:  2018年5月30日 下午4:27:45
 * @修改时间:  2018年5月30日 下午4:27:45
 * @类说明: app 用户授权表
 */
@Data
@Document(collection="playerAuth")
public class PlayerAuth {
	
	@Id
	private String id;
	
	// app 用户玩家id
	@Field("playerId")
	private String playerId;
	
	// app 用户玩家名
	@Field("name")
	private String name;
	
	// 服务器Id
	@Field("serverId")
	private Integer serverId;
	
	// 用户权限组
	@Field("authList")
	private List<String> authList;

}
