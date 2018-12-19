define('module/RoleInfo', ['lib/jquery', 'util/artTemplate', 'module/Dialog', 'module/Validator', 'util/ajaxPromise'], function(require) {
	'use strict';
	var $, Dialog, tmpl, Validator, ajaxPromise,
		roleInfo, getLeafNum, dialog,
		roleInfoTmpl, authorityTmpl;
	$ = require('lib/jquery');
	tmpl = require('util/artTemplate');
	Dialog = require('module/Dialog');
	Validator = require('module/Validator');
	ajaxPromise = require('util/ajaxPromise');
	/**
	 * 角色模板
	 * @param {String} roleName 角色名称
	 * @param {String} roleSign 角色标识
	 * @param {String} description 角色描述
	 * @param {Boolean} status 禁用状态 1禁用 0启用
	 */
	roleInfoTmpl = tmpl.compile([
		'<div class="form-horizontal">',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">角色名：</label>',
				'<div class="col-sm-8">',
					'<input type="text" value="{{roleName}}" class="role-name form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">roleKey：</label>',
				'<div class="col-sm-8">',
					'<input type="text" value="{{roleSign}}" class="role-sign form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">描述：</label>',
				'<div class="col-sm-8">',
					'<input type="text" value="{{description}}" class="description form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<div class="col-sm-offset-4 col-sm-8">',
					'<div class="checkbox">',
						'<label><input class="status" type="checkbox" {{if status}}checked{{/if}}>&nbsp;禁用</label>',
					'</div>',
				'</div>',
			'</div>',
		'</div>'
	].join(''));
	/**
	 * 权限模板
	 * @param {Number} type 节点类型 0 目录 1 菜单
	 * @param {Boolean} hasRole 已授权
	 * @param {Number} leafNum 子树的叶子数
	 * @param {String} id 节点id
	 * @param {String} name 节点描述
	 */
	authorityTmpl = tmpl.compile([
		'{{each menu}}',
		'{{if $index === 0 || $index < menu.length - 1 && $value.level <= lastLevel}}',
		'<tr>',
		'{{/if}}',
			'<td{{if $value.type < 2}} rowspan="{{$value.leafNum}}"{{/if}}>',
				'<div class="checkbox">',
					'<label title={{$value.description}}><input type="checkbox" class="menu-check" data-index="{{$value.levelTree}}" data-id="{{$value.id}}"{{if $value.hasRole}} checked{{/if}}>{{$value.name}}</label>',
				'</div>',
			'</td>',
//			'<td{{if $value.type === 1}} rowspan="{{$value.leafNum}}"{{/if}}>',
//				'<div class="checkbox">',
//				'<label title={{$value.description}}><input type="checkbox" class="menu-check" data-index="{{$value.levelTree}}" data-id="{{$value.id}}"{{if $value.hasRole}} checked{{/if}}>{{$value.name}}</label>',
//				'</div>',
//			'</td>',
		'{{if $value.type === 2 || $value.leafNum === 0}}',
		'</tr>',
		'{{/if}}',
		// 利用空判断来实现变量赋值
		/*'{{if lastLevel = $value.level}}{{/if}}',*/
		'{{/each}}'
	].join(''));
	/**
	 * 计算叶节点数量
	 * @param  {Array} data 有序节点数组
	 */
    getLeafNum = function(data) {
        var i, len, j, parents = [], item, level, isLeaf;
        data = data || [];
        for(i = 0, len = data.length; i < len; ++i) {
            item = data[i];
            level = item.level;
            isLeaf = !!item.url;
            if(!isLeaf) {
                item.leafNum = 0;
                parents[level] = item;
            } else {
                for(j = 0; j < level; ++j) {
                    parents[j].leafNum++;
                }
            }
        }
//		console.info(data);
    };
	dialog = new Dialog('modal-dialog');
	roleInfo = {
		/**
		 * 添加角色
		 * @param {String} source 来源id
		 * @example
		 * 		seajs.use(['module/RoleInfo'], function(roleInfo) {
		 * 			roleInfo.addRole('');
		 * 		});
		 */
		addRole: function(source) {
			dialog.show({
				sizeClass: 'modal-sm',
				title: '创建角色',
				content: [
					'<div class="form-horizontal">',
						'<div class="form-group">',
							'<label class="col-sm-4 control-label">角色名：</label>',
							'<div class="col-sm-8">',
								'<input type="text" value="" class="role-name form-control" maxLength="30" placeholder="请输入角色名"/>',
							'</div>',
						'</div>',
						'<div class="form-group">',
							'<label class="col-sm-4 control-label">roleKey：</label>',
							'<div class="col-sm-8">',
								'<input type="text" value="" class="role-sign form-control" maxLength="30" placeholder="请输入roleKey"/>',
							'</div>',
						'</div>',
						'<div class="form-group">',
							'<label class="col-sm-4 control-label">描述：</label>',
							'<div class="col-sm-8">',
								'<input type="text" value="" class="description form-control" maxLength="30" placeholder="请输入角色描述"/>',
							'</div>',
						'</div>',
						'<div class="form-group">',
							'<div class="col-sm-offset-4 col-sm-8">',
								'<div class="checkbox">',
									'<label><input class="status" type="checkbox" checked>&nbsp;禁用</label>',
								'</div>',
							'</div>',
						'</div>',
					'</div>'
				].join(''),
				source: source,
				confirm: function() {
					var Self = this, container, data = {},
						validator = new Validator(),
						roleName, roleSign;
					container = Self._container;
					// validate data
					roleName = container.find('.role-name');
					data.roleName = roleName.val().trim();
					roleSign = container.find('.role-sign');
					data.roleSign = roleSign.val().trim();
					validator.add(data.roleName, 'isNotEmpty', function() {
						alert('请输入角色名');
						roleName.val('').focus();
					}).add(data.roleSign, 'isNotEmpty', function() {
						alert('请输入roleKey');
						roleSign.val('').focus();
					});
					if(!validator.start()) {
						Self.enableConfirm();
						return;
					}
					data.description = container.find('.description').val().trim();
					data.status = container.find('.status').prop('checked') ? 1 : 0; 
					ajaxPromise({
						url: window.basePath + 'role/addRole',
						type: 'POST',
						data: data,
						dataType: 'json'
					}).then(function(data) {
						document.location.reload();
					}, function() {
						Self.enableConfirm();
					});
				}
			});
		},
		/**
		 * 编辑角色
		 * @param {Object} data 角色数据
		 * @example
		 * 		seajs.use(['module/RoleInfo'], function(roleInfo) {
		 * 			// 角色数据取自dataset
		 * 			roleInfo.editRole({
		 * 				id: '',
		 * 				roleName: '',
		 * 				roleSign: '',
		 * 				description: '',
		 * 				status: ''
		 * 			});
		 * 		});
		 */
		editRole: function(config) {
			dialog.show({
				sizeClass: 'modal-sm',
				title: '编辑角色',
				content: roleInfoTmpl(config),
				force: 1,
				confirm: function() {
					var Self = this, validator = new Validator(), container, data, roleName, roleSign;
					data = {
						id: config.id
					};
					container = Self._container;
					roleName = container.find('.role-name');
					data.roleName = roleName.val().trim();
					roleSign = container.find('.role-sign');
					data.roleSign = roleSign.val().trim();
					validator.add(data.roleName, 'isNotEmpty', function() {
						alert('请输入角色名');
						roleName.val('').focus();
					}).add(data.roleSign, 'isNotEmpty', function() {
						alert('请输入roleKey');
						roleSign.val('').focus();
					});
					if(!validator.start()) {
						Self.enableConfirm();
						return;
					}
					data.description = container.find('.description').val().trim();
					data.status = container.find('.status').prop('checked') ? 1 : 0; 
					ajaxPromise({
						url: window.basePath + 'role/updateRole',
						type: 'POST',
						data: data,
						dataType: 'json'
					}).then(function(data) {
						document.location.reload();
					}, function() {
						Self.enableConfirm();
					});
				}
			});
		},
		/**
		 * 角色授权
		 * @param  {Number|String} roleId 角色id
		 * @example
		 * 		seajs.use('module/RoleInfo', function(roleInfo) {
		 * 			roleInfo(12);
		 * 		});
		 */
		authority: function(roleId) {
			ajaxPromise({
				url: window.basePath + 'resources/listJson',
				type: 'GET',
				data: {
					roleId: roleId
				},
				dataType: 'json'
			}).then(function(data) {
				var menu;
				menu = data.result;
				getLeafNum(menu);
				dialog.show({
					sizeClass: 'modal-lg',
					title: '角色授权',
					content: [
						'<div class="table-scroll">',
							'<table class="table table-bordered table-middle">',
								'<thead>',
									'<tr>',
										'<th class="min-w100">目录</th>',
										'<th class="min-w100">子目录/菜单</th>',
										'<th class="min-w200">菜单</th>',
									'</tr>',
								'</thead>',
								'<tbody class="menu-list"></tbody>',
							'</table>',
						'</div>'
					].join(''),
					force: 1,
					renderCall: function() {
						var Self = this, menuList;
						menuList = Self._body.find('.menu-list');
						menuList.html(authorityTmpl({
							menu: menu
						}));
						Self.checkList = menuList.find('.menu-check');
						Self._body.on('click.bs.custom', '.menu-check', function(e) {
							var el = $(this), parentNodes = [], curIndex, curIndices, parentIndex, curChecked, parentNode;
							curChecked = el.prop('checked');
							curIndex = el.data('index') + '';
							if(curChecked) {
								curIndices = curIndex.split('-');
								curIndices.pop();
								while(curIndices.length) {
									parentIndex = curIndices.join('-');
									parentNode = Self.checkList.filter('[data-index=' + parentIndex + ']')[0];
									if(parentNode) {
										parentNodes.push(parentNode);
									}
									curIndices.pop();
								}
								$(parentNodes).prop('checked', true);
							}
							Self.checkList.filter('[data-index^=' + curIndex + '-]').prop('checked', curChecked);
						}).on('hide.bs.modal', function(e) {
							delete Self.checkList;
						});
					},
					confirm: function() {
						var Self = this;
						ajaxPromise({
							url: window.basePath + 'role/authentic',
							type: 'POST',
							data: {
								roleId: roleId,
								resId: Self.checkList.filter(':checked').map(function(i) {
									return $(this).data('id');
								}).get().join()
							},
							dataType: 'json'
						}).then(function(data) {
							alert('授权完成');
							document.location.reload();
						}, function() {
							Self.enableConfirm();
						});
					}
				});
			});
		}
	};
	return roleInfo;
});