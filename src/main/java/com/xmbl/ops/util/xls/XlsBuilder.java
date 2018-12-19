/*
* $Id$ Copyright (c) 2011 Qunar.com. All Rights Reserved.
*/
package com.xmbl.ops.util.xls;


import java.io.OutputStream;

/**
 * 生成excel的builder类, 适用于2007之前的版本, 生成格式为xml
 *
 * 使用：
 *  XlsBuilder builder = new XlsBuilder(os);
 *  IExcelSheetBuilder sheet1 = builder.newExcel();
 *  sheet1.appendHeader().appendContent().appendContent().end();
 *  IExcelSheetBuilder sheet2 = builder.newExcel();
 *  sheet2.appendHeader().appendContent().appendContent().end();
 *  builder.flushAndClose();
 *
 *
 * @author: chenhonglei  Date: 15-03-12 Time: 上午10:12
 */
public class XlsBuilder implements IExcelBuilder {

    private XmlWorkbook workbook;

    private static final String EXCEL_HEADER = "<?xml version=\"1.0\"?>\n" +
            "<?mso-application progid=\"Excel.Sheet\"?>\n" +
            "<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"\n" +
            " xmlns:o=\"urn:schemas-microsoft-com:office:office\"\n" +
            " xmlns:x=\"urn:schemas-microsoft-com:office:excel\"\n" +
            " xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\"\n" +
            " xmlns:html=\"http://www.w3.org/TR/REC-html40\">\n";

    private static final String EXCEL_PROPERTIES = "<DocumentProperties xmlns=\"urn:schemas-microsoft-com:office:office\">\n" +
            "  <Author>qunar.com</Author>\n" +
            "  <Company>qunar.com</Company>\n" +
            "  <Version>11.5606</Version>\n" +
            " </DocumentProperties>";

    private static final String EXCEL_STYLE = "<Styles>\n" +
            "  <Style ss:ID=\"Default\" ss:Name=\"Normal\">\n" +
            "   <Alignment ss:Vertical=\"Center\"/>\n" +
            "   <Borders/>\n" +
            "   <Font ss:FontName=\"宋体\" x:CharSet=\"134\" ss:Size=\"12\"/>\n" +
            "   <Interior/>\n" +
            "   <NumberFormat/>\n" +
            "   <Protection/>\n" +
            "  </Style>\n" +
            " </Styles>";

    private static final String EXCEL_BOTTOM = "</Workbook>";

    private XlsBuilder(OutputStream os) {
        this.workbook = new XmlWorkbook(os);
    }

    public static XlsBuilder newExcel(OutputStream os) {
        XlsBuilder builder = new XlsBuilder(os);
        builder.createHeader();
        return builder;
    }

    private void createHeader() {
        flushContent(EXCEL_HEADER);
        flushContent(EXCEL_PROPERTIES);
        flushContent(EXCEL_STYLE);
    }

    private void createBottom() {
        flushContent(EXCEL_BOTTOM);
    }

    private void flushContent(String content) {
        workbook.write(content);
    }

    @Override
    public IExcelSheetBuilder newSheet(String sheetTitle) {
        return new XlsSheetBuilder(workbook, sheetTitle);
    }

    @Override
    public void flushAndClose() {
        createBottom();
        workbook.flush();
        workbook.close();
    }

}
