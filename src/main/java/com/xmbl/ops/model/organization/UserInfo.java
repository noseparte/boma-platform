package com.xmbl.ops.model.organization;

import lombok.Data;

import java.util.Date;


@Data
public class UserInfo {
	
	private Integer id;

    private String userKey;

    private String userName;

    private String userMobile;

    private String password;

    private String role;

    private String groupname;

	private String roleName;

    private String email;

    private Byte status;

    private Integer logLevel;

    private Integer teamId;

    private Date createTime;
 
    private Date updateTime;
    
    private String operator;
    
    
    private String idNumber;
    private String bank;
    private String province;
    private String city;
    private String county;
    private String bankSubbranch;
    private String bankCard;

    private Integer readid;

    private String statusForShow;

	private String orgName;

    public UserInfo() {
 		super();
 	}
    public UserInfo(String userKey, String userName, String idNumber, String bank,
    		String province, String city, String county,
    		String bankSubbranch, String bankCard, String password, Date updateTime,String operator) {
		this.userKey = userKey;
		this.userName = userName;
		this.idNumber = idNumber;
		this.bank = bank;
		this.province = province;
		this.city = city;
		this.county = county;
		this.bankSubbranch = bankSubbranch;
		this.bankCard = bankCard;
		this.password = password;
		this.updateTime= updateTime;
		this.operator= operator;		
	}
    public UserInfo(String userKey, String userName, String userMobile, String password,
    		String role, String groupname, Byte status,
    		Integer teamId, Date createTime ,Date updateTime,String operator) {
		this.userKey = userKey;
		this.userName = userName;
		this.userMobile = userMobile;
		this.password = password;
		this.role = role;
		this.groupname = groupname;
		this.status = status;
		this.teamId = teamId;
		this.createTime = createTime;
		this.updateTime= updateTime;
		this.operator= operator;
		
	}
    public UserInfo(Integer id ,String userKey, String userName,  String userMobile, String password,
    		String role, String groupname, Byte status,
    		Integer teamId, Date createTime ,Date updateTime,String operator) {
    	this.id = id;
		this.userKey = userKey;
		this.userName = userName;
		this.userMobile = userMobile;
		this.password = password;
		this.role = role;
		this.groupname = groupname;
		this.status = status;
		this.teamId = teamId;
		this.createTime = createTime;
		this.updateTime= updateTime;
		this.operator= operator;
	}

}