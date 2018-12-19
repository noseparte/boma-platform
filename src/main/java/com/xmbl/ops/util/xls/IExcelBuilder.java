/*
* $Id$ Copyright (c) 2011 Qunar.com. All Rights Reserved.
*/
package com.xmbl.ops.util.xls;

/**
 * @author: chenhonglei  Date: 12-11-27 Time: 下午2:13
 */
public interface IExcelBuilder {

    IExcelSheetBuilder newSheet(String sheetTitle);

    void flushAndClose();

}
