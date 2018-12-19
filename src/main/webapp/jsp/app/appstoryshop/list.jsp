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
<title>app故事集商店列表</title>
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
	<article class="container-fluid">
	
		<div class="panel panel-default" >
			  <div class="panel-heading">
			    	<h3 class="panel-title">商店信息列表</h3>
			  </div>
			  <div style="min-height:620px;">
			    	 <ul class="list-group">
			    	 		<li class="list-group-item list-group-item-warning">
    	 	   						<div class="row" style="min-height:20px;">
    	 	   							<div class="col-sm-1 text-center" >序号</div>
										<div class="col-sm-2 text-center" >创建人</div>
										<div class="col-sm-2 text-center" >商店名称</div>
										<div class="col-sm-1 text-center" >上月打开数</div>
										<div class="col-sm-1 text-center" >昨天打开数</div>
										<div class="col-sm-1 text-center" >上小时打开数</div>
										<div class="col-sm-1 text-center" >系数</div>
										<div class="col-sm-1 text-center" >系数比例</div>
										<div class="col-sm-1 text-center" >统计综合值</div>
										<div class="col-sm-1 text-center" >操作</div>
    	 	   						</div>
    	 	   				</li>
    	 	   				<c:if test="${isSuccess}">
					    	 	   <c:forEach var= "one"  items="${pagin.datas}"  varStatus ="status">
			    	 	   				<li class="list-group-item 
			    	 	   						<c:if test='${stat.index%2==0 }'>list-group-item-info</c:if>
			    	 	   						<c:if test='${stat.index%2==1 }'>list-group-item-success</c:if>">
			    	 	   						<div class="row" style="min-height:60px;">
			    	 	   							<div class="col-sm-1">
			    	 	   								<div class="row text-center"  style="font-size:12px;">
			    	 	   									<div>${ status.count }</div>
			    	 	   								</div>
			    	 	   							</div>
			    	 	   							<div class="col-sm-2">
			    	 	   								<div class="row text-center" >
			    	 	   									<div>${ one.authorName }</div>
			    	 	   								</div>
			    	 	   							</div>
			    	 	   							<div class="col-sm-2">
			    	 	   								<div class="row text-center">
			    	 	   									<div>${ one.name }</div>
			    	 	   								</div>
			    	 	   							</div>
			    	 	   							<div class="col-sm-1">
				    	 	   							   <div class="row text-center">
				    	 	   									<div>${ one.preMonthOpenCount }</div>
				    	 	   								</div>
			    	 	   							</div>
			    	 	   							<div class="col-sm-1">
				    	 	   							   <div class="row text-center">
				    	 	   									<div>${ one.preTodayOpenCount }</div>
				    	 	   								</div>
			    	 	   							</div>
			    	 	   							<div class="col-sm-1">
			    	 	   									<div class="row text-center">
				    	 	   									<div>${ one.preHourOpenCount }</div>
				    	 	   								</div>
			    	 	   							</div>
			    	 	   							<div class="col-sm-1">
			    	 	   								<div class="row text-center">
				    	 	   									<div>${ one.rv }</div>
				    	 	   							</div>
			    	 	   							</div>
			    	 	   							<div class="col-sm-1">
			    	 	   								<div class="row text-center">
				    	 	   									<div>${ one.rvRadio }</div>
				    	 	   							</div>
			    	 	   							</div>
			    	 	   							<div class="col-sm-1">
			    	 	   								<div class="row text-center">
				    	 	   									<div>${ one.recommend }</div>
				    	 	   							</div>
			    	 	   							</div>
			    	 	   							<div class="col-sm-1">
			    	 	   								<div class="row text-center">
				    	 	   									<button class="btn btn-success toEdit" objId="${one.id }"  oneRv="${one.rv }">修改商店系数</button >
				    	 	   							</div>
			    	 	   							</div>
			    	 	   						</div>
			    	 	   				</li>
					    	 	   </c:forEach>
			    	 	   </c:if>
					 </ul>
			  </div>
			  <div class="panel-footer" style="padding-bottom:0px;margin-bottom:0px;">
						<c:if test="${isSuccess && pagin.datas.size() > 0}">
							<jsp:include page="./page.jsp" >
								<jsp:param name="pagin" value="${pagin}" />
							</jsp:include>
						</c:if>
						<c:if test="${ !isSuccess || pagin.datas.size() == 0}">
								<div class="row">
									<div class="col-sm-1 col-sm-offset-6 text-warning">暂无数据</div>
								</div>
						 </c:if>
			  </div>
		</div>
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
					var oneRv = $(this).attr('oneRv');
					if (objId == '') {
        				BootstrapModel.create_bootstarp_alert({
                            type: 'danger',
                            content: '该商店不存在'
                        });
					}
					var url = '<%=basePath%>app/storyshop/toEdit.html';
					$.get(url,{
						id:objId
					}).then(function(data) {
						BootstrapModel.create_bootstarp_dialog({
							title: "修改信息",
			                type: 'warning',
			                width: '400',
			                height:"200",
			                content: data,
			                button: {
			                	"确定":function() {
			                		var editUrl= '<%=basePath %>app/storyshop/edit';
			                		var rv = $('#rv').val().trim();
			                		if (rv == '') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '商店系数值必须填写!'
				                        }, function(){
			                            });
			                		}
			                		if (parseInt(rv)!=rv) {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '商店系数不是整数!'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		$.post(editUrl,{
			                			id:objId,
			                			rv: rv
			                		}).then(function(data){
			                			if (data.status == 0) {
			                				BootstrapModel.create_bootstarp_alert({
					                            type: 'success',
					                            content: '修改成功'
					                        }, function(){
					                        	window.location.href="<%=basePath %>app/storyshop/list.html";
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
				})
				
			});
		}
	});
</script>
</html>