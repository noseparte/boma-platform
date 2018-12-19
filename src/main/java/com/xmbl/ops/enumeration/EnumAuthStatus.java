package com.xmbl.ops.enumeration;

public enum EnumAuthStatus {
	VALID (0,"有效"),
	INVALID (1,"无效");
	
	private EnumAuthStatus(int id, String desc){
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