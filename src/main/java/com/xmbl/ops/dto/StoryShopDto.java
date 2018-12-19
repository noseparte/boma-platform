package com.xmbl.ops.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  StoryShopDto 
 * @创建时间:  2018年3月9日 下午3:30:12
 * @修改时间:  2018年3月9日 下午3:30:12
 * @类说明:
 */
@Data
public class StoryShopDto {
	@Id
	private String _id;
	private String id;
	// 故事商店名字
	private String name;
	private Integer downloads;
	private Integer todayDownloads;
	private Integer openCount;
	private Integer monthOpenCount;
	// 上月打开次数
	private Integer preMonthOpenCount;
	private Integer todayOpenCount;
	// 昨天打开次数
	private Integer preTodayOpenCount;
	private Integer hourOpenCount;
	// 前一小时打开次数
	private Integer preHourOpenCount;
	// 商店系数
	private Integer rv;
	// 商店系数比例
	private Integer rvRadio;
	// 商店统计综合分值
	private Integer recommend;
	// 创建人姓名
	private String authorName;
}
