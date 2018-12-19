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
						<h5>银行管理</h5>
					</div>
					<div class="ibox-content">
                        <div id="toolbar" class="btn-group">
                            <div class="pull-left form-inline form-group">
                                <input type="text" id="bank_name" name="bank_name" class="form-control" placeholder="银行名称" />
                                <button type="button" class="btn btn-default btn-primary" onclick="bstQuery();">查询</button>
                                <button type="button" class="btn btn-default btn-primary" onclick="toAdd();">新增</button>
                                <button type="button" class="btn btn-default btn-primary" onclick="toEdit();">修改</button>
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
            url: 'api/pay/get_bank_list?tm=' + new Date().getTime(),
            toolbar:'#toolbar',
            method:'post', 
            columns: [{
                field: 'id',
                visible: false,
                halign: 'center'
            }, {
                field: 'bank_id',
                title: '银行id',
                align: 'center',
                halign: 'center',
                width: '15%'
            }, {
                field: 'bank_name',
                title: '银行名称',
                align: 'center',
                halign: 'center',
                width: '15%',
            }, {
                field: 'bank_code',
                title: '银行代码',
                align: 'center',
                halign: 'center',
                width: '15%'
                //formatter: formatNAMEFun
            }, {
                field: 'createTime',
                title: '创建时间',
                //visible: false,
                align: 'center',
                halign: 'center',
                width: '15%',
                formatter:formatDataTime
            }, {
                field: 'bank_url',
                title: '银行网关',
                align: 'center',
                halign: 'center',
                width: '25%'
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
            window.location.href = "<%=basePath%>api/pay/to_bank_add";
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
                        url: '<%=basePath%>api/report/report_type_delete?tm=' +  new Date().getTime(),
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
        /**
        * 格式化日期（含时间"00:00:00"）
        */
        function formatterDateTime(date) {
        	var datetime = date.getFullYear()
        	+ "-"// "年"
        	+ ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
        	+ (date.getMonth() + 1))
        	+ "-"// "月"
        	+ (date.getDate() < 10 ? "0" + date.getDate() : date
        	.getDate())
        	+ " "
        	+ (date.getHours() < 10 ? "0" + date.getHours() : date
        	.getHours())
        	+ ":"
        	+ (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
        	.getMinutes())
        	+ ":"
        	+ (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
        	.getSeconds());
        	return datetime;
        }
        //时间.
        function formatDataTime(value, row, index){
        	var date = new Date(row.createTime);
            var d = formatterDateTime(date);  
            /* var dformat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-')   
                    + '  ' + [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':');   */
            return d;  
        }
    </script>
    
</body>
</html>

