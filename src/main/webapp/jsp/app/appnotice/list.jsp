<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/tlds/Functions" prefix="func"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!doctype html>
<html lang="zh-CN">
<%@ include file="../../inc/version.jsp"%>
<head>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>app通知公告列表</title>
<meta http-equiv="keywords" content="" />
<meta http-equiv="description" content="" />
<link type="image/x-icon" rel="shortcut icon"
	href="<%=basePath%>image/logo/favicon.ico">
<link rel="stylesheet"
	href="<%=basePath%>css/bootstrap/bootstrap.3.3.5.min.css">
<link
	href="<%=basePath%>css/bootstrap/bootstrap-datetimepicker.min.css"
	rel="stylesheet" type="text/css" />
<link rel="stylesheet"
	href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css">
<link rel="stylesheet" href="<%=basePath%>css/exam/problem.css">
<script type="text/javascript">
	var path = '<%=path%>';
	var basePath = '<%=basePath%>';
	(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
</script>
</head>
<body>
	<div class="row clearfix" style="margin: 10px auto;"></div>
	<article class="container-fluid  container-list">
		<form class="form-inline search-form">
			<div class="form-group">
				<label>公告标题</label> <input class="form-control  title1" type="text"
					value="${ title }" name="title1" />
			</div>
			<div class="form-group">
				<label>项目类型</label> <select name="proTypeCode1"
					class="form-control proTypeCode1">
					<c:if test="${proTypeCode ==0 }">
						<option value="0" selected>全部</option>
					</c:if>
					<c:if test="${proTypeCode !=0 }">
						<option value="0">全部</option>
					</c:if>
					<c:if test="${proTypeCode ==1 }">
						<option value="1" selected>三消</option>
					</c:if>
					<c:if test="${proTypeCode !=1 }">
						<option value="1">三消</option>
					</c:if>
				</select>
			</div>
			<div class="form-group">
				<label>应用类型</label> <select name="appTypeCode1"
					class="form-control appTypeCode1">
					<c:if test="${appTypeCode ==0 }">
						<option value="0" selected>全部</option>
					</c:if>
					<c:if test="${appTypeCode !=0 }">
						<option value="0">全部</option>
					</c:if>
					<c:if test="${appTypeCode ==1 }">
						<option value="1" selected>安卓</option>
					</c:if>
					<c:if test="${appTypeCode !=1 }">
						<option value="1">安卓</option>
					</c:if>
					<c:if test="${appTypeCode ==2 }">
						<option value="2" selected>苹果</option>
					</c:if>
					<c:if test="${appTypeCode !=2 }">
						<option value="2">苹果</option>
					</c:if>
				</select>
			</div>
			<div class="form-group">
				<label>公告状态</label> <select name="status1"
					class="form-control status1">
					<c:if test="${status ==-2 }">
						<option value="-2" selected>全部</option>
					</c:if>
					<c:if test="${status !=-2 }">
						<option value="-2">全部</option>
					</c:if>
					<c:if test="${status ==0 }">
						<option value="0" selected>下架</option>
					</c:if>
					<c:if test="${status !=0 }">
						<option value="0">下架</option>
					</c:if>
					<c:if test="${status ==1 }">
						<option value="1" selected>发布</option>
					</c:if>
					<c:if test="${status !=1 }">
						<option value="1">发布</option>
					</c:if>
				</select>
			</div>
			<div class="form-group">
				<a class="btn btn-primary  search">搜索</a>
			</div>
		</form>
		<div class="panel panel-default">
			<div class="panel-heading">
				<div class="row">
					<div class="col-sm-2">
						<h3 class="panel-title">app通知公告列表</h3>
					</div>
					<div class="col-sm-2 pull-right">
						<a class="btn btn-success edit pull-right" objId="">添加</a>
					</div>
				</div>
			</div>
			<div style="min-height: 620px;">
				<ul class="list-group">
					<li class="list-group-item list-group-item-warning">
						<div class="row" style="min-height: 20px;">
							<div class="col-sm-1 text-center">序号</div>
							<div class="col-sm-1 text-center">创建人</div>
							<div class="col-sm-2 text-center">创建时间</div>
							<div class="col-sm-2 text-center">发布时间</div>
							<div class="col-sm-1 text-center">项目类型</div>
							<div class="col-sm-1 text-center">应用类型</div>
							<div class="col-sm-1 text-center">公告标题</div>
							<div class="col-sm-1 text-center">排序</div>
							<div class="col-sm-1 text-center">状态</div>
							<div class="col-sm-1 text-center">操作</div>
						</div>
					</li>
					<c:if test="${isSuccess}">
						<c:forEach var="one" items="${pagin.datas}" varStatus="stat">
							<li
								class="list-group-item 
			    	 	   						<c:if test='${stat.index%2==0 }'>list-group-item-info</c:if>
			    	 	   						<c:if test='${stat.index%2==1 }'>list-group-item-success</c:if>">
								<div class="row" style="min-height: 60px;">
									<div class="col-sm-1">
										<div class="row text-center" style="font-size: 12px;">
											<div>${ stat.count }</div>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="row text-center">
											<div>${ one.createBy }</div>
										</div>
									</div>
									<div class="col-sm-2">
										<div class="row text-center">
											<div>${ func:formatDate(one.createDate) }</div>
										</div>
									</div>
									<div class="col-sm-2">
										<div class="row text-center">
											<div>${ func:formatDate(one.sendDate) }</div>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="row text-center">
											<div>
												<c:if test="${one.proTypeCode == 1 }">三消项目</c:if>
											</div>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="row text-center">
											<div>
												<c:if test="${one.appTypeCode == 0 }">全部</c:if>
												<c:if test="${one.appTypeCode == 1 }">安卓</c:if>
												<c:if test="${one.appTypeCode == 2 }">苹果</c:if>
											</div>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="row text-center">
											<div>${ one.title }</div>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="row text-center">
											<div>${ one.order }</div>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="row text-center">
											<div>
												<c:if test="${one.status == -1 }">删除</c:if>
												<c:if test="${one.status == 0 }">下架</c:if>
												<c:if test="${one.status == 1 }">发布</c:if>
											</div>
										</div>
									</div>
									<div class="col-sm-1">
										<div class="row text-center">
											<a class="btn btn-warning edit" objId="${one._id }">修改</a> <a
												class="btn btn-danger del" objId="${one._id }">删除</a>
										</div>
									</div>
								</div>
							</li>
						</c:forEach>
					</c:if>
				</ul>
			</div>
			<div class="panel-footer"
				style="padding-bottom: 0px; margin-bottom: 0px;">
				<c:if test="${isSuccess && pagin.datas.size() > 0}">
					<jsp:include page="./page.jsp">
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
				// 新增 或 修改
				$('.edit').on('click', function () {
					var objId = $(this).attr('objId');
					//根据objId是否为空判断是新增还是修改
					console.info(objId);
					var url = '<%=basePath%>app/appnotice/toedit.html';
					$.get(url,{
						id:objId
					}).then(function(data) {
						BootstrapModel.create_bootstarp_dialog({
							title: objId==""?"新增信息":"修改信息",
			                type: 'warning',
			                width: '600',
			                height:"800",
			                content: data,
			                button: {
			                	"确定":function() {
			                		var title = $(".title").val();
			                		var content = $(".content").val();
			                		var sendDateStr = $(".sendDateStr").val();
			                		var proTypeCode = $("input[name='proTypeCode']:checked").val();
			                		var appTypeCode = $("input[name='appTypeCode']:checked").val();
			                		var order = $(".order").val();
			                		var status = $("input[name='status']:checked").val();
			                		if (title == '') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '标题不能为空'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		if (title.trim().length > 10) {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '标题不能超过10个字符'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		if (content == '') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '内容不能为空'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		if (content.trim().length > 250) {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '内容不能超过250个字符'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		
			                		if (sendDateStr == '') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '发送时间不能为空'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		if (proTypeCode == '') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '项目类型必选'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		if (appTypeCode == '') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '应用类型必须选择'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		if (order == '') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '排序号不能为空'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		if (status == '') {
			                			BootstrapModel.create_bootstarp_alert({
				                            type: 'warning',
				                            content: '状态必须选择'
				                        }, function(){
			                            });
			                			return;
			                		}
			                		//alert(title +"" + content +"=" + sendDateStr +"==="+ proTypeCode +"==="+appTypeCode +"===" +order+"=====" +status );
			                		var editUrl= '<%=basePath%>app/appnotice/edit';
			                		$.post(editUrl,{
			                			id:objId,
			                			title:title,
			                			content:content,
			                			sendDateStr:sendDateStr,
			                			proTypeCode:proTypeCode,
			                			appTypeCode:appTypeCode,
			                			order:order,
			                			status:status
			                		}).then(function(data){
			                			if (data.status == 0) {
			                				BootstrapModel.create_bootstarp_alert({
					                            type: 'success',
					                            content: objId==""?"新增信息成功":"修改信息成功"
					                        }, function(){
					                        	window.location.href="<%=basePath%>app/appnotice/list.html";
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
				
				// 删除
				$('.del').on('click', function () {
					var objId = $(this).attr('objId');
					if (objId == '') {
						BootstrapModel.create_bootstarp_alert({
                            type: 'warning',
                            content: '要删除的对象传参有误'
                        }, function(){
                        });
						return;
					}
					BootstrapModel.create_bootstarp_dialog({
						title: "删除提示",
		                type: 'warning',
		                width: '400',
		                height:"200",
		                content: "数据删除后将不可恢复,请确定是否删除该公告",
		                button: {
		                	"确定" : function (){
		                		var url = "<%=basePath%>app/appnotice/del";
		    					$.post(url,{
		    						id: objId
		    					}).then(function(data) {
		    						if (data.status == 0) {
		                				BootstrapModel.create_bootstarp_alert({
		    	                            type: 'success',
		    	                            content: '删除成功'
		    	                        }, function(){
		    	                        	window.location.href="<%=basePath%>app/appnotice/list.html";
		                                });
		                			} else {
		                				BootstrapModel.create_bootstarp_alert({
		    	                            type: 'danger',
		    	                            content: data.msg
		    	                        });
		                			}

		    					}, function(data) {
		    						BootstrapModel.create_bootstarp_alert({
		                                type: 'danger',
		                                content: data.msg
		                            });

		    					});

		                	},
		                	"取消" : function () {

		                	}
		                }
					});

				});
				

				// 搜索
				$(".search").on('click',function(){
					var title = $(".title1").val().trim();
					var status=$(".status1 option:selected").val();
					var proTypeCode=$(".proTypeCode1 option:selected").val();
					var appTypeCode=$(".appTypeCode1 option:selected").val();
					// alert(title+"==="+proTypeCode+"==="+appTypeCode + "===="+status);
					window.location.href="<%=basePath%>app/appnotice/list.html"
															+"?title="+title
															+"&status="+status
															+"&proTypeCode="+proTypeCode
															+"&appTypeCode="+appTypeCode;
				});
				
			});
		}
	});
</script>
</html>