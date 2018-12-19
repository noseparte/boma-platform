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
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">    
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<title>账号注册管理</title>
<link type="image/x-icon" rel="shortcut icon" href="<%=basePath %>image/logo/favicon.ico">

<link rel="stylesheet" href="<%=basePath %>css/bootstrap/bootstrap.3.3.5.min.css">
<link rel="stylesheet" href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css">
<script type="text/javascript">
	var path = '<%=path %>';
	var basePath = '<%=basePath%>';
	(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
</script>
</head>
<body>
<c:set var="preUrl" value="dataRegisterList
							?accountid=${ accountid }
							&channelid=${ channelid }
							&gameserverid=${ gameserverid }
							&gameid=${ gameid }
							&gameversion=${ gameversion }
							&platfromid=${ platfromid }
							&imei=${ imei }
							&imeiid=${ imeiid }
							&playerid=${ playerid }
							&profession=${ profession }
							&uuid=${ uuid }
							&mac=${ mac }&" />
	<header class="ui-page-header">
	<!-- Only required for left/right tabs -->
	<!--<div class="tabbable"> 
    <ul class="nav nav-tabs">
    <li ><a href="#" data-toggle="tab">用户管理</a></li>
    </ul>
    </div>
</div>-->
	<div class="mini-title">当前位置：账号注册管理</div>
	</header>
	<article class="container-fluid">
		<form class="form-inline search-form">
			<div class="form-group">
				<label>渠道</label>
				<input type="text" class="form-control" value="${ channelid }" name="channelid"/>
			</div>
			<div class="form-group">
				<label>区服</label>
				<input type="text" class="form-control" value="${ gameserverid }" name="gameserverid"/>
			</div>
			<div class="form-group">
				<label>版本</label>
				<input type="text" class="form-control" value="${ gameversion }" name="gameversion"/>
			</div>
			<div class="form-group">
				<label>账号</label>
				<input type="text" class="form-control" value="${ accountid }" name="accountid"/>
			</div>
			<div class="form-group">
				<label>角色id</label>
				<input type="text" class="form-control" value="${ playerid }" name="playerid"/>
			</div>
			<div class="form-group">
				<label>imei</label>
				<input type="text" class="form-control" value="${ imei }" name="imei"/>
			</div>
			<div class="form-group">
				<label>imeiid</label>
				<input type="text" class="form-control" value="${ imeiid }" name="imeiid"/>
			</div>
			<div class="form-group">
				<button class="btn btn-primary">搜索</button>
			</div>
		</form>
		<table class="table table-hover table-bordered table-condensed">
			<thead>
				<tr class="info">
					<th style="min-width:50px">渠道</th>
					<th style="min-width:50px">区服</th>
					<th style="min-width:90px">账号id</th>
					<th style="min-width:90px">uid</th>
					<th style="min-width:90px">角色id</th>
					<th style="min-width:90px">角色名</th>
					<th style="min-width:90px">Imei码</th>
					<th style="min-width:90px">Imei码ID</th>
					<th style="min-width:90px">注册时间</th>
				</tr>
			</thead>
			<tbody id="user-list">
				<c:forEach var="userInfo" items="${ dataRegisterLogList }">
					<tr>
					<td>${ userInfo.channelid}</td>
					<td>${ userInfo.gameserverid}</td>
					<td>${ userInfo.accountid}</td>
						<td>${ userInfo.uuid}</td>
				 		<td class="playerid">${ userInfo.playerid }</td>
						<td class="playerid">${ userInfo.playerid }</td>
						<td class="imei">${ userInfo.imei }</td>
						<td class="imeiid">${ userInfo.imeiid }</td>
					    <td class="createtime">${ userInfo.createtime }</td>
						<td>
						</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</article>
	<%@ include file = "../inc/newpage.jsp" %>
	<div id="modal-dialog" class="modal fade"  tabindex="-1" role="dialog" aria-hidden="true">
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
			seajs.use(['lib/jquery', 'module/Dialog', 'module/UserInfo', 'util/ajaxPromise'], function($, Dialog, userInfo, ajaxPromise) {
				// 加载小组列表
				var userList, teamId = $('#team-id'), role = $('#role'), identity = $('#identity'), dialog = new Dialog('modal-dialog');
				userInfo.initRole(role, '${ groupName }');
				// 创建用户
				$('#add-member-btn').on('click', function(e) {
					var el = $(this);
					e.preventDefault();
					userInfo.addMember(el.attr('id'));
				});
				userList = $('#user-list');
				// 编辑信息
				userList.on('click', '.edit-btn', function(e) {
					var el = $(this), data;
					data = el.closest('tr').data();
					userInfo.editMember(data);
				});
				// 重置密码
				userList.on('click', '.reset-password-btn', function(e) {
					var el = $(this), id;
					id = el.closest('tr').data('user-id');
					dialog.show({
						sizeClass: 'modal-sm',
						title: '重置密码',
						content: '确定要重置密码吗？',
						source: 'reset-password',
						renderCall: function() {
							var Self = this;
							Self._confirm.text('确定');
						},
						confirm: function(e) {
							var Self = this;
							ajaxPromise({
								url: window.basePath + 'user/updateUserPassword',
								type: 'GET',
								data: {
									id: id
								},
								dataType: 'json'
							}).then(function(data) {
								Self.enableConfirm();
								alert('重置成功');
								Self.hide();
							}, function() {
								Self.enableConfirm();
							});
						}
					});
				});
			});
		}
	});
</script>
</body>
</html>

