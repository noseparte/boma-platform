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
<title>app通知公告页面</title>
<meta http-equiv="keywords" content=""/>
<meta http-equiv="description" content=""/>
<link type="image/x-icon" rel="shortcut icon" href="<%=basePath %>image/logo/favicon.ico">
<link rel="stylesheet" href="<%=basePath %>css/bootstrap/bootstrap.3.3.5.min.css">
<link href="<%=basePath %>css/bootstrap/bootstrap-datetimepicker.min.css" rel="stylesheet" type="text/css"/>
<link href="<%=basePath %>js/jquery.spinner-master/dist/css/bootstrap-spinner.min.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css">
<link rel="stylesheet" href="<%=basePath %>css/exam/problem.css">
<script type="text/javascript">
	var path = '<%=path %>';
	var basePath = '<%=basePath%>';
	(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
</script>
<script type="text/javascript" src="<%=basePath%>js/jquery.spinner-master/dist/js/jquery.spinner.min.js"></script>
</head>
<body>
	<div class="row clearfix" style="margin:2px auto;"></div>
	<form class="form-horizontal" role="form">
		  <input  type="hidden"  id="objId" value="${id}"/>
		  <div class="form-group">
			    <label for="title" class="col-sm-3 control-label">公告标题</label>
			    <div class="col-sm-9">
			       <input type="text" class="form-control title" placeholder="请输入公告标题"  value="${one.title}">
			    </div>
		  </div>
		  <div class="form-group">
			    <label for="content" class="col-sm-3 control-label">公告内容</label>
			    <div class="col-sm-9">
			    	<textarea class="form-control content" rows="2"   placeholder="请输入公告内容"  >${one.content}</textarea>
			    </div>
		  </div>
		  <div class="form-group">
			    <label for="sendDate" class="col-sm-3 control-label">公告发布时间</label>
			    <div class="col-sm-9">
			    	<div class="row">
			    		<div class="col-sm-10">
			    			<input type="text" class="form-control sendDateStr"   value="${ func:formatDate(one.sendDate) }" data-date-format="yyyy-mm-dd hh:ii:00"  readonly>
			    		</div>
			    		<div class="col-sm-2">
			    			<i class="glyphicon glyphicon-calendar" style="font-size:30px;color:#5cb85c;"></i>
			    		</div>
			    	</div>
			    </div>
		  </div>
		  <div class="form-group">
			    <label for="proTypeCode" class="col-sm-3 control-label">项目类型</label>
			    <div class="col-sm-9">
			    	 <label class="radio-inline">
        				<input type="radio" name="proTypeCode"  value="1" checked> 三消项目
    				</label>
			    </div>
		  </div>
		  <div class="form-group">
			    <label for="appTypeCode" class="col-sm-3 control-label">应用类型</label>
			    <div class="col-sm-9">
			    	 <label class="radio-inline">
        				<input type="radio" name="appTypeCode"  value="0"  <c:if test="${one.appTypeCode==null || one.appTypeCode == 0 }">checked</c:if>/> all
    				</label>
			    	 <label class="radio-inline">
        				<input type="radio" name="appTypeCode"  value="1"  <c:if test="${one.appTypeCode == 1 }">checked</c:if> /> 安卓
    				</label>
			    	 <label class="radio-inline">
        				<input type="radio" name="appTypeCode"  value="2"  <c:if test="${one.appTypeCode == 2 }">checked</c:if> /> 苹果
    				</label>
			    </div>
		  </div>
		  <div class="form-group">
			    <label for="order" class="col-sm-3 control-label">排序号</label>
			    <div class="col-sm-9">
			       <%-- <input type="text" class="form-control order"  placeholder="请输入排序数"  value="${one.order}"> --%>
			       <div class="input-group spinner" data-trigger="spinner">
					    <input type="text" class="form-control text-center order" value="${one.order }" data-min="0"  data-step="1" data-rule="quantity">
					    <span class="input-group-addon">
					        <a href="javascript:" class="spin-up" data-spin="up"><i class="glyphicon glyphicon-chevron-up"></i></a>
					        <a href="javascript:" class="spin-down" data-spin="down"><i class="glyphicon glyphicon-chevron-down"></i></a>
					    </span>
					</div>
			    </div>
		  </div>
		  <div class="form-group">
			    <label for="status" class="col-sm-3 control-label">公告状态</label>
			    <div class="col-sm-9">
			        <label class="radio-inline">
        				<input type="radio" name="status"  value="0"  <c:if test="${one.status==0 }">checked</c:if> /> 下架
    				</label>
			    	 <label class="radio-inline">
        				<input type="radio" name="status"  value="1"  <c:if test="${one.status==1 }">checked</c:if>/> 发布
    				</label>
			    </div>
		  </div>
 	</form>
</body>
<script type="text/javascript">
	MX.load({
		js: 'lib/sea',
		version: '${ JS_LIB_SEA_VERSION }',
		success: function() {
			seajs.use(['lib/jquery', 'util/bootstrap.datetimepicker.zh-CN'], function($, datetimepicker) {
				// 绑定datetimepicker插件
				$('.sendDateStr').datetimepicker({
						language: 'zh-CN',/*加载日历语言包，可自定义*/
						weekStart: 1,
						todayBtn:  1,
						autoclose: 1,
						todayHighlight: 1,
						minView: 0,
						forceParse: 0,
						showMeridian: 1,
						showDate: true,  
	                    timeFormat: 'yyyy-mm-dd hh:ii:ss',  
	                    stepHour: 1,  
	                    stepMinute: 1,  
	                    stepSecond: 1  
				});
				$('.glyphicon-calendar').on('click',function(){
					$('.sendDateStr').focus();
				});
				
				$('.order').spinner('changed', function(e, newVal, oldVal) {});
				$('[data-trigger="spinner"]').spinner('changing', function(e, newVal, oldVal) {});
			});
		}
	});
</script>
</html>