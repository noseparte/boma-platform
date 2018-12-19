/*
* $Id$ Copyright (c) 2011 Qunar.com. All Rights Reserved.
*/
package com.xmbl.ops.util.xls;

import java.util.List;
import java.util.Objects;



/**
 *   构造一个xml格式的sheet, 形如:
 *   <Worksheet ss:Name="Sheet1">
 *     <Table ss:ExpandedColumnCount="5" ss:ExpandedRowCount="6" x:FullColumns="1"
 *         x:FullRows="1" ss:DefaultColumnWidth="54" ss:DefaultRowHeight="14.25">
 *         <Row ss:AutoFitHeight="0">
 *         <Cell><Data ss:Type="Number">11</Data></Cell>
 *         <Cell><Data ss:Type="Number">232</Data></Cell>
 *         <Cell><Data ss:Type="String">三地风俗</Data></Cell>
 *         <Cell ss:Index="5"><Data ss:Type="String">三地风俗</Data></Cell>
 *         </Row>
 *     </Table>
 *   </Worksheet>
 *
 *   调用方法 ：
 *
 *   XlsSheetBuilder builder = new XlsSheetBuilder()
 *   builder.appendHeader().appendContent().appendContent()...end()
 *
 *
 * @author: chenhonglei  Date: 12-11-27 Time: 下午4:13
 */
public class XlsSheetBuilder implements IExcelSheetBuilder {

    /**
     * sheet名字
     */
    private String sheetTitle;

    private XmlWorkbook workbook;

    private static final String TABLE_START = "<Table ss:DefaultColumnWidth=\"54\" ss:DefaultRowHeight=\"14.25\">";

    private static final String TABLE_END = "</Table>";

    public XlsSheetBuilder(XmlWorkbook workbook, String sheetTitle) {
        this.sheetTitle = sheetTitle;
        this.workbook = workbook;
        this.createHeader();
    }

    private void createHeader() {
        flushContent("<Worksheet ss:Name=\""+ this.sheetTitle +"\">");
        flushContent(TABLE_START);
    }

    private void createBottom() {
        flushContent(TABLE_END);
        flushContent("</Worksheet>");
    }

    @Override
    public IExcelSheetBuilder appendHeader(Column... headersParam) {
        StringBuilder sb = new StringBuilder();
        sb.append("<Row ss:AutoFitHeight=\"0\">");
        for(Column column : headersParam) {
            sb.append(createCell(column.getName()));
        }
        sb.append("</Row>");
        flushContent(sb.toString());
        return this;
    }

    @Override
    public IExcelSheetBuilder appendContent(List<Object> excelRow) {
        StringBuilder sb = new StringBuilder();
        sb.append("<Row ss:AutoFitHeight=\"0\">");
        for(Object obj : excelRow) {
            sb.append(createCell(Objects.toString(obj)));
        }
        sb.append("</Row>");
        flushContent(sb.toString());
        return this;
    }

    private String createCell(String value) {
        return  "<Cell><Data ss:Type=\"String\">"+ value +"</Data></Cell>";
    }

    private void flushContent(String content) {
        workbook.write(content);
    }

    @Override
    public void end() {
        createBottom();
    }

}
