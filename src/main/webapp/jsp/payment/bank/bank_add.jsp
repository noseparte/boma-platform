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
                        <h5>银行管理 <small>新增</small></h5>
                        <div class="ibox-tools">
                            
                        </div>
                    </div>
                    <div class="ibox-content">
                        <form id="ReportTypeForm" method="post" class="form-horizontal">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">银行ID</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" name="bank_id" id="bank_id">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">银行名称</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" name="bank_name" id="bank_name" >
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">银行代码</label>
                                <div class="col-sm-6">
                                    <input type="text" class="form-control" name="bank_code" id="bank_code">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-2 control-label">银行网关</label>
                                <div class="col-sm-8">
                                    <input type="text" class="form-control" name="bank_url" id="bank_url">
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-sm-4 col-sm-offset-2">
                                    <button class="btn btn-primary" type="button" onclick="save();">保存内容</button>
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
           ['bank_name','银行名称不可为空!'],
           ['bank_code','银行代码不可为空!'],
           ['bank_url','银行网关不可为空!']];
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
		var bank_id = $('#bank_id').val();   		//银行ID
        var bank_name = $("#bank_name").val();  	//银行名称
        var bank_code = $("#bank_code").val();     //银行代码
        var bank_url = $("#bank_url").val();     //银行网关
        
        if(bank_name != null && bank_name != ''){
            $.ajax({
                type: "POST",
                url: '<%=basePath%>api/pay/add_bank?tm=' +  new Date().getTime(),
                data: {
                    "bank_id" : bank_id,
                    "bank_name" : bank_name,
                    "bank_code" : bank_code,
                    "bank_url" : bank_url
                },
                dataType: 'json',
                //beforeSend: validateData,
                cache: false,
                success: function(data) {
                    if (data.meta.message == 'ok') {
                        layer.msg("添加成功");
                        goBack();
                    } else {
                        layer.msg(data.meta.message);
                    }
                }
            });
        } else{
            layer.msg("请填写要发布的类型描述");
        }
	}
	
	function goBack(){
		this.location.href="<%=basePath%>api/pay/to_bank_management";
	}
	
	
</script>
	</body>
</html>

