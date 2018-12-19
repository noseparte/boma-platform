<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<nav class="navbar user-info-navbar" role="navigation">
    <!-- Left links for user info navbar -->
    <ul class="user-info-menu left-links list-inline list-unstyled">
        <li class="hidden-sm hidden-xs">
            <a href="#" data-toggle="sidebar">
                <i class="fa-bars"></i>
            </a>
        </li>
    </ul>
    <!-- Right links for user info navbar -->
    <ul class="user-info-menu right-links list-inline list-unstyled">
        <li class="dropdown user-profile">
            <a href="#" data-toggle="dropdown">
                <img src="<%=basePath %>assets/images/user-4.png" alt="user-image" class="img-circle img-inline userpic-32" width="28"/>
							<span>
								<i class="fa-angle-down"></i>
							</span>
            </a>
            <ul class="dropdown-menu user-profile-menu list-unstyled">
                <li>
                    <a href="#">
                        <i class="fa-user"></i>
                        个人中心
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="fa-wrench"></i>
                        设置
                    </a>
                </li>
                <li class="last">
                    <a href="<%=basePath %>login/userLogout">
                        <i class="fa-lock"></i>
                        退出
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</nav>