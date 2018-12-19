package com.xmbl.ops.model.organization;

import lombok.Data;

import java.util.Date;
/**
 * 菜单id
 * @author sbb
 *
 */
@Data
public class Resources {

	// 菜单id
	private Integer id;

	// 菜单名称
    private String name;

    // 父菜单id
    private Integer parentid;

    // 菜单英文别名
    private String reskey;
    
    // 菜单图形标志
    private String icon;

    private Integer type;

    private String resurl;

    private Integer level;

    private String description;

    private Byte status;

    private String operator;

    private Date createtime;

    private Date updatetime;

    private Integer pid;

    private ResourcesRole resourcesRole;
    
    private Role role;
    

    private String levelTree;//生成表示树
    
    private boolean hasRole;//对应角色权限有无
  
    
    public Resources(){
    	super();
    }
    
    public Resources(String operator, Integer id, String name, String resUrl, String resKey,String icon,
			Integer parentId, Byte status, Integer pid, Integer type, Integer level, String description){
    	this.id = id;
    	this.name = name;
    	this.parentid = parentId;
    	this.reskey = resKey;
    	this.icon = icon;
    	this.type = type;
    	this.resurl = resUrl;
    	this.level = level;
    	this.description = description;
    	this.status = status;
    	this.createtime = new Date();
    	this.operator = operator;
    	this.pid = pid;
    }
    
    
}