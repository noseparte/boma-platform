package com.xmbl.ops.test;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class testchart {
	
	public static void main(String[] args) {
//		test();
		int cnt = 6;
		for(int i = 0; i<2000; i++){
//			String s = getRandomInviteCode(cnt);
			String s = getStringRandom(cnt);
//			String s = RandomStringUtil.getRandomCode(6, 6);
			System.out.printf( i+"---"+s+"\n");
		}
//		 List<String> results=genCodes(6,100);
//		 System.out.printf( "---"+results+"\n");
	}
	
    //生成随机数字和字母,  
    public static String getStringRandom(int length) {  
          
        String val = "";  
        Random random = new Random();  
          
        //参数length，表示生成几位随机数  
        for(int i = 0; i < length; i++) {  
              
            String charOrNum = random.nextInt(2) % 2 == 0 ? "char" : "num";  
            //输出字母还是数字  
            if( "char".equalsIgnoreCase(charOrNum) ) {  
                //输出是大写字母还是小写字母  
                int temp = random.nextInt(2) % 2 == 0 ? 65 : 97;  
                val += (char)(random.nextInt(26) + temp);  
            } else if( "num".equalsIgnoreCase(charOrNum) ) {  
                val += String.valueOf(random.nextInt(10));  
            }  
        }  
        return val;  
    }  
	
	public static String getRandomInviteCode(int cnt){
		String code = "";
		int codeCount = 6;
		char[] codeSequence = { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',         
		         'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',         
		         'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',         
		         'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',         
		         'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' }; 
		char[] codeSequenceNum = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' }; 
		// 随机产生codeCount数字的验证码。        
		// 创建一个随机数生成器类         
        Random random = new Random();
        StringBuffer randomCode = new StringBuffer();
        for (int i = 0; i < codeCount; i++) {   
        	 String strRand = String.valueOf(codeSequence[random.nextInt(62)]);         
        	 randomCode.append(strRand);
        }
		return randomCode.toString();
	}
	public static List<String> genCodes(int length,long num){
	      
	    List<String> results=new ArrayList<String>();
	      
	    for(int j=0;j<num;j++){
	      String val = "";   
	            
	      Random random = new Random();   
	      for(int i = 0; i < length; i++)   
	      {   
	        String charOrNum = random.nextInt(2) % 2 == 0 ? "char" : "num"; // 输出字母还是数字   
	              
	        if("char".equalsIgnoreCase(charOrNum)) // 字符串   
	        {   
	          int choice = random.nextInt(2) % 2 == 0 ? 65 : 97; //取得大写字母还是小写字母   
	          val += (char) (choice + random.nextInt(26));   
	        }   
	        else if("num".equalsIgnoreCase(charOrNum)) // 数字   
	        {   
	          val += String.valueOf(random.nextInt(10));   
	        }   
	      }
	      val=val.toLowerCase();
	      if(results.contains(val)){
	        continue;
	      }else{
	        results.add(val);
	      }
	    }
	    return results;
	            
	         
	    }  
	    
	public static void test() {
	    String testStr = "测试数据";
//	    String testStr = "æµè¯åå¼";
	    try {
	        // 得到指定编码的字节数组 字符串--->字节数组
	        byte[] t_iso = testStr.getBytes("ISO8859-1");
	        byte[] t_gbk = testStr.getBytes("GBK");
	        byte[] t_utf8 = testStr.getBytes("UTF-8");
	        System.out.println("使用ISO解码..." + t_iso.length);
	        System.out.println("使用GBK解码..." + t_gbk.length);
	        System.out.println("使用UTF8解码..." + t_utf8.length);
	        // 解码后在组装
	        String ut_iso = new String(t_iso, "ISO8859-1");
	        String ut_gbk = new String(t_gbk, "GBK");
	        String ut_utf8 = new String(t_utf8, "UTF-8");
	        System.out.println("使用ISO解码后再用ISO组装..." + ut_iso);
	        System.out.println("使用GBK解码后再用GBK组装..." + ut_gbk);
	        System.out.println("使用UTF8解码后再用UTF8组装..." + ut_utf8);
	        // 有时候要求必须是iso字符编码类型
	        // 可以先用GBK/UTF8编码后，用ISO8859-1组装成字符串，解码时逆向即可获得正确中文字符
	        String t_utf8Toiso = new String(t_utf8, "ISO8859-1");
	        // 将iso编码的字符串进行还原
	        String ut_utf8Toiso = new String(t_utf8Toiso.getBytes("ISO8859-1"),"UTF-8");
	        System.out.println("使用ISO组装utf8编码字符..." + t_utf8Toiso);
	        System.out.println("使用ISO解码utf8编码字符..." + ut_utf8Toiso);
	    } catch (UnsupportedEncodingException e) {
	        e.printStackTrace();
	    }
	}
}
