<%--标签 --%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@ page trimDirectiveWhitespaces="true" isELIgnored="false"%>
<meta http-equiv="X-UA-Compatible" content="edge" />
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<link rel="shortcut icon" href="${ctx}/assets/img/favicon.ico" />
<meta charset="utf-8">
<title>循心后台管理系统</title>
<!-- Stylesheets -->
<%-- <link href="${ctx }/assets/mac/style/bootstrap.css" rel="stylesheet"> --%>
<link href="${ctx }/assets/css/bootstrap.min.css" rel="stylesheet">
<!-- Font awesome icon -->
<link rel="stylesheet" href="${ctx }/assets/mac/style/font-awesome.css">
<!-- jQuery UI -->
<link rel="stylesheet" href="${ctx }/assets/mac/style/jquery-ui.css">
<!-- Calendar -->
<link rel="stylesheet" href="${ctx }/assets/mac/style/fullcalendar.css">
<!-- prettyPhoto -->
<link rel="stylesheet" href="${ctx }/assets/mac/style/prettyPhoto.css">
<!-- Star rating -->
<link rel="stylesheet" href="${ctx }/assets/mac/style/rateit.css">
<!-- Date picker -->
<link rel="stylesheet"
	href="${ctx }/assets/mac/style/bootstrap-datetimepicker.min.css">
<!-- CLEditor -->
<link rel="stylesheet"
	href="${ctx }/assets/mac/style/jquery.cleditor.css">
<!-- Uniform -->
<link rel="stylesheet"
	href="${ctx }/assets/mac/style/uniform.default.css">
<!-- Bootstrap toggle -->
<link rel="stylesheet"
	href="${ctx }/assets/mac/style/bootstrap-switch.css">
<!-- Main stylesheet -->
<link href="${ctx }/assets/mac/style/style.css" rel="stylesheet">
<!-- Widgets stylesheet -->
<link href="${ctx }/assets/mac/style/widgets.css" rel="stylesheet">






<!-- HTML5 Support for IE -->
<!--[if lt IE 9]>
  <script src="js/html5shim.js"></script>
  <![endif]-->

<link
	href="${ctx }/assets/template/css/plugins/sweetalert/sweetalert.css"
	rel="stylesheet">
<script type="text/javascript">
	function del(o) {
		if (o == null) {
			var a = $("input[name='ids']:checked").length;
			if (a == 0) {
				swal({
					type : "warning",
					title : "",
					text : "您至少选择一条记录进行删除!!",
				});
			} else {
				swal({
					title : "您确定要删除这条信息吗",
					text : "删除后将无法恢复，请谨慎操作！",
					type : "warning",
					showCancelButton : true,
					confirmButtonColor : "#DD6B55",
					confirmButtonText : "是的，我要删除！",
					cancelButtonText : "让我再考虑一下…",
					closeOnConfirm : false,
					closeOnCancel : false
				}, function(a) {
					if (a) {
						var delids = $("input[name='ids']:checked");
						//获取所有的id执行删除操作，使用ajax
						var str = "";
						$(delids).each(function() {
							str += this.value + ",";
						});
						if (str != "") {
							var ids = str.substring(0, str.length - 1);
							window.location.href = "delete?ids=" + ids;
						} else {
							window.location.href = document.URL;
						}
						//swal("删除成功！","您已经永久删除了这条信息。","success")
					} else {
						swal("已取消", "您取消了删除操作！", "error")
					}
				})
			}
		} else {
			swal({
				title : "您确定要删除这条信息吗",
				text : "删除后将无法恢复，请谨慎操作！",
				type : "warning",
				showCancelButton : true,
				confirmButtonColor : "#DD6B55",
				confirmButtonText : "是的，我要删除！",
				cancelButtonText : "让我再考虑一下…",
				closeOnConfirm : false,
				closeOnCancel : false
			}, function(a) {
				if (a) {
					if (o != "") {
						window.location.href = "delete?id=" + o;
					} else {
						window.location.href = document.URL;
					}
					//swal("删除成功！","您已经永久删除了这条信息。","success")
				} else {
					swal("已取消", "您取消了删除操作！", "error")
				}
			})

		}
	}
	//ajax判断有没有重复
	function getrepletes(o1) {
		var r1 = $("#" + o1).val();//获取需要判断是否重复的属性
		var r2 = $("#" + o1 + "hid").val();//该值的隐藏域值 判断如果是原始值则不变
		if (r1 != '#') {
			if (r1 != r2) {
				$
						.ajax({
							type : "POST",
							url : "ajaxgetRepletes",
							data : o1 + "=" + r1,
							dataType : "text",
							success : function(msg) {
								if (msg == "true") {//
									document.getElementById("for" + o1).innerHTML = "当前值已存在！！";
									document.getElementById("for" + o1).style.cssText = "float: right; color: red;";
									$("#submit").attr("disabled", true);
								} else {
									$("#submit").attr("disabled", false);
									document.getElementById("for" + o1).innerHTML = " ";
								}
							}
						});
			}
		}
	}

	function toaddPage() {
		window.location.href = "toaddPage?selectid=${selectid}&selectparentid=${selectparentid}&type=1";
	}

	function toeditPage(o) {
		if (o == null) {
			//编辑为表格上方的按钮
			var a = $("input[name='ids']:checked").length;
			if (a == 1) {
				var id = $("input[name='ids']:checked").val();
				window.location.href = "toaddPage?selectid=${selectid}&selectparentid=${selectparentid}&type=2&id="
						+ id;
			} else if (a == 0) {
				swal({
					type : "warning",
					title : "",
					text : "请选择一条记录进行编辑!!",
				});
			} else {
				swal({
					type : "warning",
					title : "",
					text : "请不要同时选择多个进行编辑",
				});
			}
		} else {
			window.location.href = "toaddPage?selectid=${selectid}&selectparentid=${selectparentid}&type=2&id="
					+ o;
		}

	}
</script>