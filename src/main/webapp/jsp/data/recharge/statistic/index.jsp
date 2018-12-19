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
<%@ include file="../../../inc/version.jsp"%>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>充值统计</title>
<meta http-equiv="keywords" content="" />
<meta http-equiv="description" content="" />
<link type="image/x-icon" rel="shortcut icon"
	href="<%=basePath%>image/logo/favicon.ico">
<link rel="stylesheet"
	href="<%=basePath%>css/bootstrap/bootstrap.3.3.5.min.css">
<link href="<%=basePath%>css/bootstrap/bootstrap-datetimepicker.min.css"
	rel="stylesheet" type="text/css" />
<link rel="stylesheet"
	href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css">
<script type="text/javascript">
			var path = '<%=path%>';
			var basePath = '<%=basePath%>';
			(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()});}}})();
		</script>
</head>
<body>
	<!-- 头部 start -->
	<header>
		<form class="form-inline search-form">
			<div class="row" style="background:#666;margin:10px;padding:10px;">
				<div class="col-sm-12">
					<form class="navbar-form navbar-left" role="search">
						<!-- 日期选择框 start -->
						<div class="form-group">
							<i class="text-warning glyphicon glyphicon-calendar" id="start"
								style="cursor:pointer;"></i> <input
								class="form-control form-date startDateStr" type="text"
								value="${ startDateStr }" name="startDateStr"
								data-date-format="yyyy-mm-dd"> <span>&nbsp;&nbsp;&nbsp;</span>
							~ <i class="text-warning glyphicon glyphicon-calendar" id="end"
								style="cursor:pointer;"></i> <input
								class="form-control form-date endDateStr" type="text"
								value="${ endDateStr }" name="endDateStr"
								data-date-format="yyyy-mm-dd" /> <span>&nbsp;&nbsp;&nbsp;</span>
								<button class="btn btn-primary">搜索</button>
						</div>
						<!-- 日期选择框 end -->
					</form>
				</div>
			</div>
		</form>
	</header>
	<!-- 头部 end -->
	<!-- 清除行间距 -->
	<div class="row clear"></div>
	<!-- 中间 start -->
	<article style="width:99%;">
		<!-- 统计 start -->
		<div class="statistic-main">
			<!-- 统计表单数据 start -->
			<div class="row">
				<div class="col-sm-12">
					<div class="panel panel-default" style="min-height:500px;">
						<div class="panel-heading">统计图展示</div>
						<!-- 表单数据 start -->
						<table
							class="highchart  table table-hover table-bordered table-condensed "
							style="display:none;" data-graph-container="container"
							data-graph-container-before="1" data-graph-type="column">
							<caption>统计数据展示</caption>
							<thead>
								<tr style="background:#60686b;">
									<!-- <th class="min-w2" >序号</th> -->
									<th class="min-w50">日期</th>
									<th class="min-w50">1号商品</th>
									<th class="min-w50">2号商品</th>
									<th class="min-w80">3号商品</th>
									<th class="min-w80">4号商品</th>
									<th class="min-w80">5号商品</th>
									<th class="min-w80">6号商品</th>
								</tr>
							</thead>
							<tbody>
								<c:forEach var="one" items="${ list }" varStatus="status">
									<tr>
										<%-- <td>${status.count }</td> --%>
										<td>${ one.date }</td>
										<td>${ one.scale1 }</td>
										<td>${ one.scale2 }</td>
										<td>${ one.scale3 }</td>
										<td>${ one.scale4 }</td>
										<td>${ one.scale5 }</td>
										<td>${ one.scale6 }</td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
						<!-- 表单数据 end -->
						<div class="after">
							<a class="btn btn-primary statistic_img"><i
								class="glyphicon glyphicon-align-left">统计图</i></a> <a
								class="btn btn-primary statistic_table"><i
								class="glyphicon glyphicon-th-list">统计表格</i></a>
						</div>
					</div>
				</div>

			</div>
			<!-- 统计表单数据 end -->
		</div>
		<!-- 统计 end -->
	</article>
	<!-- 中间 end  -->

	<%-- <%@ include file = "../inc/newpage.jsp" %> --%>
	<script type="text/javascript" src="<%=basePath%>js/lib/jquery.js"></script>
	<script type="text/javascript"
		src="<%=basePath%>js/lib/highcharts.min.js"></script>
	<script type="text/javascript"
		src="<%=basePath%>js/lib/highchartTable.js"></script>
	<script type="text/javascript">
			MX.load({
				js: 'lib/sea',
				version: '${ JS_LIB_SEA_VERSION }',
				success: function() {
					seajs.use(['lib/jquery', 'util/bootstrap-datetimepicker.zh-CN'], function($, datetimepicker) {
						// 绑定datetimepicker插件
						$('.form-date').datetimepicker({
							language: 'zh-CN',/*加载日历语言包，可自定义*/
							weekStart: 1,
							todayBtn:  1,
							autoclose: 1,
							todayHighlight: 1,
							minView: 2,
							forceParse: 0,
							showMeridian: 1,
							showDate: true,  
		                    timeFormat: 'yyyy-MM-dd',  
		                    //stepHour: 1,  
		                    //stepMinute: 1,  
		                    //stepSecond: 1  
						});
						$('.statistic_img').on('click',function() {
							$('.highchart').css('display','none'); 
							$('.highcharts-container ').css('display','block'); 
						});
						$('.statistic_table').on('click',function() {
							$('.highchart').css('display','block'); 
							$('.highcharts-container ').css('display','none'); 
						});
						$('#start').on('click',function(){
							$('.startDateStr').datetimepicker('show');
						});
						$('#end').on('click',function(){
							$('.endDateStr').datetimepicker('show');
						});
					});
					$(document).ready(function() {
						  $('table.highchart').highchartTable();
					});
				}
			});
		</script>
</body>
</html>