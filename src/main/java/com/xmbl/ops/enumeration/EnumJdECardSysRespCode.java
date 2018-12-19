package com.xmbl.ops.enumeration;

public enum EnumJdECardSysRespCode {
		JD_ECARD_SYS_SUCC(10000,"10000","jd_ecard_sys_succ","查询成功"),
		JD_ECARD_SYS_APPKEY_ERR(10001,"10001","jd_ecard_sys_appkey_err","错误的请求appkey"),
		JD_ECARD_SYS_NODATA_ERR(10003,"10003","jd_ecard_sys_nodata_err","不存在相应的数据信息"),
		JD_ECARD_SYS_NO_APPKEY_ERR(10004,"10004","jd_ecard_sys_no_appkey_err","URL上appkey参数不能为空"),
		JD_ECARD_SYS_NO_BALANCE_ERR(10010,"10010","jd_ecard_sys_no_balance_err","接口需要付费，请充值"),
		JD_ECARD_SYS_BUSY_ERR(10020,"10020","jd_ecard_sys_busy_err","万象系统繁忙，请稍后再试"),
		JD_ECARD_SYS_FAIL_ERR(10030 ,"10030","jd_ecard_sys_fail_err","调用万象网关失败， 请与万象联系"),
		JD_ECARD_SYS_TOO_MANY_ERR(10040  ,"10040","jd_ecard_sys_too_many_err","超过每天限量，请明天继续"),
		JD_ECARD_SYS_USER_DISABLE_ERR(10050 ,"10050","jd_ecard_sys_user_disable_err","用户已被禁用"),
		JD_ECARD_SYS_HAS_ROLE_ERR(10060 ,"10060","jd_ecard_sys_has_role_err","提供方设置调用权限，请联系提供方"),
		JD_ECARD_SYS_NO_COMPANY_ERR(10070 ,"10070","jd_ecard_sys_no_company_err","该数据只允许企业用户调用"),
		JD_ECARD_SYS_FILE_TOO_BIG_ERR(10090 ,"10090","jd_ecard_sys_file_too_big_err","文件大小超限，请上传小于1M的文件"),
		JD_ECARD_SYS_MER_IFACE_ERR(11010,"11010","jd_ecard_sys_mer_iface_err","商家接口调用异常，请稍后再试"),
		JD_ECARD_SYS_MER_IFACE_REPONSE_ERR(11030,"11030","jd_ecard_sys_mer_iface_reponse_err","商家接口返回格式有误")
		;
		private EnumJdECardSysRespCode(int id, String numcode, String wordcode, String desc) {
			this.id = id;
			this.numcode = numcode;
			this.wordcode = wordcode;
			this.desc = desc;
		}
		private int id;
		private String numcode;
		private String wordcode;
		private String desc;
		
		public int getId() {
			return id;
		}
		public void setId(int id) {
			this.id = id;
		}
		public String getNumcode() {
			return numcode;
		}
		public void setNumcode(String numcode) {
			this.numcode = numcode;
		}
		public String getWordcode() {
			return wordcode;
		}
		public void setWordcode(String wordcode) {
			this.wordcode = wordcode;
		}
		public String getDesc() {
			return desc;
		}
		public void setDesc(String desc) {
			this.desc = desc;
		}
}
