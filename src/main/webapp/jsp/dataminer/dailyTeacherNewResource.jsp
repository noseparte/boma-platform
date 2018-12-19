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
<%@ include file = "../inc/version.jsp" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<title>每日教师新增请求统计</title>
	<link href="<%=basePath%>css/bootstrap/bootstrap.3.3.5.min.css" rel="stylesheet" type="text/css"/>
	<link href="<%=basePath%>css/common_${ CSS_COMMON_VERSION }.css" rel="stylesheet" type="text/css"/>
	<style type="text/css">
		.line-container {
			height: 400px;
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
	<div class="mini-title">每日教师新增请求统计</div>
</header>
<div class="panel panel-default">
	<div id="count-container" class="panel-body line-container"></div>
</div>
<script type="text/javascript">
	MX.load({
		js: 'lib/sea',
		version: '${ JS_LIB_SEA_VERSION }',
		success: function() {
			seajs.use(['lib/jquery', 'lib/highcharts', 'util/ajaxPromise'], function($, highcharts, ajaxPromise) {
				ajaxPromise({
					url: window.basePath + 'DailyStat/dailyNewResourceData',
					type: 'GET',
					dataType: 'json'
				}).then(function(data) {
					var result = data.result;
					$('#count-container').highcharts({
						chart: {
							zoomType: 'x'
						},
						title: {
							text: '每日教师新增资源统计'
						},
						xAxis: {
							categories: result.dates
						},
						yAxis: {
							gridLineDashStyle: 'loaddash',
							title: {
								text: 'Counts:'
							}
						},
						legend: {
							layout: 'vertical',
							align: 'right',
							verticalAlign: 'middle',
							borderWidth: 1
						},
						series: [{
							name: '新增教师数',
							data: result.newTeacherCount
						}, {
							name: '新增音频数',
							data: result.newAudioCount
						}, {
							name: '新增白板数',
							data: result.newWhiteboardCount
						}, {
							name: '新增习题集数',
							data: result.newProblemSetCount
						}, {
							name: '新增录制资源的教师数',
							data: result.activeTeacherCount
						}]
					});
				});
			});
		}
	});
</script>
</body>
</html>