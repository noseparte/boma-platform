package com.xmbl.ops.enumeration;

public enum EnumAppProjectChannel {
	V360_WANGPAN (1,"1","360_wangpan","360网盘"),
	VBD_YUNPAN(2,"2","bd_yunpan","百度云盘"),
	VQQ (3,"3","qq","扣扣"),
	VWX (4,"4","wx","微信")
	;
	
	private EnumAppProjectChannel(int id, String code, String name, String desc){
		this.id = id;
		this.code = code;
		this.name = name;
		this.desc = desc;
	}
	private int id;
	private String code;
	private String name;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	
}