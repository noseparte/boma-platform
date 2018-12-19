package com.xmbl.ops.enumeration;

/**
 * 小米发送充值商品状态
 * @author sunbenbao
 *
 */
public enum XiaomiSendGoodsStateType {
	INIT(0,"0","INIT","数据初始化状态"),
	HTTP_CLIENT_ERROR(1,"1","","httpclient 远程连接不上"),
	HTTP_CLIENT_NO_DATA(2,"2","","httpclient 远程获取不到数据"),
	HTTP_CLIENT_FAIL(3,"3","","远程服务器充值失败"),
	HTTP_CLIENT_SUCCESS(4,"4","","远程服务器充值成功,充值发货订单更新成功"),
	;
	private XiaomiSendGoodsStateType (int id,String code,String codedesc, String desc) {
		this.id =id;
		this.code = code;
		this.codedesc = codedesc;
		this.desc=desc;
	}
	private int id;
	private String code;
	private String codedesc;
	private String desc;
	public int getId() {
		return id;
	}
	public String getCode() {
		return code;
	}
	public String getCodedesc() {
		return codedesc;
	}
	public String getDesc() {
		return desc;
	}
}
