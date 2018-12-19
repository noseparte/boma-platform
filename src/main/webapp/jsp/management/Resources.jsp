<%@ page language="java" import="com.xmbl.ops.enumeration.EnumMenuType" pageEncoding="UTF-8"%>
<%@ page import="com.xmbl.ops.enumeration.EnumYesNo" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/tlds/Functions" prefix="func"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html>
<html lang="en">
<%@ include file = "../inc/version.jsp" %>
<head>
	<meta charset="UTF-8">
	<title>菜单管理</title>
	<link rel="stylesheet" href="<%=basePath%>/css/bootstrap/bootstrap.3.3.5.min.css">
	<link rel="stylesheet" href="<%=basePath%>/css/common_${ CSS_COMMON_VERSION }.css">
	<style type="text/css">
		.ui-fold-table .fold-icon {
			margin-right: 2px;
		}
		.ui-row-2 .fold-icon {
			margin-left: 20px;
		}
		.ui-row-3 .fold-icon {
			margin-left: 40px;
		}
		.ui-row-4 .fold-icon {
			margin-left: 60px;
		}
		.ui-fold-table .unfold .fold-icon:before {
			content: "\2212"; /*minus*/
		}
		.ui-fold-table .fold-icon:before {
			content: "\2b"; /*plus*/
		}
		.ui-fold-table .no-fold.fold-icon:before {
			content: ""!important;
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
		<div class="mini-title">当前位置：菜单管理</div>
	</header>
	<article class="container-fluid">
		<button class="btn btn-primary" id="btn-add-menu">新增</button>
		<button class="btn btn-danger" id="btn-del-menu">删除</button>
		<table class="table table-hover table-bordered table-condensed mt8">
			<thead>
				<tr class="info">
					<th class="min-w20">
						<input type="checkbox" id="all-check">
					</th>
					<th class="min-w50">菜单名称</th>
					<th class="min-w40">菜单类型</th>
					<th class="min-w40">菜单标识</th>
					<th class="min-w30">菜单图标</th>
					<th class="min-w40">URL地址</th>
					<th class="min-w40">是否隐藏</th>
					<th class="min-w40">描述</th>
					<th class="min-w40">操作</th>
				</tr>
			</thead>
			<tbody class="ui-fold-table" id="menu-list">
				<c:forEach var="resource" items="${ resourcesList }">
					<tr class="ui-row-${ resource.level } unfold" data-id="${ resource.id }" data-index="${ resource.levelTree }" data-name="${ resource.name }" data-sign="${ resource.reskey }" data-icon="${ resource.icon }" data-link="${ resource.resurl }" data-type="${ resource.type }" data-status="${ resource.status }" data-description="${ resource.description }">
						<td>
							<input type="checkbox" class="menu-check">
						</td>
						<c:set var="MENU" value="<%= EnumMenuType.MENU %>"/>
						<c:if test="${ resource.type == MENU.id }">
							<c:set var="noFold" value="no-fold"/>
						</c:if>
						<c:if test="${ resource.type != MENU.id }">
							<c:set var="noFold" value="btn-fold"/>
						</c:if>
						<td><div class="fold-icon glyphicon ${ noFold }"></div>${ resource.name }</td>
						<td>
							<c:set var="enumMenuTypes" value="<%=EnumMenuType.values()%>"/>
							<c:forEach var="enumMenuType" items="${ enumMenuTypes }">
							<c:if test="${ enumMenuType.id == resource.type }">${ enumMenuType.chineseName }</c:if>
							</c:forEach>
						</td>
						<td>${ resource.reskey }</td>
						<td>${ resource.icon }</td>
						<td>${ resource.resurl }</td>
						<td>
							<c:set var="enumYesNos" value="<%=EnumYesNo.values()%>"/>
							<c:forEach var="enumYesNo" items="${ enumYesNos }">
							<c:if test="${ enumYesNo.id == resource.status }">${ enumYesNo.chineseName }</c:if>
							</c:forEach>
						</td>
						<td>${ resource.description }</td>
						<td>
							<button class="btn btn-primary btn-xs edit-btn">编辑</button>
						</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</article>
	<div id="modal-dialog" class="modal fade" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
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
				seajs.use(['lib/jquery', 'module/TreeList', 'module/MenuInfo', 'util/ajaxPromise'], function($, TreeList, menuInfo, ajaxPromise) {
					var allCheck = $('#all-check'),
						menuList = $('#menu-list'),
						tableTree,
						checkList = menuList.find('tr .menu-check');
					tableTree = new TreeList(menuList, {
						foldSelector: 'tr .btn-fold',
						unfoldClass: 'unfold',
						getCurItem: function(el) {
							return el.closest('tr');
						}
					});
					$('#btn-add-menu').on('click', function(e) {
						menuInfo.addMenu($(this).attr('id'));
					});
					$('#btn-del-menu').on('click', function(e) {
						var deleteList = checkList.filter(':checked').map(function(i) {
							return $(this).closest('tr').data('id');
						}).get();
						if(deleteList.length === 0) {
							alert('请至少选择一个菜单');
							return;
						}
						if(confirm('确定要删除当前所选菜单？')) {
							ajaxPromise({
								url: window.basePath + 'resources/delete',
								type: 'POST',
								data: {
									rescId: deleteList.join(),
								},
								dataType: 'json'
							}).then(function(data) {
								alert('删除成功');
								document.location.reload();
							});
						}
					});
					//全选
					allCheck.on('click', function(e) {
						var el = $(this);
						checkList.prop('checked', el.prop('checked'));
					});
					menuList.on('click', '.edit-btn', function(e) {
						var el = $(this);
						menuInfo.editMenu(el.closest('tr').data());
					});
				});
			}
		});
	</script>
</body>
</html>
