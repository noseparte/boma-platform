define('module/MenuInfo', ['lib/jquery', 'util/artTemplate', 'module/Dialog', 'module/Validator', 'util/ajaxPromise'], function(require) {
	'use strict';
	var $, tmpl, Dialog, Validator, ajaxPromise,
		menuInfo, loadMenu, dialog,
		menuInfoTmpl, optionTmpl;
	$ = require('lib/jquery');
	tmpl = require('util/artTemplate');
	Dialog = require('module/Dialog');
	Validator = require('module/Validator');
	ajaxPromise = require('util/ajaxPromise');
	/**
	 * 加载菜单
	 * @return {Promise}
	 */
	loadMenu = function() {
		return ajaxPromise({
			url: window.basePath + 'resources/listJson',
			type: 'GET',
			dataType: 'json'
		}).then(function(data) {
			menuInfo = data.result.directoryList;
			// 起始位置插入默认节点
			menuInfo.unshift({
				id: '',
				name: '-----顶级目录-----',
				level: 1
			});
			return menuInfo;
		});
	};
	/**
	 * 字符串重复
	 * @param  {String} n 重复次数
	 * @return {String}   生成的字符串
	 */
	String.prototype.repeat = String.prototype.repeat || function(n) {
		return (new Array(n + 1)).join(this);
	};
	/**
	 * 菜单模板
	 * @param {String} name 菜单名称
	 * @param {String} sign 菜单标识
	 * @param {String} link 菜单url
	 * @param {Boolean} type 菜单类型 0 父目录 1 子目录 2 菜单
	 * @param {Boolean} status 菜单状态 0 展示 1 隐藏
	 * @param {String} description 菜单描述
	 */
	menuInfoTmpl = tmpl.compile([
		'<div class="form-horizontal">',
			'<div class="form-group">',
				'<label class="col-sm-2 control-label">菜单名称：</label>',
				'<div class="col-sm-10">',
					'<input type="text" value="{{name}}" class="menu-name form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-2 control-label">菜单标识：</label>',
				'<div class="col-sm-10">',
					'<input type="text" value="{{sign}}" class="menu-sign form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-2 control-label">菜单url：</label>',
				'<div class="col-sm-10">',
					'<input type="text" value="{{link}}" class="menu-link form-control"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<div class="col-sm-offset-2 col-sm-10">',
					'<div class="checkbox">',
						'<label><input class="menu-type" type="checkbox" value="1" {{if type}}checked{{/if}}>&nbsp;置为子目录</label>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<div class="col-sm-offset-2 col-sm-10">',
					'<div class="checkbox">',
						'<label><input class="menu-type" type="checkbox" value="2" {{if type}}checked{{/if}}>&nbsp;置为菜单</label>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<div class="col-sm-offset-2 col-sm-10">',
					'<div class="checkbox">',
						'<label><input class="menu-status" type="checkbox" {{if status}}checked{{/if}}>&nbsp;隐藏</label>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-2 control-label">菜单描述：</label>',
				'<div class="col-sm-10">',
					'<input type="text" value="{{description}}" class="menu-description form-control" maxLength="30"/>',
				'</div>',
			'</div>',
		'</div>'
	].join(''));
	/** 
	 * 选项模板
	 * @param {String|Number} id 菜单id
	 * @param {Number} level 菜单级别
	 * @param {String} name 菜单名称
	 */
	optionTmpl = tmpl.compile([
		'{{each options}}',
		'<option value="{{$value.id}}">{{"&nbsp;".repeat(($value.level - 1) << 3)+$value.name}}</option>',
		'{{/each}}'
	].join(''));
	dialog = new Dialog('modal-dialog');
	menuInfo = {
		/**
		 * 添加菜单
		 * @param {String} source 添加按钮来源
		 * @example
		 * 		seajs.use('module/MenuInfo', function(menuInfo) {
		 * 			menuInfo.addMenu('source');
		 * 		});
		 */
		addMenu: function(source) {
			loadMenu().then(function(menuData) {
				dialog.show({
					sizeClass: 'modal-lg',
					title: '创建菜单',
					content: [
						'<div class="form-horizontal">',
							'<div class="form-group">',
								'<label class="col-sm-2 control-label">菜单名称：</label>',
								'<div class="col-sm-10">',
									'<input type="text" value="" class="menu-name form-control" maxLength="30" placeholder="请输入菜单名称"/>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<label class="col-sm-2 control-label">菜单标识：</label>',
								'<div class="col-sm-10">',
									'<input type="text" value="" class="menu-sign form-control" maxLength="30" placeholder="请输入菜单标识"/>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<label>ICON',
									'<a href="http://code.zoomla.cn/boot/font.html" target="_blank">【参考图标】</a>',
								'</label>', 
								'<input id="icon" name="icon" type="text" value="fa-square-o" placeholder="请输入菜单图标" class="form-control">',
							'</div>',
							'<div class="form-group">',
								'<label class="col-sm-2 control-label">菜单url：</label>',
								'<div class="col-sm-10">',
									'<input type="text" value="" class="menu-link form-control" placeholder="请输入菜单url"/>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<label class="col-sm-2 control-label">上级菜单：</label>',
								'<div class="col-sm-10">',
									'<select class="menu-parent form-control"></select>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<div class="col-sm-offset-2 col-sm-10">',
									'<div class="checkbox">',
										'<label><input class="menu-type" type="checkbox" value="1" {{if type}}checked{{/if}}>&nbsp;置为子目录</label>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<div class="col-sm-offset-2 col-sm-10">',
									'<div class="checkbox">',
										'<label><input class="menu-type" type="checkbox" value="2" {{if type}}checked{{/if}}>&nbsp;置为菜单</label>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<div class="col-sm-offset-2 col-sm-10">',
									'<div class="checkbox">',
										'<label><input class="menu-status" type="checkbox">&nbsp;隐藏</label>',
									'</div>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<label class="col-sm-2 control-label">菜单描述：</label>',
								'<div class="col-sm-10">',
									'<input type="text" value="" class="menu-description form-control" maxLength="30" placeholder="请输入菜单描述"/>',
								'</div>',
							'</div>',
						'</div>'
					].join(''),
					source: source,
					initial: function() {
						var Self = this, parentMenu;
						parentMenu = Self._container.find('.menu-parent');
						parentMenu.html(optionTmpl({
							options: menuData
						}));
					},
					confirm: function() {
						var Self = this, container, data = {},
							validator = new Validator(),
							menuName, menuSign, menuLink, menuPosition;
						container = Self._container;
						menuName = container.find('.menu-name');
						data.name = menuName.val().trim();
						menuSign = container.find('.menu-sign');
						data.resKey = menuSign.val().trim();
						menuLink = container.find('.menu-link');
						data.resUrl = menuLink.val().trim();
						data.type = container.find('.menu-type').prop('checked').val();
						validator.add(data.name, 'isNotEmpty', function() {
							alert('请输入菜单名称');
							menuName.val('').focus();
						}).add(data.resKey, 'isNotEmpty', function() {
							alert('请输入菜单标识');
							menuSign.val('').focus();
						}).add(!data.type || data.resUrl, 'isNotEmpty', function() {
							alert('请输入菜单url');
							menuLink.val('').focus();
						});
						if(!validator.start()) {
							Self.enableConfirm();
							return;
						}
						data.parentId = container.find('.menu-parent').val();
						data.status = container.find('.menu-status').prop('checked') ? 1: 0;
						data.description = container.find('.menu-description').val().trim();
						ajaxPromise({
							url: window.basePath + 'resources/commitEdit',
							type: 'POST',
							data: data,
							dataType: 'json'
						}).then(function(data) {
							alert('添加成功');
							document.location.reload();
						}, function() {
							Self.enableConfirm();
						});
					}
				});
			});
		},
		/**
		 * 编辑菜单
		 * @param {Object} config 菜单数据
		 * @example
		 * 		seajs.use('module/MenuInfo', function(menuInfo) {
		 * 			// 菜单数据取自dataset
		 * 			menuInfo.editMenu({
		 * 				id: '',
		 * 				name: '',
		 * 				sign: '',
		 * 				link: '',
		 * 				type: 0,
		 * 				status: 1,
		 * 				description: ''
		 * 			});
		 * 		});
		 */
		editMenu: function(config) {
			dialog.show({
				sizeClass: 'modal-lg',
				title: '编辑菜单',
				content: menuInfoTmpl(config),
				force: 1,
				confirm: function() {
					var Self = this, container, data = {},
						validator = new Validator(),
						menuName, menuSign, menuLink;
					container = Self._container;
					menuName = container.find('.menu-name');
					data.name = menuName.val().trim();
					menuSign = container.find('.menu-sign');
					data.resKey = menuSign.val().trim();
					menuLink = container.find('.menu-link');
					data.resUrl = menuLink.val().trim();
					data.type = container.find('.menu-type').prop('checked').val();
					validator.add(data.name, 'isNotEmpty', function() {
						alert('请输入菜单名称');
						menuName.val('').focus();
					}).add(data.resKey, 'isNotEmpty', function() {
						alert('请输入菜单标识');
						menuSign.val('').focus();
					}).add(!data.type || data.resUrl, 'isNotEmpty', function() {
						alert('请输入菜单url');
						menuLink.val('').focus();
					});
					if(!validator.start()) {
						Self.enableConfirm();
						return;
					}
					data.status = container.find('.menu-status').prop('checked') ? 1: 0;
					data.description = container.find('.menu-description').val().trim();
					data.id = config.id;
					ajaxPromise({
						url: window.basePath + 'resources/commitEdit',
						type: 'POST',
						data: data,
						dataType: 'json'
					}).then(function(data) {
						alert('编辑成功');
						document.location.reload();
					}, function() {
						Self.enableConfirm();
					});
				}
			});
		}
	};
	return menuInfo;
});