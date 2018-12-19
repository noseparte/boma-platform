define('module/Dialog', ['lib/jquery', 'lib/bootstrap'], function(require) {
	'use strict';
	var Dialog, $;
	$ = require('lib/jquery');
	require('lib/bootstrap');
	/**
	 * @constructor bootstrap模态对话框
	 * @param {String} id  bootstrap对话框id
	 * @param {Object} config 扩展参数
	 * @example
	 * 		seajs.use(['module/Dialog'], function(Dialog) {
	 * 			var dialog = new Dialog('modal-dialog');
	 * 		});
	 */
	Dialog = function(id, config) {
		var Self = this,
			config = config || {};
		if(Dialog[id]) {
			return Dialog[id];
		}
		Self.id = id;
		$.extend(Self, config);
		if(Self.force) {
			Self.source = '';
		}
		Self.init();
		Dialog[id] = Self;
	};
	Dialog.prototype = {
		/**
		 * 对话框默认脚注
		 * @type {String}
		 */
		footer: [
			'<button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">取消</button>',
			'<button type="button" class="btn btn-primary btn-confirm">保存</button>'
		].join(''),
		/**
		 * 初始化入口
		 */
		init: function() {
			var Self = this;
			Self._body = $('#' + Self.id);
			Self._dialog = Self._body.find('.modal-dialog');
			Self._title = Self._body.find('.modal-title');
			Self._container = Self._body.find('.modal-body');
			Self._footer = Self._body.find('.modal-footer');
		},
		/**
		 * 清除方法
		 */
		clearMethods: function() {
			var Self = this,
				methods = ['initCall', 'initial'], i, len;
			for(i = 0, len = methods.length; i < len; ++i) {
				delete Self[methods[i]];
			}
		},
		/**
		 * 展示对话框
		 * @param  {Object} config 扩展参数
		 * @config {String} sizeClass 尺寸类 'modal-lg', 'modal-sm'
		 * @config {String} title 标题
		 * @config {String} content 主体内容
		 * @config {String} footer 脚注
		 * @config {String} source 来源
		 * @config {Boolean} force 强制渲染
		 * @config {Function} initial 初始化函数
		 * @config {Function} renderCall 渲染回调函数
		 * @config {Function} confirm 确认回调函数
		 * @example
		 * 		seajs.use(['module/Dialog'], function(Dialog) {
		 * 			var dialog = new Dialog('modal-dialog')l
		 * 			dialog.show({
		 * 				sizeClass: 'modal-lg',
		 * 				title: 'title',
		 * 				content: 'content',
		 * 				source: 'source',
		 * 				initial: $.noop,
		 * 				initCall: $.noop,
		 * 				confirm: $.noop
		 * 			});
		 * 		});
		 */
		show: function(config) {
			var Self = this, isRender;
			config = config || {};
			Self.clearMethods();
			$.extend(Self, config);
			isRender = Self.force || Self._body.data('source') !== Self.source;
			if(isRender) {
				Self._body.data('source', Self.source).off('click.bs.custom');
				Self._title.html(Self.title);
				Self._container.html(Self.content);
				Self._footer.html(Self.footer);
				Self._dialog.removeClass('modal-lg, modal-sm').addClass(Self.sizeClass);
			}
			if(Self.initial) {
				Self.initial();
			}
			Self._confirm = Self._footer.find('.btn-confirm');
			if(isRender) {
				if(Self.renderCall) {
					Self.renderCall();
				}
				Self.addEvent();
			}
			Self._body.modal('show');
		},
		/**
		 * 绑定事件
		 */
		addEvent: function() {
			var Self = this;
			// 防止重复绑定
			if(!Self._body.data('init')) {
				Self._body.data('init', 1);
				// 展示时激活确认按钮
				Self._body.on('show.bs.modal', function(e) {
					Self.enableConfirm();
				});
				// 确认事件代理
				Self._footer.on('click.bs.modal', '.btn-confirm', function(e) {
					// 防止重复点击
					$(this).prop('disabled', true);
					if(Self.confirm) {
						Self.confirm();
					}
				});
				// 取消事件代理
				Self._footer.on('click.bs.modal', '.btn-cancel', function(e) {
					if(Self.cancel) {
						Self.cancel();
					}
				});
			}
		},
		/**
		 * 隐藏对话框
		 * @example
		 * 		seajs.use(['module/Dialog'], function(Dialog) {
		 * 			var dialog = new Dialog('modal-dialog')l
		 * 			dialog.hide();
		 * 		});
		 */
		hide: function() {
			var Self = this;
			Self._body.modal('hide');
		},
		/**
		 * 激活对话框确认按钮
		 * @example
		 * 		seajs.use(['module/Dialog'], function(Dialog) {
		 * 			var dialog = new Dialog('modal-dialog')l
		 * 			dialog.enableConfirm();
		 * 		});
		 */
		enableConfirm: function() {
			var Self = this;
			Self._confirm.prop('disabled', false);
		}
	};
	return Dialog;
});