package com.xmbl.ops.enumeration;

public enum EnumSendStatus {
	////发送状态  0 成功 1待发送 2正在发送 -1 发送失败  -2 网络超时
	SEND_SUCCESS		(0, "成功"),
    SEND_CONTINE 	    (1, "待发送"),
    SEND_ONLINE 	    (2, "正在发送"),
    SEND_ERROR 	        (-1, "失败"),
    OUTTIME_ERROR 	        (-2, "网络超时");

    private EnumSendStatus(int id, String desc) {
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
