package com.xmbl.ops.util;

import com.alibaba.fastjson.JSON;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class HtmlHelper {
	   private static double linkTextRadio = 0.30; 

	    public static String filterContent(String str) {
	        if (str == "") {
	            return "";
	        }
	        str = str.replaceAll("(?is)<!DOCTYPE.*?>", "");
	        str = str.replaceAll("(?is)<!--.*?-->", "");
	        str = str.replaceAll("(?is)<script.*?>.*?</script>", "");
	        str = str.replaceAll("(?is)<style.*?>.*?</style>", "");
	        return str;
	    }

	    public static int calcLinks(Element node) {
	        Elements links = node.select("a[href]");
	        return links.size();
	    }

	    public static double calcWords(Element node) {
	        String con = node.text();
	        if (con.length() == 0) {
	            return 1 + linkTextRadio;
	        } else {
	            return con.length();
	        }
	    }

	    public static int calcSign(Element node) {
	        String[] sign = { ",", ";", ".", "\"", "'", "\\?", "¡£", ":", "£¬" };
	        int i = 0;
	        for (String ch : sign) {
	            int count = 0;
	            count = node.text().split(ch).length - 1;
	            i = +count;
	        }
	        return i;
	    }

	    public static Element drawCon(Element node) {
	        if (node.tagName() == "a") {
	            return node;
	        }
	        int links;
	        double words; 
	        double cellRatio;
	        int signs; 

	        Elements nodes = node.children();
	        for (Element cnode : nodes) {
	            if (!cnode.hasText()) {
	                cnode.remove();
	            } else {
	                links = calcLinks(cnode);
	                words = calcWords(cnode);
	                cellRatio = links / words;
	                signs = calcSign(cnode);
	                if (signs < 1) {
	                    cnode.remove();
	                } else if (cellRatio > linkTextRadio) {
	                    cnode.remove();
	                } else {
	                    drawCon(cnode);
	                }
	            }
	        }
	        return node;
	    }

	    public static String drawTitle(String str) {
	        if (str.length() < 1) {
	            return null;
	        }
	        String tit = "";
	        int xhpos = -1; 
	        int zhpos = -1; 
	        Pattern pt = Pattern.compile("<title>(.*)</title>",
	                Pattern.CASE_INSENSITIVE);
	        Matcher mc = pt.matcher(str);
	        if (mc.find()) {
	            tit = mc.group(1).trim();
	            xhpos = tit.indexOf("_");
	            zhpos = tit.indexOf("|");
	            if (xhpos > 0) {
	                tit = tit.substring(0, xhpos);
	            }
	            if (zhpos > 0) {
	                tit = tit.substring(0, zhpos);
	            }
	        }
	        return tit;
	    }

	    
	    /**
	     * 将文本转换成JSON格式的字符串
	     * @param content
	     * @return
	     */
	    public static String getImagesFromContent(String content) {
	        String trim = content.replace("<br/>","").trim();
	        String article = trim.replace("<p>", "").replaceAll("</p>", ",").trim();
	        String delHTMLTag = delHTMLTag(article);
	        String replaceHTML = delHTMLTag.replace("#", "#");
	        String[] HTMLTag = replaceHTML.split(",");
	        String jsonContent = JSON.toJSONString(HTMLTag);
	        String finalContent = jsonContent.replaceAll("\r\n", "");
	        return finalContent.toString();
	    }  
	    
	    /**
	     * 将文本转换成JSON格式的字符串
	     * @param content
	     * @return
	     */
	    public static String getTansferContent(String content) {
	    	String trim = content.replace("<br/>","").trim();
	    	String article = trim.replace("<p>", "").replaceAll("</p>", ",").trim();
//	    	String delHTMLTag = delHTMLTag(article);
//	    	String replaceHTML = delHTMLTag.replace("#", "#");
//	    	String[] HTMLTag = replaceHTML.split(",");
//	    	String jsonContent = JSON.toJSONString(HTMLTag);
//	    	String finalContent = jsonContent.replaceAll("\r\n", "");
	    	return article.toString();
	    }  
	    
	    public static String delHTMLTag(String htmlStr){ 
	        String regEx_script="<script[^>]*?>[\\s\\S]*?<\\/script>"; //定义script的正则表达式 
	        String regEx_style="<style[^>]*?>[\\s\\S]*?<\\/style>"; //定义style的正则表达式 
	        String regEx_html="<[^>]+>"; //定义HTML标签的正则表达式 
	         
	        Pattern p_script=Pattern.compile(regEx_script,Pattern.CASE_INSENSITIVE); 
	        Matcher m_script=p_script.matcher(htmlStr); 
	        htmlStr=m_script.replaceAll(""); //过滤script标签 
	         
	        Pattern p_style=Pattern.compile(regEx_style,Pattern.CASE_INSENSITIVE); 
	        Matcher m_style=p_style.matcher(htmlStr); 
	        htmlStr=m_style.replaceAll(""); //过滤style标签 
	         
	        Pattern p_html=Pattern.compile(regEx_html,Pattern.CASE_INSENSITIVE); 
	        Matcher m_html=p_html.matcher(htmlStr); 
	        htmlStr=m_html.replaceAll(""); //过滤html标签 

	        return htmlStr.trim(); //返回文本字符串 
	    } 
	    
	    /** 
	     * 得到网页中图片的地址 
	     * @param sets html字符串 
	     */  
	    public static  Set<String> getImgStr(String htmlStr) {  
	        Set<String> pics = new HashSet<String>();  
	        String img = "";  
	        Pattern p_image;  
	        Matcher m_image;  
	        String regEx_img = "<img.*src\\s*=\\s*(.*?)[^>]*?>";  
	        p_image = Pattern.compile(regEx_img, Pattern.CASE_INSENSITIVE);  
	        m_image = p_image.matcher(htmlStr);  
	        while (m_image.find()) {  
	            // 得到<img />数据  
	            img = m_image.group();  
	            // 匹配<img>中的src数据  
	            Matcher m = Pattern.compile("src\\s*=\\s*\"?(.*?)(\"|>|\\s+)").matcher(img);  
	            while (m.find()) {  
	                pics.add(m.group(1).trim());  
	            }  
	        }  
	        return pics;  
	    }  
	    
	    
	    
}
