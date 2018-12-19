package com.xmbl.ops.model.organization;

import lombok.Data;

import java.util.Date;
@Data
public class ActiveRetention {
   
    private Date createtime;

    private Long gameid;

    private Long gameserverid;

    private Long platformid;
    
	private Long ru;

    private Long oneDayRetained;

    private Long twoDayRetained;

    private Long threeDayRetained;

    private Long fourDayRetained;

    private Long fiveDayRetained;

    private Long sixDayRetained;

    private Long sevenDayRetained;

    private Long tenDayRetained;

    private Long fifteenDayRetained;

    private Long thirtyDayRetained;

    private Date updatetime;

  
}