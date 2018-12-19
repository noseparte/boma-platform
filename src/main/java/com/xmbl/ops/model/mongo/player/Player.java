package com.xmbl.ops.model.mongo.player;

import lombok.Data;

import java.util.List;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  Player 
 * @创建时间:  2018年1月16日 下午5:26:29
 * @修改时间:  2018年1月16日 下午5:26:29
 * @类说明: 游戏服务器玩家具体信息
 */
@Data
public class Player {
	private Long id;
	private String name;
	private Integer level;
	private Integer sid;
	private Integer csId;
	private Integer ll;
	private Integer ls;
	private String avatar;
	private Boolean needGuild;
	private Integer model;
	private Integer nationality;
	private String signature;
	private List<Integer> avaters;
}
