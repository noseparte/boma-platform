package com.xmbl.ops.itstack;

import com.xmbl.ops.itstack.server.NettyServer;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class InitializationNettyServer implements ApplicationListener<ContextRefreshedEvent> {
//	@Resource(name = "taskExecutor")
//    private TaskExecutor taskExecutor;
	@Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
      //需要执行的逻辑代码，当spring容器初始化完成后就会执行该方法。
		//为了颜色一致，我们用管理Err输出
				System.err.println("---------- SpringMVC自动加载         ---------- ");
				System.err.println("---------- 启动Netty线程池       ---------- ");

				/* 说明
				 * 如果此处不用线程池，直接用server.run()启动【直接调用方法而已】
				 * 那么你会看到tomcat启动过程中，在启动了Netty后就会一直等待连接
				 */
				NettyServer server = new NettyServer();
				//线程池
				ExecutorService es = Executors.newCachedThreadPool();//Executors 工厂方法 Executors.newCachedThreadPool()（无界线程池，可以进行自动线程回收）s
				//启动线程池
				es.execute(server);
		              
		       //taskExecutor.execute(server);
 }
}
