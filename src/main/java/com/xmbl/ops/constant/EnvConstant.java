package com.xmbl.ops.constant;

import com.xmbl.ops.util.PropertyUtil;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名: EnvConstant
 * @创建时间: 2018年1月15日 上午11:28:34
 * @修改时间: 2018年1月15日 上午11:28:34
 * @类说明: 开发环境常量
 */
public class EnvConstant {

    public static String ENV = PropertyUtil.getProperty("conf/env.properties", "env");

    public final static int Normal = 0;
    public final static int Unusual = 1;
}
