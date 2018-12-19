package com.xmbl.ops.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.annotation.Immutable;
import org.springframework.context.annotation.Configuration;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Copyright © 2018 noseparte © BeiJing BoLuo Network Technology Co. Ltd.
 *
 * @Author Noseparte
 * @Compile --
 * @Version 1.0
 * @Description     APP用户登录解决方案——JWT（java web token）生成Token
 *
 * {@Link https://blog.csdn.net/weixin_37162010/article/details/80210993}
 */
@Slf4j
@Immutable
@Configuration
public class LoginTokenConfig {

    /** token秘钥，请勿泄露，请勿随便修改 backups:JKKLJOoasdlfj */
    public static final String SECRET = "JKKLJOoasdlfj";
    /** token 过期时间: 10天 */
    public static final int calendarField = Calendar.DATE;
    public static final int calendarInterval = 10;


    /**
     * JWT生成Token.<br/>
     *
     * JWT构成: header, payload, signature
     *
     * @param userkey
     *              登录成功后用户userkey, 参数userkey不可传空
     * @return
     */
    public static String createToken(String userkey){
        try{
            Date iatDate = new Date();
            // expire time
            Calendar nowTime = Calendar.getInstance();
            nowTime.add(calendarField, calendarInterval);
            Date expiresDate = nowTime.getTime();

            // header Map
            Map<String, Object> map = new HashMap<>();
            map.put("alg", "HS256");
            map.put("typ", "JWT");

            // build token
            // param backups {iss:Service, aud:APP}
            String token = JWT.create().withHeader(map) // header
                    .withClaim("iss", "Service") // payload
                    .withClaim("aud", "APP")
                    .withClaim("userkey", userkey)
                    .withIssuedAt(iatDate) // sign time
                    .withExpiresAt(expiresDate) // expire time
                    .sign(Algorithm.HMAC256(SECRET)); // signature

            return token;
        }catch (Exception e){
            log.error("创建用户token失败");
        }
        return "";
    }

    /**
     * 解密Token
     *
     * @param token
     * @return
     * @throws Exception
     */
    public static Map<String, Claim> verifyToken(String token) {
        DecodedJWT jwt = null;
        try {
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET)).build();
            jwt = verifier.verify(token);
        } catch (Exception e) {
            // e.printStackTrace();
            log.error("token 校验失败, 抛出Token验证非法异常,errorMsg,{}", e.getMessage());
        }
        return jwt.getClaims();
    }

    /**
     * 根据Token获取userkey
     *
     * @param token
     * @return userkey
     */
    public static Long getAppUID(String token) {
        Map<String, Claim> claims = verifyToken(token);
        Claim userkey_claim = claims.get("userkey");
        if (null == userkey_claim || StringUtils.isEmpty(userkey_claim.asString())) {
            // token 校验失败, 抛出Token验证非法异常
        }
        return Long.valueOf(userkey_claim.asString());
    }

}
