package com.xmbl.ops.util;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;



/**
 * 类EncodeUtil.java的实现描述：字符串加密解密类
 * 
 */
public class EncryptUtil {


    private static String       strDefaultKey = "xuexibao";
    /** 加密工具 */
    private Cipher              encryptCipher = null;
    /** 解密工具 */
    private Cipher              decryptCipher = null;

    /**
     * 将byte数组转换为表示16进制值的字符串， 如：byte[]{8,18}转换为：0813， 和public static byte[] hexStr2ByteArr(String strIn) 互为可逆的转换过程
     * 
     * @param arrB 需要转换的byte数组
     * @return 转换后的字符串
     * @throws Exception
     */
    public static String byteArr2HexStr(byte[] arrB) throws Exception {
        int iLen = arrB.length;
        // 每个byte用两个字符才能表示，所以字符串的长度是数组长度的两倍
        StringBuffer sb = new StringBuffer(iLen * 2);
        for (int i = 0; i < iLen; i++) {
            int intTmp = arrB[i];
            // 把负数转换为正数
            while (intTmp < 0) {
                intTmp = intTmp + 256;
            }
            // 小于0F的数需要在前面补0
            if (intTmp < 16) {
                sb.append("0");
            }
            sb.append(Integer.toString(intTmp, 16));
        }
        return sb.toString();
    }

    /**
     * 将表示16进制值的字符串转换为byte数组， 和public static String byteArr2HexStr(byte[] arrB) 互为可逆的转换过程
     * 
     * @param strIn 需要转换的字符串
     * @return 转换后的byte数组
     * @throws Exception
     */
    public static byte[] hexStr2ByteArr(String strIn) throws Exception {
        byte[] arrB = strIn.getBytes();
        int iLen = arrB.length;
        // 两个字符表示一个字节，所以字节数组长度是字符串长度除以2
        byte[] arrOut = new byte[iLen / 2];
        for (int i = 0; i < iLen; i = i + 2) {
            String strTmp = new String(arrB, i, 2);
            arrOut[i / 2] = (byte) Integer.parseInt(strTmp, 16);
        }
        return arrOut;
    }

    /**
     * 默认构造方法，使用默认密钥
     * 
     * @throws Exception
     */
    public EncryptUtil(){
        this(strDefaultKey);
    }

    /**
     * 指定密钥构造方法
     * 
     * @param strKey 指定的密钥
     * @throws Exception
     */

	public EncryptUtil(String strKey){
        try {
            SecretKey secretKey = new SecretKeySpec(strKey.getBytes(), "DES");  
            encryptCipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
            encryptCipher.init(Cipher.ENCRYPT_MODE, secretKey);
            decryptCipher = Cipher.getInstance("DES/ECB/PKCS5Padding");
            decryptCipher.init(Cipher.DECRYPT_MODE, secretKey);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /**
     * 加密字节数组
     * 
     * @param arrB 需加密的字节数组
     * @return 加密后的字节数组
     * @throws Exception
     */
    public byte[] encrypt(byte[] arrB) throws Exception {

        try {
            return encryptCipher.doFinal(arrB);
        } catch (Exception ex) {
        }
        return null;
    }

    /**
     * 加密字符串
     * 
     * @param strIn 需加密的字符串
     * @return 加密后的字符串
     * @throws Exception
     */
    public String encrypt(String strIn) {
        try {
            return byteArr2HexStr(encrypt(strIn.getBytes()));
        } catch (Exception ex) {
        }
        return "";
    }

    /**
     * 解密字节数组
     * 
     * @param arrB 需解密的字节数组
     * @return 解密后的字节数组
     * @throws Exception
     */
    public byte[] decrypt(byte[] arrB) throws Exception {
        try {
            return decryptCipher.doFinal(arrB);
        } catch (Exception ex) {
        }
        return null;
    }

    /**
     * 解密字符串
     * 
     * @param strIn 需解密的字符串
     * @return 解密后的字符串
     * @throws Exception
     */
    public String decrypt(String strIn) {
        try {
            return new String(decrypt(hexStr2ByteArr(strIn)));
        } catch (Exception ex) {
        }
        return "";
    }
    
    public static void main(String[] args) {
    	EncryptUtil util= new EncryptUtil();
    	String aaa="91xuexibao.com&t=1000";
    	String encode = util.encrypt(aaa);
    	System.out.println(encode);
    	System.out.println(util.decrypt(encode));
	}
}