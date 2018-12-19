define('module/UserInfo', ['lib/jquery', 'util/artTemplate', 'module/Dialog', 'module/Validator', 'util/ajaxPromise'], function(require) {
	'use strict';
	var $, tmpl, dialog, Dialog, Validator, ajaxPromise,
		userInfo, loadTeam, loadRole,
		userInfoTmpl, incompleteUserInfoTmpl, loadTeamMember, teamInfoTmpl, newTeamTmpl,
		optionTmpl, initOptionTmpl;
	$ = require('lib/jquery');
	tmpl = require('util/artTemplate');
	Dialog = require('module/Dialog');
	Validator = require('module/Validator');
	ajaxPromise = require('util/ajaxPromise');
	/**
	 * 加载小组信息
	 * @param  {String}   identity  身份
	 * @return {Promise}
	 */
	loadTeam = function(identity) { 
		return ajaxPromise({
			url: window.basePath + 'tool/getGameServerList', 
			type: 'GET',
			dataType: 'json',
			data: {
				role: identity
			}
		}).then(function(data) {
			var gameserverInfo;
			gameserverInfo = data.result;
			gameserverInfo.unshift({
				id: '',
				name: '请选择'
			});
			return gameserverInfo;
		});
	};
	/**
	 * 加载角色信息
	 * @param {Number} filter 是否过滤
	 * @return {Promise}
	 */
	loadRole = function(filter) {
		return ajaxPromise({
			url: window.basePath + 'role/getRoleList',
			data: {
				filter: filter
			},
			type: 'GET',
			dataType: 'json'
		}).then(function(data) {
			var roleInfo;
			roleInfo = data.result;
			roleInfo.unshift({
				id: '',
				name: '请选择'
			});
			return roleInfo;
		});
	};
	// 下拉模板
	optionTmpl = tmpl.compile([
		'{{each options}}',
			'<option value="{{$value.id}}">{{$value.name}}</option>',
		'{{/each}}'
	].join(''));
	// 初始化下拉模板
	initOptionTmpl = tmpl.compile([
		'{{each info}}',
		'<option {{if id===$value.id+""}}selected="selected"{{/if}} value="{{$value.id}}">{{$value.name}}</option>',
		'{{/each}}'
	].join(''));
	// 用户信息模板
	userInfoTmpl = tmpl.compile([
		'<div class="form-horizontal">',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">密码：</label>',
				'<div class="col-sm-8">',
					'<input type="text" value="" class="password form-control"  maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">账号：</label>',
				'<div class="col-sm-8">',
					'<input type="text" value="{{userKey}}" class="user-key form-control" disabled/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">姓名：</label>',
				'<div class="col-sm-8">',
					'<input type="text" value="{{userName}}" class="user-name form-control"  maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">角色：</label>',
				'<div class="col-sm-8">',
					'<select class="role form-control" disabled>',
						'{{each roleInfo}}',
						'<option {{if role===$value.id}}selected="selected"{{/if}} value="{{$value.id}}">{{$value.name}}</option>',
						'{{/each}}',
					'</select>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">状态：</label>',
				'<div class="col-sm-8">',
					'<select class="status form-control">',
						'<option {{if status===0}}selected="selected"{{/if}} value="0">启用</option>',
						'<option {{if status===1}}selected="selected"{{/if}} value="1">禁用</option>',
					'</select>',
				'</div>',
			'</div>',
//			'<div class="form-group">',
//				'<label class="col-sm-4 control-label">机构：</label>',
//				'<div class="col-sm-8">',
//					'<input type="text" value="{{orgName}}" class="org-name form-control" disabled/>',
//				'</div>',
//			'</div>',
		'</div>'
	].join(''));
	dialog = new Dialog('modal-dialog');
	userInfo = {
			/**
			 * 初始化服务器列表
			 * @param  {String|jQuery} container 小组信息容器
			 * @param {String} teamId 当前小组id
			 * @example
			 * 		seajs.use(['module/UserInfo'], function(userInfo) {
			 * 			userInfo.initTeam('', '');
			 * 		});
			 */
			initTeam: function(container, gameserverId) {
				if($.type(container) === 'string') {
					container = $('#' + container);
				}
				loadTeam('').then(function(gameserverInfo) {
					//debugger;
					container.append(initOptionTmpl({
						info: gameserverInfo,
						id: gameserverId
					}));
				});
			},
		/**
		 * 初始化角色
		 * @param  {String|jQuery} container 角色信息容器
		 * @param {String} roleId 当前角色id
		 * @example
		 * 		seajs.use(['module/UserInfo'], function(userInfo) {
		 * 			userInfo.initRole('', '');
		 * 		});
		 */
		initRole: function(container, roleId) {
			if($.type(container) === 'string') {
				container = $('#' + container);
			}
			loadRole(0).then(function(roleInfo) {
				container.append(initOptionTmpl({
					info: roleInfo,
					id: roleId
				}));
			});
		},
		/**
		 * 添加成员
		 * @param {String} source 来源id
		 * @example
		 * 		seajs.use(['module/UserInfo'], function(userInfo) {
		 * 			userInfo.addMember('');
		 * 		});
		 */
		addMember: function(source) {
			console.log(source);
			loadRole(0).then(function(info) {
				dialog.show({
					sizeClass: 'modal-sm',
					title: '创建用户',
					content: [
						'<div class="form-horizontal">',
							'<div class="form-group">',
								'<label class="col-sm-4 control-label">密码：</label>',
								'<div class="col-sm-8">',
									'<input type="text" value="" class="password form-control"  maxLength="30"/>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<label class="col-sm-4 control-label">账号：</label>',
								'<div class="col-sm-8">',
									'<input type="text" value="" class="user-key form-control"/>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<label class="col-sm-4 control-label">姓名：</label>',
								'<div class="col-sm-8">',
									'<input type="text" value="" class="user-name form-control" maxLength="30"/>',
								'</div>',
							'</div>',
							'<div class="form-group">',
								'<label class="col-sm-4 control-label">角色：</label>',
								'<div class="col-sm-8">',
									'<select class="role form-control"></select>',
								'</div>',
							'</div>',
						'</div>'
					].join(''),
					source: source,
					initial: function() {
						var Self = this, container, orgSelect, orgs;
						container = Self._container;
						container.find('.password').val('');
						container.find('.user-key').val('');
						container.find('.user-name').val('');
						container.find('.role').html(optionTmpl({
							options: info
						}));
						container.find('.role').on('change', function(e) {
							if($(this).val() === 'organization' && !container.find('.org').length) {
								container.find('.form-horizontal').append([
//									'<div class="form-group">',
//										'<label class="col-sm-4 control-label">机构：</label>',
//										'<div class="col-sm-8">',
//											'<select class="org form-control"></select>',
//										'</div>',
//									'</div>'
								].join(''));
								orgSelect = container.find('.org');
								ajaxPromise({
									url: window.basePath + 'org/listAll',
									type: 'GET',
									data: {},
									dataType: 'json'
								}).then(function(data) {
									orgs = data.result.organizationList;
									orgs.unshift({
										id: '',
										name: '全部'
									});
									if(orgs.length) {
										orgSelect.html(optionTmpl({
											options: orgs
										}));
									}
								}, function() {

								});
							} else {
								if(container.find('.org').length) {
									container.find('.org').closest('.form-group').remove();
								}
							}
						});
					},
					confirm: function() {
						var Self = this, validator = new Validator(),
							container, _userMobile, _userKey, _password, data = {};
						container = Self._container;
						_userKey = container.find('.user-key');
						data.userKey = _userKey.val().trim();
						_password = container.find('.password');
						data.password = _password.val();
						data.groupName = container.find('.role').val();
						validator.add(data.userKey, 'isNotEmpty', function() {
							alert("账号不能为空");
							_userKey.val('').focus();
						}).add(data.password, 'isNotEmpty', function() {
							alert('密码不能为空');
							_password.val('').focus();
						}).add(data.groupName, 'isNotEmpty', function() {
							alert('请选择角色');
						});
//						if(data.groupName === 'organization') {
//							data.orgId = container.find('.org').val();
//							validator.add(data.orgId, 'isNotEmpty', function() {
//								alert('请选择机构');
//							});
//						}
						if(!validator.start()) {
							Self.enableConfirm();
							return;
						}
						data.userName = container.find('.user-name').val().trim();
						ajaxPromise({
							url: window.basePath + 'user/addUserInfo',
							type: 'GET',
							data: data,
							dataType: 'json'
						}).then(function(data) {
							window.location.reload();
						}, function() {
							Self.enableConfirm();
						});
					}
				});
			});
		},
		/**
		 * 编辑成员
		 * @param {Object} data 成员数据
		 * @example
		 * 		seajs.use(['module/UserInfo'], function(userInfo) {
		 * 			// 成员数据取自dataset
		 * 			userInfo.editMember({
		 * 				role: '',
		 * 				userMobile: '',
		 * 				userKey: '',
		 * 				userName: '',
		 * 				teamRole: '',
		 * 				status: ''
		 * 			});
		 * 		});
		 */
		editMember: function(data) {
			loadRole(0).then(function(roleInfo) {
				data.roleInfo = roleInfo;
				dialog.show({
					sizeClass: 'modal-sm',
					title: '编辑用户',
					content: userInfoTmpl(data),
					force: 1,
					confirm: function() {
						var Self = this, validator = new Validator(),
							container, requestData = {};
						container = Self._container;
						requestData.groupName = container.find('.role').val();
						validator.add(requestData.groupName, 'isNotEmpty', function() {
							alert('请选择角色');
						});
						if(!validator.start()) {
							Self.enableConfirm();
							return;
						}
						$.extend(requestData, {
							userKey: data.userKey,
							id: data.userId,
							userName: container.find('.user-name').val().trim(),
							password: container.find('.password').val(),
							status: container.find('.status').val(),
							teamId: container.find('.team').val()
						});
						ajaxPromise({
							url: window.basePath + 'user/updateUserInfo',
							type: 'GET',
							data: requestData,
							dataType: 'json'
						}).then(function(data) {
							window.location.reload();
						}, function() {
							Self.enableConfirm();
						});
					}
				});
			});
		}
	};
	return userInfo;
});
