package com.xmbl.ops.controller.organization;

import com.xmbl.ops.constant.SessionConstant;
import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.dto.ResponseResult;
import com.xmbl.ops.enumeration.EnumPersonStatus;
import com.xmbl.ops.enumeration.EnumResCode;
import com.xmbl.ops.model.organization.UserInfo;
import com.xmbl.ops.model.organization.UserLog;
import com.xmbl.ops.service.organization.ResourcesRoleService;
import com.xmbl.ops.service.organization.ResourcesService;
import com.xmbl.ops.service.organization.UserInfoService;
import com.xmbl.ops.service.organization.UserLogService;
import com.xmbl.ops.util.Md5PasswordEncoder;
import com.xmbl.ops.util.VerifyCodeUtil;
import com.xmbl.ops.web.api.bean.Response;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.UnknownSessionException;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.*;

@Controller
@RequestMapping(value = "/login")
public class LoginController extends AbstractController {
	private static Logger logger = LoggerFactory.getLogger("session_expired_log");
	@Autowired
	protected UserInfoService userInfoService;
	
	@Autowired
	protected ResourcesService resourcesService;
	
	@Autowired
	protected ResourcesRoleService resourcesRoleService;
	
	@Autowired
	protected UserLogService userLogService;
	
	
	@RequestMapping(value = "/userLogin")
	public@ResponseBody
	ResponseResult userLogin(HttpServletRequest request, HttpServletResponse response) {
	  	String userKey = request.getParameter("loginId");
	  	String password = request.getParameter("password");
	    String veryCode = request.getParameter("securityCode");
	  	try {
	  	  	// 验证是否登录成功
	  	  	String securityCode = (String) request.getSession().getAttribute("securityCode");
	  	  	if (null == veryCode ||
	  	  		null == securityCode ||
	  	  	    !securityCode.equalsIgnoreCase(veryCode)) {
	  	  		return errorJson(EnumResCode.SERVER_ERROR.value(), "验证码错误！");
	  	    }
	  		if (StringUtils.isEmpty(userKey)) {
	  			return errorJson(EnumResCode.SERVER_ERROR.value(), "用户名不能为空");
	  		}
	  		if (StringUtils.isEmpty(password)) {
	  			return errorJson(EnumResCode.SERVER_ERROR.value(), "密码不能为空");
	  		}
	  		password = Md5PasswordEncoder.encode(password);
	  		
	  		UsernamePasswordToken token = new UsernamePasswordToken(userKey, password);
	  		// token.setRememberMe(true);
	  		// 获取当前的Subject
	  		Subject subject = SecurityUtils.getSubject();
	  		Session session = subject.getSession();
	  		try {
	  			subject.login(token);
	  		} catch (UnknownAccountException uae) {
	  			return errorJson(EnumResCode.SERVER_ERROR.value(), "用户名或密码不正确");
	  		} catch (IncorrectCredentialsException ice) {
	  			return errorJson(EnumResCode.SERVER_ERROR.value(), "用户名或密码不正确");
	  		} catch (LockedAccountException lae) {
	  			return errorJson(EnumResCode.SERVER_ERROR.value(), "账户已锁定");
	  		} catch (ExcessiveAttemptsException eae) {
	  			return errorJson(EnumResCode.SERVER_ERROR.value(), "用户名或密码错误次数过多");
	  		} catch (AuthenticationException ae) {
	  			return errorJson(EnumResCode.SERVER_ERROR.value(), "用户名或密码不正确");
	  		} 
	  		List<Map<String, Object>> result = new ArrayList<>();
	  		Map<String, Object> map = new HashMap<>();
	  		
	  		if (subject.isAuthenticated()) {			
	  			logger.info("登录成功,userName:{}--Time:{}",token.getUsername(),com.xmbl.ops.util.DateUtils.formatDate(new Date()));
	  			UserInfo user = userInfoService.getUserInfoByKey(userKey);
	  			// 用户被禁用
	  			if(Byte.valueOf(EnumPersonStatus.CLOSE.getId()).equals(user.getStatus())) {
	  				return errorJson(EnumResCode.SERVER_ERROR.value(), "用户已禁止，请联系管理员！");
	  			}
	  			
	  			//设置session
//				this.setSession(SessionConstant.ID_NUMBER, user.getIdNumber());
				this.setSession(SessionConstant.CURRENT_USER_ID, user.getId());
				this.setSession(SessionConstant.USER_NAME, user.getUserKey());
				this.setSession(SessionConstant.GROUP_NAME, user.getGroupname());
//				this.setSession(SessionConstant.TEAM_ID, user.getTeamId());		
	  			//登陆跳转
				map.put("url", request.getContextPath() + "/");
				result.add(map);
				String operator = (String) session.getAttribute(SessionConstant.USER_NAME);
				String ip = request.getRemoteAddr().toString();
				InetAddress addr = InetAddress.getLocalHost();
				String host=addr.getHostAddress().toString();//获得本机IP
				UserLog userLog = new UserLog(operator,ip,null,null,operator+"登陆成功！",Byte.valueOf("0"));
				userLogService.insertUserLog(userLog);
				return successJson(result);
	  		} else {
	  			logger.info("登录时用户没有被授权,跳转登录页面,userName:{}-Time:{}",token.getUsername(),com.xmbl.ops.util.DateUtils.formatDate(new Date()));
	  			token.clear();
	  			return errorJson(EnumResCode.SERVER_ERROR.value(), "认证失败！");
	  		}
	  	} catch (Exception e) {
	  		e.printStackTrace();
	  		return errorJson(EnumResCode.SERVER_ERROR.value(), "认证失败！");
	  	}
	}

	/**
	 * send login-security-code
	 * 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/securityCode",method=RequestMethod.GET)
	@ResponseBody
	public Response sendVerifyCode(HttpServletRequest request,HttpServletResponse  response) {
		logger.info("web验证码制作开始");
		try {
			// 通知浏览器不要缓存  
			response.setHeader("Expires", "-1");  
			response.setHeader("Cache-Control", "no-cache");  
			response.setHeader("Pragma", "-1");  
			VerifyCodeUtil util = VerifyCodeUtil.Instance();  
			// 将验证码输入到session中，用来验证  
			String code = util.getString();  
			request.getSession().setAttribute("securityCode", code);  
			// 输出到web页面  
			ImageIO.write(util.getImage(), "jpg", response.getOutputStream());  
			logger.info("web验证码制作完成");
			return new Response().success();
		} catch (Exception e) {
			logger.error("web验证码制作失败",e);
		}
		return new Response().failure();
	}

//	@RequestMapping(value = "/securityCode")
//	public@ResponseBody
//	void securityCode(HttpServletRequest request, HttpServletResponse response) throws IOException {
//		int width = 85; 
//		int height = 30;
//		int codeCount = 4;
//		int x = 17;
//	    int fontHeight = 28;         
//	    int codeY = 26;         
////		char[] codeSequence = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',         
////		         'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',         
////		         'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' }; 
//		char[] codeSequence = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J',         
//		         'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',         
//		         'X', 'Y', 'Z', '2', '3', '4', '5', '6', '7', '8', '9' }; 
//		 // 定义图像buffer         
//        BufferedImage buffImg = new BufferedImage(width, height,         
//                BufferedImage.TYPE_INT_RGB);         
//        Graphics2D g = buffImg.createGraphics();         
//        // 创建一个随机数生成器类         
//        Random random = new Random();         
//        // 将图像填充为白色         
//        g.setColor(Color.WHITE);         
//        g.fillRect(0, 0, width, height);         
//        // 创建字体，字体的大小应该根据图片的高度来定。         
//        Font font = new Font("Fixedsys", Font.PLAIN, fontHeight);         
//        // 设置字体。         
//        g.setFont(font);         
//        // 画边框。         
//        g.setColor(Color.BLACK);         
//        g.drawRect(0, 0, width - 1, height - 1);         
//        // 随机产生160条干扰线，使图象中的认证码不易被其它程序探测到。         
//        g.setColor(Color.BLACK);         
//        for (int i = 0; i < 10; i++) {         
//            int xx = random.nextInt(width);         
//            int y = random.nextInt(height);         
//            int xl = random.nextInt(12);         
//            int yl = random.nextInt(12);         
//            g.drawLine(xx, y, xx + xl, y + yl);         
//        }         
//        // randomCode用于保存随机产生的验证码，以便用户登录后进行验证。         
//        StringBuffer randomCode = new StringBuffer();         
//        int red = 0, green = 0, blue = 0;         
//        // 随机产生codeCount数字的验证码。         
//        for (int i = 0; i < codeCount; i++) {         
//            // 得到随机产生的验证码数字。         
//            String strRand = String.valueOf(codeSequence[random.nextInt(32)]);         
//            // 产生随机的颜色分量来构造颜色值，这样输出的每位数字的颜色值都将不同。         
//            red = random.nextInt(255);         
//            green = random.nextInt(255);         
//            blue = random.nextInt(255);         
//            // 用随机产生的颜色将验证码绘制到图像中。         
//            g.setColor(new Color(red, green, blue));         
//            g.drawString(strRand, (i + 1) * x, codeY);         
//            // 将产生的四个随机数组合在一起。         
//            randomCode.append(strRand);         
//        }         
//        // 将四位数字的验证码保存到Session中。         
//        HttpSession session = request.getSession();         
//        session.setAttribute("securityCode", randomCode.toString().toLowerCase());         
//        // 禁止图像缓存。         
//        response.setHeader("Pragma", "no-cache");         
//        response.setHeader("Cache-Control", "no-cache");         
//        response.setDateHeader("Expires", 0);         
//        response.setContentType("image/jpeg");         
//        // 将图像输出到Servlet输出流中。         
//        ServletOutputStream sos = response.getOutputStream();         
//        ImageIO.write(buffImg, "jpeg", sos);         
//        sos.close();                  
//	}
	

	@SuppressWarnings("finally")
	@RequestMapping(value = "/userLogout")
	public String userLogout(HttpServletRequest request, HttpServletResponse response) {
		try{
			logger.info("登出{}--{}",SecurityUtils.getSubject().getPrincipal(),com.xmbl.ops.util.DateUtils.formatDate(new Date()));
			HttpSession session = request.getSession();
			String operator = (String) session.getAttribute(SessionConstant.USER_NAME);
			if (operator != null) {
				//	String ip = getIpAddr(request);
				InetAddress addr = InetAddress.getLocalHost();
				String host=addr.getHostAddress().toString();//获得本机IP
				UserLog userLog = new UserLog(operator,host,null,null,operator+"登出成功！",Byte.valueOf("0"));
				userLogService.insertUserLog(userLog);
				SecurityUtils.getSubject().logout();
				logger.info("登出成功{}",com.xmbl.ops.util.DateUtils.formatDate(new Date()));
			} else {
				logger.info("用户已退出登录{}",com.xmbl.ops.util.DateUtils.formatDate(new Date()));
			}
			
		}catch(UnknownSessionException use){
			logger.error("登出失败，未知的session", use);
		} catch (UnknownHostException eo) {
			logger.error("登出失败，未知的Host", eo);
		}
//		}finally{
//				 try {
////					 response.sendRedirect(request.getServletContext() + "/login");
//				 } catch (IOException e) {
//					 logger.error("登出时,redirect失败",e);
//				 }
//		}
		return "/login";
	}
	
	private void setSession(Object key, Object value) {
		Subject currentUser = SecurityUtils.getSubject();
		if (null != currentUser) {
			Session session = currentUser.getSession();
			if (null != session) {
				session.setAttribute(key, value);
			}
		}
	}	
	/**
     * 获取访问者IP
     * 
     * 在一般情况下使用Request.getRemoteAddr()即可，但是经过nginx等反向代理软件后，这个方法会失效。
     * 
     * 本方法先从Header中获取X-Real-IP，如果不存在再从X-Forwarded-For获得第一个IP(用,分割)，
     * 如果还不存在则调用Request .getRemoteAddr()。
     * 
     * @param request
     * @return
     */
    public static String getIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("X-Real-IP");
        if (!StringUtils.isBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            return ip;
        }
        ip = request.getHeader("X-Forwarded-For");
        if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
        	ip = request.getHeader("Proxy-Client-IP");  
        	}  
        	if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
        	ip = request.getHeader("WL-Proxy-Client-IP");  
        	}  
        	if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
        	ip = request.getRemoteAddr();  
        }  
        if (!StringUtils.isBlank(ip) && !"unknown".equalsIgnoreCase(ip)) {
            // 多次反向代理后会有多个IP值，第一个为真实IP。
            int index = ip.indexOf(',');
            if (index != -1) {
                return ip.substring(0, index);
            } else {
                return ip;
            }
        } else {
            return request.getRemoteAddr();
        }
    }
    
    /**
     * 获取访问用户的客户端IP（适用于公网与局域网）.
     */
    public static final String getIpAddrs(final HttpServletRequest request)
            throws Exception {
        if (request == null) {
            throw (new Exception("getIpAddr method HttpServletRequest Object is null"));
        }
        String ipString = request.getHeader("x-forwarded-for");
        if (StringUtils.isBlank(ipString) || "unknown".equalsIgnoreCase(ipString)) {
            ipString = request.getHeader("Proxy-Client-IP");
        }
        if (StringUtils.isBlank(ipString) || "unknown".equalsIgnoreCase(ipString)) {
            ipString = request.getHeader("WL-Proxy-Client-IP");
        }
        if (StringUtils.isBlank(ipString) || "unknown".equalsIgnoreCase(ipString)) {
            ipString = request.getRemoteAddr();
        }
     
        // 多个路由时，取第一个非unknown的ip
        final String[] arr = ipString.split(",");
        for (final String str : arr) {
            if (!"unknown".equalsIgnoreCase(str)) {
                ipString = str;
                break;
            }
        }
     
        return ipString;
    }
}
