<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
	
<footer>
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<!-- Copyright info -->
				<p class="copy">
					Copyright &copy; 2017 | <a href="#">BeiJing Network Technology Co. Ltd.</a>
				</p>
			</div>
		</div>
	</div>

</footer>
<!-- JS -->
<script src="${ctx }/assets/mac/js/jquery.js"></script>
<!-- jQuery -->
<script src="${ctx }/assets/mac/js/bootstrap.js"></script>
<!-- Bootstrap -->
<script src="${ctx }/assets/mac/js/jquery-ui-1.9.2.custom.min.js"></script>
<!-- jQuery UI -->
<script src="${ctx }/assets/mac/js/fullcalendar.min.js"></script>
<!-- Full Google Calendar - Calendar -->
<script src="${ctx }/assets/mac/js/jquery.rateit.min.js"></script>
<!-- RateIt - Star rating -->
<script src="${ctx }/assets/mac/js/jquery.prettyPhoto.js"></script>
<!-- prettyPhoto -->

<!-- jQuery Flot -->
<script src="${ctx }/assets/mac/js/excanvas.min.js"></script>
<script src="${ctx }/assets/mac/js/jquery.flot.js"></script>
<script src="${ctx }/assets/mac/js/jquery.flot.resize.js"></script>
<script src="${ctx }/assets/mac/js/jquery.flot.pie.js"></script>
<script src="${ctx }/assets/mac/js/jquery.flot.stack.js"></script>

<!-- jQuery Notification - Noty -->
<script src="${ctx }/assets/mac/js/jquery.noty.js"></script>
<!-- jQuery Notify -->
<script src="${ctx }/assets/mac/js/themes/default.js"></script>
<!-- jQuery Notify -->
<script src="${ctx }/assets/mac/js/layouts/bottom.js"></script>
<!-- jQuery Notify -->
<script src="${ctx }/assets/mac/js/layouts/topRight.js"></script>
<!-- jQuery Notify -->
<script src="${ctx }/assets/mac/js/layouts/top.js"></script>
<!-- jQuery Notify -->
<!-- jQuery Notification ends -->

<script src="${ctx }/assets/mac/js/sparklines.js"></script>
<!-- Sparklines -->
<script src="${ctx }/assets/mac/js/jquery.cleditor.min.js"></script>
<!-- CLEditor -->
<script src="${ctx }/assets/mac/js/bootstrap-datetimepicker.min.js"></script>
<!-- Date picker -->
<script src="${ctx }/assets/mac/js/jquery.uniform.min.js"></script>
<!-- jQuery Uniform -->
<script src="${ctx }/assets/mac/js/bootstrap-switch.min.js"></script>
<!-- Bootstrap Toggle -->
<script src="${ctx }/assets/mac/js/filter.js"></script>
<!-- Filter for support page -->
<script src="${ctx }/assets/mac/js/custom.js"></script>
<!-- Custom codes -->
<script src="${ctx }/assets/mac/js/charts.js"></script>
<!-- Charts & Graphs -->

<!-- Sweet alert -->
<script
	src="${ctx }/assets/template/js/plugins/sweetalert/sweetalert.min.js"></script>


<script type="text/javascript">
	$(function() {
		$("#checkall").click(function() {
			var flag = $("[name=checkall]:checkbox").is(':checked');
			$("[name=ids]:checkbox").each(function() {
				$(this).prop("checked", flag);
			})
		})
	})
</script>

