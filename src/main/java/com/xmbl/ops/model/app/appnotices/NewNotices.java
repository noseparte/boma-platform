package com.xmbl.ops.model.app.appnotices;

import lombok.Data;

import java.util.Date;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  Notices 
 * @创建时间:  2018年3月13日 下午2:16:26
 * @修改时间:  2018年3月13日 下午2:16:26
 * @类说明: 公告服务器通知公告表
 */
@Data
public class NewNotices {
	// 唯一id
	private String _id;
	// 创建时间
	private Date createDate;
	// 创建人
	private String createBy;
	// 修改时间 
	private Date updateDate;
	// 修改人
	private String updateBy;
	// 公告标题
	private String title;
	// 公告内容
	private String content;
	// 发送时间
	private Date sendDate;
	// 项目类型
	private String proTypeCode;
	// 应用类型
	private String appTypeCode;
	// 排序
	private Integer order;
	// 公告状态  -1 删除  0 下架 1 发布  
	private Integer status = 1;
}
