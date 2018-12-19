package com.xmbl.ops.controller.app;

import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.dto.*;
import com.xmbl.ops.enumeration.EnumAppProject;
import com.xmbl.ops.enumeration.EnumAppProjectChannel;
import com.xmbl.ops.model.app.AppVersion;
import com.xmbl.ops.service.app.AppVersionService;
import com.xmbl.ops.util.UUIDTool;
import com.xmbl.ops.util.appversion.AppversionUtil;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author: sunbenbao
 * @Email: 1402614629@qq.com
 * @类名: AppVersion
 * @创建时间: 2018年3月5日 上午11:12:55
 * @修改时间: 2018年3月5日 上午11:12:55
 * @类说明:
 */
@Controller
@RequestMapping(value = "/app/version")
public class AppVersionController extends AbstractController {

    private static Logger LOGGER = LoggerFactory.getLogger(AppVersionController.class);

    @Autowired
    private AppVersionService appVersionService;

    /**
     * 查询app版本信息列表
     * <br></br>
     * <span>只查询最近30次的版本信息列表</span>
     *
     * @return
     */
    @RequestMapping(value = "/list.html")
    public String list(
            // 项目名
            //@RequestParam(value="project", required=false) String project,
            // 渠道  360 扣扣  微信 百度云盘
            //@RequestParam(value="channel", required=false) String channel,
            // 排序类型: 创建时间creatdate
            @RequestParam(value = "sortType", defaultValue = "create_date") String sortType,//
            // 排序方式: desc 降序 asc 升序
            @RequestParam(value = "sort", defaultValue = "DESC") String sort,//
            // 查询页码 默认 1
            @RequestParam(value = "page", defaultValue = "1") int page,//
            // 每页显示条数
            @RequestParam(value = "size", defaultValue = "30") int size,//
            Model model
    ) {
        try {
//			Assert.isTrue(StringUtils.isNotBlank(project), "项目名不能为空");
//			Assert.isTrue(StringUtils.isNotBlank(channel), "渠道不能为空");
//			Assert.isTrue(project.equals(EnumAppProject.SANXIAO.getCode()), "项目名错误");
//			Assert.isTrue(//
//					channel.equals(EnumAppProjectChannel.V360_WANGPAN.getCode()) //
//					|| channel.equals(EnumAppProjectChannel.VBD_YUNPAN.getCode())//
//					|| channel.equals(EnumAppProjectChannel.VQQ.getCode())//
//					|| channel.equals(EnumAppProjectChannel.VWX.getCode())//
//					, "渠道传值有误");

            LOGGER.info("查询app版本信息列表");
            Integer status = 1;
//			Long count = appVersionService.findCnt(project,channel,status);
            Long count = appVersionService.findCnt(status);
            Pagination pagin = new Pagination(page, size, count);
            page--;
//			List<AppVersion> appVersionLst = appVersionService.findList(project,channel,status,sortType,sort,page,size);
            List<AppVersion> appVersionLst = appVersionService.findList(status, sortType, sort, page, size);
            List<AppVersionDto> appVersionDtoLst = new ArrayList<AppVersionDto>();
            AppVersionDto appVersionDto = null;
            for (AppVersion appVersion : appVersionLst) {
                appVersionDto = new AppVersionDto();
                BeanUtils.copyProperties(appVersion, appVersionDto);
                appVersionDto.setProject(AppversionUtil.getAppProjectDesc(appVersion.getProject()));
                appVersionDto.setChannel(AppversionUtil.getAppProjectChannelDesc(appVersion.getChannel()));
                appVersionDtoLst.add(appVersionDto);
            }
            pagin.setDatas(appVersionDtoLst);
            model.addAttribute("isSuccess", true);
            model.addAttribute("page", page);
            model.addAttribute("size", size);
            model.addAttribute("pagin", pagin);
//			model.addAttribute("project",project);
//			model.addAttribute("channel",channel);
            LOGGER.info("查询app版本信息成功。。。");
        } catch (Exception e) {
            model.addAttribute("isSuccess", false);
            LOGGER.error("查询app版本信息错误，错误信息:{}", e.getMessage());
        }
        return "app/appversion/list";
    }

    /**
     * 跳转到编辑页面
     *
     * @return
     */
    @RequestMapping(value = "/toEdit.html")
    public String toEdit(//
                         @RequestParam(value = "id", required = false) String id,//
                         Model model//
    ) {
        try {
            LOGGER.info("app版本信息跳转到编辑页面");
            model.addAttribute("id", id);
            // 绑定所有项目名
            List<AppVersionProjectDto> appVersionProjectLsts = new ArrayList<AppVersionProjectDto>();
            AppVersionProjectDto appVersionProjectDto = null;
            for (EnumAppProject enumAppProject : EnumAppProject.values()) {
                appVersionProjectDto = new AppVersionProjectDto();
                appVersionProjectDto.setProjectId(enumAppProject.getCode());
                appVersionProjectDto.setProjectName(enumAppProject.getDesc());
                appVersionProjectLsts.add(appVersionProjectDto);
            }
            model.addAttribute("appVersionProjectLsts", appVersionProjectLsts);
            // 绑定所有渠道
            List<AppVersionProjectChannelDto> appVersionProjectChannelLst = new ArrayList<AppVersionProjectChannelDto>();
            AppVersionProjectChannelDto appVersionProjectChannelDto = null;
            for (EnumAppProjectChannel enumAppProjectChannel : EnumAppProjectChannel.values()) {
                appVersionProjectChannelDto = new AppVersionProjectChannelDto();
                appVersionProjectChannelDto.setChannelId(enumAppProjectChannel.getCode());
                appVersionProjectChannelDto.setChannelName(enumAppProjectChannel.getDesc());
                appVersionProjectChannelLst.add(appVersionProjectChannelDto);
            }
            model.addAttribute("appVersionProjectChannelLst", appVersionProjectChannelLst);
            // 修改页面
            if (StringUtils.isNotBlank(id)) {
                //查询app对应版本信息
                LOGGER.info("查询app版本信息");
                AppVersion appversion = appVersionService.findById(id);
                model.addAttribute("appversion", appversion);
                model.addAttribute("edittype", "upd");
            } else {
                AppVersion appversion = new AppVersion();
                model.addAttribute("appversion", appversion);
                model.addAttribute("edittype", "crt");
            }
        } catch (Exception e) {
            LOGGER.error("===========================报错了，错误信息为:{}", e.getMessage());
        }
        return "app/appversion/toEdit";
    }


    /**
     * 编辑
     * <br></br>
     * 修改 和 保存
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/edit")
    public ResponseResult edit(
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "projectId", required = false) String projectId,
            @RequestParam(value = "channelId", required = false) String channelId,
            @RequestParam(value = "version", required = false) String version,
            @RequestParam(value = "desc_info", required = false) String desc_info
    ) {
        try {
            boolean flag = false;
            if (StringUtils.isNotBlank(id)) {
                LOGGER.info("修改app版本信息");
                AppVersion appVersion = appVersionService.findById(id);
                appVersion.setUpdate_by("admin");
                appVersion.setUpdate_date(new Date());
                appVersion.setProject(projectId);
                appVersion.setChannel(channelId);
                appVersion.setVersion(version);
                appVersion.setDesc_info(desc_info);
                flag = appVersionService.updById(appVersion);
                LOGGER.info("修改APP版本信息" + (flag ? "成功" : "失败"));
                Assert.isTrue(flag, "修改APP版本信息失败");
                return successJson("修改APP版本信息成功");
            } else {
                LOGGER.info("增加app版本信息");
                AppVersion appVersion = new AppVersion();
                appVersion.setId(UUIDTool.getUUID());
                Date date = new Date();
                appVersion.setCreate_by("admin");
                appVersion.setCreate_date(date);
                appVersion.setUpdate_by("admin");
                appVersion.setUpdate_date(date);
                appVersion.setProject(projectId);
                appVersion.setChannel(channelId);
                appVersion.setVersion(version);
                appVersion.setDesc_info(desc_info);
                flag = appVersionService.insert(appVersion);
                LOGGER.info("新增APP版本信息" + (flag ? "成功" : "失败"));
                Assert.isTrue(flag, "新增APP版本信息失败");
                return successJson("新增APP版本信息成功");
            }
        } catch (Exception e) {
            LOGGER.error("====================编辑操作出错啦！错误信息为:" + e.getMessage());
            return errorJson(e.getMessage());
        }
    }

    /**
     * 删除和批量删除
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/del")
    public ResponseResult del(
            @RequestParam(value = "id", required = false) String id
    ) {
        try {
            LOGGER.info("app版本信息删除开始");
            boolean flag = appVersionService.delete(id);
            LOGGER.info("删除app版本信息" + (flag ? "成功" : "失败"));
            Assert.isTrue(flag, "删除app版本信息失败");
            return successJson("app版本信息删除成功!");
        } catch (Exception e) {
            LOGGER.error("====================报错啦。错误消息为:" + e.getMessage());
            return errorJson(e.getMessage());
        }
    }

    @ResponseBody
    @RequestMapping(value = "/getAppVersion", method = RequestMethod.POST)
    public ResponseResult getAppVersion(
            @RequestParam(value = "project", required = false) String project,
            @RequestParam(value = "channel", required = false) String channel
    ) {
        try {
            Assert.isTrue(StringUtils.isNotBlank(project), "项目名不能为空");
            Assert.isTrue(StringUtils.isNotBlank(channel), "渠道不能为空");
            Assert.isTrue(project.equals(EnumAppProject.SANXIAO.getCode()), "项目名错误");
            Assert.isTrue(//
                    channel.equals(EnumAppProjectChannel.V360_WANGPAN.getCode()) //
                            || channel.equals(EnumAppProjectChannel.VBD_YUNPAN.getCode())//
                            || channel.equals(EnumAppProjectChannel.VQQ.getCode())//
                            || channel.equals(EnumAppProjectChannel.VWX.getCode())//
                    , "渠道传值有误");

            int status = 1;
            AppVersion appVersion = appVersionService.findByProjectAndChannelAndStatus(project, channel, status);
            Assert.isTrue(appVersion != null, "未查询到该版本,请联系管理员添加相应版本信息");
            return successJson(appVersion);
        } catch (Exception e) {
            LOGGER.error("=================报错啦，错误信息为:" + e.getMessage());
            return errorJson(e.getMessage());
        }

    }
}
