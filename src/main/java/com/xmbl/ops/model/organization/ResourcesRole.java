package com.xmbl.ops.model.organization;

import lombok.Data;

@Data
public class ResourcesRole {
    private Integer rescId;

    private Integer roleId;
    
    public ResourcesRole()
    {
    	super();
    }
    
    public ResourcesRole(Integer roleId, Integer rescId)
    {
    	this.roleId = roleId;
    	this.rescId = rescId;
    }

}