<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page isELIgnored="false"%>



<div class="sidebar-dropdown">
	<a href="#">导航</a>
</div>

<!--- Sidebar navigation -->
<!-- If the main navigation has sub navigation, then add the class "has_sub" to "li" of main navigation. -->
<ul id="nav">
	<c:forEach items="${resourceslist }" var="rs" varStatus="Status">
		<c:if test="${rs.type eq '0'}">
			<li class="has_sub"><a href="#"<c:if test="${rs.id eq selectparentid }">class="open subdrop"</c:if>><i class="${rs.icon }" ></i>
					${rs.name }<span class="pull-right"><i class="icon-chevron-right"></i></span></a>
				<ul <c:if test="${rs.id eq selectparentid }">style="display:block;"</c:if>>
				<c:forEach items="${resourceslist }" var="rs2" varStatus="Status">
				<c:if test="${rs2.parentId eq rs.id  && rs2.type eq '1'}">
				<li ><a    href="${pageContext.request.contextPath}/${rs2.resUrl }?selectid=${rs2.id}&selectparentid=${rs2.parentId}"><font style="margin-left: 50px;">${rs2.name }</font></a> </li>
				</c:if>
			</c:forEach>
				</ul></li>
		</c:if>
	</c:forEach><%-- 
			<li ><a href="${pageContext.request.contextPath}/user/list"><font style="margin-left: 50px;">用户管理</font></a> </li>
			<li ><a href="${pageContext.request.contextPath}/role/list"><font style="margin-left: 50px;">角色管理</font></a> </li>
			<li ><a href="${pageContext.request.contextPath}/resource/list"><font style="margin-left: 50px;">资源管理</font></a> </li> --%>
</ul>

