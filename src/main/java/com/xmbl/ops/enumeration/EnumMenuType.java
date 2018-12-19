package com.xmbl.ops.enumeration;

public enum EnumMenuType {
	CATA	(0, "父目录"),
	PATH	(1, "子目录"),
	MENU	(2, "菜单");

	private EnumMenuType(int id, String chineseName) {
		this.id = id;
		this.chineseName = chineseName;
	}

	private int id;
	private String chineseName;
	public int getId() {
		return id;
	}
	public String getChineseName() {
		return chineseName;
	}

}
