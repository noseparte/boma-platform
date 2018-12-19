package com.xmbl.ops.test;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.File;

public class readxml {

	public static void main(String[] args) {
		try {
			String path="src/main/resources/xml/";
			File file=new File(path);
			File[] tempList = file.listFiles();
			System.out.println("该目录下对象个数："+tempList.length);
			for (int i = 0; i < tempList.length; i++) {
				if (tempList[i].isFile()) {
					System.out.println("文     件："+tempList[i]);
					System.out.println("文     件："+tempList[i].getName().substring(0, tempList[i].getName().indexOf(".")));
					File f = new File(tempList[i].toString());
					DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();//步骤1
					DocumentBuilder builder = factory.newDocumentBuilder();//步骤2
					Document doc = (Document) builder.parse(f);//步骤3
					NodeList nl = ((org.w3c.dom.Document) doc).getElementsByTagName("item");
					for (int j = 0; j < nl.getLength(); j++) {
						System.out.println(doc.getElementsByTagName("item").item(j).getAttributes().getNamedItem("id").getNodeValue().toString());
						System.out.println(doc.getElementsByTagName("item").item(j).getAttributes().getNamedItem("name").getNodeValue().toString());
						System.out.println(doc.getElementsByTagName("item").item(j).getAttributes().getNamedItem("type").getNodeValue().toString());
					}
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
