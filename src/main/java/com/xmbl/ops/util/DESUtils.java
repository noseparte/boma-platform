package com.xmbl.ops.util;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import java.security.Key;
import java.security.SecureRandom;

/**
 * 
 * Copyright © 2017 noseparte(Libra) © Like the wind, like rain
 * @Author Noseparte
 * @Compile 2017年10月30日 -- 上午8:20:43
 * @Version 1.0
 * @Description	数据库加密工具
 */
public class DESUtils {

	private static Key key;
	private static String KEY_STR = "41ED0A742D7DAA5D45F84708C2792158";

	static {
		try {
			KeyGenerator generator = KeyGenerator.getInstance("DES");
			SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");
			secureRandom.setSeed(KEY_STR.getBytes());
			generator.init(secureRandom);
			key = generator.generateKey();
			generator = null;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 对字符串进行加密，返回BASE64的加密字符串 <功能详细描述>
	 * 
	 * @param str
	 * @return
	 * @see [类、类#方法、类#成员]
	 */
	public static String getEncryptString(String str) {
		BASE64Encoder base64Encoder = new BASE64Encoder();
//		System.out.println(key);
		try {
			byte[] strBytes = str.getBytes("UTF-8");
			Cipher cipher = Cipher.getInstance("DES");
			cipher.init(Cipher.ENCRYPT_MODE, key);
			byte[] encryptStrBytes = cipher.doFinal(strBytes);
			return base64Encoder.encode(encryptStrBytes);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

	}

	/**
	 * 对BASE64加密字符串进行解密 <功能详细描述>
	 * 
	 * @param str
	 * @return
	 * @see [类、类#方法、类#成员]
	 */
	public static String getDecryptString(String str) {
		BASE64Decoder base64Decoder = new BASE64Decoder();
		try {
			byte[] strBytes = base64Decoder.decodeBuffer(str);
			Cipher cipher = Cipher.getInstance("DES");
			cipher.init(Cipher.DECRYPT_MODE, key);
			byte[] encryptStrBytes = cipher.doFinal(strBytes);
			return new String(encryptStrBytes, "UTF-8");
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

	}

	public static void main(String[] args) {
		String name = "root";
		String password = "Xunxin@1204";
		String secrect = "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";
//		String encode2hex = MD5Util.encode2hex(secrect);
//		System.out.println(encode2hex);
		
		String encryname = getEncryptString(name);
		String encrypassword = getEncryptString(password);
		String encryensecrect = getEncryptString(secrect);
		System.out.println(encryname);
		System.out.println(encrypassword);
		System.out.println(encryensecrect);

		System.out.println(getDecryptString(encryname));
		System.out.println(getDecryptString(encrypassword));
	}

}
