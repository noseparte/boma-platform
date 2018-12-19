package com.xmbl.ops.util;

import java.util.Comparator;

/**
 * Created by ljc on 2015/12/9.
 */
public class StringComparator implements Comparator<String> {
    @Override
    public  int compare(String X, String Y) {
        return X.compareTo(Y);
    }
}
