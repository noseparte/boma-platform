package com.xmbl.ops.service.app;

import com.xmbl.ops.dao.app.IAppVersionDao;
import com.xmbl.ops.model.app.AppVersion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  AppVersionService 
 * @创建时间:  2018年3月5日 上午11:19:24
 * @修改时间:  2018年3月5日 上午11:19:24
 * @类说明:
 */
@Service
public class AppVersionService {
	
	@Autowired
	private IAppVersionDao iAppVersionDao;
	
	public Long findCnt(String project, String channel, Integer status) {
		Long count = iAppVersionDao.findCnt(project,channel,status);
		return count;
	}
	
	public Long findCnt(Integer status) {
		Long count = iAppVersionDao.findCnt(status);
		return count;
	}

	public List<AppVersion> findList(String project, String channel, Integer status, String sortType, String sort,
			int page, int size) {
		List<AppVersion> appVersionLst = iAppVersionDao.findList(project, channel, status, sortType, sort, page, size);
		return appVersionLst;
	}

	public List<AppVersion> findList(Integer status, String sortType, String sort, int page, int size) {
		List<AppVersion> appVersionLst = iAppVersionDao.findList(status, sortType, sort, page, size);
		return appVersionLst;
	}
	
	public AppVersion findById(String id) {
		AppVersion appVersion = iAppVersionDao.findById(id);
		return appVersion;
	}

	public boolean updById(AppVersion appVersion) {
		boolean flag = iAppVersionDao.updById(appVersion);
		return flag;
	}

	public boolean insert(AppVersion appVersion) {
		boolean flag = iAppVersionDao.insertBy(appVersion);
		return flag;
	}

	public boolean delete(String id) {
		boolean flag = iAppVersionDao.deleteById(id);
		return flag;
	}

	public AppVersion findByProjectAndChannelAndStatus(String project, String channel, int status) {
		AppVersion appVersion = iAppVersionDao.findByProjectAndChannelAndStatus(project, channel, status);
		return appVersion;
	}

}
