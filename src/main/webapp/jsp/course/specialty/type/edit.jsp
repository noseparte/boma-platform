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
    <script type="text/javascript" charset="utf-8" src="plugins/ueditor/ueditor.config.js"></script>
    <script type="text/javascript" charset="utf-8" src="plugins/ueditor/ueditor.all.js"></script>
    <script type="text/javascript" charset="utf-8" src="plugins/ueditor/lang/zh-cn/zh-cn.js"></script>
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
                            <label class="col-sm-2 control-label">专业等级</label>
                            <div class="col-sm-4">
                                <input type="text" id="eduLevel" class="form-control required" name="eduLevel" value="${pd.eduLevel}"
                                       style="width:500px;" class="form-control" placeholder="请输入教育等级 例如：本科、专科"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">专业编号</label>
                            <div class="col-sm-4">
                                <input type="text" id="code" class="form-control required" name="code" value="${pd.code}"
                                       style="width:500px;" class="form-control" placeholder="请输入编号"/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">排序</label>
                            <div class="col-sm-4">
                                <input type="text" id="sort" class="form-control required" name="sort" value="${pd.sort}"
                                       style="width:500px;" class="form-control" placeholder="请输入序号"/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label">专业类型</label>
                            <div class="col-sm-4">
                                <input type="text" id="type" class="form-control required" name="type" value="${pd.type}"
                                       style="width:500px;" class="form-control" placeholder="请输入专业类型"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label">专业状态</label>
                            <div class="col-sm-8">
                                <select class="form-control" name="state" id="state" style="width:140px;"  value="${pd.state}">
                                    <option value="0">--启用--</option>
                                    <option value="1">--禁用--</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-sm-4 col-sm-offset-2">
                                <button class="btn btn-primary" type="button" onclick="edit();">保存内容</button>
                                <button class="btn btn-white" type="button" onclick="goBack();">取消</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- 全局js -->
    <system:jsFooter/>
    <!-- 自定义js -->
    <script type="text/javascript">
        //表单ID
        var formId = "#AwardManagerForm";
        $(document).ready(function () {
            //初始化下拉菜单
            var arr = [['eduLevel', '教育等级不可为空!'],
                ['code', '未填写编号'],
                ['sort', '未填写序号'],
                ['type', '未填写类型'],
                ['state', '请选择专业状态']];
            if (!checkForm(arr)) {
                return false;
            }

        });

        //批量验证表单非空
        function checkForm(arr) {
            for (var i = 0; i < arr.length; i++) {
                if ($("#" + arr[i][0]).val() == '') {
                    $("#" + arr[i][0]).focus();
                    return false;
                }
            }
            return true;
        }
        //表单提交
        function edit() {
            var id = $('#id').val();   //标题
            var eduLevel = $('#eduLevel').val();   //标题
            var code = $("#code").val();  	//开始日期
            var sort = $("#sort").val();  //开奖日期
            var type = $("#type").val();     //备注
            var state = $("#state").val();     //状态

            if (eduLevel != null && eduLevel != '') {
                $.ajax({
                    type: "POST",
                    url: '<%=basePath%>api/course/specialty_type_edit?tm=' + new Date().getTime(),
                    data: {
                        "id": id,
                        "eduLevel": eduLevel,
                        "code": code,
                        "sort": sort,
                        "type": type,
                        "state": state
                    },
                    dataType: 'json',
                    //beforeSend: validateData,
                    cache: false,
                    success: function (data) {
                        if (data.meta.message == 'ok') {
                            layer.msg("修改成功");
                            goBack();
                        } else {
                            layer.msg(data.meta.message);
                        }
                    }
                });

            } else {
                layer.msg("请填写教育等级");
            }

        }

        /**
         * 判断是否为数字字符串
         */
        function isNotNumChar(numChar) {
            if (!isNaN(numChar)) {
                return true;
            } else {
                return false;
            }
        }

        //返回到列表页面
        function goBack() {
            layer.close(layer.index);
            <%-- this.location.href="<%=basePath%>api/gm/get_story_recommend_list"; --%>
            window.parent.location.reload();
            //this.location.href = "<%=basePath%>api/course/to_specialty_type_list_view";
        }

    </script>
</body>
</html>