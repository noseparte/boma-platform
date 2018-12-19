package com.xmbl.ops.enumeration;

public enum EnumInviteCodeStatus {
	NOUSE		    (0, "未使用"),
	UNUSE		    (1, "已使用"),
	DELL		    (-1, "已删除");

	private EnumInviteCodeStatus(int id, String desc) {
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
