package com.xmbl.ops.constant;

import com.xmbl.ops.util.PropertyUtil;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  GameServerConstant 
 * @创建时间:  2017年12月26日 下午6:44:47
 * @修改时间:  2017年12月26日 下午6:44:47
 * @类说明: 游戏服务器常量
 */
public class GameServerConstant {
		// 游戏服务器最多注册人数
		public static final Long GAME_SERVER_MOST_REGISTER_COUNT = 10000l; 
		// 商品发货ip  10.254.218.118
		public static String SEND_GOODS_IP = PropertyUtil.getProperty("conf/env.properties", "send_goos_ip");
		//	商品发货地址port  9223
		public static String SEND_GOODS_PORT = PropertyUtil.getProperty("conf/env.properties", "send_goos_port");
}
