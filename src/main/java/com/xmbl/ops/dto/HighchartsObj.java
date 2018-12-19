package com.xmbl.ops.dto;

import lombok.Data;

import java.util.List;

/**
 * highcharts 返回对象
 * @author sbb
 *
 */
@Data
public class HighchartsObj {
	private String name;
	private List<Integer> data;
}
