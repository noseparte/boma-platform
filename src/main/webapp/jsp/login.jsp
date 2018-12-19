<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<!DOCTYPE html>
<html lang="zh-CN">
<%@ include file="/jsp/inc/version.jsp"%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta charset="utf-8">
<title>UGC平台管理系统</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="keywords" content="">
<meta name="author" content="">
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<link rel="shortcut icon" href="<%=basePath%>image/logo/favicon.ico">
<script type="text/javascript">
	var basePath = '<%=basePath%>';
	(function(){MX=window.MX||{};var g=function(a,c){for(var b in c)a.setAttribute(b,c[b])};MX.load=function(a){var c=a.js,b=c?".js":".css",d=-1==location.search.indexOf("jsDebug"),e=a.js||a.css;-1==e.indexOf("http://")?(e=(a.path||window.basePath)+((c?"js/":"css/")+e)+(!d&&!c?".source":""),b=e+(a.version?"_"+a.version:"")+b):b=e;d||(d=b.split("#"),b=d[0],b=b+(-1!=b.indexOf("?")?"&":"?")+"r="+Math.random(),d[1]&&(b=b+"#"+d[1]));if(c){var c=b,h=a.success,f=document.createElement("script");f.onload=function(){h&&h();f=null};g(f,{type:"text/javascript",src:c,async:"true"});document.getElementsByTagName("head")[0].appendChild(f)}else{var c=b,i=a.success,a=document.createElement("link");g(a,{rel:"stylesheet"});document.getElementsByTagName("head")[0].appendChild(a);g(a,{href:c});i&&(a.onload=function(){i()})}}})();
	</script>
<link href="<%=basePath%>css/bootstrap/bootstrap.3.3.5.min.css"
	rel="stylesheet">
<link href="<%=basePath %>css/common_${ CSS_COMMON_VERSION }.css"
	rel="stylesheet">
<!-- 引用样式文件开始 -->
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/css/common-all-plugin.css">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/css/common.css">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/css/login.css">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/hplus/css/font-awesome.css">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/hplus/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/hplus/css/animate.min.css">
<!-- 引用样式文件结束 -->

<!-- 引用脚本文件开始-->
<script type="text/javascript" src="<%=basePath%>js/config.js"></script>
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>js/common-all-plugin-01.js">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>js/common-all-plugin-02.js">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>js/common-all-plugin-03.js">
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>js/common-all.js">
<link rel="stylesheet" type="text/css" href="<%=basePath%>js/app.js">
<script src="hplus/js/plugins/layer/layer.min.js"></script>

<style>
#light-loader {
	position: absolute;
	top: -120px;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	z-index: 1000;
	display: none
}

#loaded {
	display: none;
	color: #fff;
	position: absolute;
	left: 0;
	top: 220px;
	text-align: center;
	color: white;
	width: 312px;
	margin: auto;
	right: 0;
}
/* .form-group.googeltest{display:none} */
</style>

<style type="text/css">
.sign-window {
	width: 422px;
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left: -211px;
	margin-top: -180px;
}

,
.security-img {
	width: 85px;
	height: 22px;
	vertical-align: middle;
}
</style>
</head>
<body>
	<img src="" alt="" id="rainyDay" width="100%" height="100%" />
	<div class="menu01"></div>
	<script type="text/javascript">load(); </script>

	<!-- 时钟 -->
	<div class="fill">
		<div class="reference"></div>
		<div class="clock" id="utility-clock" style="transform: scale(0.5);">
			<div class="centre">
				<div class="dynamic"></div>
				<div class="expand round circle-1"></div>
				<div class="anchor hour">
					<div class="element thin-hand"></div>
					<div class="element fat-hand"></div>
				</div>
				<div class="anchor minute">
					<div class="element thin-hand"></div>
					<div class="element fat-hand minute-hand"></div>
				</div>
				<div class="anchor second">
					<div class="element second-hand"></div>
				</div>
				<div class="expand round circle-2"></div>
				<div class="expand round circle-3"></div>
			</div>
		</div>
	</div>

	<div id="login-form" class="login-div">
		<img class="logo" style="visibility: hidden;"
			src="<%=basePath%>image/logo/logo1.png" alt="" />
		<canvas id="particle"></canvas>
		<div class="form-horizontal DengLuBiaoDan bv-form"
			novalidate="novalidate">
			<!-- <button type="submit" class="bv-hidden-submit" style="display: none; width: 0px; height: 0px;"></button> -->
			<form id="loginForm">
				<div class="form-group has-feedback">
					<div class="col-sm-12">
						<input type="text" class="form-control account"
							placeholder="请输入账号" id="loginId" name="loginId"> <span
							class="glyphicon glyphicon-user green"></span>
					</div>
				</div>
				<div class="form-group has-feedback">
					<div class="col-sm-12">
						<input type="password" class="form-control password"
							placeholder="请输入密码" id="password" name="password"> <span
							class="glyphicon glyphicon-lock red"></span>
					</div>
				</div>
				<div class="form-group YanZhengMa has-feedback">
					<div class="col-sm-12">
						<input class="form-control security-code" placeholder="请输入验证码"
							name="securityCode" id="securityCode" required>
					</div>
					<span class="glyphicon glyphicon-pencil yellow"></span> <img
						id="regis-img" title="点击刷新验证码" height="" style="right: 10px"
						width="40%" src="<%=basePath%>login/securityCode"
						onclick="refresh()">
				</div>
		</div>
		<div class="form-group">
			<!-- onclick="submit();" -->
			<button type="submit" class="btn login-btn flex-grow confirm">立即登录</button>
		</div>
		</form>
		<ul class="row login-list">
			<li class="col-xs-4" onclick=""><span
				class="glyphicon glyphicon-check"></span>
				<p>
					<a>用户协议</a>
				</p></li>
			<li class="col-xs-4" data-command="forget-password"><span
				class="glyphicon glyphicon-lock"></span>
				<p>
					<a>忘记密码</a>
				</p></li>
			<li class="col-xs-4"><span
				class="glyphicon glyphicon-headphones"></span>
				<p>
					<a>联系客服</a>
				</p></li>
		</ul>
		<div class="login_dqsd">
			<img src="<%=basePath%>image/login/cs.png" class="cs" alt="" />
			<div class="login_dqsd-1">
				<div>当前线路速度为</div>
				<div>
					<span class="login_xlpm">0</span>ms/秒
				</div>
			</div>
		</div>
		<div id="loaded">
			已加载<span>0%</span>
		</div>
	</div>

	<script type="text/javascript">
    function refresh() {  
        var url = "login/securityCode?nocache=" + new Date().getTime();
        $("#regis-img").attr("src",url);  
    }  
    
    var clock = document.querySelector('#utility-clock');
    utilityClock(clock);

    if (clock.parentNode.classList.contains('fill')) autoResize(clock, 295 + 32);

    function utilityClock(container) {
        var dynamic = container.querySelector('.dynamic');
        var hourElement = container.querySelector('.hour');
        var minuteElement = container.querySelector('.minute');
        var secondElement = container.querySelector('.second');
        var minute = function(n) {
            return n % 5 == 0 ? minuteText(n) : minuteLine(n)
        };
        var minuteText = function(n) {
            var element = document.createElement('div');
            element.className = 'minute-text';
            element.innerHTML = (n < 10 ? '0' : '') + n;
            position(element, n / 60, 135);
            dynamic.appendChild(element)
        };
        var minuteLine = function(n) {
            var anchor = document.createElement('div');
            anchor.className = 'anchor';
            var element = document.createElement('div');
            element.className = 'element minute-line';
            rotate(anchor, n);
            anchor.appendChild(element);
            dynamic.appendChild(anchor)
        };
        var hour = function(n) {
            var element = document.createElement('div');
            element.className = 'hour-text hour-' + n;
            element.innerHTML = n;
            position(element, n / 12, 105);
            dynamic.appendChild(element)
        };
        var position = function(element, phase, r) {
            var theta = phase * 2 * Math.PI;
            element.style.top = (-r * Math.cos(theta)).toFixed(1) + 'px';
            element.style.left = (r * Math.sin(theta)).toFixed(1) + 'px'
        };
        var rotate = function(element, second) {
            element.style.transform = element.style.webkitTransform = 'rotate(' + (second * 6) + 'deg)'
        };
        var animate = function() {
            var now = new Date();
            var time = now.getHours() * 3600 +
                        now.getMinutes() * 60 +
                        now.getSeconds() * 1 +
                        now.getMilliseconds() / 1000;
            rotate(secondElement, time);
            rotate(minuteElement, time / 60);
            rotate(hourElement, time / 60 / 12);
            requestAnimationFrame(animate);
           
        };
        for (var i = 1; i <= 60; i ++) minute(i)
        for (var i = 1; i <= 12; i ++) hour(i)
        animate();
    }

    function autoResize(element, nativeSize) {
        var update = function() {
            var scale = Math.min(window.innerWidth, window.innerHeight) / nativeSize;
            element.style.transform = element.style.webkitTransform = 'scale(0.5)'
        };
        update();
        window.addEventListener('resize', update)
    }
    </script>
	<script>

$(function(){
	window.onload = function() {
		//背景随时间切换
		/* var now = new Date();
		var curr_hour = now.getHours();
		if(curr_hour >= 12 && curr_hour < 19) {
			document.body.style.background = 'url(../image/login/login_bg3.jpg)';
		}
		else if(curr_hour >= 01 && curr_hour < 07){
			document.body.style.background = 'url(../image/login/login_bg2.jpg)';
		}else{
			document.body.style.background = 'url(../image/login/login_bg.jpg)';
		}  */
		/* image/login/U1Tqqdw2.jpg */
		
		$('.login1-2').click(function(){
			$(this).next('.erwema').toggleClass('show1');
			$(this).parents('.login1').siblings().children('.erwema').removeClass('show1');
			
		});
		 $('.erwema').append('<div class="login-close glyphicon glyphicon-remove"></div>');
		 function remainTime(){
			 
				$('.login-close').click(function(){
					
					$('.erwema').removeClass('show1');
				})
			
		 }
		 setTimeout(remainTime(),3000);
		 
		
	};
})
</script>
	<script type="text/javascript"
		src="<%=basePath%>plugins/official/rainyday.min.js"></script>
	<script type="text/javascript"
		src="<%=basePath%>plugins/official/lightLoader.min.js"></script>
	<script>
function animate(a) {
    if ("function" == typeof a) {
        var b = 16;
        ctx.clearRect(0, 0, canvas.width, canvas.height),
        a(b),
        RAF(function() {
            animate(a)
        })
    }
}
function Particle(a, b, c, d, e, f, g) {
    this.x = a,
    this.y = b,
    this.ex = c,
    this.ey = d,
    this.vx = e,
    this.vy = f,
    this.a = 1500,
    this.color = g,
    this.width = particleSize_x,
    this.height = particleSize_y,
    this.stop = !1,
    this["static"] = !1,
    this.maxCheckTimes = 10,
    this.checkLength = 5,
    this.checkTimes = 0
}
function useImage() {
    img.complete ? canvasHandle.init() : img.onload = function() {
        canvasHandle.init()
    }
}
var canvas = document.getElementById("particle"),
ctx = canvas.getContext("2d");
img = document.querySelector(".logo"),
canvas.width = 150,
canvas.height = 150;
var mouseX = null,
mouseY = null,
mouseRadius = 50,
RAF = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(a) {
        window.setTimeout(a, 1e3 / 60)
    }
} ();
Array.prototype.forEach2 = function(a) {
    for (var b = 0; b < this.length; b++) a.call("object" == typeof this[b] ? this[b] : window, b, this[b])
};
var particleArray = [],
animateArray = [],
particleSize_x = 1,
particleSize_y = 2,
canvasHandle = {
    init: function() {
        img.style.visibility = "hidden",
        this._reset(),
        this._initImageData(),
        this._execAnimate()
    },
    _reset: function() {
        particleArray.length = 0,
        animateArray.length = 0,
        this.ite = 100,
        this.start = 0,
        this.end = this.start + this.ite
    },
    _initImageData: function() {
        this.imgx = (canvas.width - img.width) / 2,
        this.imgy = (canvas.height - img.height) / 2,
        ctx.clearRect(0, 0, canvas.width, canvas.height),
        ctx.drawImage(img, this.imgx, this.imgy, img.width, img.height);
        for (var a = ctx.getImageData(this.imgx, this.imgy, img.width, img.height), b = 0; b < img.width; b += particleSize_x) for (var c = 0; c < img.height; c += particleSize_y) {
            var d = 4 * (c * a.width + b);
            if (a.data[d + 3] >= 125) {
                var i, e = "rgba(" + a.data[d] + "," + a.data[d + 1] + "," + a.data[d + 2] + "," + a.data[d + 3] + ")",
                f = b + 20 * Math.random(),
                g = 200 * -Math.random() + 400,
                h = img.height / 2 - 40 * Math.random() + 20;
                i = h < this.imgy + img.height / 2 ? 300 * Math.random() : 300 * -Math.random(),
                particleArray.push(new Particle(f + this.imgx, h + this.imgy, b + this.imgx, c + this.imgy, g, i, e)),
                particleArray[particleArray.length - 1].drawSelf()
            }
        }
    },
    _execAnimate: function() {
        var a = this;
        particleArray.sort(function(a, b) {
            return a.ex - b.ex
        }),
        this.isInit || (this.isInit = !0, animate(function(b) {
            animateArray.length < particleArray.length && (a.end > particleArray.length - 1 && (a.end = particleArray.length - 1), 1400 == a.end && setTimeout(function() {
                img.style.visibility = "visible",
                canvas.style.display = "none"
            },
            1e3), animateArray = animateArray.concat(particleArray.slice(a.start, a.end)), a.start += a.ite, a.end += a.ite),
            animateArray.forEach2(function(a) {
                this.update(b)
            })
        }))
    }
},
tickTime = 16,
oldColor = "";
Particle.prototype = {
    constructor: Particle,
    drawSelf: function() {
        oldColor != this.color && (ctx.fillStyle = this.color, oldColor = this.color),
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
    },
    move: function(a) {
        if (this.stop) this.x = this.ex,
        this.y = this.ey;
        else {
            a /= 1e3;
            var b = this.ex - this.x,
            c = this.ey - this.y,
            d = Math.atan(c / b),
            e = Math.abs(this.a * Math.cos(d));
            e = this.x > this.ex ? -e: e;
            var f = Math.abs(this.a * Math.sin(d));
            f = this.y > this.ey ? -f: f,
            this.vx += e * a,
            this.vy += f * a,
            this.vx *= .95,
            this.vy *= .95,
            this.x += this.vx * a,
            this.y += this.vy * a,
            Math.abs(this.x - this.ex) <= this.checkLength && Math.abs(this.y - this.ey) <= this.checkLength ? (this.checkTimes++, this.checkTimes >= this.maxCheckTimes && (this.stop = !0)) : this.checkTimes = 0
        }
    },
    update: function(a) {
        this.move(a),
        this.drawSelf()
    }
},
useImage();
</script>

	<script type="text/javascript">
      !function(){
        var image = document.getElementById('rainyDay');
        image.onload = function() {
          var engine = new RainyDay({
            image: this,
            enableSizeChange:false
          });
          engine.rain([
            [3, 2, 2]
          ], 100);
        };
        image.crossOrigin = 'anonymous';
        image.src = '<%=basePath%>image/login/U1Tqqdw2.jpg';
        //image.src = 'img/login/logo.png.jpg';
        
        $toggleBtns = $('.check-network').find('> .pull-left:first')
                            .add($('.app_download-ios'))
                            .add($('.app_download-client'))
                            .add($('.host-valid'))
                            .click(function(e){
                              e.preventDefault();
                              var active = $(this).is('.active');
                              $toggleBtns.removeClass('active');
                              $(this)[active ? 'remove' : 'add' + 'Class']('active')
                            })

      }();
 	
      <%-- function submit(){
	       var loginId = $('#loginId').val();   //用户名
	       var password = $("#password").val();  //密码
	       var securityCode = $("#securityCode").val();     //验证码
	       
	       $.ajax({
				type: "POST",
				url: '<%=basePath%>login/userLogin?tm=' +  new Date().getTime(),
				data: {
					"loginId" : loginId,
					"password" : password,
					"securityCode" : securityCode
				},
				dataType: 'json',
				//beforeSend: validateData,
				cache: false,
				success: function(data) {
					if (data.msg == 'ok') {
					    console.info(data.result);
					    /* var obj = JSON.parse(data.result)
					    console.info(obj);
					    console.info(data.result.url); */
					    //window.location.href = data.result.url;
					} else {
						layer.msg(data.msg);
					}
				}
	       });
      } --%>
      
      $().ready(function() {
    		// 提交时验证表单
    	  MX.load({
    			js: 'lib/sea',
    			version: '${ JS_LIB_SEA_VERSION }',
    			success: function() {
    				if(top !== window) {
    					top.location.href = window.basePath + '/login.jsp';
    				}
    				seajs.use(['lib/jquery', 'page/login'], function($, Login) {
    					var login = new Login('login-form');
    				});
    			}
    		});
      });
      
    </script>


</body>
</html>

