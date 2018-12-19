package com.xmbl.ops.filter;

import com.xmbl.ops.constant.SessionConstant;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;

import javax.servlet.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class LoginFilter extends HttpServlet implements Filter {

	private static final long serialVersionUID = 4165932699188503783L;

    @Override
    public void init(FilterConfig filterConfig) {
//        ServletContext servletContext = filterConfig.getServletContext();  
//        WebApplicationContext wac = null;  
//        wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);  
//        this.userInfoService = (UserInfoService) wac.getBean("userInfoService");  
    }

    @Override
    public void doFilter(ServletRequest arg0, ServletResponse arg1, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) arg0;
        HttpServletResponse response = (HttpServletResponse) arg1;
        Subject currentUser = SecurityUtils.getSubject();
        Session session = currentUser.getSession();
        String userName = (String) session.getAttribute(SessionConstant.USER_NAME);// 登录人
        String groupName = (String) session.getAttribute(SessionConstant.GROUP_NAME);
        String url = request.getRequestURI();
        if(StringUtils.isEmpty(userName) || StringUtils.isEmpty(groupName)) {
            if(url.indexOf("login") >= 0
            || url.endsWith(".js") || url.endsWith(".jpg") || url.endsWith(".gif")
            || url.endsWith(".css") || url.endsWith(".png")) {
                filterChain.doFilter(request, response);
                return ;
            } else if(url.indexOf("platform/api/server/gmservers") >= 0){
            	filterChain.doFilter(request, response);
            	return;
//            } else if(url.indexOf("platform/api") >= 0){
//            	filterChain.doFilter(request, response);
//            	return;
            } else if(url.indexOf("platform/api/file") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("platform/file/FileUpload") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("platform/tool/lastestnotice") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("platform/login/securityCode") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("platform/sx/") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("platform/api/user") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("platform/pay/api") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("**/") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("**/**") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("/") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("platform/app/version/getAppVersion") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("platform/api/award/award_detail") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else if(url.indexOf("platform/api/gameservers") >= 0){
            	filterChain.doFilter(request, response);
            	return;
            }else {
                response.sendRedirect(request.getContextPath() + "/login.jsp");
                return ;
            }
        }
        filterChain.doFilter(arg0, arg1);
    }
    
}
