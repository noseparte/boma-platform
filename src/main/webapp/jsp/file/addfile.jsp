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
	<title>导入文件</title>
	<link type="image/x-icon" rel="shortcut icon" href="<%=basePath %>image/logo/favicon.ico">
	<link rel="stylesheet" href="<%=basePath %>css/bootstrap/bootstrap.3.3.5.min.css">
	<link href="<%=basePath %>css/bootstrap/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css"/>
	<link rel="stylesheet" href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css">
	<script type="text/javascript">
		var path = '<%=path %>';
		var basePath = '<%=basePath%>';
		(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
	</script>
</head>
<body>
<c:set var="preUrl" value="recognitionHistory
							?fileId=${ fileId }
							&operator=${ operator }
							&startTime=${ startTime }
							&endTime=${ endTime }&" />
	<header class="ui-page-header">
		<div class="mini-title">当前位置：导入文件</div>
	</header>
	<article class="container-fluid">
		<form class="form-inline search-form">
			<div class="form-group">
				<a href="#" class="btn btn-success ml10" id="import-imgs" data-toggle="modal" data-target=".modal">导入文件</a>
			</div>
		</form>
	<div id="modal-dialog" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">
						<span aria-hidden="true">&times;</span>
						<span class="sr-only">Close</span>
					</button>
					<h4 class="modal-title"></h4>
				</div>
				<div class="modal-body"></div>
				<div class="modal-footer"></div>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		MX.load({
			js: 'lib/sea',
			version: '${ JS_LIB_SEA_VERSION }',
			success: function() {
				seajs.use(['lib/jquery', 'util/bootstrap.datetimepicker.zh-CN', 'module/Dialog', 'util/uploadFile', 'util/artTemplate'], function($, datetimepicker, Dialog, uploader, tmpl) {
					var dialog = new Dialog('modal-dialog');
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
					$('#import-imgs').on('click', function(e) {
						var el = $(this);
						e.preventDefault();
						dialog.show({
							sizeClass: 'modal-sm',
							title: '选择',
							content: [
								'<input class="img-select form-control" type="file" multiple="multiple" accept="image/*">'
							].join(''),
							force: 1,
							confirm: function() {
								var Self = this, container;
								container = Self._container;
								uploader(container.find('.img-select')[0].files, {
									url: window.basePath + 'file/FileUpload/addfile'
								}).then(function(results) {
									var len, errorResults, errorTmpl;
									errorResults = results.filter(function(o) {
										return o.status !== 0;
									});
									len = errorResults.length;
									if(len > 0) {
										errorTmpl = tmpl.compile([
											'<div style="color:#c00;">处理完毕，以下上传失败：</div>',
											'<ul>',
												'{{each data}}',
												'<li>',
													'{{$value.name}}-{{$value.msg}}',
												'</li>',
												'{{/each}}',
											'</ul>',
											'<div style="color:#c00;">请修复问题文件重新上传！</div>'
										].join(''));
										container.html(errorTmpl({data: errorResults}));
									} else {
										container.text('处理完毕，全部上传成功！');
									}
								});
								container.html([
									'<div style="text-align:center;">正在上传，请等待…</div>',
									'<img src="' + window.basePath + 'image/recognition/loading.gif" style="display:block;width:24px;margin:0 auto;">'
								].join(''));
							}
						});
					});
				});
			}
		});
	</script>
</body>
</html>
