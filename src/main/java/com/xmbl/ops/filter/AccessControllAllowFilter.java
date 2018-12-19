package com.xmbl.ops.filter;

import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component("accessControllAllowFilter")
public class AccessControllAllowFilter implements Filter{

	@Override
	public void destroy() {
	}

	/**
	 * TODO:跨域的暂定
	 */
	@Override
	public void doFilter(ServletRequest req, ServletResponse resp,
			FilterChain chain) throws IOException, ServletException {
		HttpServletResponse response = (HttpServletResponse)resp;
		response.addHeader("Access-Control-Allow-Origin","*");
		response.addHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
		chain.doFilter(req, resp);
	}

	@Override
	public void init(FilterConfig filterConfig) {
		//To change body of implemented methods use File | Setting |File Templates.
	}

}
