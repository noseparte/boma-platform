package com.xmbl.ops.model.user;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Copyright © 2017 noseparte(Libra) © Like the wind, like rain
 * 
 * @Author Noseparte
 * @Compile 2017年10月25日 -- 下午4:32:05
 * @Version 1.0
 * @Description	移动端用户第三方信息
 */
@Data
@Document(collection = "bm_app_user_info_data")
public class UserInfoData extends GeneralBean {
	
	private String 							openId;				//第三方用户token
	private String 							openType;			//第三方类型 {"微博":"MicroBlog","腾讯":"Tencent","微信":"WeChat"}
	private int 							openState;			//是否绑定
	private String							openRemark;			//备注
	private Date							bindTime;			//绑定时间
	private int 							is_delete;			//是否删除
	private String 							userkey;			//用户
	
	public UserInfoData() {
		super();
	}

	public UserInfoData(String openId, String openType, int openState, String openRemark, Date bindTime, String userkey) {
		this.openId = openId;
		this.openType = openType;
		this.openState = openState;
		this.openRemark = openRemark;
		this.bindTime = bindTime;
		this.userkey = userkey;
	}
}
