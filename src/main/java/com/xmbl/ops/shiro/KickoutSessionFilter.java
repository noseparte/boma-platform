package com.xmbl.ops.shiro;

import com.xmbl.ops.constant.GroupNameConstant;
import com.xmbl.ops.constant.SessionConstant;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.session.*;
import org.apache.shiro.session.mgt.DefaultSessionKey;
import org.apache.shiro.session.mgt.SessionManager;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.Serializable;
import java.util.Deque;
import java.util.LinkedList;


public class KickoutSessionFilter extends AccessControlFilter {
	private static Logger logger = LoggerFactory.getLogger("session_expired_log");
	private String kickoutUrl;
	private boolean kickoutAfter = false;
	private int maxSession = 1;
	private SessionManager sessionManager;
	private Cache<String, Deque<Serializable>> cache;

	public String getKickoutUrl() {
		return kickoutUrl;
	}

	public void setKickoutUrl(String kickoutUrl) {
		this.kickoutUrl = kickoutUrl;
	}

	public void setKickoutAfter(boolean kickoutAfter) {
		this.kickoutAfter = kickoutAfter;
	}

	public void setMaxSession(int maxSession) {
		this.maxSession = maxSession;
	}

	public void setSessionManager(SessionManager sessionManager) {
		this.sessionManager = sessionManager;
	}

	public void setCacheManager(CacheManager cacheManager) {
		this.cache = cacheManager.getCache("shiro-kickout-session");
	}

	@Override
	protected boolean isAccessAllowed(ServletRequest request, ServletResponse response,
		Object mappedValue) {
		return false;
	}

	@Override
	protected boolean onAccessDenied(ServletRequest request, ServletResponse response) {
		Subject subject = SecurityUtils.getSubject(); 
	
		if (!subject.isAuthenticated()) {
			return true;
		}

		Session session = subject.getSession();
		String username = (String) subject.getPrincipal();
		Serializable sessionId = session.getId();
		String groupName = (String) session.getAttribute(SessionConstant.GROUP_NAME);

		if(GroupNameConstant.NoRestrict.equals(groupName))
			return true;
		
		// 同步控制
		Deque<Serializable> deque = cache.get(username);
		if (deque == null) {
			deque = new LinkedList<Serializable>();
			cache.put(username, deque);
			logger.info("加入缓存成功,cache:{},sessionId:{},usreName:{},deque:{}",cache,sessionId,username,deque);
		}

		if (!deque.contains(sessionId) && session.getAttribute("kickout") == null) {
			deque.push(sessionId);
			cache.put(username, deque);
			logger.info("把sessionID放入deque,cache:{},sessionId:{},usreName:{},deque:{}",cache,sessionId,username,deque);
		}

		while (deque.size() > maxSession) {
			Serializable kickoutSessionId = null;
			if (kickoutAfter) { // 如果踢出后者
				kickoutSessionId = deque.removeFirst();
				cache.put(username, deque);
			} else { // 否则踢出前者
				kickoutSessionId = deque.removeLast();
				cache.put(username, deque);
				logger.info("踢出成功:cache:{},kickoutSessionId:{}",cache,kickoutSessionId);
			}
			try{ 
				Session kickoutSession = sessionManager.getSession(new DefaultSessionKey(kickoutSessionId));
				if (kickoutSession != null) 
				{
					// 设置会话的kickout属性表示踢出了
					kickoutSession.setAttribute("kickout", true);
				}
			}catch(UnknownSessionException use) {//ignore
				logger.error("kickoutSession,session(stopped or expired),There is no session with id{}",kickoutSessionId);
			}catch(ExpiredSessionException ese) {
				logger.error("kickoutSession,session was expired:{}",kickoutSessionId);
			}catch(StoppedSessionException sse) {
				logger.error("kickoutSession,session was stopped:{}",kickoutSessionId);
			}catch(SessionException se) {
				logger.error("kickoutSession,session exception:{}",kickoutSessionId);
			}catch(Exception e) {
				logger.error("kickoutSession,session exception:{}",kickoutSessionId);
			}
		}

		if (session.getAttribute("kickout") != null) {
			// 会话被踢出了
			try {
				 subject.logout();
			} catch (UnknownSessionException use) {
				 logger.error("kickoutSession失败，未知的session", use);
			}
			return true;
		}
		return true;
		}
	}
