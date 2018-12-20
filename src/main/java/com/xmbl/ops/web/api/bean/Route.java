package com.xmbl.ops.web.api.bean;

import org.apache.http.annotation.Immutable;

/**
 * 路由链接管理类
 */
@Immutable
public class Route {

    public final static String PATH = "/api";
    public final static String APP_PATH = "/app";

    public final static String OPEN_LOGIN = "/open_login";
    public final static String BIND_USER_PHONE = "/bind_user_phone";
    public final static String BIND_OPEN_ACCOUNT = "/bind_open_account";



    /**
     * 用户管理i
     */
    public class User {
        public final static String PATH = "/user";

        public final static String TO_USER_LIST = "/to_user_list";
        public final static String TO_USER_SAVE_OR_UPDATE = "/to_user_save_or_update";
        public final static String USER_LIST = "/user_list";
        public final static String USER_DELETE = "/del";
        public final static String YES_OR_NO = "/yesOrNo";                            //禁用 or 启用
    }

    /**
     * 课程管理
     */
    public class Course {
        public final static String PATH = "/course";

        public final static String GET_ACAGEMY_VIEW = "/get_acagemy_view";
        public final static String GET_ACAGEMY_LIST = "/get_acagemy_list";
        public final static String TO_ACAGEMY_ADD = "/to_acagemy_add";
        public final static String SPECIALTY_TYPE_EDIT = "/specialty_type_edit";
        public final static String GET_SPECIALTY_TYPE_EDIT = "/get_specialty_type_edit";
        public final static String UEDITOR_LOADING = "/ueditor_loading";
        public final static String GET_COURSE_TYPE_LIST = "/get_course_type_list";
        public final static String GET_SPECIALTY_TYPE_LIST = "/get_specialty_type_list";
        public final static String GET_SPECIALTY_LIST = "/get_specialty_list";
        public final static String SPECIALTY_TYPE_ADD = "/specialty_type_add";
        public final static String SPECIALTY_TYPE_DELETE = "/specialty_type_delete";

        public final static String TO_SPECIALTY_LIST_VIEW = "/to_specialty_list_view";
        public final static String TO_SPECIALTY_TYPE_ADD_VIEW = "/to_specialty_add_view";
        public final static String TO_SPECIALTY_TYPE_LIST_VIEW = "/to_specialty_type_list_view";


        public final static String TO_COURSE_TYPE_LIST_VIEW = "/to_course_type_list_view";
        public final static String TO_COURSE_TYPE_LIST_ADD = "/to_course_type_list_add";
        public final static String ADD_COURSE_TYPE = "/add_course_type";
        public final static String DELETE_COURSE_TYPE = "/delete_course_type";
        public final static String TO_COURSE_TYPE_LIST_EDIT = "/to_course_type_list_edit";
        public final static String EDIT_COURSE_TYPE = "/edit_course_type";


    }




     /**
     * 举报接口链接
     */
    public class Util {
        public final static String PATH = "/util";

        public final static String SEND_MESSAGE = "/send_message";                //用户实名认证
    }


    /**
     * 财务管理
     */
    public class Payment {

        public static final String PATH = "/pay";

        public static final String TO_BANK_MANAGEMENT = "/to_bank_management";                //跳转银行列表页
        public static final String TO_THIRD_PAY_MANAGEMENT = "/to_third_pay_management";    //跳转银行列表页
        public static final String TO_BANK_ADD = "/to_bank_add";                            //跳转平台银行新增页
        public static final String TO_THIRD_PAY_ADD = "/to_third_pay_add";                    //跳转第三方支付新增页
        public static final String TO_THIRD_PAY_UPDATE = "/to_third_pay_update";            //跳转第三方支付信息修改页

        public static final String GET_BANK_LIST = "/get_bank_list";                        //获取平台银行列表
        public static final String GET_THIRD_PAY_LIST = "/get_third_pay_list";                //获取第三方支付列表
        public static final String ADD_BANK = "/add_bank";                                    //平台银行新增
        public static final String ADD_THIRD_PAY = "/add_third_pay";                        //第三方支付新增
        public static final String EDIT_THIRD_PAY = "/edit_third_pay";                        //第三方支付修改

    }



}
