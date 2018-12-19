/*
* $Id$ Copyright (c) 2011 Qunar.com. All Rights Reserved.
*/
package com.xmbl.ops.util.xls;

import java.util.List;

/**
 * @author: chenhonglei  Date: 12-11-27 Time: 下午2:19
 */
public interface IExcelSheetBuilder {

    IExcelSheetBuilder appendHeader(Column... headersParam);

    IExcelSheetBuilder appendContent(List<Object> excelRow);

    void end();

}
