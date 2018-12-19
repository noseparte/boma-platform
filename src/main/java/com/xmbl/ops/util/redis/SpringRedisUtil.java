package com.xmbl.ops.util.redis;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  SpringRedisUtil 
 * @创建时间:  2017年12月25日 下午8:31:49
 * @修改时间:  2017年12月25日 下午8:31:49
 * @类说明: redis 工具类
 */
@Component
public class SpringRedisUtil {
	
		private static Logger LOGGER = LoggerFactory.getLogger(SpringRedisUtil.class);
	
	    @Autowired  
	    private static StringRedisTemplate stringRedisTemplate;  
	  
	    /** 
	     * 压栈 
	     *  
	     * @param key 
	     * @param value 
	     * @return 
	     */  
	    public static Long push(String key, String value) {  
	        return stringRedisTemplate.opsForList().leftPush(key, value);  
	    }  
	  
	    /** 
	     * 出栈 
	     *  
	     * @param key 
	     * @return 
	     */  
	    public static String pop(String key) {  
	        return stringRedisTemplate.opsForList().leftPop(key);  
	    }  
	  
	    /** 
	     * 入队 
	     *  
	     * @param key 
	     * @param value 
	     * @return 
	     */  
	    public static Long in(String key, String value) {  
	        return stringRedisTemplate.opsForList().rightPush(key, value);  
	    }  
	  
	    /** 
	     * 出队 
	     *  
	     * @param key 
	     * @return 
	     */  
	    public static String out(String key) {  
	        return stringRedisTemplate.opsForList().leftPop(key);  
	    }  
	  
	    /** 
	     * 栈/队列长 
	     *  
	     * @param key 
	     * @return 
	     */  
	    public static Long length(String key) {  
	        return stringRedisTemplate.opsForList().size(key);  
	    }  
	  
	    /** 
	     * 范围检索 
	     *  
	     * @param key 
	     * @param start 
	     * @param end 
	     * @return 
	     */  
	    public static List<String> range(String key, int start, int end) {  
	        return stringRedisTemplate.opsForList().range(key, start, end);  
	    }  
	  
	    /** 
	     * 移除 
	     *  
	     * @param key 
	     * @param i 
	     * @param value 
	     */  
	    public static void remove(String key, long i, String value) {  
	        stringRedisTemplate.opsForList().remove(key, i, value);  
	    }  
	  
	    /** 
	     * 检索 
	     *  
	     * @param key 
	     * @param index 
	     * @return 
	     */  
	    public static String index(String key, long index) {  
	        return stringRedisTemplate.opsForList().index(key, index);  
	    }  
	  
	    /** 
	     * 置值 
	     *  
	     * @param key 
	     * @param index 
	     * @param value 
	     */  
	    public static void set(String key, long index, String value) {  
	        stringRedisTemplate.opsForList().set(key, index, value);  
	    }  
	  
	    /** 
	     * 裁剪 
	     *  
	     * @param key 
	     * @param start 
	     * @param end 
	     */  
	    public static void trim(String key, long start, int end) {  
	        stringRedisTemplate.opsForList().trim(key, start, end);  
	    }  
}
