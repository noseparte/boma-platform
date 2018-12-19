package com.xmbl.ops.test;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.Date;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

//import kafka.javaapi.producer.Producer;
//import kafka.producer.KeyedMessage;
//import kafka.producer.ProducerConfig;
//import kafka.serializer.StringEncoder;


public class TaskGameApiServer implements Runnable {

	 private String topic = "test-topic";//发送给Kafka的数据的类别
//	 private Producer <Integer,String> producerForKafka;
	 private static String dateToday = new Date().toString();
	 private static Random random = new Random();
	 private static Logger logger = LoggerFactory.getLogger("test_kafka_log");	
	 private static Logger logger_kafka = LoggerFactory.getLogger("kafka_log");	
	 
	 @Override
	 public void run() {
//		 Producer producer = createProducer();
		 int counter = 0; //搞500条
	     String Result="";
	     JSONObject resObj = new JSONObject();
		 while(true){  //模拟实际情况，不断循环，异步过程，不可能是同步过程
			 counter++;
			
			 System.out.println("product:"+counter +"--num:" + counter++);
//			 logger.info("product:"+userLog);
//			 producer.send(new KeyedMessage<Integer, String>(topic, userLog));//send是核心代码

			 HttpClient httpClient =  new HttpClient();
			
					httpClient.getParams().setSoTimeout(100);
					httpClient.getParams().setConnectionManagerTimeout(100);
					httpClient.getHttpConnectionManager().getParams().setSoTimeout(100);
					
		        GetMethod getMethod = new GetMethod("http://120.92.3.242:8086/platform/api/server/gmservers"); 	
//			    GetMethod getMethod = new GetMethod("http://192.168.0.124:8080/platform/api/server/gmservers"); 	
//				PostMethod postMethod = new PostMethod("http://192.168.0.124:8080/platform/api/server/gmservers");
//				HttpMethodParams param = postMethod.getParams();
//				param.setContentCharset("UTF-8");
				//另外设置http client的重试次数，默认是3次；当前是禁用掉（如果项目量不到，这个默认即可）
//				param.setParameter(HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler(0, false));
//				int statuscode = httpClient.executeMethod(postMethod);
//				Result = postMethod.getResponseBodyAsString();
			    try {
			    	//执行getMethod
			    	Long startTime = System.currentTimeMillis();
			    	int statusCode = httpClient.executeMethod(getMethod);
			    	Long endTime = System.currentTimeMillis();
					Long executeTime = endTime - startTime;
			    	System.out.println(statusCode);
			    	logger_kafka.info("----"+statusCode +"执行时间--"+executeTime);
			    	if (statusCode != HttpStatus. SC_OK) {
			    	System.err.println("Method failed: "
			    	+ getMethod.getStatusLine());
			    	
			    	}
			    	//读取内容
			    	byte[] responseBody = getMethod.getResponseBody();
			    	//处理内容
			    	System.out.println (new String(responseBody));
			    	logger_kafka.info("结果----"+new String(responseBody));
			    	} catch (HttpException e) {
			    	//发生致命的异常，可能是协议不对或者返回的内容有问题
			    	System.out.println("Please check your provided http address!");
			    	e.printStackTrace();
			    	} catch (IOException e) {
			    	//发生网络异常
			    	e.printStackTrace();
			    	} finally {
			    	//释放连接
			    	getMethod.releaseConnection();
			    	}
			 
			 if(0 == counter%500){
				 counter = 0;
				 try {
					 Thread.sleep(100000);
				 } catch (InterruptedException e) {
					 // TODO Auto-generated catch block
					 e.printStackTrace();
				 }
			 }
		 }
	 }

		
		

	@Autowired
	public static void main(String[] args) throws Exception {
		//为了颜色一致，我们用管理Err输出
		System.err.println("---------- SpringMVC自动加载         ---------- ");
		System.err.println("---------- 启动Netty线程池       ---------- ");

		/* 说明
		 * 如果此处不用线程池，直接用server.run()启动【直接调用方法而已】
		 * 那么你会看到tomcat启动过程中，在启动了Netty后就会一直等待连接
		 */
		TaskGameApiServer server = new TaskGameApiServer();
		//线程池
		ExecutorService es = Executors.newCachedThreadPool();
		//启动线程池
//		es.execute(server);
	}
}