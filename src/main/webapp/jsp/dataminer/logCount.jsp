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
		<title>数据可视化</title>
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
			<div class="mini-title">数据可视化</div>
		</header>
		<div class="panel panel-default">
			<div id="count-container" class="panel-body line-container"></div>
		</div>
		<div class="panel panel-default">
			<div id="percent-container" class="panel-body line-container"></div>
		</div>
		<script type="text/javascript">
			MX.load({
				js: 'lib/sea',
				version: '${ JS_LIB_SEA_VERSION }',
				success: function() {
					seajs.use(['lib/jquery', 'lib/highcharts', 'util/ajaxPromise'], function($, highcharts, ajaxPromise) {
						ajaxPromise({
							url: window.basePath + 'confidential/querylogCountSearch',
							type: 'GET',
							dataType: 'json'
						}).then(function(data) {
							var result = data.result;
							$('#count-container').highcharts({
								chart: {
									zoomType: 'x'
								},
								title: {
									text: '搜索次数'
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
									name: '搜索次数',
									data: result.queryCounts
								}, {
									name: '拍题用户数',
									data: result.queryUserCounts
								}]
							});
							$('#percent-container').highcharts({
								chart: {
									zoomType: 'x'
								},
								title: {
									text: '多种搜索的占比'
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
									name: '输出包含错误',
									data: result.containErrorCountRates
								}, {
									name: '图像识别错误',
									data: result.orcErrorCountRates
								}, {
									name: '相似度分支较高',
									data: result.scoreCountRates
								}, {
									name: '学科识别错误',
									data: result.subjectErrorCountRates
								}]
							});
						});
					});
				}
			});
		</script>
	</body>
</html>