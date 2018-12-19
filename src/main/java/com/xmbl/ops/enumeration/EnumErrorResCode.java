package com.xmbl.ops.enumeration;

public enum EnumErrorResCode {
	SUCCESSFUL(0), SERVER_SUCCESS(2),SERVER_ERROR(-1),
	NOUSER(3), EXITIN(4),ISOUT(5),
	ONEIN(6), EXITOUT(7),NOORGANIZATION(8);

	private EnumErrorResCode(int status) {
		this.status = status;
	}

	private int status;

    public int value() {
		return status;
	}
}
