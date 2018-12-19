package com.xmbl.ops.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ParamUtil {
	/**
	 * 手机号验证
	 * 
	 * @param str
	 * @return 验证通过返回true
	 */
	public static boolean isMobile(String str) {
		Pattern p = null;
		Matcher m = null;
		boolean b = false;
		p = Pattern.compile("^[1][0-9]{10}$"); // 验证手机号
		m = p.matcher(str);
		b = m.matches();
		return b;
	}

	public static int stringToInt(String str) {
		if (str == null || "".equals(str.trim())) {
			return 0;
		}
		try {
			int val = Integer.parseInt(str);
			return val;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0;
	}

	public static long stringToLong(String str) {
		if (str == null || "".equals(str.trim())) {
			return 0L;
		}
		try {
			long val = Long.parseLong(str);
			return val;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0L;
	}

	public static boolean stringMeaningful(String str) {
		if (str == null || "".equals(str.trim())) {
			return false;
		}

		return true;
	}
}
