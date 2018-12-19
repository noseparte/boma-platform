package com.xmbl.ops.enumeration;

public enum EnumItemMoneyId {
	/**
	Gold			=	0;		// 金币
	BindGold		=	1;		// 绑定金币
	Diamond			=	2;		// 钻石
	BindDiamond		=	3;		// 绑定钻石
	Crystal         =   4;      // 魔晶
	Achivement      =   5;      // 成就
	Reputation      =   6;      // 声望
	ImpetrateCredit =   7;      // 祈福积分
	SpiritCredit    =   8;      // 精灵积分
	StarSoul		=   9;		// 星魂
	WarContribution =   10;     // 战功
	 */
	Gold		    (0, "金币"),
	BindGold	    (1, "绑定金币"),
	Diamond	        (2, "钻石"),
	BindDiamond	    (3, "绑定钻石"),
	Crystal	        (4, "魔晶"),
	Achivement	    (5, "成就"),
	Reputation	    (6, "声望"),
	ImpetrateCredit	(7, "祈福积分"),
	SpiritCredit	(8, "精灵积分"),
	StarSoul	    (9, "星魂"),
	WarContribution	(10, "战功");

	private EnumItemMoneyId(int id, String desc) {
		this.id = id;
		this.desc = desc;
	}

	private int id;
	private String desc;
	public int getId() {
		return id;
	}
	public String getDesc() {
		return desc;
	}

}
