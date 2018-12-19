<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<html>
<head>
    <base href="<%=basePath%>">
    <title>fileUpload</title>
    <script src="<%=basePath%>scripts/jquery-1.11.1.js"></script>
    <script src="<%=basePath%>scripts/ajaxfileupload.js"></script>
</head>
<body>
<h3>上传文件</h3>
<form name="form1" action="/platform/file/FileUpload/fileUpload_stream" method="post" enctype="multipart/form-data">
    <input type="file" name="file_upload">
    <input type="submit" value="upload"/>
</form>
<hr>
</body>
</html>