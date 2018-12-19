package com.xmbl.ops.enumeration;

public enum EnumNoticesStatus {
	NORMAL		(0, "正常"),
	DELECT		(-1, "删除");

	private EnumNoticesStatus(int id, String desc) {
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
