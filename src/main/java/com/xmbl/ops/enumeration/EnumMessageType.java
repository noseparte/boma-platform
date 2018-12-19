package com.xmbl.ops.enumeration;

public enum EnumMessageType {
	Notice		(1, "通知"),
	Message 	(2, "信息"),
	Tips 	    (3, "提示")
	;

    private EnumMessageType(int id, String desc) {
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
