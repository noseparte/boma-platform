package com.xmbl.ops.dto;

import lombok.Data;

import java.util.Date;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  AppVersionDto 
 * @创建时间:  2018年3月5日 下午8:00:58
 * @修改时间:  2018年3月5日 下午8:00:58
 * @类说明:
 */
@Data
public class AppVersionDto {
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
