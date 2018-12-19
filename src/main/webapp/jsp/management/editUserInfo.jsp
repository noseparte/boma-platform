<%@ page language="java" pageEncoding="UTF-8"%>
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
<title>编辑用户</title>
<meta http-equiv="keywords" content="">
<meta http-equiv="description" content="">
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
	<header class="ui-page-header">
		<div class="mutil-title">
			<div class="main-title">个人信息</div>
		</div>
	</header>
	<div class="container-fluid">
		<article class="mb20">
			<div class="panel panel-default">
				<div class="panel-heading ui-flex-between">
					<span class="text-muted">个人信息</span>
					<span class="text-muted">账号：${ userinfo.userKey }&nbsp;</span>
				</div>
				<div class="panel-body ui-flex-container">
					<div class="form-group flex1">
						<label for="user-name">姓名</label>
						<input type="text" id="user-name" class="form-control" value="${ userinfo.userName }" placeholder="姓名">
					</div>
				</div>
			</div>
		</article>
		<div class="ui-flex-container mb20">
			<article class="flex1">
				<div class="panel panel-default">
					<div class="panel-heading ui-flex-between">
						<span class="text-muted">修改密码</span>
						<button id="active-password" class="glyphicon glyphicon-wrench btn-square" data-enable="true"></button>
					</div>
					<div class="panel-body">
						<div class="form-group">
							<label for="old-password">原密码</label>
							<input type="password" class="form-control" id="old-password" disabled placeholder="原密码">
						</div>
						<div class="form-group">
							<label for="new-password">新密码</label>
							<input type="password" class="form-control" id="new-password" disabled placeholder="新密码">
						</div>
						<div class="form-group">
							<label for="new-password2">确认新密码</label>
							<input type="password" class="form-control" id="new-password2" disabled placeholder="确认新密码">
						</div>
					</div>
				</div>
			</article>
		</div>
	</div>
	<footer class="text-center ui-page-footer">
		<button id="edit-user" class="btn btn-primary btn-block">提交</button>
	</footer>
<script type="text/javascript">
	MX.load({
		js: 'lib/sea',
		version: '${ JS_LIB_SEA_VERSION }',
		success: function() {
			seajs.use(['lib/jquery', 'module/Validator', 'util/ajaxPromise'], function($, Validator, ajaxPromise) {
				var activePassword = $('#active-password'),
					oldPassword = $('#old-password'),
					newPassword = $('#new-password'),
					newPassword2 = $('#new-password2'),
					editUser = $('#edit-user');
				// 修改密码
				activePassword.on('click', function(e) {
					var el = $(this), enable = !el.data('enable');
					oldPassword.prop('disabled', enable);
					newPassword.prop('disabled', enable);
					newPassword2.prop('disabled', enable);
					el.data('enable', enable);
				});
				editUser.on('click', function(e) {
					var userName = $('#user-name'),
						validator = new Validator(),
						idCardNum,
						bankSubbranch,
						account,
						province,
						city,
						county,
						data = {};
					// 表单验证
					data.userName = userName.val().trim();
					validator.add(data.userName, 'isNotEmpty', function() {
						alert('姓名不能为空');
						userName.focus();
					});
					if(!activePassword.data('enable')) {
						data.password = oldPassword.val();
						data.passwordNew = newPassword.val();
						data.passwordNew2 = newPassword2.val();
						validator.add(data.password, 'minLength:4', function() {
							alert('请输入正确的密码');
							oldPassword.focus();
						}).add(data.passwordNew, 'minLength:4', function() {
							alert('请输入正确的密码');
							newPassword.focus();
						}).add(data.passwordNew2, 'minLength:4', function() {
							alert('请输入正确的密码');
							newPassword2.focus();
						}).add(data.passwordNew, 'identical', data.passwordNew2, function() {
							alert('两次输入新密码不一致');
							newPassword.val('').focus();
							newPassword2.val('');
						});
					}
					if(!validator.start()) {
						return;
					}
					data.userKey = '${ userinfo.userKey }';
					// 提交表单
					ajaxPromise({
						url: window.basePath + 'user/updateBankUserInfo',
						contentType: 'application/x-www-form-urlencoded;charset=utf-8',
						type: 'GET',
						data: data,
						dataType: 'json'
					}, {
						resolveError: 1
					}).then(function(data) {
						alert(data.msg);
						if(data.status === 0 || data.status === 2) {
							top.location.href = window.basePath;
						}
					});
				});
			});
		}
	});
</script>
</body>
</html>
