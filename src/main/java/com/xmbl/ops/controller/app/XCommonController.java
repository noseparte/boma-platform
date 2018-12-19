package com.xmbl.ops.controller.app;

import com.alibaba.fastjson.JSONException;
import com.github.qcloudsms.SmsSingleSender;
import com.github.qcloudsms.SmsSingleSenderResult;
import com.github.qcloudsms.httpclient.HTTPException;
import com.xmbl.ops.config.MessageConfig;
import com.xmbl.ops.controller.AbstractController;
import com.xmbl.ops.model.data.Message;
import com.xmbl.ops.service.data.MessageService;
import com.xmbl.ops.web.api.bean.Route;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Date;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile --
 * @Version 1.0
 * @Description
 */
@Slf4j
@RestController
@RequestMapping(value = Route.PATH + Route.Util.PATH)
public class XCommonController extends AbstractController {

    @Autowired
    private MessageService messageService;

    @PostMapping(value = Route.Util.SEND_MESSAGE)
    public void sendMessage(String phoneNumber){
        try {
            String[] params = {"5678"};//数组具体的元素个数和模板中变量个数必须一致，例如事例中templateId:5678对应一个变量，参数数组中元素个数也必须是一个
            SmsSingleSender ssender = new SmsSingleSender(MessageConfig.AppID, MessageConfig.AppKey);
            SmsSingleSenderResult result = ssender.sendWithParam("86", phoneNumber,
                    MessageConfig.templateId, params, MessageConfig.smsSign, "", "");  // 签名参数未提供或者为空时，会使用默认签名发送短信
            if (result.result == 0){  // 成功
                log.info("短信发送成功，result ,{}",result);
                // 存库
                Message message = new Message(params.toString(), phoneNumber,1, new Date(), 0);
                messageService.save(message);
            }
        } catch (HTTPException e) {
            // HTTP响应码错误
            e.printStackTrace();
        } catch (JSONException e) {
            // json解析错误
            e.printStackTrace();
        } catch (IOException e) {
            // 网络IO错误
            e.printStackTrace();
        }
    }



}
