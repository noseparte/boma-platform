<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/tlds/Functions" prefix="func"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!doctype html>
<html lang="zh-CN">
<%@ include file = "../inc/version.jsp" %>
<head>
	<title>《方块创造》平台公告</title>
	<meta charset="UTF-8">
	<link type="image/x-icon" rel="shortcut icon" href="<%=basePath %>image/logo/favicon.ico">
	<link href="<%=basePath %>css/bootstrap/bootstrap.3.3.5.min.css" rel="stylesheet" type="text/css"/>
	<link href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css" rel="stylesheet">
	<script type="text/javascript">
		var path = '<%=path %>';
		var basePath = '<%=basePath%>';
		(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
	</script>
	<style type="text/css">
	#notice-container .notice-tips {
		cursor: pointer;
		color: #8a6d3b;
	}
	</style>
</head>
<body>
	<c:set var="preUrl" value="announcementList?" />
	<header class="ui-page-header">
		<div class="mutil-title" id="notice-container">
			<!-- <div class="main-title"> -->
			<ul class ="nav">
			<li class="active"><a href="http://www.ugcapp.com" target="_blank">《方块创造》平台公告</a>
			</ul><!-- </div>-->
			<c:choose>
			<c:when test="${isread == false}">
			<div class="sub-title text-warning notice-tips" data-alt="公告" data-user-key="${userKey}" data-read-id="${firstid}">您有新公告未阅读</div>
			</c:when>
			<c:otherwise>
			<!-- <div class="sub-title">公告</div> -->
			</c:otherwise>
			</c:choose>
		</div>
	</header>
	<article class="container-fluid">
		<div class="panel panel-default">
			<div class="panel-heading">
				<span>公告栏</span>
			</div>
			<div class="panel-body">
				<table class="table table-stripped small m-t-md">
					<tbody>
						<tr>
							<td class="no-borders">
								<i class="fa fa-circle text-danger">
									<a href="http://www.ugcapp.com/reward_specified_page?devType=pc&pageName=user_agreement" target="_blank">《用户协议》</a>
								</i>
							</td>
						</tr>
						<tr>
							<td class="no-borders">
								<i class="fa fa-circle text-danger">
									<a href="http://www.ugcapp.com/reward_specified_page?devType=pc&pageName=parents_care" target="_blank">《家长监护》</a>
								</i>
							</td>
						</tr>
						<tr>
							<td class="no-borders">
								<i class="fa fa-circle text-danger">
									<a href="http://www.ugcapp.com/reward_specified_page?devType=pc&pageName=user_rights_protection" target="_blank">《用户权益保障措施》</a>
								</i>
							</td>
						</tr>
						<tr>
							<td class="no-borders">
								<i class="fa fa-circle text-danger">
									<a href="http://www.ugcapp.com/reward_specified_page?devType=pc&pageName=game_content_institution" target="_blank">《游戏内容自审制度》</a>
								</i>
							</td>
						</tr>
					</tbody>
				</table>
				<%-- <ul>
					<c:forEach var="announcement" items="${ announcementList }">
					<li class="content">
						<header class="mb6">
							<span class="text-muted">${ func:formatDate(announcement.createTime) } by ${ announcement.operator }</span>
						</header>
						<div>${ announcement.text }</div>
					</li>
					</c:forEach>
				</ul> --%>
			</div>
		</div>
	</article>
	<%@ include file = "../inc/newpage.jsp" %>
<script>
	MX.load({
		js: 'lib/sea',
		version: '${ JS_LIB_SEA_VERSION }',
		success: function() {
			seajs.use(['lib/jquery', 'util/ajaxPromise'], function($, ajaxPromise) {
				$(function() {
					$('#notice-container').on('click', '.notice-tips', function(e) {
						var el = $(this);
						el.removeClass('notice-tips text-warning')
						.text(el.data('alt'));
						ajaxPromise({
							url: window.basePath + 'user/updateUserReadId',
							type: 'POST',
							data: {
								userkey: el.data('user-key'),
								readid: el.data('read-id')
							}
						});
					});
				});
			});
		}
	});
</script>
</body>
</html>