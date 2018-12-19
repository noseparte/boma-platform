package com.xmbl.ops.itstack.server;

import com.xmbl.ops.itstack.netty.ChildChannelHandler;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;

//@Component
public class NettyServer implements Runnable {

	public void run() {
		System.err.println("---------- 服务端开启等待连接 ----------");

		EventLoopGroup bossGroup = new NioEventLoopGroup();
		EventLoopGroup workerGroup = new NioEventLoopGroup();
		try {

			ServerBootstrap b = new ServerBootstrap();

			b.group(bossGroup, workerGroup);
			b.channel(NioServerSocketChannel.class);
			b.option(ChannelOption.SO_BACKLOG, 1024);
			b.childOption(ChannelOption.SO_KEEPALIVE, true); // (6)
			b.childHandler(new ChildChannelHandler());
			// 绑定端口
			ChannelFuture f = b.bind(6000).sync();

			// 等待服务端监听端口关闭
			f.channel().closeFuture().sync();

		} catch (Exception e) {
			System.err.println("---------- 服务端端口已绑定 ----------");
//			e.printStackTrace();
		} finally {
			bossGroup.shutdownGracefully();
			workerGroup.shutdownGracefully();
		}

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
