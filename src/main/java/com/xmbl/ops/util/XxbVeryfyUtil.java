package com.xmbl.ops.util;

import org.apache.commons.lang3.StringUtils;

import java.util.*;

public class XxbVeryfyUtil {
	
//	private static final String KEY_GENERATE_ALGORITHM = "RSA";
	private static final String privateKey = "MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAIIPj6KZzUKnoWI/indtWGvT8glEkXf33/uw6FG1ecPKHIUTn2d3wGGuYgvkgDXQdGyqxW9gIYcaBtozrbHPnKKqVdJAwfxiypT9Er5lxYjliC7Jwx8P4dJE+wvLsKm4KuziENWIPESowCehxV8OEr+ySDlpH2r8jf9aEmNSyv1zAgMBAAECgYBmVbQgrn+RCLC0y2Y53fGKtjNlE2yaRpEYSvQhBneOlEKoeu4bzV+z/C/tR5eRwDk7H4tFvQ/ka5gkrDDpDYAiWpzlEX7dqQmtE+zDQnRQToGQ0/bpeu7qm+JxihXKn2RvZQWzJZ4shmt0iwKhggHLgBwrIzYoeLjeISRliyfBcQJBAPKjVufufPmxgIK6GxAVDkI4e0A8h6n4QML3NgVLtbXupNJk6NknKItHTh29u6SWdbnIDvQt4xhk3mJSxmUvbF0CQQCJOSGB2mwjh1JEqSqckyUa8l8uvG3nzUhqllIfmZpu4i5/JjMam3LkT49dDXbOxmG7OGmbxPsab5xV+Oj09/QPAkEAlvYnUQAhw5y7bxppUhU3nN3VWT8PzSGG8YarlpnnQX1sEPb1pH3njNhdcsWkZJ+0OVWOcD/IhlnjvtrvUu8xhQJBAIAx0DzIeigC3ndodneJ+6sd7I/z1tUr8VAqGJSO4jhes0Nzw2BDAuWJ8gvjbS+lI15NSFQOhOtgg3PJspBQKD8CQQCTbtIdHjssHTL8SguFsHnTwyaIPisxRu65ULh/hDubpdCPxwsxndDFEI3LVJPG5ow4lH9JSkiOiRuITvZmM+dw";
	private static final String publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCD4+imc1Cp6FiP4p3bVhr0/IJRJF399/7sOhRtXnDyhyFE59nd8BhrmIL5IA10HRsqsVvYCGHGgbaM62xz5yiqlXSQMH8YsqU/RK+ZcWI5YguycMfD+HSRPsLy7CpuCrs4hDViDxEqMAnocVfDhK/skg5aR9q/I3/WhJjUsr9cwIDAQAB";
	
	public static void main(String[] args) {
		
	}
	public static boolean veryfy(Map<String, String> params, String sign) {
		if(StringUtils.isEmpty(sign))
			return false;
		Map<String, String> paramsNew = paramFilter(params);
		String paramStr = concatParamString(paramsNew);
		return RSA.verify(paramStr, sign, publicKey);
	}
	
	public static String sign(Map<String, String> params) {
		Map<String, String> paramsNew = paramFilter(params);
		String paramStr = concatParamString(paramsNew);
		return RSA.sign(paramStr, privateKey);
	}
	
	private static Map<String, String> paramFilter(Map<String, String> sArray) {
		Map<String, String> result = new HashMap<String, String>();
		if (sArray == null || sArray.size() <= 0) return result;
		for (String key : sArray.keySet()) {
			String value = sArray.get(key);
			if (value == null || value.equals("") || key.equalsIgnoreCase("sign"))
				continue;
			result.put(key, value);
		}
		return result;
	}
	
	private static String concatParamString(Map<String, String> params) {
		List<String> keys = new ArrayList<>(params.keySet());
		Collections.sort(keys);
		StringBuilder prestr = new StringBuilder();
		for (int i = 0; i < keys.size(); i++) {
			String key = keys.get(i);
			String value = params.get(key);
			prestr.append(key).append(value);
		}
		return prestr.toString();
	}
	
}
