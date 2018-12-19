package com.xmbl.ops.controller.organization;

import com.xmbl.ops.constant.SessionConstant;
import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.model.organization.UserLog;
import com.xmbl.ops.service.organization.UserLogService;
import com.xmbl.ops.util.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;

@Controller
@RequestMapping(value = "/user")
public class UserLogController extends AbstractController {
	private static final int limit = 30;
	
	@Autowired
	protected UserLogService userLogService;

	@RequestMapping(value = "/userLogsList")
	public String userLogsList(HttpServletRequest request, ModelMap model, String loginName,  String startTime, String endTime, Long page) throws Exception {
		HttpSession session = request.getSession();
		String operatorName = (String) session.getAttribute(SessionConstant.USER_NAME);
		try {
				page = page == null || page < 0 ? 0 : page;
				Date startDate = DateUtils.parseDate(startTime, "yyyy-MM-dd HH:mm:ss");
				Date endDate = DateUtils.parseDate(endTime, "yyyy-MM-dd HH:mm:ss");
				long totalNum = userLogService.searchCount(loginName, startDate, endDate);
				long totalPageNum = totalNum / limit;
				if (totalNum > totalPageNum * limit)
					totalPageNum++;
				if (page >= totalPageNum && totalPageNum != 0)
					page = totalPageNum - 1;
				long start = page * limit;
				List<UserLog> userLogsList = userLogService.searchList(loginName, startDate, endDate, start,
						limit);
				model.addAttribute("loginName", loginName);
				model.addAttribute("startTime", startTime);
				model.addAttribute("endTime", endTime);
				model.addAttribute("userLogsList", userLogsList);
				model.addAttribute("page", page);
				model.addAttribute("totalNum", totalNum);
				model.addAttribute("totalpage", totalPageNum);
				return "management/userLogsList";
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	
}
