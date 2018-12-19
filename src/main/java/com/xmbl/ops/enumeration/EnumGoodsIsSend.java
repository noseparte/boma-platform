package com.xmbl.ops.enumeration;

public enum EnumGoodsIsSend {
	NO (0, "0", "失败"),
	YES (1, "1", "成功");

	private EnumGoodsIsSend(Integer id, String code,String desc) {
		this.id = id;
		this.code = code;
		this.desc = desc;
	}
	private int id;
	private String code;
	private String desc;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
}
