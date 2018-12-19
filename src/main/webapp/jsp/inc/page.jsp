<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<footer class="text-center ui-page-footer">
	<ul class="pagination" id="page-nav">
		<li><a href="javascript:void(0);" onclick="goUrl(0)">Prev</a></li>

		<c:if test="${ page == 1 }">
			<li><a href="javascript:void(0);" onclick="goUrl(${ page-1 })">&laquo;</a></li>
			<li><a href="javascript:void(0);" onclick="goUrl(${ page-1 })">${ page }</a></li>
		</c:if>
		<c:if test="${ page >= 2 }">
			<li><a href="javascript:void(0);" onclick="goUrl(${ page-1 })">&laquo;</a></li>
			<li><a href="javascript:void(0);" onclick="goUrl(${ page-2 })">${ page-1 }</a></li>
			<li><a href="javascript:void(0);" onclick="goUrl(${ page-1 })">${ page }</a></li>
		</c:if>

		<li class="active"><a href="javascript:void(0);" onclick="goUrl(${ page })">${ page+1 }</a></li>
		<!-- 当前页  (ps:page从第0页开始) -->

		<c:if test="${ totalpage - page >= 3 }">
			<li><a href="javascript:void(0);" onclick="goUrl(${ page+1 })">${ page+2 }</a></li>
			<li><a href="javascript:void(0);" onclick="goUrl(${ page+2 })">${ page+3 }</a></li>
			<li><a href="javascript:void(0);" onclick="goUrl(${ page+1 })">&raquo;</a></li>
		</c:if>
		<c:if test="${ totalpage - page == 2 }">
			<li><a href="javascript:void(0);" onclick="goUrl(${ page+1 })">${ page+2 }</a></li>
			<li><a href="javascript:void(0);" onclick="goUrl(${ page+1 })">&raquo;</a></li>
		</c:if>
		<%-- <li><a href="javascript:void(0);" onclick="goUrl(${ totalpage-1 })">Next</a></li> --%>
	</ul>
	<span class="total-num" style="max-width:100px;display:block;margin:0 auto;text-align:center;font-size:12px;color:#999;">${ totalNum }条记录</span>
</footer>
