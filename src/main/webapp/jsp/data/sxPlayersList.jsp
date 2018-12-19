<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/tlds/Functions" prefix="func"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!doctype html>
<html lang="zh-CN">
	<%@ include file = "../inc/version.jsp" %>
	<head>
		<meta charset="utf-8"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
		<title>三消玩家管理</title>
		<meta http-equiv="keywords" content=""/>
		<meta http-equiv="description" content=""/>
		<link type="image/x-icon" rel="shortcut icon" href="<%=basePath %>image/logo/favicon.ico">
		<link rel="stylesheet" href="<%=basePath %>css/bootstrap/bootstrap.3.3.5.min.css">
		<link href="<%=basePath %>css/bootstrap/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css"/>
		<link rel="stylesheet" href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css">
		<style type="text/css">
			.round-img90 {
				border-radius: 50%;
				background-color: #999;
				width: 90px;
				height: 90px;
			}
		</style>
		<script type="text/javascript">
			var path = '<%=path %>';
			var basePath = '<%=basePath%>';
			(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()});}}})();
		</script>
</head>
<body>
<c:set var="preUrl" value="sxUsersInfoList?userId=${ userId }
					&name=${ name }&" />
	<header class="ui-page-header">
		<div class="mini-title">当前位置：玩家列表管理</div>
	</header>
	<article class="container-fluid">
		<form class="form-inline search-form">
			<div class="form-group">
				<label>玩家id</label>
				<input type="text" class="form-control" value="${ userId }" name="userId">
			</div>
			<!-- <div class="form-group">
				<label>玩家名</label>
				<input type="text" class="form-control" value="${ name }" name="name">
			</div>
		 <div class="form-group">
				<label>状态</label>
				<select name="isBlock" class="form-control">
					<option value="" <c:if test="${ isBlock == null }">selected="selected"</c:if>>全部</option>
					<option value="true" <c:if test="${ 'true' == isBlock }">selected="selected"</c:if>>封号</option>
					<option value="false" <c:if test="${ 'false' == isBlock }">selected="selected"</c:if>>未封号</option>
				</select>
			</div>
			<br>
			<div class="form-group">
				<label>钻石数</label>
				<input type="text" class="form-control w50" value="${ scoreStart }" name="scoreStart">-
				<input type="text" class="form-control w50" value="${ scoreEnd }" name="scoreEnd">
			</div>
			<div class="form-group">
				<label>角色创建时间</label>
				<input class="form-control form-date" type="text" value="${ startTime }" name="startTime" data-date-format="yyyy-mm-dd 00:00:00">~<input class="form-control form-date" type="text" value="${ endTime }" name="endTime" data-date-format="yyyy-mm-dd 23:59:59"/>
			</div>-->
			<div class="form-group">
				<button class="btn btn-primary">搜索</button>
			</div>
		</form>
		<table class="table table-hover table-bordered table-condensed">
			<thead>
				<tr class="info">
					<!--  <th>玩家id</th>
					<th>玩家名</th>
					<th>玩家等级</th>
					<th>钻石数</th>
					<th>金币数</th>
					<th>职业</th>
					<th>性别</th>
					<th>最后登录时间</th>
					<th>累计在线时间</th>
					<th>累计充值钱数</th>-->
					<th>角色ID</th>
					<th>角色名称</th>
					<th>登录时间</th>
					<th>下线时间</th>
					<th>登录次数</th>
					<th>在线时长(秒)</th>
				</tr>
			</thead>
			<tbody id="user-list">
				<c:forEach var="usersInfo" items="${ usersList }">
				<tr>
					<td>${ usersInfo.playerId }</td>
					<td>${ usersInfo.name }</td>
					<td>${ usersInfo.loginStr }</td>
					<td>${ usersInfo.logoffStr }</td>
					<td>${ usersInfo.loginTimes }</td>
					<td>${ usersInfo.loginTime }</td>
				</tr>
				</c:forEach>
			</tbody>
		</table>
	</article>
	<%@ include file = "../inc/newpage.jsp" %>
	<div id="modal-dialog" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
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
	<div id="image-input" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button data-dismiss="modal" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
					<h4 class="modal-title"></h4>
				</div>
				<div class="modal-body"></div>
				<div class="modal-footer"></div>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		MX.load({
			js: 'lib/sea',
			version: '${ JS_LIB_SEA_VERSION }',
			success: function() {
				seajs.use(['lib/jquery', 'module/Dialog', 'module/UserInfo', 'module/Validator', 'util/bootstrap.datetimepicker.zh-CN','util/ajaxPromise'], function($, Dialog, UserInfo, Validator, datetimepicker,ajaxPromise) {
					var dialog = new Dialog('modal-dialog'), 
						DEFAULT_AVATAR = window.basePath + 'image/default-avatar.png';
					// 加载服务器列表
				   // var gameserverList;
				  //  UserInfo.initTeam('gameserver-id', '${ gameserverId }');
				   // gameserverList = $('#gameserver-list');
					// 绑定datetimepicker插件
					$('.form-date').datetimepicker({
						language: 'zh-CN',/*加载日历语言包，可自定义*/
						weekStart: 1,
						todayBtn: 1,
						autoclose: 1,
						todayHighlight: 1,
						minView: 2,
						forceParse: 0,
						showMeridian: 1
					});
			
				});
			}
		});
	</script>
</body>
</html>

