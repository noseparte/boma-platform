/**
 * @description  录题后台登录
 * @author 
 */
define('page/login', ['lib/jquery', 'util/ajaxPromise', 'util/bootstrapModel','module/Validator'], function(require) {
	'use strict';
	var $ = require('lib/jquery'),
		ajaxPromise = require('util/ajaxPromise'),
		Validator = require('module/Validator'),
		Login;
	/**
	* @constructor 登陆
	* @param {String} id 登陆表单id
	* @param {Object} [config] 配置参数
	* @config {String} alertTip 提示信息
	* @example
	*   seajs.use('page/login', function(Login) {
	*       new Login('login_form', {
	*           alertTip: '亲，用户名和密码都得要哦'
	*       });
	*   })
	*/
	Login = function(id, config) {
		var Self = this;
		Self._body = $('#' + id);
		Self = $.extend(Self, config);
		Self.init();
		Self.addEvent();
	};
	Login.prototype = {
		/**
		* 初始化入口
		*/
		init: function() {
			this._account = this._body.find('.account').focus();
			this._password = this._body.find('.password');
			this._securityCode = this._body.find('.security-code');
			this._securityImg = this._body.find('.security-img');
		},
		/**
		* 绑定事件
		*/
		addEvent: function() {
			var Self = this;
			$(document).on('keydown', function(e) {
				if(13 === e.keyCode) {
					Self.submit();
				}
			});
			Self._body.on('click', '.confirm', function(e) {
				e.preventDefault();
				Self.submit();
			}).on('click', '.reset', function(e) {
				Self._account.val('').focus();
				Self._password.val('');
			}).on('click', '.security-img', function(e) {
				Self.refreshSecurityImg();
			});
		},
		/**
		* 表单提交
		*/
		submit: function() {
			var Self = this, data = {}, validator;
			data.loginId = Self._account.val().trim();
			data.password = Self._password.val();
			data.securityCode = Self._securityCode.val().trim();
			validator = new Validator();
			validator.add(data.loginId, 'isNotEmpty', function() {
				BootstrapModel.create_bootstarp_alert({
                    type: 'warning',
                    content: '用户名不能为空'
                }, function(){
                });

				//alert('用户名不能为空');
			}).add(data.password, 'isNotEmpty', function() {
				BootstrapModel.create_bootstarp_alert({
                    type: 'warning',
                    content: '密码不能为空'
                }, function(){
                });

				//alert('密码不能为空');
			}).add(data.securityCode, 'isNotEmpty', function() {
				BootstrapModel.create_bootstarp_alert({
					type: 'warning',
					content: '验证码不能为空'
				}, function(){
				});

				//alert('验证码不能为空');
			});
			if(!validator.start()) {
				return false;
			}
			ajaxPromise({
				url: window.basePath + 'login/userLogin',
				type: 'POST',
				data: data,
				dataType: 'json'
			}).then(function(data) {
				document.location.href = data.result[0].url;
			}, function() {
				Self.refreshSecurityImg();
			});
		},
		refreshSecurityImg: function() {
			var Self = this;
			Self._securityImg.attr('src', window.basePath + 'login/securityCode?t=' + Date.now());
		}
	};
	return Login;
});