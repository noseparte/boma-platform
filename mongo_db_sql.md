数据库表设计


一、用户管理 app
	1.学生 AppUser(bm_app_user)
		String id;							  //用户ID	
		String accountid;                     //用户accountid
		String userkey;                   	  //用户标识符userkey
		String password;                      //用户密码
		String playername;                	  //院校地址
		String mobile;                        //院校图片
		Integer status;                  	  //用户状态
		Integer logincnt                      //登录次数
		Boolean isDelete;
		Date createTime;
	2.代理 AgencyEntity(bm_app_agency)
		String id;							  //用户ID	
		String accountid;                     //用户accountid
		String userkey;                   	  //用户标识符userkey
		String password;                      //用户密码
		String playername;                	  //院校地址
		String mobile;                        //院校图片
		Integer status;                  	  //用户状态
		Integer logincnt                      //登录次数
		Boolean isDelete;
		Date createTime;
	3.报名材料 ApplicationMaterials(bm_app_materials)
		String id;							  //用户ID	
		String userkey;                   	  //用户标识符userkey
		String specialtyId;                   //专业ID
		String specialty_type;                //专业类型
		String course_level;                  //层次ID
		Integer status;                  	  //用户状态
		Boolean isDelete;
		Date createTime;
	4.移动端用户第三方信息 UserInfoData(bm_app_user_info_data)
		String id;							  //用户ID	
		String openId;						  //第三方用户token
		String openType;					  //第三方类型 {"腾讯":"Tencent","微信":"WeChat"}
		int openState;						  //是否绑定
		String openRemark;					  //备注
		Date bindTime;						  //绑定时间
		int is_delete;						  //是否删除
		String userkey;						  //用户
		Boolean isDelete;
		Date createTime;
		
二、课程管理 edu 
	1.院校 AcademyEntity(bm_edu_cademy)
		String id;							  //院校ID	
		String academyName;                   //院校名称
		String academyCode;                   //院校编号
		String academyDec;                    //院校简介
		String academyAddress;                //院校地址
		String academyUrl;                    //院校图片
		String academyPhone;                  //院校电话
		int academyState;                     //院校状态
		Boolean isDelete;
		Date createTime;
	2.专业 SpecialtyEntity(bm_edu_specialty)
		String id;
		String specialtyName;                 //专业名称
		int specialtyCode;                    //专业编号
		String specialtyDec;                  //专业描述
		Date applyTime;                       //报名时间
		String examTime;                      //考试时间
		String checkWeb;                      //查询网站
		String period;                        //周期
		int specialtyState;                   //专业状态  0 正常 1 暂停
		Date applyEndTime;                    //报名截止时间
		String academyId;                     //院校id
		Boolean isDelete;
		Date createTime;
	3.专业类型 SpecialtyType(bm_edu_specialty_type)
		String id;
		String eduLevel;					  //专业类型	
		String code;						  //编号	
		int sort;							  //序号	
		int type;               			  //类型
		int state;							  //状态  0 正常 1 暂停	
		Boolean isDelete;
		Date createTime;
	4.课程类型 CourseType(bm_edu_course_type)
		String id;
		String courseName;              	  //课程名称
		int courseType;                       //课程类型 1.精品 2.VIP
		Boolean isDelete;
		Date createTime;
	5.课程层次 CourseLevelEntity(bm_edu_course_level)
		String id;
		int level;                            //层级
		String levelName;                     //层级名称
		String levelCode;                     //层级编号
		String levelDec;                      //层级描述
		Boolean isDelete;
		Date createTime;
	6.费用 ExpenseEntity(bm_edu_expense)
		String id;
		String cost;                         // 费用
		int periods;                         // 1.全款或期数
		double per_price;                    // 每期多少钱
		coure_type_id;                		 // 课程类型
		String specialtyId;                  // 专业id
		String academyId;                    // 院校id
		String specialty_type_id;            // 课程类型
		Boolean isDelete;
		Date createTime;
三、财务管理 pay
	1.银行管理 Bank(bm_pay_bank)
		String id;							  //银行id
		String bank_name;					  //银行名称
		String bank_code;					  //银行代码
		String bank_url;				   	  //银行网关
		Boolean isDelete;
		Date createTime;	
	2.订单管理 Order(bm_pay_order)
		String id;
		Long playerId; 						  // 用户ID
		String accountId;					  // 账号ID
		String userKey; 					  // 登录名
		String orderNo; 					  // 订单编号,流水号
		int orderType; 						  // 订单类型 1.支付宝 | 2.微信
		int payType; 						  // 支付类型  全款、分期
		int periods; 					  	  // 期数 
		Date orderAccountingTime; 			  // 到账时间
		int orderState; 					  // 订单状态 0:已到账 | 1:未到账
		String remark;                        // 备注
		Boolean isDelete;
		Date createTime;
	3.支付管理 ThirdPayBean(bm_pay_third_pay)
		String id;					  		  //渠道ID
		String third_name;					  //第三方支付名称
		String third_type;					  //第三方支付类型
		String mer_no;						  //商户号
		String mer_key;						  //商户秘钥(公|私)
		String return_url;					  //异步通知地址	
		Boolean isDelete;
		Date createTime;
四、数据管理 data
	1.APP下载量 AppDownloads(bm_data_app_downloads)
		String id;							  //
		Boolean isDelete;
		Date createTime;	
	2.用户登录记录 LoginRecord(bm_data_login_record)
		String id;							  //
		Boolean isDelete;
		Date createTime;	
	3.代理转发记录 AgencyTranspondRecord(bm_data_agency_transpond_record)
		String id;							  //
		Boolean isDelete;
		Date createTime;	
	4.代理收入情况 AgencyIncomeRecord(bm_data_agency_inome_record)
		String id;							  //
		Boolean isDelete;
		Date createTime;	
	5.腾讯云短信记录 Message(bm_data_message)
		String id;							  //短信ID
		String code;						  //验证码			
		String phoneNumber;					  //手机号		
		int type;					  		  //类型 1.注册 2.找回密码  .....	
		Date sendTime;						  //发送时间	
		Date overTime;						  //过期时间	
		int status;							  //状态 0.可用 1.不可用	
		Boolean isDelete;
		Date createTime;	

