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
<%@ include file = "../../inc/version.jsp" %>
<head>
<meta charset="utf-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>app版本管理列表</title>
<meta http-equiv="keywords" content=""/>
<meta http-equiv="description" content=""/>
<link type="image/x-icon" rel="shortcut icon" href="<%=basePath %>image/logo/favicon.ico">
<link rel="stylesheet" href="<%=basePath %>css/bootstrap/bootstrap.3.3.5.min.css">
<link href="<%=basePath %>css/bootstrap/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css">
<link rel="stylesheet" href="<%=basePath %>css/exam/problem.css">
<script type="text/javascript">
	var path = '<%=path %>';
	var basePath = '<%=basePath%>';
	(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
</script>
</head>
<body>
	<header class="ui-page-header">
		<div class="mini-title">当前位置：app版本管理列表</div>
	</header>
	<div class="row">
		<div class="col-sm-2 col-sm-offset-9">
			<button class="btn btn-info pull-right toEdit"  objId="" >添加</button>
		</div>
	</div>
	<article class="container-fluid">
		<table class="table table-hover table-bordered table-condensed">
			<thead>
				<tr class="info">
					<th>序号</th>
					<th>创建人</th>
					<th>创建时间</th>
					<th>项目名</th>
					<th>渠道</th>
					<th>版本号</th>
					<th>版本描述</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody id="list">
				<c:if test="${isSuccess}">
					<c:forEach var="one" items="${ pagin.datas }" varStatus="stat">
						<tr>
							<td> ${stat.count }</td>
							<td>${ one.create_by }</td>
							<td>${func:formatDate(one.create_date) }</td>
							<td>${one.project}</td>
							<td>${one.channel}</td>
							<td>${ one.version }</td>
							<td>${ one.desc_info }</td>
							<td>
								<a class="btn btn-warning btn-sm toEdit"  objId="${one.id}">修改</a>
								<a class="btn btn-danger btn-sm del"  delId="${one.id }">删除</a>
							</td>
						</tr>
					</c:forEach>
				</c:if>
			</tbody>
		</table>
	</article>
</body>
<script type="text/javascript">
	MX.load({
		js: 'lib/sea',
		version: '${ JS_LIB_SEA_VERSION }',
		success: function() {
			seajs.use(['lib/jquery', 'util/bootstrap.datetimepicker.zh-CN','util/bootstrapModel'], function($,datetimepicker,model) {
				$('.toEdit').on('click',function() {
					var objId = $(this).attr('objId');
					var url = '<%=basePath%>app/version/toEdit.html';
					$.get(url,{
						id:objId
					}).then(function(data) {
						BootstrapModel.create_bootstarp_dialog({
							title: objId=="" ? "添加版本信息":"修改版本信息",
			                type: 'warning',
			                width: '800',
			                height:"200",
			                content: data,
			                button: {
			                	"确定":function() {
			                		var projectId = $('.project:checked').val();
			                		var channelId = $('.channel:checked').val();
			                		var version = $('#version').val();
			                		var desc_info = $('#desc_info').val();
			                		if (projectId=='') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: "项目名必须选择"
				                        });
			                			return;
			                		}
			                		if (channelId=='') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: "渠道名必须选择"
				                        });
			                			return;
			                		}
			                		if (version == '') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: "版本号不能为空"
				                        });
			                			return;
			                		}
			                		if (desc_info.length>250) {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: "版本描述信息不能超过250个字"
				                        });
			                			return;
			                		} 
			                		// alert(projectId+":"+channelId+":"+version+":"+desc_info);
			                		var editUrl= '<%=basePath %>app/version/edit';
			                		$.post(editUrl,{
			                			id:objId,
			                			projectId:projectId,
			                			channelId:channelId,
			                			version:version,
			                			desc_info: desc_info.trim()
			                		}).then(function(data){
			                			if (data.status == 0) {
			                				BootstrapModel.create_bootstarp_alert({
					                            type: 'success',
					                            content: objId==''?'新增成功':'修改成功'
					                        }, function(){
					                        	window.location.href="<%=basePath %>app/version/list.html";
				                            });
			                			} else {
			                				BootstrapModel.create_bootstarp_alert({
					                            type: 'danger',
					                            content: data.msg
					                        });
			                			}

			                		},
			                	     function(data){
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'danger',
				                            content: data.msg
				                        });

			                		});

			                	},
			                	"取消":function() {

			                	}
			                }
						});
					});
				});
				
				// 删除操作
				$('.del').on('click',function() {
					var delId = $(this).attr('delId');
					var url =  '<%=basePath %>app/version/del';
					$.post(url,{
						id: delId
					}).then(function(data) {
						if (data.msg == 'ok') {
							BootstrapModel.create_bootstarp_alert({
	                            type: 'success',
	                            content: "删除app版本信息成功"
	                        }, function(){
                                window.location.reload();
                            });
							//window.location.reload();

						} else {
							BootstrapModel.create_bootstarp_alert({
	                            type: 'danger',
	                            content: data.msg
	                        });

						}
					});
				})
				
				
			});
		}
	});
</script>
</html>