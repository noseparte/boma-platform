<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>分页页面</title>
<style type="text/css">
/*翻页*/
.jump{
    margin:0px 0;
    float: right;
    }    
.jump_text{
    float:right;
    margin:0 0 0 5px;
    line-height:33px;
    }
.jump_text input{
    width:40px;
    border:rgba(212,212,212,1.00) 1px solid;
    height:30px;
    line-height:33px;
    background:#fff;}
</style>
<script type="text/javascript">
function goPage(){
    var jumpPage = document.getElementById("jumpPage").value;
    var totalPage = '${pagin.totalPage}';
    if(isNaN(jumpPage)){
        alert("请输入数字!");

    }else if(jumpPage.length==0){
        alert("请输入页码!");
    }else if(jumpPage<=0 || Number(jumpPage)>Number(totalPage)){
        alert("非法的页码【"+jumpPage+"】!");
        document.getElementById("jumpPage").value="";

    }else{
    	//var pageUrl = '${pagin.pageUrl}';
    	//window.location.href= pageUrl+'?page='+jumpPage+'&size=${pagin.pageSize}&name=${name}';
    	var url = '<%=basePath %>/app/storyshop/list.html';
    	$.get(url,{
    		name:'${name}',
    		size:'${pagin.pageSize}',
    		page:jumpPage
    	}).then(function(data) {
    		//console.info(data);
    		$('.storyshop-list').html(data);
    	});
    }
}

function pageTo(pageNumber){
    if(pageNumber==-1){
        var curpage='${pageNumber}';
        jumpPage=Number(curpage)-1;
    }else if(pageNumber==-2){
        var curpage='${pageNumber}';
        jumpPage=Number(curpage)+1;
    }else{
        jumpPage=Number(pageNumber);
    }
    var pageUrl = '${pagin.pageUrl}';
    // console.info(pageUrl);
	//window.location.href= pageUrl+'?page='+pageNumber+'&size=${pagin.pageSize}&name=${name}';
	var url = '<%=basePath %>/app/storyshop/list.html';
	$.get(url,{
		name:'${name}',
		size:'${pagin.pageSize}',
		page:parseInt(pageNumber)
	}).then(function(data) {
		//console.info(data);
		$('.storyshop-list').html(data);
	});
}
</script>
</head>
<body>
<nav>
     <ul class="pagination">
                <!-- 上一页  -->
                <!-- 当当前页码为1时，隐藏上一页按钮  -->
                <li <c:if test="${pagin.pageNo==1 }">class="disabled"</c:if>>
                	<!-- 当当前页码不等于1时，跳转到上一页  -->
                    <a <c:if test="${pagin.pageNo==1 }">href="javaScript:void(0)"</c:if>
                    <c:if test="${pagin.pageNo!=1 }">href="javaScript:pageTo('${pagin.pageNo-1 }')"</c:if>>上一页</a>
                </li>
                <!-- 页码  -->
                <!-- 当总页数小于等于7时，显示页码1...7页 -->
                <c:if test="${pagin.totalPage<=7}">
                    <c:forEach begin="1" end="${pagin.totalPage}" var="i">
                        <li <c:if test="${pagin.pageNo==i }">class="active"</c:if>>
                            <a href="javaScript:pageTo('${i}')">${i}</a>
                        </li>
                    </c:forEach>
                </c:if>
                <!-- 当总页数大于7时 -->
                <c:if test="${pagin.totalPage>7}">
                    <!-- 当前页数小于等于4时，显示1到5...最后一页 -->
                    <c:if test="${pagin.pageNo<=4}">
                        <c:forEach begin="1" end="5" var="i">
                            <li <c:if test="${pagin.pageNo==i }">class="active"</c:if>>
                                <a href="javaScript:pageTo('${i}')">${i}</a>
                            </li>
                        </c:forEach>
                        <li><a href="#">...</a></li>
                        <li <c:if test="${pagin.pageNo==pagin.totalPage }">class="active"</c:if>>
                            <a href="javaScript:pageTo('${pagin.totalPage}')">${pagin.totalPage}</a>
                        </li>
                    </c:if>
                    <!-- 当前页数大于4时，如果当前页小于总页码书-3，则显示1...n-1,n,n+1...最后一页 -->
                    <c:if test="${pagin.pageNo>4}">
                        <c:if test="${pagin.pageNo<pagin.totalPage-3}">
                            <li><a href="javaScript:pageTo('${1}')">${1}</a></li>
                            <li><a href="#">...</a></li>
                            <c:forEach begin="${pagin.pageNo-1 }" end="${pagin.pageNo+1 }"
                                var="i">
                                <li <c:if test="${pagin.pageNo==i }">class="active"</c:if>>
                                    <a href="javaScript:pageTo('${i}')">${i}</a>
                                </li>
                            </c:forEach>
                            <li><a href="#">...</a></li>
                            <li <c:if test="${pagin.pageNo==pagin.totalPage }">class="active"</c:if>>
                                <a href="javaScript:pageTo('${pagin.totalPage}')">${pagin.totalPage}</a>
                            </li>
                        </c:if>
                    </c:if>
                    <!-- 当前页数大于4时，如果当前页大于总页码书-4，则显示1...最后一页-3，最后一页-2，最后一页-1，最后一页 -->
                    <c:if test="${pagin.pageNo>pagin.totalPage-4}">
                        <li><a href="javaScript:pageTo('${1}')">${1}</a></li>
                        <li><a href="#">...</a></li>
                        <c:forEach begin="${pagin.totalPage-3 }" end="${pagin.totalPage }" var="i">
                            <li <c:if test="${pagin.pageNo==i }">class="active"</c:if>>
                                <a href="javaScript:pageTo('${i}')">${i}</a>
                            </li>
                        </c:forEach>
                    </c:if>
                </c:if>
                <!-- 下一页  -->
                <!-- 当当前页码为最后一页或者最后一页为0时，隐藏下一页按钮  当当前页码不等于总页码时，跳转下一页  -->
                <li <c:if test="${pagin.pageNo==pagin.totalPage || pagin.totalPage==0}">class="disabled"</c:if>>
                    <a <c:if test="${pagin.pageNo==pagin.totalPage || pagin.totalPage==0 }">href="javaScript:void(0)"</c:if>
                    <c:if test="${pagin.pageNo!=pagin.totalPage }">href="javaScript:pageTo('${pagin.pageNo+1 }')"</c:if>>下一页</a>
                </li>
            </ul>
            
            <!-- 跳转页 -->
            <div class="jump">
                <span class="jump_text">共有${pagin.totalPage }页,${pagin.totalCount }条记录,跳到
                    <input type="text" name="jumpPage"  id="jumpPage" onkeyup="this.value=this.value.replace(/[^0-9-]+/,'');">页
                    <button type="button" class="btn btn-primary btn-xs" onclick="goPage()">GO</button>
                </span>
            </div>
</nav>
<div style="clear: both;"></div>
</body>
</html>