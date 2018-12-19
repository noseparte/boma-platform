<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.xmbl.ops.enumeration.EnumAuthStatus" %>
<%@ page import="com.xmbl.ops.enumeration.EnumYesNo" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/tlds/Functions" prefix="func"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html lang="en">
<%@ include file = "../inc/version.jsp" %>
<head>
	<meta charset="UTF-8">
	<title>角色管理</title>

	<link rel="stylesheet" href="<%=basePath%>/css/bootstrap/bootstrap.3.3.5.min.css">
	<link rel="stylesheet" href="<%=basePath%>/css/common_${ CSS_COMMON_VERSION }.css">
	<style type="text/css">
		.table-middle>tbody>tr>td {
			vertical-align: middle;
		}
		.table-scroll {
			max-height: 512px;
			
			overflow-y: scroll;
		}
	</style>
	<script type="text/javascript">
		var path = '<%=path %>';
		var basePath = '<%=basePath%>';
		(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
	</script>
</head>
<body>
	<header class="ui-page-header">
		<div class="mini-title">当前位置：角色管理</div>
	</header>
	<article class="container-fluid">
		<button class="btn btn-primary" id="btn-add-role">新增</button>
		<table class="table table-hover table-bordered table-condensed mt8">
			<thead>
				<tr class="info">
					<th class="min-w50">角色名</th>
					<th class="min-w40">角色标识</th>
					<th class="min-w40">状态</th>
					<th class="min-w40">是否分配权限</th>
					<th class="min-w40">描述</th>
					<th class="min-w40">操作</th>
				</tr>
			</thead>
			<tbody id="role-list">
				<c:forEach var="role" items="${ roleList }">
				<tr data-status="${role.status }" data-id="${ role.id }" data-role-sign="${ role.roleSign }" data-role-name="${ role.roleName }" data-description="${ role.description }">
					<td>${ role.roleName }</td>
					<td>${ role.roleSign }</td>
					<td>
						<c:set var="enumRoleTypes" value="<%=EnumAuthStatus.values()%>"/>
						<c:forEach var="enumRoleType" items="${ enumRoleTypes }">
						<c:if test="${ enumRoleType.id == role.status }">${ enumRoleType.desc }</c:if>
						</c:forEach>
					</td>
					<td>
						<c:set var="hasRoleTypes" value="<%=EnumYesNo.values()%>"/>
						<c:forEach var="hasRoleType" items="${ hasRoleTypes }">
						<c:if test="${ hasRoleType.id == role.hasRole }">${ hasRoleType.chineseName }</c:if>
						</c:forEach>
					</td>
					<td>${ role.description }</td>
					<td>
						<button class="btn btn-primary btn-xs edit-btn">编辑</button>
						<button class="btn btn-primary btn-xs ml10 authority-btn">分配权限</button>
					</td>
				</tr>
				</c:forEach>
			</tbody>
		</table>
	</article>
	<div id="modal-dialog" class="modal fade"  tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content" style="width: 1500px;margin: 0px 200px 0px -300px;">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
					<h4 class="modal-title"></h4>
				</div>
				<div class="modal-body"></div>
				<div class="modal-footer"></div>
			</div><!-- /.modal-content -->
		</div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
	<script type="text/javascript">
		MX.load({
			js: 'lib/sea',
			version: '${ JS_LIB_SEA_VERSION }',
			success: function() {
				seajs.use(['lib/jquery', 'module/RoleInfo'], function($, roleInfo) {
					var allCheck = $('#all-check'),
						roleList = $('#role-list'),
						checkList = roleList.find('tr .role-check');
					$('#btn-add-role').on('click', function(e) {
						roleInfo.addRole($(this).attr('id'));
					});
					roleList.on('click', '.edit-btn', function(e) {
						var el = $(this);
						roleInfo.editRole(el.closest('tr').data());
					}).on('click', '.authority-btn', function(e) {
						var el = $(this);
						roleInfo.authority(el.closest('tr').data('id'));
					});
				});
			}
		});
	</script>
</body>
</html>