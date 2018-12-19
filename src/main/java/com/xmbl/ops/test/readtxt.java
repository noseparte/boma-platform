package com.xmbl.ops.test;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

public class readtxt {
	 /**
     * 功能：Java读取txt文件的内容
     * 步骤：1：先获得文件句柄
     * 2：获得文件句柄当做是输入一个字节码流，需要对这个输入流进行读取
     * 3：读取到输入流后，需要读取生成字节流
     * 4：一行一行的输出。readline()。
     * 备注：需要考虑的是异常情况
     * @param filePath
     */
	 public static void readTxtFile(String filePath){
	        try {
	                String encoding="GBK";
	                File file=new File(filePath);
	                if(file.isFile() && file.exists()){ //判断文件是否存在
	                    InputStreamReader read = new InputStreamReader(
	                    new FileInputStream(file),encoding);//考虑到编码格式
	                    BufferedReader bufferedReader = new BufferedReader(read);
	                    String lineTxt = null;
	                    while((lineTxt = bufferedReader.readLine()) != null){
	                        System.out.println(lineTxt);
	                    }
	                    read.close();
	        }else{
	            System.out.println("找不到指定的文件");
	        }
	        } catch (Exception e) {
	            System.out.println("读取文件内容出错");
	            e.printStackTrace();
	        }
	     
	 }
	public static void main(String[] args) {
		try {
			String path="src/main/resources/txt/";
			File file=new File(path);
			File[] tempList = file.listFiles();
			System.out.println("该目录下对象个数："+tempList.length);
			for (int i = 0; i < tempList.length; i++) {
				if (tempList[i].isFile()) {
					System.out.println("文     件："+tempList[i]);
					System.out.println("文     件："+tempList[i].getName().substring(0, tempList[i].getName().indexOf(".")));
					File f = new File(tempList[i].toString());
					readTxtFile(tempList[i].toString());
				}
				if (tempList[i].isDirectory()) {
					System.out.println("文件夹："+tempList[i]);
				}
			}
		} catch (Exception e) {

			e.printStackTrace();
		}
	}
}
