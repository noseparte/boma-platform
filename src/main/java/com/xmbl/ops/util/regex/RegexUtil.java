package com.xmbl.ops.util.regex;

import java.util.regex.Pattern;

public class RegexUtil {
	
	public static final String DATE_STR = "^((((1[6-9]|[2-9]\\d)\\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})-0?2-(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$"; 

	/**
     *  验证字符串是否满足正则表达式
     * @param regex 正则表达式
     * @param validateStr 要验证的字符串
     * @return
     */
    public static boolean checkRegex(String regex,String validateStr) {
    	if (validateStr == null) {
    		return false;
    	}
    	return Pattern.matches(regex,validateStr);
    }
}
