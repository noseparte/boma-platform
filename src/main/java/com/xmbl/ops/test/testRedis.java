package com.xmbl.ops.test;

import net.sf.json.JSONObject;

//import com.xmbl.ops.cache.RedisUtil;

public class testRedis {
	public static final String REDIS_ENTER_TOPIC_BANNER_KEY = "enter_topic_banner";
//	@Resource
//	private static RedisClient redisClient;
//	
//	private static Jedis jedis = RedisUtil.getJedis(); 
//	  @Before
//	    public void setup() {
//	        //连接redis服务器，192.168.0.100:6379
//	        jedis = new Jedis("127.0.0.1", 6379);
//	        //权限认证
//	        jedis.auth("admin");  
//	    }
	public static void main(String[] args) throws Exception {  

//		boolean notRepeat = redisClient.setnx(REDIS_ENTER_TOPIC_BANNER_KEY, "1", 10);
		saveRedis();
	}
	
	/**
     * redis存储字符串
     */
//    @Test
//    public static void testString() {
//        //-----添加数据----------  
//        jedis.set("name","xinxin");//向key-->name中放入了value-->xinxin  
//        System.out.println(jedis.get("name"));//执行结果：xinxin  
//
//        jedis.append("name", " is my lover"); //拼接
//        System.out.println(jedis.get("name")); 
//
//        jedis.del("name");  //删除某个键
//        System.out.println(jedis.get("name"));
//        //设置多个键值对
//        jedis.mset("name","liuling","age","23","qq","476777XXX");
//        jedis.incr("age"); //进行加1操作
//        System.out.println(jedis.get("name") + "-" + jedis.get("age") + "-" + jedis.get("qq"));
//
//    }
	
	private static void saveRedis() {
//		redisClient.delKeys(REDIS_ENTER_TOPIC_BANNER_KEY);
		String e = "{\"picture_url\": \""+111+"\",\"url\":\""+11+"\",\"version\":\""+11+"\"}";
     	
		JSONObject result = new JSONObject();
		result.put("username", 11);
		result.put("time", "date");
//		redisClient.set("name","xinxin",0);//向key-->name中放入了value-->xinxin  
//		System.out.println(redisClient.get("name"));//执行结果：xinxin  
		          
//		          System.out.println(redisClient.get("name")); 
		          
//		          redisClient.delKeys("name");  //删除某个键
//		          System.out.println(redisClient.get("name"));
		          //设置多个键值对
//		          redisClient.mset("name","liuling","age","23","qq","476777XXX");
//		          redisClient.("age"); //进行加1操作
		
//		ServletUtils.sendAsJson(Struts2Utils.getResponse(), new StringBuilder()
//			.append("{\"status\":200,\"msg\":\"哈哈哈",\"data\":")
//			.append(result.toString())
//			.append("}").toString());
//		redisClient.set("11", e ,0);
//     	opsForList().leftPush(REDIS_ENTER_TOPIC_BANNER_KEY, e);
     }
}
