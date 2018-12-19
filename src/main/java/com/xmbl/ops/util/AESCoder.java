package com.xmbl.ops.util;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.*;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;

public class AESCoder {
	 
	private static final String KEY_ALGORITHM = "AES";
	
	private static final String CIPHER_ALGORITHM = "AES/CBC/PKCS5Padding";
	
	private static final String IV_PARAMETER = "0102030405060708";
 
	private static Key toKey(byte[] key) {
		// 实例化aes 迷药材料
		SecretKey secretKey = new SecretKeySpec(key, KEY_ALGORITHM);
		return secretKey;
	}
 
	public static byte[] decrypt(byte[] data, byte[] key)
			throws NoSuchAlgorithmException, NoSuchPaddingException,
			InvalidKeyException, IllegalBlockSizeException, BadPaddingException, NoSuchProviderException, InvalidAlgorithmParameterException {
		// 还原密钥
		Key k = toKey(key);
		Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
		IvParameterSpec iv = new IvParameterSpec(IV_PARAMETER.getBytes());//使用CBC模式，需要一个向量iv，可增加加密算法的强度
		// 初始化,解密模式
		cipher.init(Cipher.DECRYPT_MODE, k, iv);
		// 执行操作
		return cipher.doFinal(data);
	}
	public static byte[] encrypt(byte[] data, byte[] key)
			throws NoSuchAlgorithmException, NoSuchPaddingException,
			IllegalBlockSizeException, BadPaddingException, InvalidKeyException, NoSuchProviderException, InvalidAlgorithmParameterException {
		Key k = toKey(key);
		Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
		IvParameterSpec iv = new IvParameterSpec(IV_PARAMETER.getBytes());
		cipher.init(Cipher.ENCRYPT_MODE, k, iv);
		return cipher.doFinal(data);
	}
 
	/**
	 * 生成密钥
	 * 
	 * @return
	 * @throws NoSuchAlgorithmException
	 */
	public static byte[] initKey() throws NoSuchAlgorithmException {
		// 实例化
		KeyGenerator kg = KeyGenerator.getInstance(KEY_ALGORITHM);
		// aes要求密钥 长度 128位,192位,或者256
		kg.init(128);
		// 生成密钥
		SecretKey secretKey = kg.generateKey();
		// 获取密钥的二进制编码形式
		return secretKey.getEncoded();
	}
 
	public static void main(String[] args) throws NoSuchAlgorithmException,
			InvalidKeyException, NoSuchPaddingException,
			IllegalBlockSizeException, BadPaddingException, NoSuchProviderException, InvalidAlgorithmParameterException {
		String inputStr = "11";
		byte[] inputData = inputStr.getBytes();
 
		System.out.println("原文:\t" + inputStr);
		byte[] key = Base64.decodeBase64("8RS1/JPA7MvjaBTMlQlgeQ==");
		System.out.println("密钥:\t" + Base64.encodeBase64String(key));
		// 加密
		inputData = AESCoder.encrypt(inputData, key);
		System.out.println("加密后:\t" + Base64.encodeBase64String(inputData));
		// 解密
		byte[] outputData = AESCoder.decrypt(inputData, key);
		System.out.println("解密后:\t" + new String(outputData));
	}
}
