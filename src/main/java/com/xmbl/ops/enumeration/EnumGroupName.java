package com.xmbl.ops.enumeration;

/**
 * Created by ljc on 2016/3/1.
 */
public enum EnumGroupName {
    SUPER (0,"superAdmin"),
    ORGANIZATION (1,"organization");

    private EnumGroupName(int id, String desc){
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
