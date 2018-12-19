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
	<link rel="stylesheet" href="<%=basePath%>assets/404/css/main.css" type="text/css" media="screen, projection" />
	<link rel="stylesheet" type="text/css" media="all" href="<%=basePath%>assets/404/css/tipsy.css" />
	<!--[if lt IE 9]>
		<link rel="stylesheet" type="text/css" href="<%=basePath%>assets/404/css/ie8.css" />
	<![endif]-->
	<script type="text/javascript" src="<%=basePath%>assets/404/scripts/jquery-1.7.2.min.js"></script> <!-- uiToTop implementation -->
	<script type="text/javascript" src="<%=basePath%>assets/404/scripts/custom-scripts.js"></script>
	<script type="text/javascript" src="<%=basePath%>assets/404/scripts/jquery.tipsy.js"></script> <!-- Tipsy -->
	<link rel="shortcut icon" href="<%=basePath%>image/logo/favicon.ico">
</head>
<script type="text/javascript">
$(document).ready(function(){
	universalPreloader();
});

$(window).load(function(){
	universalPreloaderRemove();
	rotate();
    dogRun();
	dogTalk();
	$('.with-tooltip').tipsy({gravity: $.fn.tipsy.autoNS});
});
</script>
<body style="min-width:1000px;">
<div id="universal-preloader">
    <div class="preloader">
        <img src="<%=basePath%>assets/404/images/universal-preloader.gif" alt="universal-preloader" class="universal-preloader-preloader" />
    </div>
</div>
<div id="wrapper">
	<div class="graphic"></div>
	<div class="not-found-text">
    	<h1 class="not-found-text">页面飞掉了,或许你还没有权限!</h1>
    </div>
<div class="dog-wrapper">
	<div class="dog"></div>
	<div class="dog-bubble">
    </div>
    <div class="bubble-options">
    	<p class="dog-bubble">
        	页面坏掉啦? 
        </p>
    	<p class="dog-bubble">
	        <br />
        	主要原因是页面找不到或者你没有权限
        </p>
        <p class="dog-bubble">
        	<br />
        	没关系, 赶快联系开发吧!
        </p>
        <p class="dog-bubble">
        	休息一下，吃块饼干<br /><img style="margin-top:8px" src="<%=basePath%>assets/404/images/cookie.png" alt="cookie" />
        </p>
        <p class="dog-bubble">
        	或许听会音乐!
        </p>
    </div>
</div>
	<div class="planet"></div>
</div>
</body>
</html>