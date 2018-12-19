package com.xmbl.ops.model.mongo;

import lombok.Data;
import org.bson.types.ObjectId;

import java.util.Date;

@Data
public class GameReward {
	private ObjectId _id;
	private Long userId;// 玩家id
	private Long index;// 服务器id
	private String name;// 服务器名
	private String title;// 邮件标题
	private String content;// 邮件内容
	private String img;// 邮件上传图片
	private String goods;// 附件--物品，道具
	private Date createTime;// 执行时间
	private Long createAt;
	private Integer status;// 发送状态
	private String operator;// 操作人
	private Date updateTime;
	private Long updateAt;
	private String createTimeStr;
	private String startTimeStr;
	private String endTimeStr;
	private String goodsStr;
	private String typeStr;
	private String itemName;
	private String statusStr;

	public GameReward() {
		super();
	}

	public GameReward(Long index, Long userId, String title, String content, String img, String goods, Integer status,
			Date create_time, String operator) {
		this.index = index;
		this.userId = userId;
		this.content = content;
		this.img = img;
		this.title = title;
		this.goods = goods;
		this.createTime = create_time;
		this.createAt = create_time.getTime();
		this.status = status;
		this.operator = operator;
		this.updateTime = new Date();
		this.updateAt = System.currentTimeMillis();
	}

	public GameReward(Long index, Long userId, String title, String content, String goods, Integer status,
			Date create_time, String operator) {
		this.index = index;
		this.userId = userId;
		this.content = content;
		this.title = title;
		this.goods = goods;
		this.createTime = create_time;
		this.createAt = create_time.getTime();
		this.status = status;
		this.operator = operator;
		this.updateTime = new Date();
		this.updateAt = System.currentTimeMillis();
	}
}
