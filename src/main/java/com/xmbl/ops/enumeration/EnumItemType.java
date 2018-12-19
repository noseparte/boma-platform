package com.xmbl.ops.enumeration;

public enum EnumItemType {
	MONEY		(0, "金钱类"),
	GOODS		(1, "道具类");

	private EnumItemType(int id, String desc) {
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
