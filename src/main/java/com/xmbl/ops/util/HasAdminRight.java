package com.xmbl.ops.util;

import com.xmbl.ops.constant.GroupNameConstant;

public class HasAdminRight {

	public static boolean hasAdminRight(String groupName) { //判断是否有Admin权限
		if (GroupNameConstant.ADMIN.equals(groupName))
			return true;
		else 
			return false;
				
	}
}
