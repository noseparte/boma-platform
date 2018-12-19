package com.xmbl.ops.model.organization;

import lombok.Data;

import java.util.Date;
@Data
public class DataAnalysis {
	private Date createtime;

	private Long gameid;

	private Long gameserverid;

	private Long platformid;

	private Long onlineCount;

    private Long registerRoleCount;

    private Long registerAccoutCount;

    private Long activeRoleCount;

    private Long activeAccoutCount;

    private Long sumpayRoleCount;

    private Long sumpayMoney;

    private Long sumpayMoneyCount;

    private Long fispayRoleCount;

    private Long fispayMoney;

    private Long fispayMoneyCount;

    private Long arppu;

    private Long arpu;

    private Long pur;

    private Date updatetime;

    private String createTimeForStr;
    
    private String gameName;
    
    private String gameserverName;
    
    private String platformName;
}