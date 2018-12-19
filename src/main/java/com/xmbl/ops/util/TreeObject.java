package com.xmbl.ops.util;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;


/**
 * 这个是列表树形式显示的实体,
 * 这里的字段是在前台显示所有的,可修改
 */
@Data
public class TreeObject {
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getParentId() {
		return parentId;
	}
	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getParentName() {
		return parentName;
	}
	public void setParentName(String parentName) {
		this.parentName = parentName;
	}
	public String getResKey() {
		return resKey;
	}
	public void setResKey(String resKey) {
		this.resKey = resKey;
	}
	public String getResUrl() {
		return resUrl;
	}
	public void setResUrl(String resUrl) {
		this.resUrl = resUrl;
	}
	public Integer getLevel() {
		return level;
	}
	public void setLevel(Integer level) {
		this.level = level;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getPid() {
		return pid;
	}
	public void setPid(Integer pid) {
		this.pid = pid;
	}
	public String getTreeDesc() {
		return treeDesc;
	}
	public void setTreeDesc(String treeDesc) {
		this.treeDesc = treeDesc;
	}
	public List<TreeObject> getChildren() {
		return children;
	}
	public void setChildren(List<TreeObject> children) {
		this.children = children;
	}
	private Integer id;
	private Integer parentId;
	private String name;
	private String parentName;
	private String resKey;
	private String resUrl;
	private Integer level;
	private Integer type;
	private String icon;
	private String description;
	private Integer pid;
	private String  treeDesc;
	private List<TreeObject> children = new ArrayList<TreeObject>();
}
