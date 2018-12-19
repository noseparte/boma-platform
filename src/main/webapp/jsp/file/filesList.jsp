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
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">    
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<title>平台日志</title>
<link type="image/x-icon" rel="shortcut icon" href="<%=basePath %>image/logo/favicon.ico">
<link href="<%=basePath %>css/bootstrap/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" href="<%=basePath %>css/bootstrap/bootstrap.3.3.5.min.css">
<link rel="stylesheet" href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css">
<script type="text/javascript">
	var path = '<%=path %>';
	var basePath = '<%=basePath%>';
	(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
</script>
</head>
<body>
<c:set var="preUrl" value="fileupload/uploadFile
							?loginName=${ loginName }
							&startTime=${ startTime }
							&endTime=${ endTime }&" />
	<header class="ui-page-header">
		<div class="mini-title">当前位置：文件列表</div>
	</header>
	<article class="container-fluid">
		<form class="form-inline search-form">
			<div class="form-group">
				<label>操作人</label>
				<input type="text" class="form-control" value="${ loginName }" name="loginName"/>
			</div>
			<div class="form-group">
				<label>查询时间</label>
				<input class="form-control form-date" type="text" value="${ startTime }" name="startTime" data-date-format="yyyy-mm-dd 00:00:00">~<input class="form-control form-date" type="text" value="${ endTime }" name="endTime" data-date-format="yyyy-mm-dd 23:59:59"/>
			</div>
			<div class="form-group">
				<button class="btn btn-primary">搜索</button>
			</div>
		</form>
		<div class="form-group">
				<form name="form3" action="/platform/api/file/new/fileUpload" method="post" enctype="multipart/form-data"> 
                <input type="file" name="file" /> <input type="submit" value="文件上传" /></form>  
        </div>
		<div class="form-group">
				<form name="form2" action="/platform/api/file/new/fileUpdateUpload" method="post" enctype="multipart/form-data">  
                <input type="file" name="file" /> <input type="submit" value="文件更新" /></form>  
		</div>
		<table class="table table-hover table-bordered table-condensed">
			<thead>
				<tr class="info">
				<!-- <th style="min-width:50px">操作人</th>
					<th style="min-width:50px">操作ip</th>
					<th style="min-width:90px">操作时间</th>
					<th style="min-width:90px">操作说明</th> -->	
				</tr>
			</thead>
			<tbody id="user-list">
				<c:forEach var="userLog" items="${ userLogsList }">
					<tr >
						<td>${ userLog.loginName }</td>
				 		<td class="loginIp">${ userLog.loginIp }</td>
						<td class="createtime">${ func:formatDate(userLog.createtime)}</td>
						<td class="operation">${ userLog.operation }</td>
					</tr>
				</c:forEach>
			</tbody>
		</table>
	</article>
	<%@ include file = "../inc/newpage.jsp" %>
	<div id="modal-dialog" class="modal fade"  tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
					<h4 class="modal-title"></h4>
				</div>
				<div class="modal-body"></div>
				<div class="modal-footer"></div>
			</div><!-- /.modal-content -->
		</div><!-- /.modal-dialog -->
	</div><!-- /.modal -->
<script type="text/javascript">
MX.load({
	js: 'lib/sea',
	version: '${ JS_LIB_SEA_VERSION }',
	success: function() {
	seajs.use(['lib/jquery', 'util/bootstrap.datetimepicker.zh-CN', 'util/ajaxPromise'], function($, datetimepicker, ajaxPromise) {
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

