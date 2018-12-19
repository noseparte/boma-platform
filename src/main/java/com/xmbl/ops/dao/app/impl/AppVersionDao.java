package com.xmbl.ops.dao.app.impl;

import com.xmbl.ops.dao.app.IAppVersionDao;
import com.xmbl.ops.dao.base.EntityDaoMPDBImpl;
import com.xmbl.ops.model.app.AppVersion;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  AppVersionDao 
 * @创建时间:  2018年3月5日 下午2:03:37
 * @修改时间:  2018年3月5日 下午2:03:37
 * @类说明:
 */
@Repository
public class AppVersionDao extends EntityDaoMPDBImpl<AppVersion> implements IAppVersionDao{

	private Logger LOGGER = LoggerFactory.getLogger(AppVersionDao.class);
	
	@Override
	public Long findCnt(String project, String channel,Integer status) {
		try {
			Map<String, Object> map = new HashMap<String,Object>();
			map.put("project", project);
			map.put("channel", channel);
			map.put("status", status);
			Long count = this.getSqlSessionTemplate().selectOne(getNameSpace()+".findCnt", map);
			return count;
		} catch (Exception e) {
			LOGGER.error("获取版本信息总记录数报错，错误信息为:{}",e.getMessage());
			return 0l;
		}
	}

	@Override
	public Long findCnt(Integer status) {
		try {
			Map<String, Object> map = new HashMap<String,Object>();
//			map.put("project", project);
//			map.put("channel", channel);
			map.put("status", status);
			Long count = this.getSqlSessionTemplate().selectOne(getNameSpace()+".findCnt", map);
			return count;
		} catch (Exception e) {
			LOGGER.error("获取版本信息总记录数报错，错误信息为:{}",e.getMessage());
			return 0l;
		}
	}
	
	@Override
	public List<AppVersion> findList(
			//
			String project, String channel, Integer status, //
			String sortType, String sort,int page, int size//
	) {
		try {
			Map<String, Object> map = new HashMap<String,Object>();
			map.put("project", project);
			map.put("channel", channel);
			map.put("status", status);
			map.put("sort_type", sortType);
			map.put("sort", sort);
			map.put("page", page);
			map.put("size", size);
			List<AppVersion> appVersionLst = this.getSqlSessionTemplate().selectList(getNameSpace()+".findLst", map);
			return appVersionLst;
		} catch (Exception e) {
			LOGGER.error("查询app版本信息配置报错了,错误信息:" + e.getMessage());
			return Collections.emptyList();
		}
	}

	@Override
	public List<AppVersion> findList(Integer status, String sortType, String sort, int page, int size) {
		try {
			Map<String, Object> map = new HashMap<String,Object>();
//			map.put("project", project);
//			map.put("channel", channel);
			map.put("status", status);
			map.put("sort_type", sortType);
			map.put("sort", sort);
			map.put("page", page);
			map.put("size", size);
			List<AppVersion> appVersionLst = this.getSqlSessionTemplate().selectList(getNameSpace()+".findLst", map);
			return appVersionLst;
		} catch (Exception e) {
			LOGGER.error("查询app版本信息配置报错了,错误信息:" + e.getMessage());
			return Collections.emptyList();
		}
	}
	
	@Override
	public AppVersion findById(String id) {
		try {
			Assert.isTrue(StringUtils.isNotBlank(id), "id不能为空");
			Map<String, String> map = new HashMap<String, String>();
			map.put("id", id);
			List<AppVersion> appVersionLst = this.getSqlSessionTemplate().selectList(getNameSpace()+".findById", map);
			AppVersion appVersion = null;
			if (appVersionLst!=null && appVersionLst.size() >0 ) {
				appVersion = appVersionLst.get(0);
			}
			return appVersion;
		} catch (Exception e) {
			LOGGER.error("id不能为空");
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public boolean updById(AppVersion appVersion) {
		try  {
			Map<String, Object> map = new HashMap<String,Object>();
			map.put("id", appVersion.getId());
			map.put("update_by", appVersion.getUpdate_by());
			map.put("update_date", appVersion.getUpdate_date());
			map.put("project", appVersion.getProject());
			map.put("channel", appVersion.getChannel());
			map.put("version", appVersion.getVersion());
			map.put("desc_info", appVersion.getDesc_info());
			map.put("status", appVersion.getStatus());
			int count = this.getSqlSessionTemplate().update(getNameSpace()+".updById", map);
			return count >0;
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("修改版本信息出错了，错误信息为:"+e.getMessage());
			return false;
		}
	}

	@Override
	public boolean insertBy(AppVersion appVersion) {
		try {
			Map<String, Object> map = new HashMap<String,Object>();
			map.put("id", appVersion.getId());
			map.put("create_by", appVersion.getCreate_by());
			map.put("create_date", appVersion.getCreate_date());
			map.put("update_by", appVersion.getUpdate_by());
			map.put("update_date", appVersion.getUpdate_date());
			map.put("project", appVersion.getProject());
			map.put("channel", appVersion.getChannel());
			map.put("version", appVersion.getVersion());
			map.put("desc_info", appVersion.getDesc_info());
			map.put("status", appVersion.getStatus());
			int count = this.getSqlSessionTemplate().insert(getNameSpace()+".insertBy", map);
			return count >0;
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("新增版本信息出错啦，错误信息为:"+e.getMessage());
			return false;
		}
		
	}

	@Override
	public boolean deleteById(String id) {
		try {
			Assert.isTrue(StringUtils.isNotBlank(id), "要删除app版本id不能为空");
			Map<String,String> map = new HashMap<String, String>();
			map.put("id", id);
			int count = this.getSqlSessionTemplate().delete(getNameSpace()+".deleteById", map);
			return count >0;
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("报错啦，错误消息为"+e.getMessage());
			return false;
		}
	}

	/**
	 * 获取最新的app版本信息
	 */
	@Override
	public AppVersion findByProjectAndChannelAndStatus(String project, String channel, int status) {
		try {
			Map<String, Object> map = new HashMap<String,Object>();
			map.put("project", project);
			map.put("channel", channel);
			map.put("status", status);
			List<AppVersion> appVersionLst = this.getSqlSessionTemplate().selectList(getNameSpace()+".selectLastest", map);
			if (appVersionLst.size() >0) {
				AppVersion appVersion = appVersionLst.get(0);
				return appVersion;
			}
			return null;
		} catch (Exception e) {
			e.printStackTrace();
			LOGGER.error("查询最新的app版本信息出错啦，错误信息为:"+e.getMessage());
			return null;
		}
	}

}
