package com.xmbl.ops.enumeration;

public enum EnumOrgStatus {
    FORBIDDEN		(0, "已禁用"),
    NORMAL 	        (1, "正常");

    private EnumOrgStatus(int id, String desc) {
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
