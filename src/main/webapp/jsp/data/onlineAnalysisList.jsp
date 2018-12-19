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
<!doctype html>
<html lang="zh-CN">
	<%@ include file = "../inc/version.jsp" %>
	<head>
		<meta charset="utf-8"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
		<title>在线统计</title>
		<meta http-equiv="keywords" content=""/>
		<meta http-equiv="description" content=""/>
		<link type="image/x-icon" rel="shortcut icon" href="<%=basePath %>image/logo/favicon.ico">
		<link rel="stylesheet" href="<%=basePath %>css/bootstrap/bootstrap.3.3.5.min.css">
		<link href="<%=basePath %>css/bootstrap/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css"/>
		<link rel="stylesheet" href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css">
		<script type="text/javascript">
			var path = '<%=path %>';
			var basePath = '<%=basePath%>';
			(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()});}}})();
		</script>
	</head>
	<body>
		<c:set var="preUrl" value="dataOnlineAnalysisList
									?startTime=${ startTime }
									&endTime=${ endTime }&" />
		<header class="ui-page-header">
			<div class="mini-title">当前位置：在线统计</div>
		</header>
		<article class="container-fluid">
			<form class="form-inline search-form">
				<div class="form-group">
					<label>时间</label>
					<input class="form-control form-date" type="text" value="${ startTime }" name="startTime" data-date-format="yyyy-mm-dd 00:00:00">~<input class="form-control form-date" type="text" value="${ endTime }" name="endTime" data-date-format="yyyy-mm-dd 23:59:59"/>
				</div>
				<div class="form-group">
					<button class="btn btn-primary">搜索</button>
				</div>
			</form>
			<table class="table table-hover table-bordered table-condensed">
				<thead>
					<tr class="info">
						<th class="min-w50">日期</th>
						<th class="min-w50">游戏id</th>
						<th class="min-w50">游戏版本</th>
						<th class="min-w50">游戏服务器id</th>
						<th class="min-w50">渠道</th>
						<th class="min-w50">平台</th>
						<th class="min-w40">平均在线数量</th>
						<th class="min-w40">实时在线数量</th>
						<th class="min-w40">在线pcu </th>
						<th class="min-w40">在线pcu时间</th>
					</tr>
				</thead>
				<tbody id="topic-list">
					<c:forEach var="dataOnlineAnalysis" items="${ dataOnlineAnalysisList }">
					<tr data-id="${ dataOnlineAnalysis.datetime }">
						<td>${ func:formatDate(dataOnlineAnalysis.datetime) }</td>
						<td>${ dataOnlineAnalysis.gameid }</td>
						<td>${ dataOnlineAnalysis.gameserverid }</td>
						<td>${ dataOnlineAnalysis.channelid }</td>
						<td>${ dataOnlineAnalysis.platfromid }</td>
						<td>${ dataOnlineAnalysis.avgonlinecount }</td>
						<td>${ dataOnlineAnalysis.onlinecount }</td>
						<td>${ dataOnlineAnalysis.pcucount }</td>
						<td>${ dataOnlineAnalysis.puctime }</td>
					</tr>
					</c:forEach>
				</tbody>
			</table>
		</article>
		<%@ include file = "../inc/newpage.jsp" %>
		<script type="text/javascript">
			MX.load({
				js: 'lib/sea',
				version: '${ JS_LIB_SEA_VERSION }',
				success: function() {
					seajs.use(['lib/jquery', 'util/bootstrap.datetimepicker.zh-CN'], function($, datetimepicker) {
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
