/*
 * $Id$ Copyright (c) 2011 Qunar.com. All Rights Reserved.
 */
package com.xmbl.ops.util.xls;

import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.OutputStream;

/**
 * 一个对用于输出Excel的简单工具类, 生成格式为xlsx, 适用于2007后的版本
 *
 * 使用POI流式输出，目标是用符合DSL的友好语法渐进构建Excel
 *
 * for example:
 *
 *  XlsxBuilder excel = newExcel(os);
 *  excel.newSheet("sh1")
 *         .appendHeader(column("name"), column("age"), column("score"))
 *         .appendContent("chenhonglei", "**", "100")
 *         .appendContent("test", "21", "80");
 *  excel.newSheet("sh2)
 *         .appendHeader(column("key"), column("value"))
 *         .appendContent("test", "21")
 *         .autoSizeSheet();
 *  excel.flushAndClose();
 *
 *  定义header时可以使用column的重载方法，指定列宽度(字节)和列数据类型
 *  for example:
 *    column("price", 10, ColumnType.number)
 *
 *  tips：在一个sheet构建完成后可以调用autoSizeSheet()让excel自适应列宽, 但此方法在大数据时有性能问题，谨慎.
 *
 *  注意: 如果导出的一个sheet记录大于MAX_ROW_NUMBER(50000)时，
 *  会以50000(加header)自动分到多个sheet中，sheet名为"原sheet名-{1...2...3...}"
 *
 *  office 2010测试ok， 反正永中office是有问题
 *
 * @see XlsxSheetBuilder
 * @author chenhonglei
 * @version $Id$
 */
public final class XlsxBuilder implements IExcelBuilder {

    private static final Logger logger = LoggerFactory.getLogger(XlsxBuilder.class);

    private static final int BATCH_EXCEL_ROW = 100;  //表单数据在内存中的行数

    protected int rowNum = 0;  //当前表单的行数

    private SXSSFWorkbook workbook;

    private OutputStream os;

    private XlsxBuilder(OutputStream os) {
        workbook = new SXSSFWorkbook(BATCH_EXCEL_ROW);
        this.os = os;
    }

    public static XlsxBuilder newExcel(OutputStream os) {
        logger.info("开始构建导出对象");
        return new XlsxBuilder(os);
    }

    @Override
    public IExcelSheetBuilder newSheet(String sheetTitle) {
        logger.info("开始构建新sheet-{}", sheetTitle);
        return XlsxSheetBuilder.newSheetBuilder(workbook, sheetTitle);
    }


    @Override
    public void flushAndClose() {
        try {
            logger.info("开始对外输出excel内容");
            workbook.write(os);
            logger.info("输出excel结束");
        } catch (IOException e) {
            logger.error("导出excel异常, " + e.getMessage(), e);
        }
    }
}
