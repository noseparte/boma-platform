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
<%@ include file = "../inc/version.jsp" %>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>每日销售统计</title>
	<link href="<%=basePath%>css/bootstrap/bootstrap.3.3.5.min.css" rel="stylesheet" type="text/css"/>
	<link href="<%=basePath%>css/common_${ CSS_COMMON_VERSION }.css" rel="stylesheet" type="text/css"/>
	<style type="text/css">
		.pie-container, .line-container {
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
	<div class="mini-title">每日销售统计</div>
</header>
<div class="panel panel-default">
	<div id="income-container" class="panel-body line-container"></div>
</div>
<div class="panel panel-default">
	<div class="panel-heading form-inline">
		<div class="form-group">
			<label>日期</label>
			<input id="statistic-date" type="text" data-date-format="yyyy-mm-dd" class="form-control form-date" value="2015-12-07">
		</div>
	</div>
	<div class="panel-body ui-flex-container">
		<div id="teacher-income-container" class="panel-body pie-container flex1"></div>
		<div id="xxb-income-container" class="panel-body pie-container flex1"></div>
	</div>
</div>
<script type="text/javascript">
	MX.load({
		js: 'lib/sea',
		version: '${ JS_LIB_SEA_VERSION }',
		success: function() {
			seajs.use(['lib/jquery', 'lib/highcharts', 'util/ajaxPromise', 'util/bootstrap.datetimepicker.zh-CN'], function($, highcharts, ajaxPromise, datetimepicker) {
				var renderSubject, _date, types;
				types = ['', '每日任务固定收入', '每日任务分成', '抢答固定收入', '拍题录讲解收入', '习题集收入', '请求讲解固定收入'];
				_date = $('#statistic-date');
				_date.datetimepicker({
					language: 'zh-CN',/*加载日历语言包，可自定义*/
					weekStart: 1,
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 1,
					minView: 2,
					forceParse: 0,
					showMeridian: 1
				}).on('changeDate', function(e) {
					renderIncome(_date.val());
				});
				renderIncome = function(date) {
					var data = {};
					if(date !== undefined) {
						data.date = date;
					}
					ajaxPromise({
						url: window.basePath + 'SalesStat/incomeDay',
						type: 'GET',
						data: data,
						dataType: 'json'
					}).then(function(data) {
						var result = data.result;
						result.teacherData.forEach(function(o) {
							o[0] = types[o[0]];
						});
						result.companyData.forEach(function(o) {
							o[0] = types[o[0]];
						});
						$('#teacher-income-container').highcharts({
							title: {
								text: '教师收入分布 (' + result.date + ')'
							},
							tooltip: {
								pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
							},
							plotOptions: {
								pie: {
									allowPointSelect: true,
									cursor: 'pointer',
									dataLabels: {
										enabled: true,
										color: '#000',
										connectorColor: '#000',
										format: '<b>{point.name}</b>: {point.percentage:.1f} %'
									}
								}
							},
							series: [{
								type: 'pie',
								name: '教师收入占比',
								data: result.teacherData
							}]
						});
						$('#xxb-income-container').highcharts({
							title: {
								text: '学习宝收入分布 (' + result.date + ')'
							},
							tooltip: {
								pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
							},
							plotOptions: {
								pie: {
									allowPointSelect: true,
									cursor: 'pointer',
									dataLabels: {
										enabled: true,
										color: '#000',
										connectorColor: '#000',
										format: '<b>{point.name}</b>: {point.percentage:.1f} %'
									}
								}
							},
							series: [{
								type: 'pie',
								name: '学习宝收入占比',
								data: result.companyData
							}]
						});
					});
				};
				ajaxPromise({
					url: window.basePath + 'SalesStat/dailyIncomeData',
					type: 'GET',
					dataType: 'json'
				}).then(function(data) {
					var result = data.result;
					$('#income-container').highcharts({
						chart: {
							zoomType: 'x'
						},
						title: {
							text: '每日销售统计'
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
							name: '学习宝',
							data: result.companyIncome
						}, {
							name: '教师',
							data: result.teacherIncome
						}]
					});
				});
				renderIncome();
			});
		}
	});
</script>
</body>
</html>