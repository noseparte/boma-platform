package com.xmbl.ops.model.app;

import lombok.Data;

import java.util.Date;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  AppVersion 
 * @创建时间:  2018年3月5日 上午11:25:01
 * @修改时间:  2018年3月5日 上午11:25:01
 * @类说明:
 */
@Data
public class AppVersion {
	private String id;
	private String create_by;
	private Date create_date;
	private String update_by;
	private Date update_date;
	private String project;
	private String channel;
	private String version;
	private String desc_info;
	private Integer status = 1;
}
