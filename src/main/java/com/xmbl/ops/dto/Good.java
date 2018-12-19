package com.xmbl.ops.dto;

import lombok.Data;

@Data
public class Good {
	 public Integer type;                        // 道具类型
     public Integer id;                          // 道具ID
     public Integer count;                       // 道具数量
     public Integer misc;                        // 魔数 绑定关系
     public Good() {
    	 super();
     }
     
     public Good(Integer type, Integer id, Integer count) {
    	 this.type = type;
    	 this.id = id;
    	 this.count = count;
    	 this.misc = 1;
     }
     
}
