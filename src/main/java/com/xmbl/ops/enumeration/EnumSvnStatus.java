package com.xmbl.ops.enumeration;

public enum EnumSvnStatus {
	UNAUDIT		(1, "已最新"),
	ONLINE		(2, "更新中"),
	DELETE		(-1, "更新失败");

	private EnumSvnStatus(int id, String desc) {
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
