<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<footer class="text-center ui-page-footer">
	<ul class="pagination">
		<li><a href="${preUrl}page=0">首页</a></li>
		<c:if test="${ page == 1 }">
			<li><a href="${preUrl}page=${ page-1 }" >&laquo;</a></li>
			<li><a href="${preUrl}page=${ page-1 }">${ page }</a></li>
		</c:if>
		<c:if test="${ page >= 2 }">
			<li><a href="${preUrl}page=${ page-1 }">&laquo;</a></li>
			<li><a href="${preUrl}page=${ page-2 }">${ page-1 }</a></li>
			<li><a href="${preUrl}page=${ page-1 }">${ page }</a></li>
		</c:if>

		<li class="active"><a href="${preUrl}page=${ page }">${ page+1 }</a></li>
		<!-- 当前页  (ps:page从第0页开始) -->

		<c:if test="${ totalpage - page >= 3 }">
			<li><a href="${preUrl}page=${ page+1 }" >${ page+2 }</a></li>
			<li><a href="${preUrl}page=${ page+2 }">${ page+3 }</a></li>
			<li><a href="${preUrl}page=${ page+1 }">&raquo;</a></li>
		</c:if>
		<c:if test="${ totalpage - page == 2 }">
			<li><a href="${preUrl}page=${ page+1 }">${ page+2 }</a></li>
			<li><a href="${preUrl}page=${ page+1 }" >&raquo;</a></li>
		</c:if>
		<%-- <li><a href="${preUrl}page=${ totalpage-1 }">末页</a></li> --%>
	</ul>
	<span class="ml20 record-num">${ totalNum }4条记录</span>
</footer>