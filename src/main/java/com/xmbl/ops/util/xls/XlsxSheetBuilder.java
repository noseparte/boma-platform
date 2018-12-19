/*
 * $Id$ Copyright (c) 2011 Qunar.com. All Rights Reserved.
 */
package com.xmbl.ops.util.xls;

import com.google.common.base.Preconditions;
import com.google.common.collect.Lists;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 一个对用于输出Excel-Sheet的简单Facade.
 *
 *
 * @author li.su
 * @see XlsxBuilder
 * @version $Id$
 */
public final class XlsxSheetBuilder implements IExcelSheetBuilder {

    private static final Logger logger = LoggerFactory.getLogger(XlsxSheetBuilder.class);

    private static final int MAX_ROW_NUMBER = 50000; //一个表单中的最大行数

    private Sheet listSheet = null; //当前表单
    private List<Column> headers;
    private int lastRowIndex = 0;
    private Workbook workbook;
    private int headerSize;
    private int currentSheetNum = 1;
    private String sheetTitle;

    private XlsxSheetBuilder(Workbook workbook, String title) {
        this.sheetTitle = title;
        this.workbook = workbook;
        this.listSheet = this.workbook.createSheet(title);
    }

    static IExcelSheetBuilder newSheetBuilder(SXSSFWorkbook workbook, String title) {
        IExcelSheetBuilder builderWithXlsx = new XlsxSheetBuilder(workbook, title);
        return builderWithXlsx;
    }


    @Override
    public IExcelSheetBuilder appendHeader(Column... headersParam) {

        CellStyle headStyle = getDefaultHeaderStyle();
        List<Column> headers = Lists.newArrayList(headersParam);
        Row header = listSheet.createRow(lastRowIndex);
        for (int i = 0; i < headers.size(); i++) {
            Column item = headers.get(i);
            Cell cell = header.createCell(i);
            cell.setCellStyle(headStyle);
            cell.setCellValue(item.getName());
            this.listSheet.setColumnWidth(i, item.getWidth() * 256);
        }
        this.headers = headers;
        this.headerSize = headers.size();

        lastRowIndex++;

        return this;
    }


    public IExcelSheetBuilder autoSizeSheet() {
        for (int i = 0; i <headerSize; i++) {
            this.listSheet.autoSizeColumn(i);
        }
        return this;
    }


    /**
     * @param excelRow
     * @return
     */
    @Override
    public IExcelSheetBuilder appendContent(List<Object> excelRow) {

        Preconditions.checkNotNull(headers, "未设置excel头");

        Row row = this.listSheet.createRow(lastRowIndex);
        for (int i = 0; i < headerSize; ++i) {
            Column headerInfo = headers.get(i);
            switch (headerInfo.getColumnType()) {
                case bool:
                    row.createCell(i).setCellValue((Boolean) excelRow.get(i));
                    break;
                case string:
                    row.createCell(i).setCellValue((String)excelRow.get(i));
                    break;
                case number:
                    Object value = excelRow.get(i);
                    if (value instanceof Double) {
                        row.createCell(i).setCellValue((Double)value);
                        break;
                    }
                    if (value instanceof Integer) {
                        row.createCell(i).setCellValue((Integer)value);
                        break;
                    }
                    row.createCell(i).setCellValue(value.toString());
                    break;
                case rich_string:
                    row.createCell(i).setCellValue((RichTextString)excelRow.get(i));
                    break;
                case date:
                    Object date = excelRow.get(i);
                    if (date instanceof Date) {
                        row.createCell(i).setCellValue((Date)excelRow.get(i));
                        break;
                    }
                    if (date instanceof Calendar) {
                        row.createCell(i).setCellValue((Calendar)excelRow.get(i));
                        break;
                    }
                    row.createCell(i).setCellValue(excelRow.get(i).toString());
                    break;

                default:
                    row.createCell(i).setCellValue(excelRow.get(i).toString());
                    break;
            }

        }
        lastRowIndex++;

        rotateSheet();

        return this;
    }

    @Override
    public void end() {
    }

    /**
     * 数据滚入下一个Sheet.
     */
    private void rotateSheet() {
        if (lastRowIndex >= MAX_ROW_NUMBER) {
            logger.error("{}大于{}条自动新建下个sheet{}",
                    new Object[] {this.sheetTitle, MAX_ROW_NUMBER, currentSheetNum + 1});

            listSheet = workbook.createSheet(this.sheetTitle + "-" + (++currentSheetNum));
            lastRowIndex = 0;

            appendHeader(this.headers.toArray(new Column[this.headers.size()]));
        }
    }

    /**
     * 获取Header的样式
     * @return
     */
    protected CellStyle getDefaultHeaderStyle(){
        org.apache.poi.ss.usermodel.Font font = workbook.createFont();
        font.setBoldweight(Font.BOLDWEIGHT_BOLD);
        font.setFontHeightInPoints((short) 10);
        font.setFontName("ARIAL");

        CellStyle style = workbook.createCellStyle();
        style.setAlignment(CellStyle.ALIGN_CENTER);
        style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        style.setFont(font);
        return style;
    }

}
