package com.xmbl.ops.dao.app;

import com.xmbl.ops.dao.base.IEntityDao;
import com.xmbl.ops.model.app.AppVersion;

import java.util.List;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名:  IAppVersionDao 
 * @创建时间:  2018年3月5日 下午2:02:38
 * @修改时间:  2018年3月5日 下午2:02:38
 * @类说明:
 */
public interface IAppVersionDao extends IEntityDao<AppVersion>{

	Long findCnt(String project, String channel, Integer status);

	List<AppVersion> findList(String project, String channel, Integer status, String sortType, String sort, int page,
			int size);

	AppVersion findById(String id);

	boolean updById(AppVersion appVersion);

	boolean insertBy(AppVersion appVersion);

	boolean deleteById(String id);

	Long findCnt(Integer status);

	List<AppVersion> findList(Integer status, String sortType, String sort, int page, int size);

	AppVersion findByProjectAndChannelAndStatus(String project, String channel, int status);

}
