define('module/TeacherList', ['lib/jquery', 'util/artTemplate', 'module/Dialog', 'module/Validator', 'util/ajaxPromise'], function(require) {
	'use strict';
	var $, tmpl, dialog, Dialog, Validator, ajaxPromise,
		teacherList, optionTmpl, techerInfoTmpl, getCity;
	$ = require('lib/jquery');
	tmpl = require('util/artTemplate');
	Dialog = require('module/Dialog');
	Validator = require('module/Validator');
	ajaxPromise = require('util/ajaxPromise');
	dialog = new Dialog('modal-dialog');
	// 教师信息模板
	techerInfoTmpl = tmpl.compile([
		'<div class="form-horizontal">',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">手机号：</label>',
				'<div class="col-lg-9">',
					'<input type="text" data-teacher-id="{{teacherId}}" value="{{phoneNumber}}" class="teacher-phone-number form-control" disabled maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">姓名：</label>',
				'<div class="col-lg-9">',
					'<input type="text" value="{{name}}" class="teacher-name form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">昵称：</label>',
				'<div class="col-lg-9">',
					'<input type="text" value="{{nickname}}" class="teacher-nickname form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">性别：</label>',
				'<div class="col-lg-9">',
					'<label class="radio-inline"><input type="radio" name="gender" value="1">男</label>',
					'<label class="radio-inline"><input type="radio" name="gender" value="0">女</label>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">身份证号：</label>',
				'<div class="col-lg-9">',
					'<input type="text" value="{{idNumber}}" class="teacher-identitycard-number form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">省份：</label>',
				'<div class="col-lg-9">',
					'<select class="province form-control">',
						'{{#provinces}}',
					'</select>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">市/区：</label>',
				'<div class="col-lg-9">',
					'<select class="city form-control">',
						'<option value="">请选择</option>',
					'</select>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">教师资格证号：</label>',
				'<div class="col-lg-9">',
					'<input type="text" value="{{idTeacher}}" class="teacher-qualificertificate-number form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">辅导年级：</label>',
				'<div class="col-lg-9">',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="1">小学</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="2">初中</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="3">高中</label>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">辅导学科：</label>',
				'<div class="col-lg-9">',
					'<label class="checkbox-inline"><input type="checkbox" name="subject" value="1">数学</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="subject" value="2">语文</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="subject" value="3">英语</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="subject" value="4">政治</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="subject" value="5">历史</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="subject" value="6">地理</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="subject" value="7">物理</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="subject" value="8">化学</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="subject" value="9">生物</label>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">教龄（年）：</label>',
				'<div class="col-lg-9">',
					'<input type="text" value="{{teachAge}}" class="teacher-teach-age form-control" maxLength="30"/>',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-lg-2 control-label">个人简介：</label>',
				'<div class="col-lg-9">',
					'<textarea class="teacher-description form-control" rows="3"></textarea>',
				'</div>',
			'</div>',
		'</div>'
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
						name: '请选择'
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
	teacherList = {
		/**
		 * 获取省份下拉列表
		 * @param  {String} provinces 省份下拉列表html
		 * @example
		 * 		seajs.use('module/DistrictInfo', function(districtInfo) {
		 * 			districtInfo.getProvinces(provinceSelect.html());
		 * 		});
		 */
		initProvinces: function(provinceSelect, provinces) {
			var Self = teacherList, i, len, item;
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
			var Self = teacherList;
			getCity({
				provinceid: curProvince
			}, citySelect, curCity);
			provinceSelect.val(curProvince);
			provinceSelect.on('change', function(e) {
				var data = {};
				citySelect.html('<option value="">请选择</option>');
				data.provinceid = $(this).val();
				getCity(data, citySelect);
			});
		},
		/**
		 * 新建教师
		 * @param {String} source 来源
		 * @example
		 * 		seajs.use('module/TeacherList', function(teacherList) {
		 * 			teacherList.addTeacher($('.add-org-btn').attr('id'));
		 * 		});
		 */
		addTeacher: function(source) {
			var Self = teacherList, checkPhoneNumber, inputInfo, addTeacherInfo, updateTeacherInfo;
			addTeacherInfo = function(data) {
				ajaxPromise({
					url: window.basePath + 'teacher/addTeacherInfo',
					type: 'GET',
					data: data,
					dataType: 'json'
				}).then(function(data) {
					window.location.reload();
				}, function() {
					Self.enableConfirm();
				});
			};
			updateTeacherInfo = function(data) {
				ajaxPromise({
					url: window.basePath + 'teacher/updateTeacherInfo',
					type: 'GET',
					data: data,
					dataType: 'json'
				}).then(function(data) {
					window.location.reload();
				}, function() {
					Self.enableConfirm();
				});
			};
			checkPhoneNumber = function() {
				dialog.show({
					sizeClass: 'modal-lg',
					title: '新增教师',
					content: [
						'<div class="form-horizontal">',
							'<div class="form-group">',
								'<label class="col-lg-2 control-label">手机号：</label>',
								'<div class="col-lg-9">',
									'<input type="text" class="teacher-phone-number form-control" maxLength="30"/>',
								'</div>',
							'</div>',
						'</div>',
					].join(''),
					source: source,
					initial: function() {
						var Self = this;
					},
					confirm: function() {
						var Self = this, validator = new Validator(),
							container, _phoneNumber, data = {}, phoneNumber;
						container = Self._container;
						_phoneNumber = container.find('.teacher-phone-number');
						data.phoneNumber = _phoneNumber.val().trim();
						phoneNumber = _phoneNumber.val().trim();
						validator.add(data.phoneNumber, 'isNotEmpty', function() {
							alert("手机号码不能为空");
							_phoneNumber.val('').focus();
						}).add(data.phoneNumber, 'mobileFormat', function() {
							alert("手机号码不合法");
							_phoneNumber.val('').focus();
						});
						if(!validator.start()) {
							Self.enableConfirm();
							return;
						}
						ajaxPromise({
							url: window.basePath + 'teacher/validatePhoneNumber',
							type: 'GET',
							data: data,
							dataType: 'json'
						}, {
							resolveError: 1
						}).then(function(data) {
							if(data.status === 0) {
								inputInfo(phoneNumber);
							} else if(data.status === 5) {
								if(comfirm('该教师已被录入，是否直接加入当前机构？')) {
									addTeacherInfo({
										phoneNumber: phoneNumber
									});
								}
							} else {
								alert(data.msg);
							}
						}, function() {
							Self.enableConfirm();
						});
					}
				});
			};
			inputInfo = function(phoneNumber) {
				dialog.show({
					sizeClass: 'modal-lg',
					title: '新增教师',
					content: techerInfoTmpl({
						phoneNumber: phoneNumber,
						provinces: Self.provinces,
					}),
					source: '',
					initial: function() {
						var Self = this, container, provinceSelect, citySelect;
						container = Self._container;
					},
					renderCall: function() {
						var me = this, container;
						container = me._container;
						Self.initChainCity(container.find('.province'), container.find('.city'));
					},
					confirm: function() {
						var Self = this, validator = new Validator(),
							container, data = {},
							_name, _nickName, _idNumber, _idTeacher, _teachAge, _description;
						container = Self._container;
						_name = container.find('.teacher-name');
						_nickName = container.find('.teacher-nickname');
						_idNumber = container.find('.teacher-identitycard-number');
						_idTeacher = container.find('.teacher-qualificertificate-number');
						_teachAge = container.find('.teacher-teach-age');
						_description = container.find('.teacher-description');
						data.phoneNumber = phoneNumber;
						data.name = _name.val().trim();
						data.nickName = _nickName.val().trim();
						data.gender = container.find('input[name=gender]').filter(':checked').val();
						data.idNumber = _idNumber.val().trim();
						data.provinceId = container.find('.province').val();
						data.cityId = container.find('.city').val();
						data.idTeacher = _idTeacher.val().trim();
						data.gradeIdArray = $.map(container.find('input[name=grade]').filter(':checked'), function(el) {
							return $(el).val();
						}).join();
						data.subjectIdArray = $.map(container.find('input[name=subject]').filter(':checked'), function(el) {
							return $(el).val();
						}).join();
						data.courseYear = _teachAge.val().trim();
						data.selfDescription = _description.val().trim();
						validator.add(data.name, 'isNotEmpty', function() {
							alert("姓名不能为空");
							_name.focus();
						}).add(data.name, 'maxLength:8', function() {
							alert("姓名至多8个字");
							_name.focus();
						}).add(data.nickName, 'isNotEmpty', function() {
							alert("昵称不能为空");
							_nickName.focus();
						}).add(data.nickName, 'maxLength:8', function() {
							alert("昵称至多8个字");
							_nickName.focus();
						}).add(data.gender, 'isNotEmpty', function() {
							alert('请选择性别');
						}).add(data.idNumber, 'isNotEmpty', function() {
							alert("身份证号不能为空");
							_idNumber.focus();
						}).add(data.idNumber, 'idNumberFormat', function() {
							alert("身份证号不合法");
							_idNumber.focus();
						}).add(data.provinceId, 'isNotEmpty', function() {
							alert('请选择省份');
						}).add(data.cityId, 'isNotEmpty', function() {
							alert('请选择城市');
						}).add(data.idTeacher, 'isNotEmpty', function() {
							alert("教师资格证号不能为空");
							_idTeacher.focus();
						}).add(data.idTeacher, 'teacherCertificateFormat', function() {
							alert("教师资格证号不合法");
							_idTeacher.focus();
						}).add(data.gradeIdArray, 'isNotEmpty', function() {
							alert('请选择辅导年级');
						}).add(data.subjectIdArray, 'isNotEmpty', function() {
							alert('请选择辅导学科');
						}).add(data.subjectIdArray.split(',').join(''), 'maxLength:2', function() {
							alert('辅导学科至多可选两项');
						}).add(data.courseYear, 'isNotEmpty', function() {
							alert("教龄不能为空");
							_teachAge.focus();
						}).add(data.courseYear, 'teachAge', function() {
							alert("教龄不合法");
							_teachAge.focus();
						}).add(data.selfDescription, 'isNotEmpty', function() {
							alert("个人简介不能为空");
							_description.focus();
						}).add(data.selfDescription, 'maxLength:800', function() {
							alert("个人简介不能超过800字");
							_description.focus();
						});
						if(!validator.start()) {
							Self.enableConfirm();
							return;
						}
						addTeacherInfo(data);
					}
				});
			};
			checkPhoneNumber();
		},
		/**
		 * 编辑教师
		 * @param {String} source 来源
		 * @example
		 * 		seajs.use('module/TeacherList', function(teacherList) {
		 * 			teacherList.addOrg($('.edit-org-btn').attr('id'));
		 * 		});
		 */
		editTeacher: function(data) {
			var Self = teacherList, id = data.teacherId;
			dialog.show({
				sizeClass: 'modal-lg',
				title: '编辑教师',
				content: techerInfoTmpl($.extend({}, data, { provinces: Self.provinces })),
				source: '',
				initial: function() {
					var Self = this, container;
					container = Self._container;
				},
				renderCall: function() {
					var me = this, container, grades, subjects, i, len;
					container = me._container;
					Self.initChainCity(container.find('.province'), container.find('.city'), data.provinceId, data.cityId);
					container.find('input[name=gender][value="' + data.gender + '"]').attr('checked', true);
					grades = data.grades.split(',');
					subjects = data.subjects.split(',');
					for(i = 0, len = grades.length; i < len; i++) {
						container.find('input[name=grade][value="' + grades[i] + '"]').attr('checked', true);
					}
					for(i = 0, len = subjects.length; i < len; i++) {
						container.find('input[name=subject][value="' + subjects[i] + '"]').attr('checked', true);
					}
				},
				confirm: function() {
					var Self = this, validator = new Validator(),
						container, data = {},
						_name, _nickName, _idNumber, _idTeacher, _teachAge, _description;
					container = Self._container;
					_name = container.find('.teacher-name');
					_nickName = container.find('.teacher-nickname');
					_idNumber = container.find('.teacher-identitycard-number');
					_idTeacher = container.find('.teacher-qualificertificate-number');
					_teachAge = container.find('.teacher-teach-age');
					_description = container.find('.teacher-description');
					data.teacherId = id;
					data.phoneNumber = phoneNumber;
					data.name = _name.val().trim();
					data.nickName = _nickName.val().trim();
					data.gender = container.find('input[name=gender]').filter(':checked').val();
					data.idNumber = _idNumber.val().trim();
					data.provinceId = container.find('.province').val();
					data.cityId = container.find('.city').val();
					data.idTeacher = _idTeacher.val().trim();
					data.gradeIdArray = $.map(container.find('input[name=grade]').filter(':checked'), function(el) {
						return $(el).val();
					}).join();
					data.subjectIdArray = $.map(container.find('input[name=subject]').filter(':checked'), function(el) {
						return $(el).val();
					}).join();
					data.courseYear = _teachAge.val().trim();
					data.selfDescription = _description.val().trim();
					validator.add(data.name, 'isNotEmpty', function() {
						alert("姓名不能为空");
						_name.focus();
					}).add(data.name, 'maxLength:8', function() {
						alert("姓名至多8个字");
						_name.focus();
					}).add(data.nickName, 'isNotEmpty', function() {
						alert("昵称不能为空");
						_nickName.focus();
					}).add(data.nickName, 'maxLength:8', function() {
						alert("昵称至多8个字");
						_nickName.focus();
					}).add(data.gender, 'isNotEmpty', function() {
						alert('请选择性别');
					}).add(data.idNumber, 'isNotEmpty', function() {
						alert("身份证号不能为空");
						_idNumber.focus();
					}).add(data.idNumber, 'idNumberFormat', function() {
						alert("身份证号不合法");
						_idNumber.focus();
					}).add(data.provinceId, 'isNotEmpty', function() {
						alert('请选择省份');
					}).add(data.cityId, 'isNotEmpty', function() {
						alert('请选择城市');
					}).add(data.idTeacher, 'isNotEmpty', function() {
						alert("教师资格证号不能为空");
						_idTeacher.focus();
					}).add(data.idTeacher, 'teacherCertificateFormat', function() {
						alert("教师资格证号不合法");
						_idTeacher.focus();
					}).add(data.gradeIdArray, 'isNotEmpty', function() {
						alert('请选择辅导年级');
					}).add(data.subjectIdArray, 'isNotEmpty', function() {
						alert('请选择辅导学科');
					}).add(data.subjectIdArray.split(',').join(''), 'maxLength:2', function() {
						alert('辅导学科至多可选两项');
					}).add(data.courseYear, 'isNotEmpty', function() {
						alert("教龄不能为空");
						_teachAge.focus();
					}).add(data.courseYear, 'teachAge', function() {
						alert("教龄不合法");
						_teachAge.focus();
					}).add(data.selfDescription, 'isNotEmpty', function() {
						alert("个人简介不能为空");
						_description.focus();
					}).add(data.selfDescription, 'maxLength:800', function() {
						alert("个人简介不能超过800字");
						_description.focus();
					});
					if(!validator.start()) {
						Self.enableConfirm();
						return;
					}
					updateTeacherInfo(data);
				}
			});
		}
	};
	return teacherList;
});
