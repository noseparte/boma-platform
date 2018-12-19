package com.xmbl.ops.constant;

/**
 * 付款的服务器IP和对应端口配置
 * @author sunbenbao
 *
 */
public class PaymentConstant {
	public static String PAYMENT_IP = "10.254.218.118";
	public static String PAYMENT_PORT = "9223";
	public static Integer PAYMENT_SERVER_ID = 1;
	
	//测试商户号
	//	public static final String MCHID = "M9144030035873982X0";// M123456999999999  M9144030035873982X0
	//商户号
	public static final String MCHID = "M91310114312299857Y";// M123456999999999  M9144030035873982X0
	
	//测试商户密钥
	//	public static final String RSA_PRIVATE =
	//	"MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALys+oYaxqv4FYju"+
	//	"8C1poM6qmHLjWPnXzqEJT0NxyFXgdaK/Qe9DcpcASod9mIAdlLIxJEyYNlWeonAJ"+
	//	"VYW8pQ+pTVGwI9n0iaT71ldWQzcMN3Dvi/+zpgw3HxxO7HJtEIlR84pvILv1yceC"+
	//	"ZCqqQ4O/4SemsG00oTiTyD3SM2ZvAgMBAAECgYBLToeX6ywNC7Icu7Hljll+45yB"+
	//	"jri+0CJLKFoYw1uA21xYnxoEE9my54zX04uA502oafDhGYfmWLDhIvidrpP6oalu"+
	//	"URb/gbV5Bdcm98gGGVgm6lpK+G5N/eawXDjP0ZjxXb114Y/Hn/oVFVM9OqcujFSV"+
	//	"+Wg4JgJ4Mmtdr35gYQJBAPbhx030xPcep8/dL5QQMc7ddoOrfxXewKcpDmZJi2ey"+
	//	"381X+DhuphQ5gSVBbbunRiDCEcuXFY+R7xrgnP+viWcCQQDDpN8DfqRRl+cUhc0z"+
	//	"/TbnSPJkMT/IQoFeFOE7wMBcDIBoQePEDsr56mtc/trIUh/L6evP9bkjLzWJs/kb"+
	//	"/i25AkEAtoOf1k/4NUEiipdYjzuRtv8emKT2ZPKytmGx1YjVWKpyrdo1FXMnsJf6"+
	//	"k9JVD3/QZnNSuJJPTD506AfZyWS6TQJANdeF2Hxd1GatnaRFGO2y0mvs6U30c7R5"+
	//	"zd6JLdyaE7sNC6Q2fppjmeu9qFYq975CKegykYTacqhnX4I8KEwHYQJAby60iHMA"+
	//	"YfSUpu//f5LMMRFK2sVif9aqlYbepJcAzJ6zbiSG5E+0xg/MjEj/Blg9rNsqDG4R"+
	//	"ECGJG2nPR72O8g==";
	//商户密钥
	public static final String RSA_PRIVATE =
	"MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAOwDaV9UUUVeXsEW"+
	"68wDUeJ0kTcrGIUM87PY/k6rFPeaZqKNbFURZKPNcsyjO36LuFFF0veiJMKkQbQi"+
	"w9q8CoDHtMkZTWVr52xBrPNlYp98nID+IJ0E1hzNFwM0bR9YhBMuTQbXpPcEHrY0"+
	"VcvDPYHBD21fLuTFRaL7Dj6BwNxtAgMBAAECgYA56Uhk1NqwS8yyUn5/a90e1P2A"+
	"7PkyRJBT9A3Knd4iN2exwUPwx7jLHLFrly4VChGrF5gBnW6puAZLPjCSrotgv3f8"+
	"/agcotNQmi6kDU8CB2SwqakFkeL6E58Uk7+7OX6zt/yK4SCRnInvzPdwVa+FPFtx"+
	"/Ngyqxu7d3OsviqqwQJBAPsgw9sEssrdKJxWQxLgnfVvdHfngmceRd3ZhgyLVtvL"+
	"7WTyO7dUQUA57qwyzYB7e1npXoKL6/BlbdT/vIAgB90CQQDwl5RAxAlkDbpVQphA"+
	"wbnaO2Qz7Lwix53GOrMoOi8dspKJd0aBxEoBST3McWxfkwg8UIqdXrOPsxlJaVMw"+
	"naXRAkA/oLyfGKCob8KjYePau5iqIBQ1cS4ELJJtNHkXYpKeXBwJEKr6t1lVCZik"+
	"fra80Ayf6lYs44DjRv++ERHUsMjtAkBJkoDSgWBByXTmp7O5ccRsuOa+fjFWDWbw"+
	"/HhW39wSn83x3ZihDC55UDVmtHSokWTeVN7emtwcIG+mJGA9KKhRAkEA1jCnhFYd"+
	"TArwU9ZrIYMP7B5VuLQFmw+005UER0jjALNs8JgBEDIi1lnTC6ZD7qTpk8AXuFxU"+
	"pfreVpGiSjeAog==";
	
	// channel 支付渠道
	public static String CHANNEL_WX = "wx";
	public static String CHANNEL_ALIPAY = "alipay";
	public static String CHANNEL_SEVENPAY = "sevenpay";
	
	// service 支付服务类型
	// 一码收银     备注:未接入
	public static String SERVICE_ONECODE_PAY = "onecode.coll.pay";
	// PC端收银台  备注；未接入
	public static String SERVICE_PC_GATEWAY_PAY = "pc。gateway.pay";
	// 手机网页端公众号    备注；未接入
	public static String SERVICE_H5_GATEWAY_PAY = "h5.gateway.pay";
	// 原生H5支付     备注；未接入
	public static String SERVICE_H5T_GATEWAY_PAY = "h5_t.gateway.pay";
	// 手机支付插件收银台   
	public static String SERVICE_MOBILE_PLUGIN_PAY = "mobile.plugin.pay";
	// 交易结果查询    备注；未接入
	public static String SERVICE_QUERY_ORDER_STATUS = "mch.query.orderstatus";
	// 商户退款   备注；未接入
	public static String SERVICE_MCH_REFUND = "mch.refund";
	// 商户转账      备注；未接入
	public static String SERVICE_MCH_TRANSFER = "mch.transfer";

	// inputCharset
	public static String INPUTCHAR="UTF-8";
	
	//	http://combinedpay.qifenqian.com/gateway.do
	//  测试环境：http://zt.qifenmall.com/gateway.do
	//pgUrl 该链接在游戏后端平台没有使用     目前接入安卓开发包中调用该链接
	public static String PGURL ="http://combinedpay.qifenqian.com/gateway.do";
	
	//bgUrl 七分钱订单支付成功   - 第三方回调用游戏后端支付平台url
	public static String BGURL ="http://120.92.3.242:9086/platform/pay/api/rechage/sevenpay";
	
	//安卓 手机  电脑 调用  游戏后端平台的url  备注该链接给手机端调用 用户生成购买的订单
	public static String AndrodAndIosAndPcUrl ="http://120.92.3.242:9086/platform/pay/api/order/senvenpay";
	
	// version 支付版本 网关版本
	public static String VERSION = "v1.0";
	
	// pageLanguage = 1 表示中文
	public static String PAGELANGUAGE = "1";
	
	// signType
	public static String SIGNTYPE = "RSA";
	
	// payerId 付款人  不确定 对应游戏玩家
	//	private static StringF payerId;
	// 付款类型 固定值
	public static String PAYTYPE = "1";
	
	// 订单超时时间
	public static String ORDER_TIME_OUT = "3600";
	
}
