package com.xmbl.ops.model.mongo.player;

import com.xmbl.ops.util.DateUtils;
import lombok.Data;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  PlayerMgr 
 * @创建时间:  2018年1月16日 下午5:14:37
 * @修改时间:  2018年1月16日 下午5:14:37
 * @类说明: 游戏服 玩家角色信息表  
 *  备注 : 该表平台不做删除修改操作。 只能查询
 */
@Data
public class PlayerMgr {
	private String id;
	 // 玩家ID
	private Long playerId;
	// 玩家名称
	private String name;
	// 最后登录时间
	private Long login;
	// 最后离线时间	
	private Long logoff;
	// 登录次数
	private Long loginTimes;
	// 在线时长
	private Long loginTime;
	// 在线时长字符串
	private String loginTimeStr;
	// 创建时间
	private Long createTick;
	// 最后登录时间
	private String li;
	// 最后离线时间
	private String lf;
	// 创建时间
	private String ct;
	// 充值金额
	private Integer recharge;
	// 现存钻石
	private Integer diamonds;
	// 创建关卡数
	private Integer createStageCount;
	// 提交关卡数
	private Integer submitStageCount;
	// 下载关卡数
	private Integer downloadStageCount;
	// 创建关卡集数
	private Integer createStoryCount;
	// 提交关卡集数
	private Integer submitStoryCount;
	// 下载关卡集数
	private Integer downloadStoryCount;
	// 提交竞技关卡集数
	private Integer submitPkStoryCount;
	// 下载竞技关卡集数
	private Integer downloadPkStoryCount;
	// 创建主题数
	private Integer createMotifCount;
	// 提交主题数
	private Integer submitMotifCount;
	// 下载主题数
	private Integer downloadMotifCount;
	// 创建好友对战房间数
	private Integer createMatchRoomCount;
	// 创建关卡竞标赛数
	private Integer createMatchBattleCount;
	// 创建关卡集竞标赛数
	private Integer createMatchStoryCount;
	// 参与好友对战次数
	private Integer partakeMatchRoomCount;
	// 参与关卡竞标赛次数
	private Integer partakeMatchBattleCount;
	// 参与关卡集竞标赛次数
	private Integer partakeMatchStoryCount;
	// 玩家具体信息
	private Player player ;
	
	// getter and setter 
	public void setLoginTimeStr() {
		Long loginTime = this.getLoginTime();
		this.loginTimeStr = DateUtils.getDateTimeStr(loginTime);
	}
}
