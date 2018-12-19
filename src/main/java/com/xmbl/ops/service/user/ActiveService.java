package com.xmbl.ops.service.user;

import com.xmbl.ops.dao.user.impl.UserDaoImpl;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
@Service
public class ActiveService {

	@Resource
	UserDaoImpl userDao;   

    /** 
     * 处理邮箱激活 
     * @throws ParseException  
     */  
      ///传递激活码和email过来  
    public void processActivate(String email , String validateCode)throws ServiceException{    
         //数据访问层，通过email获取用户信息  
//        UserModel user=userDao.find(email);  
//        //验证用户是否存在   
//        if(user!=null) {    
//            //验证用户激活状态    
//            if(user.getStatus()==0) {   
//                ///没激活  
//                Date currentTime = new Date();//获取当前时间    
//                //验证链接是否过期   
//                currentTime.before(user.getRegisterTime());  
//                if(currentTime.before(user.getLastActivateTime())) {    
//                    //验证激活码是否正确    
//                    if(validateCode.equals(user.getValidateCode())) {    
//                        //激活成功， //并更新用户的激活状态，为已激活   
//                        System.out.println("==sq==="+user.getStatus());  
//                        user.setStatus(1);//把状态改为激活  
//                        System.out.println("==sh==="+user.getStatus());  
//                        userDao.update(user);  
//                    } else {    
//                       throw new ServiceException("激活码不正确");    
//                    }    
//                } else { throw new ServiceException("激活码已过期！");    
//                }    
//            } else {  
//               throw new ServiceException("邮箱已激活，请登录！");    
//            }    
//        } else {  
//            throw new ServiceException("该邮箱未注册（邮箱地址不存在）！");    
//        }    
//            
    }   
  
}  
