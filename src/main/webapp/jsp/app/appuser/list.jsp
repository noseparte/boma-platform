<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/include/taglib.jsp"%>
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
						<h5>当前位置：app游戏用户列表</h5>
					</div>
					<div class="ibox-content">
                        <div id="toolbar" class="btn-group">
                            <div class="pull-left form-inline form-group">
                                <input type="text" id="userKey" name="userkey" class="form-control" placeholder="用户账号" />
                                <button type="button" class="btn btn-default btn-primary" onclick="bstQuery();">查询</button>
                                <!-- <button type="button" class="btn btn-default btn-primary" onclick="toAdd();">新增</button>
                                <button type="button" class="btn btn-default btn-primary" onclick="toEdit();">修改</button> -->
                                <button type="button" class="btn btn-default btn-danger" onclick="toDel();">删除</button>
                            </div>
                        </div>
                        <table id="queryTable" data-mobile-responsive="true"></table>
                    </div>
				</div>
			</div>
		</div>
	</div>
	<div id="myModal" class="modal inmodal fade" tabindex="-1" role="dialog"  aria-hidden="true"></div>
    <!-- 全局js -->
    <system:jsFooter/>
    <script type="text/javascript">
        //表格ID
        var tableId = "#queryTable";
        //表格请求及数据
        var tableColumns = {
            url: 'app/user/user_list?tm=' + new Date().getTime(),
            toolbar:'#toolbar',
            method:'post', 
            columns: [{
                field: 'id',
                visible: false,
                halign: 'center'
            }, {
                field: 'createid',
                title: '平台账号',
                align: 'center',
                halign: 'center',
                width: '30%'
            }, {
                field: 'userkey',
                title: '游戏账号',
                align: 'center',
                halign: 'center',
                width: '15%',
                //formatter: formatNAMEFun
            }, {
                field: 'type',
                title: '账号类型',
                //visible: false,
                align: 'center',
                halign: 'center',
                width: '15%',
                formatter:formatUserType
            }, {
                field: 'serverid',
                title: '服务器id',
                align: 'center',
                halign: 'center',
                width: '10%'
            }, {
                field: 'logincnt',
                title: '登录次数',
                //visible: false,
                align: 'center',
                halign: 'center',
                width: '10%'
            }, {
                field: 'status',
                title: '实时状态',
                align: 'center',
                halign: 'center',
                width: '5%',
                formatter: formatShowEnable
            }, {
                field: 'status',
                title: '是否禁用',
                //visible: false,
                align: 'center',
                halign: 'center',
                width: '10%',
                formatter:formatStatus
            }]
        };
        $(document).ready(function (){
            var msg = "${msg}";
            console.info(msg);
            if(msg != null && msg != ""){
                if(msg == '200'){
                    layer.msg("成功编辑代理商信息", {time:3000});
                } else if(msg == 'successEdit'){
                    layer.msg("成功编辑代理商信息");
                }else{
                    layer.msg("代理商信息编辑失败！");
                }
            }
            //初始化下拉菜单
            //$("#sectionName").createOption();
            //初始化及查询生成表格内容
            table = $(tableId).bootstrapTable(tableColumns);
        });
        //查询刷新表格
        function searchRefreshTable(){
            //销毁表格
            $(tableId).bootstrapTable('destroy');
            $(tableId).bootstrapTable(tableColumns);
        }
        //导出Excel
        function toExport(){
            $(tableId).bootstrapTable('exportTable', {
                type : 'excel'
            });
        }
        //跳转到新增页面
        function toAdd(){
            window.location.href = "<%=basePath%>api/report/report_type_add";
        }
        //跳转到编辑页面
        function toEdit(){
            var ids = getBstCheckedId('id');
            if(!(ids.length == 1)){
                layer.msg('请只选中一条信息再进行编辑。');
                return false;
            }
            window.location.href = "<%=basePath%>api/report/report_type_update?id=" + ids[0];
        }
        //批量删除数据
        function toDel(){
            var ids = getBstCheckedId('id');
            if((ids.length < 1)){
                layer.msg('请选中信息再进行删除。');
                return false;
            }
            var idsStr = ids.toString();
            layer.confirm('确定删除已选信息吗？', {
                btn: ['确认','取消'],
                shade: false,
                yes: function(index, layero){
                    $.ajax({
                        type: "POST",
                        url: '<%=basePath%>app/user/del?tm=' +  new Date().getTime(),
                        data: {
                            IDS: idsStr
                        },
                        dataType: 'json',
                        //beforeSend: validateData,
                        cache: false,
                        success: function(data) {
                            if (data.meta.message == 'ok') {
                                layer.msg('删除信息成功');
                                bstQuery();
                            } else {
                                layer.msg('删除信息失败');
                            }
                        }
                    });
                }
            });
        }
        //浏览
        function toView(uid){
            if(uid != null && uid != ""){
                layer.full(
                    layer.open({
                        type: 2,
                        title: '信息浏览',//窗体标题
                        area: ['600px', '600px'],//整个窗体宽、高，单位：像素px
                        fix: false,//窗体位置不固定
                        maxmin: true,//最大、小化是否显示
                        scrollbar: true,//整体页面滚动条是否显示 
                        content: ['/api/user/user_view?id=' + uid],//URL地址
                        closeBtn: 1,//显示关闭按钮
                        btn: ['关闭']
                    })
                );
            }else{
                layer.msg("系统未获取到数据主键，请重新选择数据！");
            }
        }
        
        //操作
        function formatNAMEFun(value, row, index){
            var format_v = "<button type=\"button\" class=\"btn btn-link\" onclick=\"toView('"+row.uid+"');\">" + row.name + "</button>";
            return format_v;
        }
        //时间
        function formatDataTime(value, row, index){
            var d = new Date(row.createTime);  
            var dformat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-')   
                    + '  ' + [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':');  
            return dformat;  
        }
        //用户等级  /**  
        function formatUserType(value, row, index){
            var d = '';  
            if(row.type == 'P'){ d = '手机'; }
            if(row.type == 'E'){ d = '邮箱'; }
            if(row.type == 'Y'){ d = '游客'; }
            return d;  
        }
        
      	//实时状态
        function formatShowEnable(value, row, index){
        	var format_v = "";
            if(row.status == 1){
            	format_v += "<div class=\"btn \">" + "正常" + "</div>";
            }else{
        		format_v += "<div class=\"bt \">" + "冻结" + "</div>";
            }
            return format_v;  
        }
      	//禁用  or 启用
        function formatStatus(value, row, index){
        	var format_v = "";
            if(row.status == 1){
            	format_v += "<button type=\"button\" class=\"btn btn-danger\" onclick=\"forbidden('"+row.id+"');\">" + "冻结" + "</button>";
            }else{
        		format_v += "<button type=\"button\" class=\"btn btn-info\" onclick=\"enabled('"+row.id+"');\">" + "激活" + "</button>";
            }
            return format_v;  
        }
     	// 禁用
		function forbidden(id) {
			var status = '2';
			console.log("禁用");
			$.post("/platform/app/user/yesOrNo",{
				id:id,
				status:status
			}).then(function(data) {
				window.location.reload();
			});
		}
		// 启用
		function enabled(id) {
			var status = '1';
			$.post("/platform/app/user/yesOrNo",{
				id:id,
				status:status
			}).then(function(data) {
				window.location.reload();
			});
		}
    </script>
    
</body>
</html>

