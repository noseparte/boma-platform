package com.xmbl.ops.enumeration;

public enum EnumRole {
	TEACHER		("教师", "教师"),
	STUDENT 	("学生", "学生");

	private EnumRole(String id, String desc) {
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
