package com.xmbl.ops.util;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class Common {
	/**
	 * 将Map形式的键值对中的值转换为泛型形参给出的类中的属性值 t一般代表pojo类
	 * 
	 * @descript
	 * @param object
	 * @param params
	 */
	public static <T extends Object> T flushObject(T t, Map<String, Object> params) {
		if (params == null || t == null)
			return t;

		Class<?> clazz = t.getClass();
		for (; clazz != Object.class; clazz = clazz.getSuperclass()) {
			try {
				Field[] fields = clazz.getDeclaredFields();

				for (int i = 0; i < fields.length; i++) {
					String name = fields[i].getName(); // 获取属性的名字
					Object value = params.get(name);
					if (value != null && !"".equals(value)) {
						// 注意下面这句，不设置true的话，不能修改private类型变量的值
						fields[i].setAccessible(true);
						fields[i].set(t, value);
					}
				}
			} catch (Exception e) {
			}

		}
		return t;
	}
	
	public static boolean isIP(String addr)
    {
      if(addr.length() < 7 || addr.length() > 15 || "".equals(addr))
      {
        return false;
      }
      /**
       * 判断IP格式和范围
       */
      String rexp = "([1-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])(\\.(\\d|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])){3}";
      
      Pattern pat = Pattern.compile(rexp);  
      
      Matcher mat = pat.matcher(addr);  
      
      boolean ipAddress = mat.find();

      return ipAddress;
    }
}
