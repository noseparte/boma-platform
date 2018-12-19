package com.xmbl.ops.enumeration;

public enum EnumNoticesType {
	ALL		("all", "all"),
	IOS		("IOS", "IOS"),
	ANDROID		("ANDROID", "ANDROID");

	private EnumNoticesType(String id, String desc) {
		this.id = id;
		this.desc = desc;
	}

	private String id;
	private String desc;
	public String getId() {
		return id;
	}
	public String getDesc() {
		return desc;
	}

}
