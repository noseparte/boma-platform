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
			<div class="mini-title">充值记录统计</div>
		</header>
		<div class="panel panel-default">
			<div id="charge-sum-container" class="panel-body line-container"></div>
		</div>
		<div class="panel panel-default">
			<div id="charge-count-container" class="panel-body line-container"></div>
		</div>
		<script type="text/javascript">
			MX.load({
				js: 'lib/sea',
				version: '${ JS_LIB_SEA_VERSION }',
				success: function() {
					seajs.use(['lib/jquery', 'lib/highcharts', 'util/ajaxPromise'], function($, highcharts, ajaxPromise) {
						ajaxPromise({
							url: window.basePath + 'SalesStat/dailyChargeData',
							type: 'GET',
							dataType: 'json'
						}).then(function(data) {
							var result = data.result;
							$('#charge-sum-container').highcharts({
								chart: {
									zoomType: 'x'
								},
								title: {
									text: '充值金额'
								},
								xAxis: {
									categories: result.dates
								},
								yAxis: {
									gridLineDashStyle: 'loaddash',
									title: {
										text: '元'
									}
								},
								legend: {
									layout: 'vertical',
									align: 'right',
									verticalAlign: 'middle',
									borderWidth: 1
								},
								series: [{
									name: '学生充值',
									data: result.studentChargeSum
								}, {
									name: '机构充值',
									data: result.institutionChargeSum
								}]
							});
							$('#charge-count-container').highcharts({
								chart: {
									zoomType: 'x'
								},
								title: {
									text: '充值次数'
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
									name: '学生充值',
									data: result.studentChargeCount
								}, {
									name: '机构充值',
									data: result.institutionChargeCount
								}]
							});
						});
					});
				}
			});
		</script>
	</body>
</html>
