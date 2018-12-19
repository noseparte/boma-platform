package com.xmbl.ops.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * <p>期数的处理</p>	
 * <p>User: Zhugong Team
 * <p>Date: 2016年12月28日 下午1:51:21
 * <p>Version: 1.0
 */
public class PeriodsUtil {

	/**
	 * 获取当前期数
	 * @return
	 */
	public static String getPeriods(Date date){
		String per = dateToString(date);
		int period =  dateToInt(date);
		int iods = period/5 - 107;
		String periods = per + String.valueOf(iods);
		return periods;
		
	}
	//获取当前时间对应的小时数
	public static int getHour(Date date){
		SimpleDateFormat simple = new SimpleDateFormat("HH:mm:ss");
	
		String format = simple.format(date);
		String[] split = format.split(":");
		String time = split[0];
		int hh = Integer.parseInt(time);
		return hh;
	}
	//获取当前时间对应的 yyyyMMdd HHmmss
	public static Date getStringToDate(String timestamp) throws ParseException{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
	    Date date = sdf.parse(timestamp); 
		return date;
	}
	//获取当前时间对应的 yyyyMMdd HHmmss
	public static String getWholeTime(Date date){
		SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String format = simple.format(date);
		return format;
	}
	//获取当前时间对应的 yyyyMMdd
	public static String getTianShu(Date date){
	    SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd");
	    String format = simple.format(date);
	    return format;
	}
	//获取当前时间对应的 yyyyMMdd
	public static String getLotteryDate(Date date){
		SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd HH");
		String format = simple.format(date);
		return format;
	}
	//获取当前时间对应的 yyyyMMdd
	public static String getTian(Date date){
		SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd");
		
		String format = simple.format(date);
		String[] split = format.split("-");
		String time = split[0]+split[1]+split[2];
		return time;
	}
	//获取当前时间对应的时间 HH-mm-ss
	public static String getShijian(Date date){
		SimpleDateFormat simple = new SimpleDateFormat("HH-mm-ss");
		
		String format = simple.format(date);
		String[] split = format.split("-");
		String time = split[0]+split[1]+split[2];
		return time;
	}
	
	
	private static int dateToInt(Date date){
		String[] da = date.toLocaleString().split("-");
		String ss = da[2];
		int s = 0;
		System.out.println(ss.length());
		if(ss.length() == 11){
			String se = ss.substring(3);
			String[] sh = se.split(":");
			s = (Integer.parseInt(sh[0])*60+Integer.parseInt(sh[1]));
		}
		if(ss.length() == 10){
			String se = ss.substring(3);
			String[] sh = se.split(":");
			s = (Integer.parseInt(sh[0])*60+Integer.parseInt(sh[1]));
		}
		if(ss.length() == 9){
			String se = ss.substring(2);
			String[] sh = se.split(":");
			s = (Integer.parseInt(sh[0])*60+Integer.parseInt(sh[1]));
		}
		return s;
	}
	
	public static String dateToString(Date date){
		String[] da = date.toLocaleString().split("-");
		String se = null;
		String ss = da[0] + da[1] + da[2];
		String[] sh = ss.split(":");
		String sm = sh[0]+sh[1]+sh[2];
		System.err.println(sm.length());
		if(sm.length() == 12){
			se = ss.substring(4, 6);
		}
		if(sm.length() == 13){
			se = ss.substring(4, 7);
		}
		if(sm.length() == 14){
			se = ss.substring(4, 7);
		}
		if(sm.length() == 15){
			se = ss.substring(4, 8);
		}
		return se;
	}
	
	//毫秒数转时间
	public static Date longToDate(long time){
		
	    //输入毫秒数，转化为日期，用calendar方法；  
        Calendar calendar = Calendar.getInstance();  
        calendar.setTimeInMillis(time);  
        Date date = calendar.getTime();
        return date;
	
	}
	
	public static String getQuestionIndex(Date date) throws ParseException {
	    //初始化定义 Final Q&A编号    
	    String indexNo = "";
	    //前四位
	    SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd");
	    String time = simple.format(date);
	    String[] timer = time.split("-");
	    String index = timer[0]+timer[1]+timer[2];
	    //后四位
	    SimpleDateFormat sf = new SimpleDateFormat("HH:mm:ss");
	    String milli = sf.format(date);
	    String[] millis = milli.split(":");
	    int no = Integer.parseInt(millis[0])*60*60 + Integer.parseInt(millis[1])*60 + Integer.parseInt(millis[2]);
	    indexNo = index + String.valueOf(no);
	    System.out.println(indexNo);
	    return indexNo;
	}
	
	public static long quene(Date date) throws ParseException {
	    SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd");
	    String format = simple.format(date);
	    Date date1=simple.parse(format);
	    long addDate = PeriodsUtil.addDate(date1);
        return addDate;
	}
	
	public static Date transfer(String date) throws ParseException {
		SimpleDateFormat simple = new SimpleDateFormat("yyyy-MM-dd HH");
		Date date1=simple.parse(date);
		return date1;
	}
	
//	Date转毫秒数
	public static long addDate(Date date) throws ParseException{
		long betweenDate = 0;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateString = date.toLocaleString();
		long specialDate = sdf.parse(dateString).getTime();
		
		return specialDate;
		
	}
	public void getNowTime(){
	Calendar currentDate = new GregorianCalendar();   
	  
	currentDate.set(Calendar.HOUR_OF_DAY, 0);  
	currentDate.set(Calendar.MINUTE, 0);  
	currentDate.set(Calendar.SECOND, 0);  
//	Date dateCursor = new Date();
//	dateCursor.setTodayStart((Date)currentDate.getTime().clone());s
	
	}
	
	/* 
     * 将时间转换为时间戳
     */    
    public static String dateToStamp(String s) throws ParseException{
        String res;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = simpleDateFormat.parse(s);
        long ts = date.getTime();
        res = String.valueOf(ts);
        return res;
    }
    /* 
     * 将时间戳转换为时间
     */
    public static Date stampToDate(String stamp){
		try {
			SimpleDateFormat format =  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			Long time=new Long(stamp);  
		    String d = format.format(time);  
		    Date date=format.parse(d);  
			System.out.println("Format To Date:"+date);  
			return date;  
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
    }
	
    /**
     * 时间比较{结束时间大于开始时间}
     * compare startDate to endDate
     * 
     * @param startDate
     * @param endDate
     */
    public static boolean compareDateEndTimeGTStartTime(String startDate, String endDate) {
    	DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	try {
			Date start = df.parse(startDate);//将字符串转换为date类型  
			Date end = df.parse(endDate);  
//			System.out.println(start);
//			System.out.println(start.getTime());
			if(end.getTime()>start.getTime()) { //比较时间大小,如果dt1大于dt2  
                return true;  
            }else{  
                return false;  
            }  
		} catch (ParseException e) {
			e.printStackTrace();
		}
    	return false;  
    }
    
	public static void main(String[] args) throws ParseException {
//		Date transfer = stampToDate("1525680000000");
//		System.out.println(transfer);
//		boolean flag = compareDateEndTimeGTStartTime("2018-03-10 16:00:00", "2018-05-09 16:00:00");
//		System.out.println(flag);
		
		Date stringToDate = longToDate(636617173531026461L);
		Date Date = longToDate(1525682405075L);
		System.out.println(stringToDate);
		System.out.println(Date);
	}
   
	
	
	
	
	
}
