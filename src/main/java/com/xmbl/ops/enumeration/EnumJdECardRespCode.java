package com.xmbl.ops.enumeration;

public enum EnumJdECardRespCode {
		JD_ECARD_SUCC(1000,"1000","jd_ecard_succ","获取订单成功"),
		JD_ECARD_QUERY_ORDER_ERR(1001 ,"1001","jd_ecard_query_order_err","获取订单失败，请稍后再试"),
		JD_ECARD_NO_MONEY_ERR(1002 ,"1002","jd_ecard_no_money_err","余额不足，请充值"),
		JD_ECARD_USER_AUTHENTICATION_ERR(1301 ,"1301","jd_ecard_user_authentication_err","用户身份验证失败"),
		JD_ECARD_NO_PARAM_ERR(1302 ,"1302","jd_ecard_no_param_err","参数不可为空"),
		JD_ECARD_QUERY_PARAM_TYPE_ERR(1303 ,"1303","jd_ecard_query_param_type_err","参数类型有误")
		;
		private EnumJdECardRespCode(int id, String numcode, String wordcode, String desc) {
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
