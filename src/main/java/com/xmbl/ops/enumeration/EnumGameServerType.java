package com.xmbl.ops.enumeration;

public enum EnumGameServerType {
	World		("World", "World"),
	Match		("Match", "Match"),
	Battle		("Battle", "Battle");

	private EnumGameServerType(String id, String desc) {
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
