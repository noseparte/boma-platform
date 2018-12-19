package com.xmbl.ops.itstack.netty;

import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelHandlerContext;

 
public class EchoServerHandler extends ChannelHandlerAdapter { // (1)

 

    public void channelRead(ChannelHandlerContext ctx, Object msg) { // (2)

       ctx.write(msg); // (1)

       ctx.flush(); // (2)

    }

 

    @Override

    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) { // (4)

       // Close theconnection when an exception is raised.

       cause.printStackTrace();

       ctx.close();

    }

}