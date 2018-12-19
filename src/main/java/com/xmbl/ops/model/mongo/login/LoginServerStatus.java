package com.xmbl.ops.model.mongo.login;

import lombok.Data;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  LoginServerStatus 
 * @创建时间:  2018年5月28日 下午2:58:51
 * @修改时间:  2018年5月28日 下午2:58:51
 * @类说明:
 */
@Data
@Document(collection="login_server_status")
public class LoginServerStatus {
	// 登录服务器id
	@Id
	private String id;
	@CreatedBy
	private String create_by;
	@CreatedDate
	private Date create_date;
	@LastModifiedBy
	private String update_by;
	@LastModifiedDate
	private Date update_date;
	// 登录服务器编号
	private String server_id;
	// 登录服务器名字
	private String server_name;
	// 登录服务器公网ip(公网、内网ip唯一)
	private String pub_ip;
	// 登录服务器内网ip
	private String pri_ip;
	// 0 关闭状态 1 开启状态
	private Integer status = 0;

	public LoginServerStatus() {
		super();
	}
	
	public LoginServerStatus(String create_by , Date create_date, String server_id, String server_name, String pub_ip,
			String pri_ip, Integer status) {
		super();
		this.create_by = create_by;
		this.create_date = create_date;
		this.server_id = server_id;
		this.server_name = server_name;
		this.pub_ip = pub_ip;
		this.pri_ip = pri_ip;
		this.status = status;
	}


	
	
	
	
	
	
}
