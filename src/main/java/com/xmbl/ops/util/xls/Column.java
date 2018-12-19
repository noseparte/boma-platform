package com.xmbl.ops.util.xls;

/**
 * Excel Column Info.
 */
public class Column {
    private String name;
    private int width;
    private ColumnType columnType;

    private Column(String name, int width, ColumnType columnType) {
        super();
        this.name = name;
        this.width = width;
        this.columnType = columnType;
    }

    public static Column column(String name, int width) {
        return new Column(name, width, ColumnType.string);
    }

    public static Column column(String name) {
        return column(name, 10);
    }

    public static Column column(String name, ColumnType columnType) {
        return new Column(name, 10, columnType);
    }

    public String getName() {
        return name;
    }

    public int getWidth() {
        return width;
    }

    public ColumnType getColumnType() {
        return columnType;
    }
}