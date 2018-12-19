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
		.low-retention {
			background-color: #b6f2f3;
		}
		.medium-retention {
			background-color: #8ee6ea;
		}
		.high-retention {
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
		<div class="mini-title">拍题回访率</div>
	</header>
	<article class="container-fluid">
		<div id="filter-container" class="form-inline search-form">
			<div class="form-group">
				<input type="text" data-date-format="yyyy-mm-dd" class="form-control form-date start-date" value="${startDate}"> -
				<input type="text" data-date-format="yyyy-mm-dd" class="form-control form-date end-date" value="${endDate}">
			</div>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading">拍题回访率</div>
			<div class="panel-body">
				<table class="table table-bordered table-hover">
					<thead>
						<tr>
							<td>日期</td>
							<c:forEach var="value" begin="1" end="7" step="1">
							<td>${ value }天后</td>
							</c:forEach>
						</tr>
					</thead>
					<tbody id="revisit-container"></tbody>
				</table>
			</div>
		</div>
	</article>
	<script id="user-retention-tmpl" type="text/html">
		{{each userData}}
			<tr>
				<td>{{$value.date}}</td>
				{{each $value.retaintions as retention}}
				{{if retention === 0}}
					<td></td>
				{{else}}
				<td class="{{if retention < 20}}low{{else if retention < 40}}medium{{else}}high{{/if}}-retention">{{retention}}%</td>
				{{/if}}
				{{/each}}
			</tr>
		{{/each}}
	</script>
	<script type="text/javascript">
		MX.load({
			js: 'lib/sea',
			version: '${ JS_LIB_SEA_VERSION }',
			success: function() {
				seajs.use(['lib/jquery', 'util/bootstrap.datetimepicker.zh-CN', 'util/ajaxPromise', 'util/artTemplate'], function($, datetimepicker, ajaxPromise, tmpl) {
					var updateData, revisitContainer, filterContainer, btnExport;
					revisitContainer = $('#revisit-container');
					filterContainer = $('#filter-container');
					updateData = function() {
						var config = {
							startDate: filterContainer.find('.start-date').val(),
							endDate: filterContainer.find('.end-date').val()
						};
						ajaxPromise({
							url: window.basePath + 'confidential/dailyRevisitSearch',
							type: 'GET',
							data: config,
							dataType: 'json'
						}).then(function(data) {
							var result = data.result;
							if(result.length === 0) {
								alert('当前时间段暂无数据');
								return;
							}
							// render table
							revisitContainer.html(tmpl('user-retention-tmpl', {
								userData: result
							}));
						});
					};
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