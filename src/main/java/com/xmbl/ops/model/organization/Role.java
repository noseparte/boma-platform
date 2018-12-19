package com.xmbl.ops.model.organization;

import lombok.Data;

import java.util.Date;


@Data
public class Role {
    
	private Long id;

    private String roleName;

    private String roleSign;

    private String description;

    private Byte status;

    private String operator;

    private Date createtime;

    private Date updatetime;
    
    private Integer hasRole;
    
    
    public Role() {
		super();
    }
  
    public Role(String roleName, String roleSign, String description, Byte status, String operator,  Date date) {
    	this.roleName=roleName;
    	this.roleSign=roleSign;
    	this.description=description;
    	this.status=status;
    	this.operator=operator;
    	this.createtime=date;
    	this.updatetime=date;
    }
  
    public Role(Long id, String roleName, String roleSign, String description, Byte status, String operator,  Date date){
    	this.id=id;
	  	this.roleName=roleName;
	  	this.roleSign=roleSign;
	  	this.description=description;
	  	this.status=status;
	  	this.operator=operator;
	  	this.createtime=date;
	  	this.updatetime=date;
    }
}