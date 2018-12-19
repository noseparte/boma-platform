package com.xmbl.ops.interceptor.mybatisInterceptor.page;

import org.apache.ibatis.executor.ErrorContext;
import org.apache.ibatis.executor.ExecutorException;
import org.apache.ibatis.executor.statement.PreparedStatementHandler;
import org.apache.ibatis.executor.statement.RoutingStatementHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.mapping.ParameterMode;
import org.apache.ibatis.plugin.*;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.property.PropertyTokenizer;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.type.TypeHandler;
import org.apache.ibatis.type.TypeHandlerRegistry;

import javax.xml.bind.PropertyException;
import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/** 
 * 分页拦截器 
 *  
 * @author  
 */  
@Intercepts({ @Signature(type = StatementHandler.class, method = "prepare", args = { Connection.class,Integer.class})})  
public class PagePlugin implements Interceptor {  
  
    private static String dialect = "";  
    private static String pageSqlId = "";  
  
    public Object intercept(Invocation ivk) throws Throwable {  
        if ((ivk.getTarget() instanceof RoutingStatementHandler)) {  
            RoutingStatementHandler statementHandler = (RoutingStatementHandler) ivk.getTarget();  
            // 通过反射获取到当前RoutingStatementHandler对象的delegate属性  
            PreparedStatementHandler delegate = (PreparedStatementHandler) ReflectHelper  
                    .getValueByFieldName(statementHandler, "delegate");  
             // 通过反射获取delegate父类BaseStatementHandler的mappedStatement属性   
            MappedStatement mappedStatement = (MappedStatement) ReflectHelper.getValueByFieldName(delegate,  
                    "mappedStatement");  
             // 获取方法名，如果方法是以PAGE结尾的，则加工sql语句，添加分页  
            if (mappedStatement.getId().matches(pageSqlId)) {  
                BoundSql boundSql = delegate.getBoundSql();  
                Object parameterObject = boundSql.getParameterObject();  
                if (parameterObject == null) {  
                    throw new NullPointerException("parameterObject");  
                }  
                Connection connection = (Connection) ivk.getArgs()[0];  
                String sql = boundSql.getSql();  
                String countSql = "select count(0) from (" + sql + ") tt ";  
                PreparedStatement countStmt = connection.prepareStatement(countSql);  
                BoundSql countBS = new BoundSql(mappedStatement.getConfiguration(), countSql,  
                        boundSql.getParameterMappings(), parameterObject);  
  
                Field metaParamsField = ReflectUtil.getFieldByFieldName(boundSql, "metaParameters");  
                if (metaParamsField != null) {  
                    MetaObject mo = (MetaObject) ReflectUtil.getValueByFieldName(boundSql, "metaParameters");  
                    ReflectUtil.setValueByFieldName(countBS, "metaParameters", mo);  
                }  
                setParameters(countStmt, mappedStatement, countBS, parameterObject);  
                ResultSet rs = countStmt.executeQuery();  
                int count = 0;  
                if (rs.next()) {  
                    count = rs.getInt(1);  
                }  
                rs.close();  
                countStmt.close();  
  
                PageBean page = null;  
                if ((parameterObject instanceof PageBean)) {  
                    page = (PageBean) parameterObject;  
                    page.setTotalCount(count);  
                } else if ((parameterObject instanceof Map)) {  
                    Map map = (Map) parameterObject;  
                    page = (PageBean) map.get("page");  
                    if (page == null) {  
                        page = new PageBean(-1);  
                    }  
                    page.setTotalCount(count);  
                } else {  
                    Field pageField = ReflectHelper.getFieldByFieldName(parameterObject, "page");  
                    if (pageField != null) {  
                        page = (PageBean) ReflectHelper.getValueByFieldName(parameterObject, "page");  
                        if (page == null) {  
                            page = new PageBean(-1);  
                        }  
                        page.setTotalCount(count);  
                        ReflectHelper.setValueByFieldName(parameterObject, "page", page);  
                    } else {  
                        throw new NoSuchFieldException(parameterObject.getClass().getName());  
                    }  
                }  
                String pageSql = generatePageSql(sql, page);  
                ReflectHelper.setValueByFieldName(boundSql, "sql", pageSql);  
            }  
        }  
        Object o = ivk.proceed();  
        return o;  
    }  
  
    public Object plugin(Object arg0) {  
        return Plugin.wrap(arg0, this);  
    }  
  
    public void setProperties(Properties p) {  
        dialect = p.getProperty("dialect");  
        if ((dialect == null) || (dialect.equals(""))) {  
            try {  
                throw new PropertyException("dialect property is not found!");  
            } catch (PropertyException e) {  
                e.printStackTrace();  
            }  
        }  
        pageSqlId = p.getProperty("pageSqlId");  
        if ((dialect == null) || (dialect.equals(""))) {  
            try {  
                throw new PropertyException("pageSqlId property is not found!");  
            } catch (PropertyException e) {  
                e.printStackTrace();  
            }  
        }  
    }  
  
    private void setParameters(PreparedStatement ps, MappedStatement mappedStatement, BoundSql boundSql,  
            Object parameterObject) throws SQLException {  
        ErrorContext.instance().activity("setting parameters").object(mappedStatement.getParameterMap().getId());  
        List parameterMappings = boundSql.getParameterMappings();  
        if (parameterMappings != null) {  
            Configuration configuration = mappedStatement.getConfiguration();  
            TypeHandlerRegistry typeHandlerRegistry = configuration.getTypeHandlerRegistry();  
            MetaObject metaObject = parameterObject == null ? null : configuration.newMetaObject(parameterObject);  
            for (int i = 0; i < parameterMappings.size(); i++) {  
                ParameterMapping parameterMapping = (ParameterMapping) parameterMappings.get(i);  
                if (parameterMapping.getMode() != ParameterMode.OUT) {  
                    Object value = null;  
                    String propertyName = parameterMapping.getProperty();  
                    PropertyTokenizer prop = new PropertyTokenizer(propertyName);  
                    if (parameterObject == null) {  
                        value = null;  
                    } else if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {  
                        value = parameterObject;  
                    } else if (boundSql.hasAdditionalParameter(propertyName)) {  
                        value = boundSql.getAdditionalParameter(propertyName);  
                    } else if ((propertyName.startsWith("__frch_"))  
                            && (boundSql.hasAdditionalParameter(prop.getName()))) {  
                        value = boundSql.getAdditionalParameter(prop.getName());  
                        if (value != null) {  
                            value = configuration.newMetaObject(value)  
                                    .getValue(propertyName.substring(prop.getName().length()));  
                        }  
                    } else {  
                        value = metaObject == null ? null : metaObject.getValue(propertyName);  
                    }  
                    TypeHandler typeHandler = parameterMapping.getTypeHandler();  
                    if (typeHandler == null) {  
                        throw new ExecutorException("There was no TypeHandler found for parameter " + propertyName  
                                + " of statement " + mappedStatement.getId());  
                    }  
                    if (value != null) {  
                        typeHandler.setParameter(ps, i + 1, value, parameterMapping.getJdbcType());  
                    }  
                }  
            }  
        }  
    }  
  
    private String generatePageSql(String sql, PageBean page) {  
        String sortFields = page.getSortFields();  
        String orders = page.getOrder();  
        if ((page != null) && (dialect != null) && (!dialect.equals(""))) {  
            StringBuffer pageSql = new StringBuffer();  
            if (dialect.equalsIgnoreCase("mysql")) {  
                if (page.getSortFields() != null) {  
                    if (sortFields.contains(",")) {  
                        String sortSql = appendPageSortSql(sortFields, orders);  
                        pageSql.append("select * from (").append(sql).append(" order by ").append(sortSql)  
                                .append(") r ");  
                    } else if ((page.getOrder() != null) && (page.getOrder().equalsIgnoreCase("desc"))) {  
                        pageSql.append("select * from (").append(sql).append(" order by ").append(page.getSortFields())  
                                .append(" ").append(page.getOrder()).append(") r ");  
                    } else {  
                        pageSql.append("select * from (").append(sql).append(" order by ").append(page.getSortFields())  
                                .append(") r ");  
                    }  
                } else {  
                    pageSql.append(sql);  
                }  
                int startIndex = (page.getPage() - 1) * page.getPageSize();  
                pageSql.append(" limit " + startIndex + "," + page.getPageSize());  
            } else if (dialect.equalsIgnoreCase("oracle")) {  
                pageSql.append("select tmp_tb_1.* from (select tmp_tb.*,ROWNUM row_id from (");  
                if (page.getSortFields() != null) {  
                    if (sortFields.contains(",")) {  
                        String sortSql = appendPageSortSql(sortFields, orders);  
                        pageSql.append("select * from (").append(sql).append(" order by ").append(sortSql)  
                                .append(") r ");  
                    } else if (page.getOrder().equalsIgnoreCase("desc")) {  
                        pageSql.append(sql).append(" order by ").append(page.getSortFields()).append(" ")  
                                .append(page.getOrder());  
                    } else {  
                        pageSql.append(sql).append(" order by ").append(page.getSortFields());  
                    }  
                } else {  
                    pageSql.append(sql);  
                }  
                pageSql.append(")  tmp_tb where ROWNUM<=");  
                int endIndex = page.getPageSize() * page.getPage();  
                pageSql.append(endIndex);  
                pageSql.append(") tmp_tb_1 where row_id>");  
                int startIndex = (page.getPage() - 1) * page.getPageSize();  
                pageSql.append(startIndex);  
            }  
            return pageSql.toString();  
        }  
        return sql;  
    }  
  
    private String appendPageSortSql(String sortFields, String orders) {  
        String[] arr_sortField = sortFields.split(",");  
        String[] arr_order = orders.split(",");  
        int sortField_length = arr_sortField.length;  
        int order_length = arr_order.length;  
        if (sortField_length != order_length) {  
            throw new IllegalArgumentException("请输入正确的排序字段和排序关键字");  
        }  
        StringBuilder sort_condition = new StringBuilder();  
        for (int i = 0; i < arr_sortField.length; i++) {  
            sort_condition.append(" " + arr_sortField[i] + " " + arr_order[i] + " " + ",");  
        }  
        String sortSql = sort_condition.toString();  
        sortSql = sortSql.substring(0, sortSql.length() - 1);  
  
        return sortSql.toString();  
    }  
  
    private static class ReflectHelper {  
        public static Field getFieldByFieldName(Object obj, String fieldName) {  
            for (Class superClass = obj.getClass(); superClass != Object.class;) {  
                try {  
                    return superClass.getDeclaredField(fieldName);  
                } catch (NoSuchFieldException localNoSuchFieldException) {  
                    superClass = superClass.getSuperclass();  
                }  
            }  
            return null;  
        }  
  
        public static Object getValueByFieldName(Object obj, String fieldName)  
                throws SecurityException, NoSuchFieldException, IllegalArgumentException, IllegalAccessException {  
            Field field = getFieldByFieldName(obj, fieldName);  
            Object value = null;  
            if (field != null) {  
                if (field.isAccessible()) {  
                    value = field.get(obj);  
                } else {  
                    field.setAccessible(true);  
                    value = field.get(obj);  
                    field.setAccessible(false);  
                }  
            }  
            return value;  
        }  
  
        public static void setValueByFieldName(Object obj, String fieldName, Object value)  
                throws SecurityException, NoSuchFieldException, IllegalArgumentException, IllegalAccessException {  
            Field field = obj.getClass().getDeclaredField(fieldName);  
            if (field.isAccessible()) {  
                field.set(obj, value);  
            } else {  
                field.setAccessible(true);  
                field.set(obj, value);  
                field.setAccessible(false);  
            }  
        }  
    }  
}  