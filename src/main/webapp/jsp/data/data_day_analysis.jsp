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
		<meta charset="UTF-8">
		<title>日关键数据</title>
		<link href="<%=basePath%>css/bootstrap/bootstrap.3.3.5.min.css" rel="stylesheet" type="text/css"/>
		<link href="<%=basePath%>css/common_${ CSS_COMMON_VERSION }.css" rel="stylesheet" type="text/css"/>
		<style type="text/css">
			.low-retaintion {
				background-color: #b6f2f3;
			}
			.medium-retaintion {
				background-color: #8ee6ea;
			}
			.high-retaintion {
				background-color: #5dcacf;
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
			<div class="mini-title">日关键数据</div>
		</header>
		<article class="container-fluid">
			<div id="filter-container" class="form-inline search-form">
				<div class="form-group">
					<input type="text" data-date-format="yyyy-mm-dd" class="form-control form-date start-date" value="${startDate}">
					<input type="text" data-date-format="yyyy-mm-dd" class="form-control form-date end-date" value="${endDate}">
				</div>
				<div class="form-group">
					<label for="day" class="radio-inline">
						<input id="day" type="radio" name="type" value="1" checked>日
					</label>
			<!--  		<label for="month" class="radio-inline">
						<input id="month" type="radio" name="type" value="2">月
					</label>-->
				</div>
			</div>
		<!--  	<div class="panel panel-default">
				<div class="panel-body">
					<div id="user-addition" class="line-plot"></div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-body">
					<div id="user-active" class="line-plot"></div>
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-body">
					<div id="user-total" class="line-plot"></div>
				</div>
			</div>-->
			<div class="panel panel-default">
				<div class="panel-heading ui-flex-between"><span>日关键数据明细</span><a id="btn-export" href="<%=basePath%>generateDayRemain/exportDayNewLogin?startDate=${startDate}&endDate=${endDate}&type=1" class="btn btn-success btn-xs">导出</a></div>
				<div class="panel-body">
					<table class="table table-bordered table-hover">
						<thead>
							<tr>
								<td>日期</td>
								<td>服务器</td>
								<td>新增用户</td>
								<td>当前在线人数</td>
								<td>注册角色数</td>
								<td>注册账号数</td>
								<td>活跃角色数</td>
								<td>活跃账号数</td>
								<td>总充值人数</td>
								<td>总充值钱数</td>
								<td>充值总笔数</td>
								<td>首次充值人数</td>
								<td>首次充值总钱数</td>
								<td>首次充值笔数</td>
								<td>arppu</td>
								<td>arpu</td>
								<td>pur</td>
							</tr>
						</thead>
						<tbody id="user-data-container"></tbody>
					</table>
				</div>
			</div>
		</article>
		<script id="user-data-tmpl" type="text/html">
			{{each userData}}
				<tr>
					<td>{{$value.date}}</td>
					<td>{{$value.newlogin}}</td>
					<td>{{$value.alive}}</td>
					<td>{{$value.allAlive}}</td>
					<td>{{$value.newlogin}}</td>
					<td>{{$value.alive}}</td>
					<td>{{$value.allAlive}}</td>
					<td>{{$value.newlogin}}</td>
					<td>{{$value.alive}}</td>
					<td>{{$value.allAlive}}</td>
					<td>{{$value.newlogin}}</td>
					<td>{{$value.alive}}</td>
					<td>{{$value.allAlive}}</td>
				</tr>
			{{/each}}
		</script>
		<script type="text/javascript">
			MX.load({
				js: 'lib/sea',
				version: '${ JS_LIB_SEA_VERSION }',
				success: function() {
					seajs.use(['lib/jquery', 'lib/highcharts', 'util/bootstrap.datetimepicker.zh-CN', 'util/ajaxPromise', 'util/artTemplate'], function($, highcharts, datetimepicker, ajaxPromise, tmpl) {
						var updateData, plotLine, userDataContainer, userAddition,userActive, userTotal, filterContainer, btnExport;
						userDataContainer = $('#user-data-container');
						userAddition = $('#user-addition');
						userActive = $('#user-active');
						userTotal = $('#user-total');
						filterContainer = $('#filter-container');
						btnExport = $('#btn-export');
						updateData = function() {
							var config = {
								startDate: filterContainer.find('.start-date').val(),
								endDate: filterContainer.find('.end-date').val(),
								type: filterContainer.find('[name="type"]').filter(':checked').val()
							};
							ajaxPromise({
								url: window.basePath + 'data/dataDaySearch',
								type: 'GET',
								data: config,
								dataType: 'json'
							}).then(function(data) {
								var renderData = {}, result = data.result;
								if(result.length === 0) {
									alert('当前时间端暂无数据');
									return;
								}
								Object.keys(result[0]).forEach(function(key) {
									renderData[key] = result.map(function(o) {
										return o[key];
									});
								});
								// render plot
								plotLine(userAddition, {
									title: '新增用户',
									categories: renderData.date,
									yLabel: '新增用户(人)',
									series: [{
										name: '新增用户',
										data: renderData.newlogin
									}]
								});
								plotLine(userActive, {
									title: '活跃用户',
									categories: renderData.date,
									yLabel: '活跃用户(人)',
									series: [{
										name: '活跃用户',
										data: renderData.alive
									}]
								});
								plotLine(userTotal, {
									title: '总用户数',
									categories: renderData.date,
									yLabel: '总用户数(人)',
									series: [{
										name: '总用户数',
										data: renderData.allAlive
									}]
								});
								// render table
								userDataContainer.html(tmpl('user-data-tmpl', {
									userData: result
								}));
								btnExport.attr('href', window.basePath + 'generateDayRemain/exportDayNewLogin?startDate=' + config.startDate + '&endDate=' + config.endDate + '&type=' + config.type);
							});
						};
						/**
						 * 绘制直线
						 * @param	{jQuery} container 容器
						 * @param	{Object} config 配置参数
						 * @config {String} title 标题
						 * @config {Array} categories x轴数据
						 * @config {Array} yLabel y标签
						 * @config {Array} series 序列
						 */
						plotLine = function(container, config) {
							container.highcharts({
								title: {
									text: config.title
								},
								xAxis: {
									categories: config.categories
								},
								yAxis: {
									gridLineDashStyle: 'loaddash',
									title: {
										text: config.yLabel
									}
								},
								legend: {
									layout: 'vertical',
									align: 'right',
									verticalAlign: 'middle',
									borderWidth: 1
								},
								series: config.series
							});
						};
						filterContainer.find('[name="type"]').on('change', function(e) {
							updateData();
						});
						filterContainer.find('.form-date').datetimepicker({
							language: 'zh-CN',/*加载日历语言包，可自定义*/
							weekStart: 1,
							todayBtn: 1,
							autoclose: 1,
							todayHighlight: 1,
							minView: 2,
							forceParse: 0,
							showMeridian: 1
						}).on('changeDate', function(e) {
							updateData();
						});
						updateData();
					});
				}
			});
		</script>
	</body>
</html>