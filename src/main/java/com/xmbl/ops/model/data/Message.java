package com.xmbl.ops.model.data;

import com.xmbl.ops.model.mongo.base.GeneralBean;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile --
 * @Version 1.0
 * @Description
 */
@Data
@Document(collection = "bm_data_message")
public class Message extends GeneralBean {

    private String code;
    private String phoneNumber;
    private int type;					  		  //类型 1.注册 2.找回密码  .....
    private Date sendTime;
    private Date overTime;
    private int status;

    public Message() {
        super();
    }

    public Message(String code, String phoneNumber,int type, Date sendTime, int status) {
        this.code = code;
        this.phoneNumber = phoneNumber;
        this.type =  type;
        this.sendTime = sendTime;
        this.overTime = getOverTime();
        this.status = status;
    }

    public static Date getOverTime(){
        return new Date((System.currentTimeMillis()+5*60*1000L));
    }

}
