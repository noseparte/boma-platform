package com.xmbl.ops.util;

import org.apache.commons.lang3.StringUtils;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.taskdefs.Expand;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class UNZIPUtil {
	private static Logger logger = LoggerFactory.getLogger("artificial_recognition_log");

	private static final String ZIP = "zip";

	/**
	 * /** 解压zip格式压缩包 对应的是ant.jar
	 */
	private static void unzip(File sourceZip, File destDir) throws Exception {
		try {
			Project p = new Project();
			Expand e = new Expand();
			e.setProject(p);
			e.setSrc(sourceZip);
			e.setOverwrite(false);
			e.setDest(destDir);
			/*
			 * ant下的zip工具默认压缩编码为UTF-8编码， 而winRAR软件压缩是用的windows默认的GBK或者GB2312编码
			 * 所以解压缩时要制定编码格式
			 */
			e.setEncoding("gbk");
			e.execute();
		} catch (Exception e) {
			logger.error("解压缩出错:", e);
			throw e;
		}
	}

	/**
	 * 解压缩
	 */
	public static File[] deCompress(String sourceFile, String destDir,
			boolean includeZipFileName, String fileName) throws Exception {
		if (StringUtils.isEmpty(sourceFile) || StringUtils.isEmpty(destDir)) {
			logger.error("路径错误");
			throw new Exception("路径错误");
		}
		// 保证文件夹路径最后是"/"或者"\"
		char lastChar = destDir.charAt(destDir.length() - 1);
		if (lastChar != '/' && lastChar != '\\') {
			destDir += File.separator;
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		// 如果解压后的文件保存路径包含压缩文件的文件名，则追加该文件名到解压路径
		// if (includeZipFileName) {
		// // String fileName = zipFile.getName();
		// if (StringUtils.isNotEmpty(fileName)) {
		// fileName = fileName.substring(0, fileName.lastIndexOf("."));
		// }
		// destDir = destDir + File.separator + fileName;
		// System.out.println(destDir);
		// }
		String StringFileName = sdf.format(new Date());
		destDir = destDir + File.separator + StringFileName;
		// 返回解压文件数组
		File[] files;
		try {
			File srcZipFile = new File(sourceFile);
			// 创建解压缩文件保存的路径
			File unzipFileDir = new File(destDir);
			if (!unzipFileDir.exists()) {
				unzipFileDir.mkdirs();
			}		
			// 根据类型，进行相应的解压缩
			String type = sourceFile.substring(sourceFile.lastIndexOf(".") + 1);

			if (ZIP.equals(type)) {
				logger.info("开始解压到服务器:{}",
						com.xmbl.ops.util.DateUtils.formatDate(new Date()));
				UNZIPUtil.unzip(srcZipFile, unzipFileDir);

				File file = new File(unzipFileDir
						+ File.separator
						+ fileName.substring(0, fileName.lastIndexOf(".")));
				// File file = new File(unzipFileDir.getAbsolutePath());
				files = file.listFiles();
				if (null == files) {
					logger.error("压缩包文件名错误");
					throw new Exception("压缩包文件名错误");
				}
			} else {
				logger.error("只支持zip格式的压缩包!");
				throw new Exception("只支持zip格式的压缩包！");
			}
		} catch (IOException e) {
			logger.error("解压文件打开错误");
			throw new Exception("解压文件打开错误");
		}
		return files;
	}

}
