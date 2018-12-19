package com.xmbl.ops.util;

import lombok.extern.slf4j.Slf4j;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 * @Author Noseparte
 * @Compile 2018年6月4日 -- 下午3:00:19
 * @Version 1.0
 * @Description		日历工具类
 */
@Slf4j
public class CalendarUtil {

	/** 
	* 获得该月第一天 
	* @param year 
	* @param month 
	* @return 
	*/  
	public static String getFirstDayOfMonth(int year,int month){  
        Calendar cal = Calendar.getInstance();  
        //设置年份  
        cal.set(Calendar.YEAR,year);  
        //设置月份  
        cal.set(Calendar.MONTH, month-1);  
        //获取某月最小天数  
        int firstDay = cal.getActualMinimum(Calendar.DAY_OF_MONTH);  
        //设置日历中月份的最小天数  
        cal.set(Calendar.DAY_OF_MONTH, firstDay);  
        //格式化日期  
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");  
        String firstDayOfMonth = sdf.format(cal.getTime());  
        return firstDayOfMonth;  
    }  
	
	/** 
	* 获得该月最后一天 
	* @param year 
	* @param month 
	* @return 
	*/  
	public static String getLastDayOfMonth(int year,int month){  
        Calendar cal = Calendar.getInstance();  
        //设置年份  
        cal.set(Calendar.YEAR,year);  
        //设置月份  
        cal.set(Calendar.MONTH, month-1);  
        //获取某月最大天数  
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);  
        //设置日历中月份的最大天数  
        cal.set(Calendar.DAY_OF_MONTH, lastDay);  
        //格式化日期  
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");  
        String lastDayOfMonth = sdf.format(cal.getTime());  
        return lastDayOfMonth;  
    }  

	
	
	public static void main(String[] args) throws Exception{
		int year = Calendar.YEAR;
		int month = Calendar.MONTH;
		System.out.println(year + ":" + month);
//		String lastDayOfMonth = getLastDayOfMonth(2018, 6);
//		System.out.println(lastDayOfMonth);
		String nowDate = PeriodsUtil.getWholeTime(new Date());
		log.info("现如今的时间为: {}" ,nowDate);
		String substring = nowDate.substring(0,10);
		log.info("截取后的时间为: {}" ,substring);
		String[] time = substring.split("-");
		log.info("分割后的时间为:年{},月{},日{}" ,time[0],time[1],time[2]);
		String lastDayOfMonth = CalendarUtil.getLastDayOfMonth(Integer.parseInt(time[0]), Integer.parseInt(time[1]));
		StringBuilder sb = new StringBuilder().append(lastDayOfMonth).append(" ").append("24:00:00");
		log.info("拼接后的时间为{}" ,sb.toString());
		Date lotteryDate = PeriodsUtil.getStringToDate(sb.toString());
		log.info("开奖时间为{}" ,lotteryDate);
	}
	
	
	
	
}
