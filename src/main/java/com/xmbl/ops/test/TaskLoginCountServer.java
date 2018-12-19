package com.xmbl.ops.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;
import java.util.Random;

//import kafka.javaapi.producer.Producer;
//import kafka.producer.KeyedMessage;
//import kafka.producer.ProducerConfig;
//import kafka.serializer.StringEncoder;


public class TaskLoginCountServer implements Runnable {

	 private String topic = "test-topic";//发送给Kafka的数据的类别
//	 private Producer <Integer,String> producerForKafka;
	 private static String dateToday = new Date().toString();
	 private static Random random = new Random();
	 private static Logger logger = LoggerFactory.getLogger("test_kafka_log");	
	 private static Logger logger_kafka = LoggerFactory.getLogger("kafka_log");	
	 static long id = 1;
	 
	 //具体的论坛频道
	    static String[] channelNames = new  String[]{
	     "Spark","Scala","Kafka","Flink","Hadoop","Storm",
	     "Hive","Impala","HBase","ML"
	    };
	    
	    //是否在线
	    static String[] onlineNames = new String[]{"0", "1"};
	    
	    //用户的两种行为模式
	    static String[] actionNames = new String[]{"View", "Register"};
	    //os 系统
	    static String[] osNames = new String[]{"android", "ios"};
	 
	    //版本 系统
	    static String[] versionNames = new String[]{"1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7"};
	    //渠道
	    static String[] channleNames = new String[]{"xiaomi", "qq" ,"360"};
	 
	 public void SparkStreamingDataMannuallyProducerForKafka(String topic){
	       dateToday = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
	       this.topic = topic ;
	      //连上kafka
	      Properties conf = new Properties();
	      conf.put("metadata.broker.list","master:9092,worker1:9092,worker2:9092");
	      conf.put("serializer.class","kafka.serializer.StringEncoder");
	     //构造器的核心是要生成数据，先要导入kafka的jar包 import kafka.producer
//	      producerForKafka= new Producer <Integer,String> (new ProducerConfig(conf)); 
	    
	}
	 @Override
	 public void run() {
//		 Producer producer = createProducer();
		 int counter = 0; //3条
		 
		 while(true){  //模拟实际情况，不断循环，异步过程，不可能是同步过程
			 counter++;
			 String loginCountlogs = LoginCountlogs();
//			 System.out.println("product:"+counter +"--num:" + counter++);
//			 System.out.println("product:"+userLog +"--num:");
//			 logger.info("product:"+userLog);
			 logger_kafka.info(loginCountlogs);
//			 producer.send(new KeyedMessage<Integer, String>(topic, userLog));//send是核心代码

			 if(0 == counter%3){
				 counter = 0;
				 try {
					 Thread.sleep(60000);
				 } catch (InterruptedException e) {
					 // TODO Auto-generated catch block
					 e.printStackTrace();
				 }
			 }
		 }
	 }

//		private Producer createProducer() {
//			Properties properties = new Properties();
//			properties.put("zookeeper.connect", "192.168.0.217:2181,192.168.0.219:2182");
//			properties.put("serializer.class", StringEncoder.class.getName());
//			properties.put("metadata.broker.list", "192.168.0.217:9092,192.168.0.219:9092");
//			return new Producer<Integer, String>(new ProducerConfig(properties));
//		 }
		
		
		public static void main(String[] args) {
//			new SparkStreamingDataMannuallyProducerForKafka("UserLogs").start();// 
//			new SparkStreamingDataMannuallyProducerForKafka("test-topic").start();//
		}
		private static String LoginCountlogs() {
			  StringBuffer logincountLogBuffer = new StringBuffer("");
			  int[] unregisteredUsers = new int[]{1, 2, 3, 4, 5, 6, 7, 8};
			  long ts = new Date().getTime();
			  Long gameid =1L;
			  String gameversion  = "1.1.1";
			  Long gameserverid  = 1L;
			  String channelid = channleNames[random.nextInt(3)];
			  String platfromid = "android";
			  String accountid = "";
			  
			  accountid = String.valueOf((long) random.nextInt((int) 2000));
			  String uuid ="";
			  String mac = String.valueOf((long) random.nextInt((int) 2000));
			  String imei = String.valueOf((long) random.nextInt((int) 2000));
			  String imeiID = String.valueOf((long) random.nextInt((int) 2000));
			  String os = osNames[random.nextInt(2)];
			  String device = "";
			  String osversion = versionNames[random.nextInt(7)];
			  String resolution = "";
			  String idaddress = "";
			  String playerid = String.valueOf((long) random.nextInt((int) 2000));
			  String profession = String.valueOf(random.nextInt((int) 12));
			  String createtime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
			
			  String online = onlineNames[random.nextInt(2)];
			  String logintime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
			  String logouttime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
			  
			  String onlinecount = String.valueOf((long) random.nextInt((int) 2000));
			  
			  
			   Long userID = 0L;
			   long pageID = 0L;
			   
			   //随机生成的用户ID 
			   if(unregisteredUsers[random.nextInt(8)] == 1) {
			    userID = null;
			   } else {
			    userID = (long) random.nextInt((int) 2000);
			   }
			   
			   
			   //随机生成的页面ID
			   pageID =  random.nextInt((int) 2000);
			   
			   //随机生成Channel
			   String channel = channelNames[random.nextInt(10)];
			   
			   //随机生成action行为
			   String action = actionNames[random.nextInt(2)];
			   
			   
			   logincountLogBuffer.append("{\"DateTime\":\"").append(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()))
			      			      .append("\",\"Type\":\"")
			      .append("OnlineCount")
			      .append("\",\"Misc1\":\"")
			      .append(ts)
			      .append("\",\"Misc2\":\"")
			      .append(gameid)
			      .append("\",\"Misc3\":\"")
			      .append(gameversion)
			      .append("\",\"Misc4\":\"")
			      .append(gameserverid)
			      .append("\",\"Misc5\":\"")
			      .append(channelid)
			      .append("\",\"Misc6\":\"")
			      .append(platfromid)
			      .append("\",\"Misc7\":\"")
			      .append(onlinecount)
			      .append("\",\"Misc8\":\"")
			      .append("")
			      .append("\",\"Misc9\":\"")
			      .append("")
			      .append("\",\"Misc10\":\"")
			      .append("")
			      .append("\",\"Misc11\":\"")
			      .append("")
			      .append("\",\"Misc12\":\"")
			      .append("")
			      .append("\",\"Misc13\":\"")
			      .append("")
			      .append("\",\"Misc14\":\"")
			      .append("")
			      .append("\",\"Misc15\":\"")
			      .append("")
			      .append("\",\"Misc16\":\"")
			      .append("")
			      .append("\",\"Misc17\":\"")
			      .append("")
			      .append("\",\"Misc18\":\"")
			      .append("")
			      .append("\",\"Misc19\":\"")
			      .append("")
			      .append("\",\"Misc20\":\"")
			      .append("")
			      .append("\"}"); 
			   
			    
			  return logincountLogBuffer.toString();
			  
			 }



//	public static void main(String[] args) throws Exception {
//		//为了颜色一致，我们用管理Err输出
//		System.err.println("---------- SpringMVC自动加载         ---------- ");
//		System.err.println("---------- 启动Netty线程池       ---------- ");
//		int port = 8000;
//
//		/* 说明
//		 * 如果此处不用线程池，直接用server.run()启动【直接调用方法而已】
//		 * 那么你会看到tomcat启动过程中，在启动了Netty后就会一直等待连接
//		 */
//		NettyServer server = new NettyServer();
//		//线程池
//		ExecutorService es = Executors.newCachedThreadPool();
//		//启动线程池
//		es.execute(server);
//	}
}