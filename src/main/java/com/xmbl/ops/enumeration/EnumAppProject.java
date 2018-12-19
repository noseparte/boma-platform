package com.xmbl.ops.enumeration;

public enum EnumAppProject {
	SANXIAO (1,"1","sanxiao","三消项目");
	
	private EnumAppProject(int id, String code, String name, String desc) {
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