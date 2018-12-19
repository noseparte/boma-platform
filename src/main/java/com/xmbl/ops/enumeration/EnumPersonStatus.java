package com.xmbl.ops.enumeration;

public enum EnumPersonStatus {
	OPEN		("0", "启用"),
	CLOSE 	    ("1", "禁用");

	private EnumPersonStatus(String id, String desc) {
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
