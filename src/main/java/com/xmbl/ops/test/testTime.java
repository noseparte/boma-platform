package com.xmbl.ops.test;


import com.xmbl.ops.util.DateUtils;
import com.xmbl.ops.util.Jdate2CshapeTicksUtil;

import java.util.Date;


public class testTime {
	

	public static void main(String[] args) {
	
		Long ticks = 636416961182780000L;
	    Date time = 
		Jdate2CshapeTicksUtil.fromDnetTicksToJdate(ticks);
	    
	    
	    
	    String tme="2017-09-22 16:55:18";
	    Date ti =  new Date();
	    Long tick = Jdate2CshapeTicksUtil.getCShapeTicks(ti);
	    System.out.println(tick+"--"+Jdate2CshapeTicksUtil.getCShapeTicks(time));
       System.out.println(DateUtils.formatDate(time));
	}
}
