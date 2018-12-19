<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/tlds/Functions" prefix="func"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!doctype html>
<html lang="zh-CN">
<%@ include file = "../inc/version.jsp" %>
<head>
	<title>公告</title>
	<meta charset="UTF-8">
	<link type="image/x-icon" rel="shortcut icon" href="<%=basePath %>image/logo/favicon.ico">
	<link href="<%=basePath %>css/bootstrap/bootstrap.3.3.5.min.css" rel="stylesheet" type="text/css"/>
	<link href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css" rel="stylesheet">
	<script type="text/javascript">
		var path = '<%=path %>';
		var basePath = '<%=basePath%>';
		(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b]);};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
	</script>
</head>
<body>
	<c:set var="preUrl" value="announcementList?" />
	<header class="ui-page-header">
		<div class="mutil-title" id="notice-container">
			<div class="main-title">公告</div>
			<div class="sub-title">公告</div>
		</div>
	</header>
	<article class="container-fluid">
		<div class="panel panel-default">
			<div class="panel-heading ui-flex-between ">
				<span>公告栏</span>
				<a href="<%=basePath %>jsp/management/editNotice.jsp" class="btn btn-primary btn-xs">新增</a>
			</div>
			<div class="panel-body">
				<ul id="announcement-list">
					<c:forEach var="announcement" items="${ announcementList }">
					<li class="content">
						<header class="mb6">
							<span class="text-muted">${ func:formatDate(announcement.createTime) } by ${ announcement.operator }</span>
							<button class="btn btn-danger btn-xs pull-right btn-del" data-id="${ announcement.id }">删除</button>
							<div class="clearfix"></div>
						</header>
						<div>${ announcement.text }</div>
					</li>
					</c:forEach>
				</ul>
			</div>
		</div>
	</article>
	<%@ include file = "../inc/newpage.jsp" %>
<script type="text/javascript">
	MX.load({
		js: 'lib/sea',
		version: '${ JS_LIB_SEA_VERSION }',
		success: function() {
			seajs.use(['lib/jquery', 'util/ajaxPromise'], function($, ajaxPromise) {
				$(function() {
					$('#announcement-list').on('click', '.btn-del', function(e) {
						ajaxPromise({
							type: 'GET',
							dataType: 'json',
							url: window.basePath + 'notice/deleAnnouncement',
							data: {
								id: $(this).data('id')
							}
						}).then(function(obj) {
							alert(obj.msg);
							window.location.reload();
						});
					});
				});
			});
		}
	});
</script>
</body>
</html>