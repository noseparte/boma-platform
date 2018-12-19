package com.xmbl.ops.itstack;

import com.xmbl.ops.itstack.netty.ChildChannelHandler;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;

public class NettyClient {
	public static void main(String[] args) {
		try {
			new NettyClient().connect("127.0.0.1", 5000);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void connect(String inetHost,int inetPort) throws Exception{
		
		EventLoopGroup group = new NioEventLoopGroup();
		
		try {
 
			Bootstrap b = new Bootstrap();
			
			b.group(group);								//group 组
			b.channel(NioSocketChannel.class);			//channel 通道
			b.option(ChannelOption.TCP_NODELAY, true);	//option 选项
			b.handler(new ChildChannelHandler());		//handler 处理
			
			//发起异步链接
			ChannelFuture f = b.connect(inetHost, inetPort);
			
			//等待客户端链路关闭
			f.channel().closeFuture().sync();
			
		} finally{
			group.shutdownGracefully();
		}
		
	}
}
