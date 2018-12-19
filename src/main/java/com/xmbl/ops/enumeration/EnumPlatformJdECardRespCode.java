package com.xmbl.ops.enumeration;

public enum EnumPlatformJdECardRespCode {
		JD_ECARD_PLATFORM_INIT(100,"100","jd_ecard_platform_init","平台购买初始化开始"),
		JD_ECARD_PLATFORM_START(200 ,"200","jd_ecard_platform_start","向京东e卡平台购买开始"),
		JD_ECARD_PLATFORM_BUY_ERR(201 ,"201","jd_ecard_platform_buy_err","购买京东e卡失败"),
		JD_ECARD_PLATFORM_QUERY_ERR(202 ,"202","jd_ecard_platform_query_err","购买京东e卡,记录查询出错了"),
		JD_ECARD_PLATFORM_BUY_SUCC(300 ,"300","jd_ecard_platform_buy_succ","购买e卡,下单成功")
		;
		private EnumPlatformJdECardRespCode(int id, String numcode, String wordcode, String desc) {
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
