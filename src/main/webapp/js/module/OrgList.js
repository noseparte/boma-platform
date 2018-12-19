define('module/OrgList', ['lib/jquery', 'util/artTemplate', 'module/Dialog', 'module/Validator', 'util/ajaxPromise'], function(require) {
	'use strict';
	var $, tmpl, dialog, Dialog, Validator, ajaxPromise,
		orgList, optionTmpl, orgInfoTmpl, statusTmpl, getCity;
	$ = require('lib/jquery');
	tmpl = require('util/artTemplate');
	Dialog = require('module/Dialog');
	Validator = require('module/Validator');
	ajaxPromise = require('util/ajaxPromise');
	dialog = new Dialog('modal-dialog');
	orgInfoTmpl = tmpl.compile([
		'<div class="form-horizontal">',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">机构名：</label>',
				'<div class="col-sm-8">',
					'<input type="text" value="{{orgName}}" class="org-name form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">省份：</label>',
				'<div class="col-sm-8">',
					'<select class="province form-control">',
						'{{#provinces}}',
					'</select>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-4 control-label">市/区：</label>',
				'<div class="col-sm-8">',
					'<select class="city form-control">',
						'<option value="">全部</option>',
					'</select>',
				'</div>',
			'</div>',
		'</div>'
	].join(''));
	// 状态模板
	statusTmpl = tmpl.compile([
		'<div class="form-group">',
			'<label class="col-sm-4 control-label">状态：</label>',
			'<div class="col-sm-8">',
				'<select class="status form-control">',
					'<option {{if status===1}}selected="selected"{{/if}} value="1">启用</option>',
					'<option {{if status===0}}selected="selected"{{/if}} value="0">禁用</option>',
				'</select>',
			'</div>',
		'</div>',
	].join(''));
	// 下拉模板
	optionTmpl = tmpl.compile([
		'{{each options}}',
			'<option value="{{$value.id}}">{{$value.name}}</option>',
		'{{/each}}'
	].join(''));
	/**
	 * 获取市/区
	 * @param  {Object} data 请求参数
	 * @provinceid {String} 省份id
	 * @param  {jQuery} citySelect 城市select
	 * @param  {String} cityId 当前城市id
	 */
	getCity = function(data, citySelect, cityId) {
		if(data.provinceid) {
			ajaxPromise({
				url: window.basePath + 'city/getCityComboBoxList',
				type: 'GET',
				data: data,
				dataType: 'json'
			}).then(function(data) {
				var citys = data.result;
				if(citys.length) {
					citys.unshift({
						id: '',
						name: '全部'
					});
					citySelect.html(optionTmpl({
						options: citys
					}));
				}
				if(cityId) {
					citySelect.val(cityId);
				}
			});
		}
	};
	orgList = {
		/**
		 * 机构初始化
		 */
		initOrganizations: function(organizationSelect, organizations) {
			var Self = orgList, i, len, item;
			for(i = 0, len = organizations.length; i < len; i++) {
				item = organizations[i];
				organizationSelect.append('<option value=' + item.id + '>' + item.name + '</option>');
			}
			Self.organizations = organizationSelect.html();
		},
		/**
		 * 获取省份下拉列表
		 * @param  {String} provinces 省份下拉列表html
		 * @example
		 * 		seajs.use('module/DistrictInfo', function(districtInfo) {
		 * 			districtInfo.getProvinces(provinceSelect.html());
		 * 		});
		 */
		initProvinces: function(provinceSelect, provinces) {
			var Self = orgList, i, len, item;
			for(i = 0, len = provinces.length; i < len; i++) {
				item = provinces[i];
				provinceSelect.append('<option value=' + item.id + '>' + item.name + '</option>');
			}
			Self.provinces = provinceSelect.html();
		},
		/**
		 * 初始化城市联动选择
		 * @param {jQuery} provinceSelect 省份下拉列表
		 * @param {jQuery} citySelect 城市下拉列表
		 * @param {String} [curProvince] 当前省份
		 * @param {String} [curCity] 当前城市
		 * @example
		 * 		seajs.use('module/DistrictInfo', function(districtInfo) {
		 * 			districtInfo.initChainCity(provinceSelect, citySelect);
		 * 			districtInfo.initChainCity(provinceSelect, citySelect, '1000');
		 * 			districtInfo.initChainCity(provinceSelect, citySelect, '15', '2000');
		 * 		});
		 */
		initChainCity: function(provinceSelect, citySelect, curProvince, curCity) {
			var Self = orgList;
			getCity({
				provinceid: curProvince
			}, citySelect, curCity);
			provinceSelect.on('change', function(e) {
				var data = {};
				citySelect.html('<option value="">全部</option>');
				data.provinceid = $(this).val();
				getCity(data, citySelect);
			});
		},
		/**
		 * 新建机构
		 * @param {String} source 来源
		 * @example
		 * 		seajs.use('module/OrgList', function(orgList) {
		 * 			orgList.addOrg($('.add-org-btn').attr('id'));
		 * 		});
		 */
		addOrg: function(source) {
			var Self = orgList;
			dialog.show({
				sizeClass: 'modal-sm',
				title: '新增教育机构',
				content: orgInfoTmpl({
					provinces: Self.provinces,
					orgName: ''
				}),
				source: source,
				initial: function() {
					var Self = this, container, provinceSelect, citySelect;
					container = Self._container;
					container.find('.org-name').val('');
					container.find('.province').val('');
					container.find('.city').val('');
				},
				renderCall: function() {
					var me = this, container;
					container = me._container;
					Self.initChainCity(container.find('.province'), container.find('.city'));
				},
				confirm: function() {
					var Self = this, validator = new Validator(),
						container, _orgName, data = {};
					container = Self._container;
					_orgName = container.find('.org-name');
					data.orgName = _orgName.val().trim();
					data.provinceId = container.find('.province').val();
					data.cityId = container.find('.city').val();
					validator.add(data.orgName, 'isNotEmpty', function() {
						alert("机构名称不能为空");
						_orgName.val('').focus();
					}).add(data.provinceId, 'isNotEmpty', function() {
						alert('请选择省份');
					}).add(data.cityId, 'isNotEmpty', function() {
						alert('请选择城市');
					});
					if(!validator.start()) {
						Self.enableConfirm();
						return;
					}
					ajaxPromise({
						url: window.basePath + 'org/addOrg',
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
		},
		/**
		 * 编辑机构
		 * @param {String} source 来源
		 * @example
		 * 		seajs.use('module/OrgList', function(orgList) {
		 * 			orgList.addOrg($('.edit-org-btn').attr('id'));
		 * 		});
		 */
		editOrg: function(data) {
			var Self = orgList, status = data.status, id = data.id;
			dialog.show({
				sizeClass: 'modal-sm',
				title: '编辑教育机构',
				content: orgInfoTmpl({
					orgName: '',
					provinces: Self.provinces
				}),
				source: '',
				initial: function() {
					var Self = this, container;
					container = Self._container;
					if(!container.find('.status').length) {
						container.find('.form-horizontal').append(statusTmpl({
							status: status
						}));
					}
					container.find('.org-name').val(data.orgName);
					container.find('.province').val(data.provinceId);
					getCity({
						provinceid: data.provinceId
					}, container.find('.city'), data.cityId || '');

				},
				renderCall: function() {
					var me = this, container;
					container = me._container;
					Self.initChainCity(container.find('.province'), container.find('.city'));
				},
				confirm: function() {
					var Self = this, validator = new Validator(),
						container, _orgName, data = {};
					container = Self._container;
					_orgName = container.find('.org-name');
					data.orgName = _orgName.val().trim();
					data.id = id;
					data.provinceId = container.find('.province').val();
					data.cityId = container.find('.city').val();
					data.status = container.find('.status').val();
					validator.add(data.orgName, 'isNotEmpty', function() {
						alert("机构名称不能为空");
						_orgName.val('').focus();
					}).add(data.provinceId, 'isNotEmpty', function() {
						alert('请选择省份');
					}).add(data.cityId, 'isNotEmpty', function() {
						alert('请选择城市');
					});
					if(!validator.start()) {
						Self.enableConfirm();
						return;
					}
					ajaxPromise({
						url: window.basePath + 'org/editOrg',
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
		}
	};
	return orgList;
});
