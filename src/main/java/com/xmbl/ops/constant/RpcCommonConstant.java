package com.xmbl.ops.constant;

public class RpcCommonConstant {
	public static String LOGIN = "/Login";										//登录
	public static String RECHARGE = "/Recharge";								//充值
	public static String PG_GETPLAYERINFO = "/PG_GetPlayerInfo";				//获取玩家信息
	public static String PG_GETSTAGEINFO = "/PG_GetStageInfo";					//获取关卡信息
	public static String PG_GETSERVERINFO = "/PG_GetServerInfo";				//获取服务器信息
	public static String GM_SENDMESSAGE = "/SendMessage";						//发送广播通知
	public static String GM_SENDPLAYERMAIL = "/SendPlayerMail";					//给指定玩家发送邮件
	public static String GM_SENDALLPLAYERMAIL = "/SendAllPlayerMail";			//给所有玩家发送邮件
	public static String GM_SETPLAYERCHAT = "/SetPlayerChat";					//禁言
	public static String GM_SETPLAYERLOGIN = "/SetPlayerLogin";					//封号
	public static String GM_SHUTDOWNSERVER = "/ShutDownServer";					//关服
	public static String GM_LOGIN = "/Login";									//登录
	public static String GM_VERIFIED = "/Verified";								//实名认证
	public static String GM_RECHARGE = "/Recharge";								//充值
	public static String GM_SETSTORYRV = "/SetStoryRv";							//设置关卡集推荐值
	public static String GM_SETCHALLENAGERANK = "/SetChallenageRank";			//设置挑战排名
	public static String GM_SETSTAGESHOPRANK = "/SetStageShopRank";				//设置关卡商店中的排名
	public static String GM_STAGEBELIKEDREWARD = "/SetStageBelikedReward";		//设置挑战大师奖励
	public static String GM_STAGECOMPLETREWARD = "/SetStageCompleteReward";		//设置闯关大师奖励
	public static String GM_STAGEGETMVPREWARD = "/SetStageGetMvpReward";		//设置MVP奖励
	public static String GM_SETPLAYERAUTH = "/SetPlayerAuth";					//设置玩家权限
	public static String PG_RECEIVECOMMENT = "/ReceiveComment";					//接收评论
	public static String PG_RECEIVEREPLYS = "/ReceiveReplys";					//接收回复
	
	public static String PG_SHIELDSTAGESHOP = "/ShieldStageShop";				//屏蔽关卡商店
	public static String PG_SHIELDSTORYSHOP = "/ShieldStoryShop";				//屏蔽关卡集商店
	public static String PG_SHIELDSTAGEBATTLE = "/ShieldStageBattle";			//屏蔽关卡锦标赛
	public static String PG_SHIELDSTORYBATTLE = "/ShieldStoryBattle";			//屏蔽关卡集锦标赛
	public static String PG_SHIELDMATCHBATTLE = "/ShieldMatchBattle";			//屏蔽淘汰赛
	
	public static String PG_REVOKEMOTIF = "/RevokeMotif";					    //下架主题商店

	public static String ip;
	public static Long port;
	
	public static String PLAYERINFO = null;
	public void Rpc_api_url(String ip, Long port) {
		RpcCommonConstant.ip = ip;
		RpcCommonConstant.port = port;
		PLAYERINFO = RpcCommonConstant.ip+":"+RpcCommonConstant.port+"GetPlayerInfo?";//获取玩家角色信息
	}

}
