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
	<div class="row clearfix" style="margin:20px auto;"></div>
	<form class="form-horizontal" role="form">
		  <input  type="hidden"  id="objId" value="${id}"/>
		  <div class="form-group">
			    <label for="project" class="col-sm-2 control-label">项目名</label>
			    <div class="col-sm-9">
			       <div>
			       		<c:forEach var="one"  items="${ appVersionProjectLsts }" varStatus="stat">
			       			<c:if test="${edittype == 'crt' && stat.count==1 }">
			       				<label class="radio-inline">
									<input type="radio" name="project"  class="project"  value="${one.projectId }"  checked> ${one.projectName }
								</label>
			       			</c:if>
			       			<c:if test="${edittype == 'crt' && stat.count != 1 }">
			       				<label class="radio-inline">
									<input type="radio" name="project"  class="project"  value="${one.projectId }" > ${one.projectName }
								</label>
			       			</c:if>
			       			<c:if test="${edittype == 'upd' }">
				       			<label class="radio-inline">
				       				<c:if test="${one.projectId == appversion.project }">
				       					<input type="radio" name="project"  class="project"  value="${one.projectId }"  checked> ${one.projectName }
				       				</c:if>
				       				<c:if test="${one.projectId != appversion.project }">
				       					<input type="radio" name="project"  class="project"  value="${one.projectId }" > ${one.projectName }
				       				</c:if>
								</label>
							</c:if>
			       		</c:forEach>
					</div>
			    </div>
		  </div>
		  <div class="form-group">
			    <label for="project" class="col-sm-2 control-label">渠道名</label>
			    <div class="col-sm-9">
			       <div>
			       		<c:forEach var="one"  items="${ appVersionProjectChannelLst }" varStatus="stat">
			       			<c:if test="${edittype == 'crt' && stat.count==1 }">
			       				<label class="radio-inline">
									<input type="radio" name="channel"  class="channel"  value="${one.channelId }"  checked> ${one.channelName }
								</label>
			       			</c:if>
			       			<c:if test="${edittype == 'crt' && stat.count != 1 }">
			       				<label class="radio-inline">
									<input type="radio" name="channel"  class="channel"  value="${one.channelId }" > ${one.channelName }
								</label>
			       			</c:if>
			       			<c:if test="${edittype == 'upd' }">
			       				<label class="radio-inline">
			       					<c:if test="${one.channelId == appversion.channel }">
			       						<input type="radio" name="channel"  class="channel"  value="${one.channelId }"  checked> ${one.channelName }
			       					</c:if>
			       					<c:if test="${one.channelId != appversion.channel }">
			       						<input type="radio" name="channel"  class="channel"  value="${one.channelId }"  > ${one.channelName }
			       					</c:if>
								</label>
			       			</c:if>
			       		</c:forEach>
					</div>
			    </div>
		  </div>
		  <div class="form-group">
			    <label for="version" class="col-sm-2 control-label">版本</label>
			    <div class="col-sm-9">
			       <input type="text" class="form-control"  id="version"  placeholder="请输入版本号"  value="${appversion.version}">
			    </div>
		  </div>
		  <div class="form-group">
			    <label for="desc_info" class="col-sm-2 control-label">描述信息</label>
			    <div class="col-sm-9">
			       <textarea class="form-control" rows="8"  id="desc_info"  placeholder="最多输入250个字符" >${appversion.desc_info}</textarea>
			    </div>
		  </div>
 	</form>
</body>
<script type="text/javascript">
	MX.load({
		js: 'lib/sea',
		version: '${ JS_LIB_SEA_VERSION }',
		success: function() {
			seajs.use(['lib/jquery'], function($) {
				
			});
		}
	});
</script>
</html>