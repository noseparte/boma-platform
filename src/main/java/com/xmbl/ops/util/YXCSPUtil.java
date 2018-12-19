package com.xmbl.ops.util;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

@Component
public class YXCSPUtil {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(YXCSPUtil.class);

    /**
     * 上传
     * 
     * @param file
     * @throws IOException
     */
    public String push(HttpServletRequest request,MultipartFile file) throws IOException {
    	long pushTimeB = System.currentTimeMillis();
        LOGGER.info(StringUtils.repeat("*", 25));
        LOGGER.info("上传开始...");
        
		String fileName = file.getOriginalFilename();  
        File fp = new File("/upload");  
        // 创建目录  
        if (!fp.exists()) {  
            fp.mkdirs();// 目录不存在的情况下，创建目录。  
        }  
        System.out.println("执行结束"+"/upload"); 
		//保存  
		String filePath = Files_Utils_DG.FilesUpload_stream(request, file, "/upload");
		String requestURI = request.getRequestURI();
		StringBuffer requestURL = request.getRequestURL();
		int index = requestURL.indexOf(requestURI);
		String requestUrlTop = requestURL.substring(0, index);
		String url = requestUrlTop + "/platform" + filePath;
		url = url.replaceAll("\\\\","/");
		LOGGER.info(url);
        long pushTimeE = System.currentTimeMillis();
        LOGGER.info("上传结束:用时:[" + (pushTimeE - pushTimeB) + "ms]");
        LOGGER.info(StringUtils.repeat("*", 25));
        return url;
    }
    
    public static void main(String[]args) {
    	
    }
}
