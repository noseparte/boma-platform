package com.xmbl.ops.model.user;
import lombok.Data;
@Data
public class UserExtras {
    private String userid;

    private String gameid;

    private String gameversion;

    private String gameserver;

    private String channel;

    private String uuid;

    private String mac;

    private String imei;

    private String imeiid;

    private String os;

    private String osversion;

    private String resolution;

    private String device;

    private String ipaddress;

    private String onlinetype;
    public UserExtras(){
    	super();
    }

}