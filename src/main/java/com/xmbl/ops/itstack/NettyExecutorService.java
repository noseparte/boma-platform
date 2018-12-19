package com.xmbl.ops.itstack;

//@Service
public class NettyExecutorService {
//	@Resource(name = "taskExecutor")
//    private TaskExecutor taskExecutor;
    public NettyExecutorService() {
		
		//为了颜色一致，我们用管理Err输出
//		System.err.println("---------- SpringMVC自动加载         ---------- ");
//		System.err.println("---------- 启动Netty线程池       ---------- ");
//
//		/* 说明
//		 * 如果此处不用线程池，直接用server.run()启动【直接调用方法而已】
//		 * 那么你会看到tomcat启动过程中，在启动了Netty后就会一直等待连接
//		 */
//		NettyServer server = new NettyServer();
//		//线程池
//		ExecutorService es = Executors.newCachedThreadPool();//Executors 工厂方法 Executors.newCachedThreadPool()（无界线程池，可以进行自动线程回收）s
//		//启动线程池
//		es.execute(server);
              
       //taskExecutor.execute(server);
	}
}
