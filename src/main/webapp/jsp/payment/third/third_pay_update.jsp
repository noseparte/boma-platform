<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF//include/taglib.jsp"%>
<!DOCTYPE html>
<html lang="en">
	<head>
		 <system:header/>
	<!-- jsp文件头和头部 -->
	</head> 
<body class="gray-bg">
	<div class="wrapper wrapper-content animated fadeInRight">
	   <div class="row">
            <div class="col-sm-12">
                <div class="ibox float-e-margins">
                    <div class="ibox-title">
                        <h5>第三方支付 <small>修改</small></h5>
                        <div class="ibox-tools">
                            
                        </div>
                    </div>
                    <div class="ibox-content">
                        <form id="ReportTypeForm" method="post" class="form-horizontal">
                            <input type="hidden" class="form-control" name="thirdId" id="thirdId" value="${pd.thirdId}" />
                            <div class="form-group">
                                <label class="col-sm-2 control-label">银行ID</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" name="bank_id" id="bank_id" value="${pd.bank_id}" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">第三方支付名称</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" name="third_name" id="third_name" value="${pd.third_name}" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">第三方支付类型</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" name="third_type" id="third_type" value="${pd.third_type}" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">商户号</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" name="mer_no" id="mer_no" value="${pd.mer_no}" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">商户秘钥(公|私)</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" name="mer_key" id="mer_key" value="${pd.mer_key}" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">异步通知地址</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" name="return_url" id="return_url" value="${pd.return_url}" />
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-sm-4 col-sm-offset-2">
                                    <button class="btn btn-primary" type="button" onclick="save();">保存修改</button>
                                    <button class="btn btn-white" type="button" onclick="goBack();">取消</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>	
	</div>	
	<div id="myModal" class="modal inmodal fade" tabindex="-1" role="dialog"  aria-hidden="true"></div>
		<!-- 全局js -->
    <system:jsFooter/>
    <script src="hplus/js/plugins/jeditable/jquery.jeditable.js"></script>
	
    <!-- 自定义js -->
    <script src="hplus/js/content.min.js"></script>
    
    <script type="text/javascript">
  //表单ID
    var formId = "#ReportTypeForm";
    $(document).ready(function(){
        //调用方式
        var arr=[['bank_id','银行ID不可为空!'],
           ['third_name','第三方支付名称不可为空!'],
           ['third_type','第三方支付类型不可为空!'],
           ['mer_no','商户号不可为空!'],
           ['mer_key','商户秘钥(公|私)不可为空!'],
           ['return_url','异步通知地址不可为空!']];
        if(!checkForm(arr)){
           return false;
        }
        
    });
    
    //批量验证表单非空
    function checkForm(arr){
      for(var i=0;i<arr.length;i++){
          if($("#"+arr[i][0]).val()==''){
            $("#"+arr[i][0]).focus();
            return false;
          }
      }
      return true;
    }
  //保存
	function save(){
		var thirdId = $('#thirdId').val();   		//第三方ID 
		var bank_id = $('#bank_id').val();   		//银行ID
        var third_name = $("#third_name").val();  	//第三方支付名称
        var third_type = $("#third_type").val();    //第三方支付类型
        var mer_no = $("#mer_no").val();     		//商户号
        var mer_key = $("#mer_key").val();     		//商户秘钥(公|私)
        var return_url = $("#return_url").val();    //异步通知地址
        
        if(third_name != null && third_name != ''){
            $.ajax({
                type: "POST",
                url: '<%=basePath%>api/pay/edit_third_pay?tm=' +  new Date().getTime(),
                data: {
                    "thirdId" : thirdId,
                    "bank_id" : bank_id,
                    "third_name" : third_name,
                    "third_type" : third_type,
                    "mer_no" : mer_no,
                    "mer_key" : mer_key,
                    "return_url" : return_url
                },
                dataType: 'json',
                //beforeSend: validateData,
                cache: false,
                success: function(data) {
                    if (data.meta.message == 'ok') {
                        layer.msg("修改成功");
                        goBack();
                    } else {
                        layer.msg(data.meta.message);
                    }
                }
            });
        } else{
            layer.msg("请填写要发布的第三方支付名称");
        }
	}
	
	function goBack(){
		this.location.href="<%=basePath%>api/pay/to_third_pay_management";
	}
	
	
</script>
	</body>
</html>

