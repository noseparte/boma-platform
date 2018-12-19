package com.xmbl.ops.enumeration;

//id  物品（虚拟币10:1）  首冲奖励  花费（人民币） 
public enum EnumSevnePayGoodsCode {
	GOODS11		(-1, "0.01", "测试", "测试"),
	GOODS00		(0, "0.01", "ceshi", "ceshi"),
	GOODS01		(1, "1", "60", "60"),
	GOODS02		(2, "1", "180", "180"),
	GOODS03		(3, "1", "300", "300"),
	GOODS04		(4, "1", "1280", "1280"),
	GOODS05		(5, "1", "2560", "2560"),
	GOODS06		(6, "1", "3240", "3240");

	private EnumSevnePayGoodsCode(int goodsId, String price, String description, String prodName) {
		this.goodsId = goodsId;
		this.price = price;
		this.description = description;
		this.prodName = prodName;
	}
	
	private int goodsId;
	private String price;
	private String description;
	private String prodName;
	
	// getter and setter
	private EnumSevnePayGoodsCode getEnumSevnePayGoodsCodeByGoodsId(int goodsId) {
		for(EnumSevnePayGoodsCode goods : EnumSevnePayGoodsCode.values()) {
			if(goodsId == goods.getGoodsId()) {
				return goods;
			}
		}
		return null;
	}
	
	public int getGoodsId() {
		return goodsId;
	}
	public String getPrice() {
		return price;
	}
	public String getPrice(int goodsId) {
		EnumSevnePayGoodsCode enumSevnePayGoodsCode = getEnumSevnePayGoodsCodeByGoodsId(goodsId);
		if(enumSevnePayGoodsCode == null){
			return null;
		}
		return enumSevnePayGoodsCode.getPrice();
	}
	public String getDescription() {
		return description;
	}
	public String getDescription(int goodsId) {
		EnumSevnePayGoodsCode enumSevnePayGoodsCode = getEnumSevnePayGoodsCodeByGoodsId(goodsId);
		if(enumSevnePayGoodsCode == null){
			return null;
		}
		return enumSevnePayGoodsCode.getDescription();
	}
	public String getProdName() {
		return prodName;
	}
	public String getProdName(int goodsId) {
		EnumSevnePayGoodsCode enumSevnePayGoodsCode = getEnumSevnePayGoodsCodeByGoodsId(goodsId);
		if(enumSevnePayGoodsCode == null){
			return null;
		}
		return enumSevnePayGoodsCode.getProdName();
	}
	
}
