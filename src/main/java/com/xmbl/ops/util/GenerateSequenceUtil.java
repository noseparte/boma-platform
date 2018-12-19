package com.xmbl.ops.util;

import java.text.FieldPosition;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.Calendar;
public class GenerateSequenceUtil {

    private static final FieldPosition HELPER_POSITION = new FieldPosition(0);

    //为了防止服务器重启，时间至少需要定位到秒，否则会出现序号重复问题
    private final static Format dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");

    private static int seq = 0;
    
    private static String flag="";
    /**
     * 时间格式生成序列
     * @return String 如：2018011722514282，前14位为时间，剩余位为当天自增长id
     */
    public static synchronized String generateSequenceNo() {

        Calendar rightNow = Calendar.getInstance();

        StringBuffer sb = new StringBuffer();

        dateFormat.format(rightNow.getTime(), sb, HELPER_POSITION);

        if(!flag.equals(sb.substring(0, 8))) {
        	flag=sb.substring(0, 8).toString();
        	seq = 0;
        }
        sb.append(seq);
        seq++;
//        System.out.println(sb.toString());
        return sb.toString();
    }
 
    public static void main(String[] args) {
    	Long start =System.currentTimeMillis();
		System.out.println(generateSequenceNo());
    	System.out.println("use time:"+(System.currentTimeMillis()-start));
	}
}