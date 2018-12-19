package com.xmbl.ops.enumeration;

public enum EnumYesNo {
	YES	(0, "否"),
	NO	(1, "是");

	private EnumYesNo(int id, String chineseName) {
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
