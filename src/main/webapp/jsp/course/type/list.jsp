<%--
  Created by IntelliJ IDEA.
  User: 1
  Date: 2018/11/14
  Time: 16:44
  To change this template use File | Settings | File Templates.
--%>
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
                    <h5>课程类型管理</h5>
                </div>
                <div class="ibox-content">
                    <div id="toolbar" class="btn-group">
                        <div class="pull-left form-inline form-group">
                            <label>课程类型</label>
                            <input type="text" id="type" name="type" class="form-control" placeholder="课程类型" />
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
        url: 'api/course/get_course_type_list?&tm=' + new Date().getTime(),
        toolbar:'#toolbar',
        method:'post',
        columns: [{
            field: '_id',
            visible: false,
            halign: 'center'
        }, {
            field: 'courseName',
            title: '课程名称',
            align: 'center',
            halign: 'center',
            width: '20%'
        }, {
            field: 'courseType',
            title: '课程类型',
            align: 'center',
            halign: 'center',
            width: '20%'
        }, {
            field: 'createTime',
            title: '创建时间',
            align: 'center',
            halign: 'center',
            width: '20%',
            formatter: formatterDate
        }, {
            field: 'status',
            title: '状态',
            align: 'center',
            halign: 'center',
            width: '20%',
            formatter: formatterStatus
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
        $("#month").createOption();
        //初始化及查询生成表格内容
        table = $(tableId).bootstrapTable(tableColumns);
    });
    //查询刷新表格
    function searchRefreshTable(){
        //销毁表格
        $(tableId).bootstrapTable('destroy');
        $(tableId).bootstrapTable(tableColumns);
    }
    //跳转到新增页面
    function toAdd(){
        window.location.href = "<%=basePath%>api/course/to_course_type_list_add";
    }
    // 跳转到编辑页面
    function toEdit(){
        var ids = getBstCheckedId('id');
        if(!(ids.length == 1)){
            layer.msg('请只选中一条信息再进行编辑。');
            return false;
        }
        var id = ids[0];
        if(id != null && id != ""){
            layer.open({
                type: 2,
                title: '修改关卡秀信息',//窗体标题
                area: ['600px', '500px'],//整个窗体宽、高，单位：像素px
                fix: false,//窗体位置不固定
                maxmin: false,//最大、小化是否显示
                scrollbar: false,//整体页面滚动条是否显示
                content: ['<%=basePath%>api/course/to_course_type_list_edit?id=' + id]
            })
        }else{
            layer.msg("系统未获取到数据主键，请重新选择数据！");
        }
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
                    url: '<%=basePath%>api/course/delete_course_type?tm=' +  new Date().getTime(),
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
    function toView(id){
        if(id != null && id != ""){
            layer.full(
                layer.open({
                    type: 2,
                    title: '闯关奖励详情',//窗体标题
                    area: ['600px', '600px'],//整个窗体宽、高，单位：像素px
                    fix: false,//窗体位置不固定
                    maxmin: true,//最大、小化是否显示
                    scrollbar: true,//整体页面滚动条是否显示
                    content: ['<%=basePath%>api/award/adventure_award_view?id=' + id],//URL地址
                    //closeBtn: 1,//显示关闭按钮
                    //btn: ['关闭']
                })
            );
        }else{
            layer.msg("系统未获取到数据主键，请重新选择数据！");
        }
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
    //时间
    function formatterDate(value, row, index){
        var d = new Date(row.createTime);
        var dformat = formatterDateTime(d);
        return dformat;
    }
    // 是否生效格式化
    function formatterStatus(value, row, index) {
        if (value == 0) {
            return "<button class=\"btn btn-info\">已生效</button>";
        }
        return "<button class=\"btn btn-danger\">未生效</button>";
    }

    //操作
    function formatNAMEFun(value, row, index){
        var format_v = "<button type=\"button\" class=\"btn btn-link\" onclick=\"toView('"+row.id+"');\">" + row.tittle + "</button>";
        return format_v;
    }
    // 格式化权限列表   评论 创建比赛 上传关卡 上传关卡集 创建挑战 推荐功能)支持模糊查询
    function formatRewardList(value, row, index){
        var format_v = "";
        var items = row.rewardList;
        if(items != null && items != ''){
            for (idx in items){
                var param = JSON.stringify(items[idx]);
                format_v += param;
            }
        }
        return format_v;
    }
    //月份
    function formatMonth(value, row, index){
        var format_v = "<button type=\"button\" class=\"btn btn-success\">" + row.month + "</button>";
        return format_v;
    }
</script>

</body>
</html>