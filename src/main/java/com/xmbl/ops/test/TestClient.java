package com.xmbl.ops.test;

public class TestClient {
//    public void connect(String host, int port, final ERequestType requestType)  
//            throws Exception {  
//        EventLoopGroup workerGroup = new NioEventLoopGroup();  
//        String msg = "Are you ok?";  
//        if (ERequestType.SOCKET.equals(requestType)) {  
//            try {  
//                Bootstrap b = new Bootstrap();  
//                b.group(workerGroup);  
//  
//                b.channel(NioSocketChannel.class).option(  
//                        ChannelOption.TCP_NODELAY, true);  
//                b.option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000);  
//                b.handler(new ChannelInitializer<SocketChannel>() {  
//                    @Override  
//                    protected void initChannel(SocketChannel ch)  
//                            throws Exception {  
//                        ch.pipeline().addLast(  
//                                "encode",  
//                                new LengthFieldBasedFrameDecoder(  
//                                        Integer.MAX_VALUE, 0, 4, 0, 4));  
//                        ch.pipeline().addLast("decode",  
//                                new LengthFieldPrepender(4));  
//                        ch.pipeline().addLast("handler",  
//                                new ClientInboundHandler());  
//                    }  
//                });  
//                ChannelFuture f = b.connect(host, port).sync();  
//                ByteBuf messageData = Unpooled.buffer();  
//                messageData.writeInt(999);  
//                messageData.writeInt(msg.length());  
//                messageData.writeBytes(msg.getBytes());  
//                f.channel().writeAndFlush(messageData).sync();  
//                f.channel().closeFuture().sync();  
//  
//            } catch (Exception e) {  
//                e.printStackTrace();  
//            }  
//  
//        } else if (ERequestType.HTTP.equals(requestType)) {  
//  
//            Bootstrap b = new Bootstrap();  
//            b.group(workerGroup);  
//            b.channel(NioSocketChannel.class);  
//            b.option(ChannelOption.SO_KEEPALIVE, true);  
//            b.handler(new ChannelInitializer<SocketChannel>() {  
//                @Override  
//                public void initChannel(SocketChannel ch) throws Exception {  
//  
//                    // 客户端接收到的是httpResponse响应，所以要使用HttpResponseDecoder进行解码  
//                    ch.pipeline().addLast(new HttpResponseDecoder());  
//                    // 客户端发送的是httprequest，所以要使用HttpRequestEncoder进行编码  
//                    ch.pipeline().addLast(new HttpRequestEncoder());  
//                    ch.pipeline().addLast(new ClientInboundHandler());  
//  
//                }  
//            });  
//            ChannelFuture f = b.connect(host, port).sync();  
//            b.channel(NioSocketChannel.class).option(ChannelOption.TCP_NODELAY,true);  
//            b.option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000);  
//  
//            URI uri = new URI("http://" + host + ":" + port);  
//  
//            DefaultFullHttpRequest request = new DefaultFullHttpRequest(  
//                    HttpVersion.HTTP_1_1, HttpMethod.POST, uri.toASCIIString(),  
//                    Unpooled.wrappedBuffer(msg.getBytes("UTF-8")));  
//  
//            // 构建http请求  
//            request.headers().set(HttpHeaders.Names.HOST, host);  
//            request.headers().set(HttpHeaders.Names.CONNECTION,  
//                    HttpHeaders.Values.KEEP_ALIVE);  
//            request.headers().set(HttpHeaders.Names.CONTENT_LENGTH,  
//                    request.content().readableBytes());  
//            // 发送http请求  
//            f.channel().write(request);  
//            f.channel().flush();  
//            f.channel().closeFuture().sync();  
//        }  
//  
//        try {  
//        } finally {  
//            workerGroup.shutdownGracefully();  
//        }  
//  
//    }  
//  
//    public static void main(String[] args) throws Exception {  
//        TestClient client = new TestClient();  
//        client.connect("127.0.0.1", 5000, ERequestType.SOCKET);  
//    }  
}  