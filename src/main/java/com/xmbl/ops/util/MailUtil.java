package com.xmbl.ops.util;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Properties;


public class MailUtil {
	public static String email_username = "xmbladmin@163.com";
	public static String email_password = "xmbl123456";
	
	public static String EMAIL_USERNAME = "xmbladmin@163.com";
	public static String EMAIL_PASSWORD = "xmbl123456";
	
	public void setEmail_username(String email_username) {
		MailUtil.email_username = email_username;
		EMAIL_USERNAME = MailUtil.email_username;
	}
	
	public void setEmail_password(String email_password) {
		MailUtil.email_password = email_password;
		EMAIL_PASSWORD = MailUtil.email_password;
	}
	
  public static final String HOST = "smtp.163.com";  
  public static final String PROTOCOL = "smtp";     
  public static final int PORT = 25;  
//  public static final String FROM = EMAIL_USERNAME;//发件人的email  
//  public static final String PWD = EMAIL_PASSWORD;//发件人密码   
//  public static final String FROM = "xmbladmin@163.com";//发件人的email  
//  public static final String PWD = "xmbl123456";//发件人密码  
  /** 
   * 获取Session 
   * @return 
   */  
  private static Session getSession() {  
      Properties props = new Properties();  
      props.put("mail.smtp.host", HOST);//设置服务器地址  
      props.put("mail.store.protocol" , PROTOCOL);//设置协议  
      props.put("mail.smtp.port", PORT);//设置端口  
      props.put("mail.smtp.auth" , true);  
        
      Authenticator authenticator = new Authenticator() {  

          @Override  
          protected PasswordAuthentication getPasswordAuthentication() {  
              return new PasswordAuthentication(EMAIL_USERNAME, EMAIL_PASSWORD);  
          }  
            
      };  
      Session session = Session.getDefaultInstance(props , authenticator);  
        
      return session;  
  }  
    
  public static void send(String toEmail , String content, String subject) {  
      Session session = getSession();  
      try {  
          System.out.println("--send--"+content);  
          // Instantiate a message  
          Message msg = new MimeMessage(session);  
          //Set message attributes  
          msg.setFrom(new InternetAddress(EMAIL_USERNAME));  
          InternetAddress[] address = {new InternetAddress(toEmail)};  
          msg.setRecipients(Message.RecipientType.TO, address);  
//          msg.setSubject("账号激活邮件");
          msg.setSubject(subject);
          msg.setSentDate(new Date());  
          msg.setContent(content , "text/html;charset=utf-8");  
 
          //Send the message  
          Transport.send(msg);  
      }  
      catch (MessagingException mex) {  
          mex.printStackTrace();  
      }  
  } 
}
