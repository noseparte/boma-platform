package com.xmbl.ops.enumeration;

public enum EnumGameServerStatus {
	UNAUDIT		(0, "关闭"),
	ONLINE		(1, "开启"),
	DELETE		(-1, "删除");

	private EnumGameServerStatus(int id, String desc) {
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
