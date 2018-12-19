package com.xmbl.ops.interceptor.mybatisInterceptor.page;

import java.io.Serializable;
import java.util.List;

public final class PageBean<T> implements Serializable {

	private static final long serialVersionUID = -3496690347694101564L;

	private int pageSize = 20;
	private long totalCount;
	private int totalPage;
	private int page = 1;
	private String sortFields;
	private String order;
	private Object parameter;
	private List<T> result;

	public PageBean() {
		
	}

	public PageBean(int pageSize) {
		if (pageSize < 1) {
			this.pageSize = 20;
		} else {
			this.pageSize = pageSize;
		}
		this.page = 1;
	}

	public int getPageSize() {
		return this.pageSize;
	}

	public int getTotalPage() {
		return this.totalPage;
	}

	public long getTotalCount() {
		return this.totalCount;
	}

	public void setTotalCount(long totalCount) {
		this.totalCount = totalCount;
		this.totalPage = ((int) (this.totalCount / this.pageSize + (this.totalCount
				% this.pageSize == 0L ? 0 : 1)));
	}

	public int getPage() {
		return this.page <= 0 ? 1 : this.page;
	}

	public void setPage(int page) {
		if (page < 1) {
			this.page = 1;
			return;
		}
		this.page = page;
	}

	public String getOrder() {
		return this.order;
	}

	public void setOrder(String order) {
		this.order = order;
	}

	public Object getParameter() {
		return this.parameter;
	}

	public void setParameter(Object parameter) {
		this.parameter = parameter;
	}

	public List<T> getResult() {
		return this.result;
	}

	public void setResult(List<T> result) {
		this.result = result;
	}

	public String getSortFields() {
		return this.sortFields;
	}

	public void setSortFields(String sortFields) {
		this.sortFields = sortFields;
	}

	public String toString() {
		return "pageSize:" + this.pageSize + ",totalCount:" + this.totalCount
				+ ",totalPage:" + this.totalPage + ",page:" + this.page
				+ ",sortFields:" + this.sortFields + ",order:" + this.order;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
}