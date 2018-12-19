<%@ page language="java" pageEncoding="UTF-8"%>
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
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
<html lang="zh-CN" style="height:100%;">
<%@ include file = "./inc/version.jsp" %>
<head>
	<base href="<%=basePath%>">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta charset="utf-8">
	<title>平台管理系统</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="keywords" content="">
	<meta name="author" content="">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
	<link rel="shortcut icon" href="<%=basePath%>image/logo/favicon.ico">
	<link rel="stylesheet" href="<%=basePath%>css/bootstrap/bootstrap.3.3.5.min.css">
	<link rel="stylesheet" href="<%=basePath%>hplus/css/font-awesome.css">
	<%-- <link rel="stylesheet" href="<%=basePath%>css/common_${ CSS_COMMON_VERSION }.css"> --%>
	<link rel="stylesheet" href="<%=basePath%>css/index.css">

	<script type="text/javascript">
		var path = '<%=path %>';
		var basePath = '<%=basePath%>';
		(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
	</script>
</head>
<body>
	<div class="container-xmbl">
		<header class="navbar index-navbar" >
			<nav class="container-fluid">
				<ul class="nav navbar-nav navbar-nav-ul">
					<li>
						<img class="logo" src="<%=basePath%>css/logo.png"/>
						<div class="navbar-brand" href=""><h3 class="bold">小米菠萝-平台管理系统</h3></div>
					</li>
					<li class="dropdown pull-right">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown">
							<i class="main-icon"></i>
							<span class="bold"><shiro:principal /></span>
							<i class="caret"></i>
						</a>
						<ul class="dropdown-menu">
							<li>
								<a href="<%=basePath%>login/userLogout"><i class="glyphicon glyphicon-log-out"></i>&nbsp;Logout</a>
							</li>
						</ul>
					</li>
				</ul>
			</nav>
		</header>
		<div class="index-container clearfix" id="index-container">
			<div class="ui-sidebar" >
				<nav class="ui-nav">
					<ul class="nav nav-stacked" id="nav" >
						<c:forEach var="tree" items="${ listtree }">
							<c:if test="${ tree.type == 0 }">
							<li class="ui-nav-${ tree.level } nav-fold" data-index="${ tree.treeDesc }"<c:if test="${ tree.level > 1 }"> style="display:none;"</c:if>>
								<a href="#">
									<i class="fa ${ tree.icon }" ></i>
									<span> ${ tree.name }</span>
									<span class="fa fa-chevron-left menu-arrow-icon"></span>
								</a>
							</li>
							</c:if>
							<c:if test="${ tree.type == 1 }">
							<li class="ui-nav-${ tree.level } nav-fold" data-index="${ tree.treeDesc }" <c:if test="${ tree.level > 1 }">style="display:none;padding-left:20px;"</c:if>>
								<a href="#">
									<i class="fa ${ tree.icon }"></i>
									<span> ${ tree.name }</span>
									<span class="fa fa-chevron-left menu-arrow-icon"></span>
								</a>
							</li>
							</c:if>
							<c:if test="${ tree.type == 2 }">
							<li class="ui-nav-${ tree.level } nav-link" data-index="${ tree.treeDesc }" data-url="<%=basePath%>${ tree.resUrl }" <c:if test="${ tree.level > 1 }"> style="display:none;padding-left:20px;"</c:if>>
								<a href="#">
									<i class="fa ${ tree.icon }"></i>
									<span> ${ tree.name }</span>
								</a>
							</li>
							</c:if>
						</c:forEach>
					</ul>
				</nav>
			</div>
			<article class="index-article">
				<iframe class="ui-frame" id="ui-frame" src="<%=basePath %>jsp/management/notice.jsp">
	
	            </iframe>
			</article>
		</div>
		<footer class="index-footer">
			<div class="copyright">
				<span class="gongan">京ICP 备 18012708号</span><br/>
				小米菠萝科技有限公司 | BeiJing Xiaomi Boluo Network Technology Co. Ltd. &nbsp;Copyright © 2016 - 2018 &nbsp;<a href="#"></a>
			</div>
		</footer>
	</div>
	<script type="text/javascript">
		MX.load({
			js: 'lib/sea',
			version: '${ JS_LIB_SEA_VERSION }',
			success: function() {
				seajs.use(['lib/jquery', 'module/TreeList'], function($, TreeList) {
					var nav = $('#nav'), treeNav,
						frame = $('#ui-frame'),
						indexContainer = $('#index-container');
					nav.on('click', '.nav-link', function(e) {
						e.preventDefault();
						frame.attr('src', $(this).data('url'));
					});
					treeNav = new TreeList(nav, {
						foldSelector: '.nav-fold',
						unfoldClass: 'unfold',
						isExclusive: 1,
					});
					$(document.body).on('click', '.dropdown-toggle', function(e) {
						var el = $(this);
						el.closest('.' + el.data('toggle')).toggleClass('open');
						e.preventDefault();
					});
					// 列表收起展开
					$('#menu-btn').click(function(e) {
						e.preventDefault();
						indexContainer.toggleClass('index-enlarge');
					});
				});
			}
		});
	</script>
</body>
</html>