package com.xmbl.ops.enumeration;

public enum EnumBannedType {
	MUTE		(1, "禁言"),
	KICK 	    (2, "封号"),
	UNMUTE 	    (3, "取消禁言"),
	UNKICK 	    (4, "取消封号")
	;

    private EnumBannedType(int id, String desc) {
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
