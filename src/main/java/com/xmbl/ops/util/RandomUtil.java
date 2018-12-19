package com.xmbl.ops.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class RandomUtil {
	
	public static <T> List<T> subList(List<T> list, int minSize, int maxSize) {
		Random random = new Random();
		int total = list.size();
		int subsize = Math.min(random.nextInt(maxSize - minSize) + minSize, total);
		List<T> subList = new ArrayList<>(subsize);
		for(int i = 0; i < subsize;) {
			T t = list.get(random.nextInt(total));
			if(!subList.contains(t)) {
				subList.add(t);
				i++;
			}
		}
		return subList;
	}
	
	public static <T> T randomItem(List<T> list) {
		int total = list.size();
		if(total < 0) return null;
		Random random = new Random();
		return list.get(random.nextInt(total));
	}
	
}
