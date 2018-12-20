<%--
  Created by IntelliJ IDEA.
  User: 1
  Date: 2018/11/15
  Time: 3:21
  To change this template use File | Settings | File Templates.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/include/taglib.jsp" %>
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

                <div class="ibox-content">
                    <form id="AcademyForm" name="AcademyForm" class="form-horizontal" method="post">
                        <div class="form-group">
                            <input type="hidden" class="form-control" name="id" id="id" value="${pd.id}" />
                            <label class="col-sm-2 control-label">课程名称</label>
                            <div class="col-sm-4">
                                <input type="text" id="courseName" class="form-control required" name="courseName" value="${pd.courseName}"
                                       style="width:500px;" class="form-control" placeholder="请输入要上传的标题 例如：排名奖励"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">课程类型</label>
                            <div class="col-sm-4">
                                <select class="form-control"  name="courseType"  id="courseType" style="width:140px;" value="${pd.courseType}" >
                                    <option value="1">--精品--</option>
                                    <option value="2">--VIP--</option>
                                </select>
                            </div>
                        </div>


                        <div class="form-group">
                            <label class="col-sm-2 control-label">是否禁用</label>
                                <div class="col-sm-8">
                                    <select class="form-control"  name="status"  id="status" style="width:140px;"  value="${pd.status}">
                                        <option value="0">--启用--</option>
                                        <option value="1">--禁用--</option>
                                    </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-sm-4 col-sm-offset-2">
                                <button class="btn btn-primary" type="button" onclick="saveOrEdit();">保存内容</button>
                                <button class="btn btn-white" type="button" onclick="goBack();">取消</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

    <!-- 全局js -->
    <system:jsFooter/>
    <!-- 自定义js -->
    <script
    ; type="text/javascript">;
    //表单ID
    var formId = "#AwardManagerForm";
    $(document).ready(function(){
    //初始化下拉菜单
    //$("#sectionName").createOption();
    //调用方式
    var arr=[
        ['courseName','课程名称不能为空'],
        ['courseType','未选择课程类型']
    ];
    if(!checkForm(arr)){
    return false;
    }

    });

    //批量验证表单非空
    function checkForm(arr){
    for(var i=0;i
    <arr.length
    ;i++){
    if($("#"+arr[i][0]).val()==''){
    $("#"+arr[i][0]).focus();
    return false;
    }
    }
    return true;
    }
    //表单提交
    function saveOrEdit(){
    var id = $('#id').val(); //标题
    var courseName = $('#courseName').val(); //标题
    var courseType = $("#courseType").val(); //开始日期
    var status = $("#status").val(); //开始日期

    if(courseName != null && courseName != ''){
    $.ajax({
    type: "POST",
    url: '<%=basePath%>api/course/edit_course_type?tm=' + new Date().getTime(),
    data: {
        "id" : id,
        "courseName" : courseName,
        "courseType" : courseType,
        "status" : status
    },
    dataType: 'json',
    cache: false,
    success: function(data) {
    if (data.meta.message == 'ok') {
    layer.msg("发布成功");
    goBack();
    } else {
    layer.msg(data.meta.message);
    }
    }
    });

    } else{
    layer.msg("请填写要发布的问题名称");
    }

    }

    /**
    * 时间比较{开奖时间不得小于当前时间}
    */
    function compareNowTimeGTLotteryDate(endTime) {
    if(endTime!= null){
    var nowDate = new Date();
    var now=new Date(formatterDateTime(nowDate).replace("-", "/").replace("-", "/"));
    var lottery=new Date(endTime.replace("-", "/").replace("-", "/"));
    if(lottery
    <now
    ){
    return false;
    }
    return true;
    }
    }
    /**
    * 时间比较{结束时间大于开始时间}
    */
    function compareDateEndTimeGTStartTime(startTime, endTime) {
    if(startTime!=null && endTime!= null){
    var start=new Date(startTime.replace("-", "/").replace("-", "/"));
    var end=new Date(endTime.replace("-", "/").replace("-", "/"));
    if(end
    <start
    ){
    return false;
    }
    return true;
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

    /**
    * 判断是否为数字字符串
    */
    function isNotNumChar(numChar) {
    if(!isNaN(numChar)){
    return true;
    }else{
    return false;
    }
    }

    //返回到列表页面
    function goBack(){
        //this.location.href="<%=basePath%>api/award/to_award_list";
        layer.close(layer.index);
        window.parent.location.reload();
    }

    </script>

    <script type = "text/javascript" >
        //初始化Uedit
        function initUedit() {
            //
            <!-- 实例化编辑器 -->
            var editor = UE.getEditor('container', {
                //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
                toolbars: [[
                    'fullscreen', 'source', '|', 'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                    'directionalityltr', 'directionalityrtl', 'indent', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                    'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                    'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
                    'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
                    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                    'print', 'preview', 'searchreplace', 'drafts', 'help'
                ]],
                //focus时自动清空初始化时的内容
                autoClearinitialContent: true,
                //关闭字数统计
                wordCount: false,
                //关闭elementPath
                elementPathEnabled: false,
                zIndex: 9010,
                //initialFramePosition : center,
                initialFrameWidth: "80%",
                //默认的编辑区域高度
                initialFrameHeight: 300
                //更多其他参数，请参考ueditor.config.js中的配置项
            });


        }

    </script>


</body>
</html>