define('module/AnnouncementInfo', ['lib/jquery', 'module/Dialog', 'module/Validator', 'util/artTemplate', 'util/ajaxPromise'], function(require) {
	'use strict';
	var $, Dialog, Validator, imgInput, tmpl, ajaxPromise, 
		AnnouncementInfo, bannerTmpl, versionTmpl, dialog, loadVersion;
	$ = require('lib/jquery');
	Dialog = require('module/Dialog');
	Validator = require('module/Validator');
	tmpl = require('util/artTemplate');
	ajaxPromise = require('util/ajaxPromise');
	/**
	 * 加载版本
	 * @return {Promise} 加载版本承诺
	 */
	loadVersion = function() {
		return ajaxPromise({
			url: window.basePath + 'tool/getVersionsComboBoxList',
			type: 'GET',
			dataType: 'json'
		}).then(function(data) {
			var versionInfo;
			versionInfo = data.result.versionsList;
			versionInfo.unshift({
				api_version: '全部'
			});
			return versionInfo;
		});
	};
	// banner模板
	bannerTmpl = tmpl.compile([
		'<div class="form-horizontal">',
			'<div class="form-group">',
				'<label class="col-sm-2 control-label">公告内容：</label>',
				'<div class="col-sm-10">',
					'<input type="text" class="form-control banner-content" maxlength="30" value="{{content}}">',
				'</div>',
			'</div>',
			'<div class="form-group">',
				'<label class="col-sm-2 control-label">区服：</label>',
				'<div class="col-sm-10">',
					'<select class="form-control app-version"></select>',
				'</div>',
			'</div>',
		'</div>'
	].join(''));
	// 版本模板
	versionTmpl = tmpl.compile([
		'{{each versions}}',
			'<option value="{{$value.app_version}}" {{if appVersion === $value.app_version}}selected{{/if}}>{{$value.api_version}}</option>',
		'{{/each}}'
	].join(''));
	dialog = new Dialog('modal-dialog');
	AnnouncementInfo = {
		/**
		 * 发送公告
		 * @param {String} source 来源id
		 * @example
		 * 		seajs.use('module/PushInfo', function(PushInfo) {
		 * 			PushInfo.addHotPush('add-hot-push');
		 * 		});
		 */
		addSendAnnouncement: function() {
			dialog.show({
				sizeClass: 'modal-lg',
				title: '新增公告',
				content: [
					'<div class="form-horizontal">',
					'<div class="form-group">',
					'<label class="col-sm-2 control-label">标题：</label>',
					'<div class="col-sm-10">',
					'<textarea class="form-control hot-title" rows="3"></textarea>',
					'</div>',
					'</div>',
					'<div class="form-group">',
					'<label class="col-sm-2 control-label">专题id：</label>',
					'<div class="col-sm-10">',
					'<input type="text" class="form-control post-id" maxlength="30">',
					'</div>',
					'</div>',
					'<div class="form-group">',
					'<label class="col-sm-2 control-label">APP版本：</label>',
					'<div class="col-sm-10">',
					'<select class="form-control app-version"></select>',
					'</div>',
					'</div>',
					'<div class="form-group">',
					'<label class="col-sm-2 control-label">操作系统：</label>',
					'<div class="col-sm-10">',
					'<select class="form-control operate-system">',
					'<option value="all">全部</option>',
					'<option value="android">android</option>',
					'<option value="iphone">iOS</option>',
					'</select>',
					'</div>',
					'</div>',
					'<div class="form-group">',
					'<label class="col-sm-2 control-label">年级：</label>',
					'<div class="col-sm-10">',
					'<div class="checkbox grade">',
					'<label class="checkbox-inline"><input type="checkbox" name="grade-all" value="0" class="check-all">全部年级</label>',
					'<br>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="31">一年级</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="32">二年级</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="33">三年级</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="34">四年级</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="35">五年级</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="36">六年级</label>',
					'<br>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="3">初一</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="4">初二</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="5">初三</label>',
					'<br>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="6">高一</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="8">高二</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="grade" value="9">高三</label>',
					'</div>',
					'</div>',
					'</div>',
					'<div class="form-group">',
					'<label class="col-sm-2 control-label">地区：</label>',
					'<div class="col-sm-10">',
					'<div class="checkbox district">',
					'<label class="checkbox-inline"><input type="checkbox" name="district-all" class="check-all" value="0">全部地区</label>',
					'<br>',
					'<label class="checkbox-inline">华东地区:</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="山东">山东</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="江苏">江苏</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="安徽">安徽</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="浙江">浙江</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="福建">福建</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="上海">上海</label>',
					'<br>',
					'<label class="checkbox-inline">华南地区:</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="广东">广东</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="广西">广西</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="海南">海南</label>',
					'<br>',
					'<label class="checkbox-inline">华中地区:</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="湖北">湖北</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="湖南">湖南</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="河南">河南</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="江西">江西</label>',
					'<br>',
					'<label class="checkbox-inline">华北地区:</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="北京">北京</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="天津">天津</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="河北">河北</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="山西">山西</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="内蒙古">内蒙古</label>',
					'<br>',
					'<label class="checkbox-inline">西北地区:</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="宁夏">宁夏</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="新疆">新疆</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="青海">青海</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="陕西">陕西</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="甘肃">甘肃</label>',
					'<br>',
					'<label class="checkbox-inline">西南地区:</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="四川">四川</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="云南">云南</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="贵州">贵州</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="西藏">西藏</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="重庆">重庆</label>',
					'<br>',
					'<label class="checkbox-inline">东北地区:</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="辽宁">辽宁</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="吉林">吉林</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="黑龙江">黑龙江</label>',
					'<br>',
					'<label class="checkbox-inline">港澳台地区:</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="香港">香港</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="澳门">澳门</label>',
					'<label class="checkbox-inline"><input type="checkbox" name="district" value="台湾">台湾</label>',
					'</div>',
					'</div>',
					'</div>',
					'</div>'
				].join(''),
				initial: function() {
					var Self = this, container = Self._container;
					container.find('.hot-title').val('');
					container.find('.post-id').val('');
					container.find('.app-version').val('all');
					container.find('.operate-system').val('all');
				},
				renderCall: function() {
					var Self = this,
						container = Self._container,
						checkGrade = container.find('.grade'),
						checkDistrict = container.find('.district');
					loadVersion().then(function (versionInfo) {
						container.find('.app-version').html(versionTmpl({
							versions: versionInfo,
							appVersion: 'all'
						}));
					});
					checkGrade.on('click', 'input', function(e) {
						var el = $(this),
							checkList = checkGrade.find('input[name=grade]'),
							checkAll = checkGrade.find('.check-all');
						if(el.hasClass('check-all')) {
							if(el.prop('checked')) {
								checkList.prop('checked', true);
							} else {
								checkList.prop('checked', false);
							}
						} else if(checkAll.prop('checked') && !el.hasClass('check-all') && !el.prop('checked')) {
							checkAll.prop('checked', false);
						} else if(!checkAll.prop('checked') && !el.hasClass('check-all') && !checkList.filter(':not(:checked)').length) {
							checkAll.prop('checked', true);
						}
					});
					checkDistrict.on('click', 'input', function(e) {
						var el = $(this),
							checkList = checkDistrict.find('input[name=district]'),
							checkAll = checkDistrict.find('.check-all');
						if(el.hasClass('check-all')) {
							if(el.prop('checked')) {
								checkList.prop('checked', true);
							} else {
								checkList.prop('checked', false);
							}
						} else if(checkAll.prop('checked') && !el.hasClass('check-all') && !el.prop('checked')) {
							checkAll.prop('checked', false);
						} else if(!checkAll.prop('checked') && !el.hasClass('check-all') && !checkList.filter(':not(:checked)').length) {
							checkAll.prop('checked', true);
						}
					});
				},
				confirm: function() {
					var Self = this,
						container = Self._container, data = {},
						hotTitle, postId, validator, allGradeCheck, allDistrictCheck;
					validator = new Validator();
					hotTitle = container.find('.hot-title');
					data.title = hotTitle.val().trim();
					postId = container.find('.post-id');
					data.specialId = postId.val().trim();
					allGradeCheck = container.find('.grade input[name=grade-all]');
					allDistrictCheck = container.find('.district input[name=district-all]');
					if(allGradeCheck.prop('checked')) {
						data.gradeIdArray = [allGradeCheck.val()].join();
					} else {
						data.gradeIdArray = $.map(container.find('.grade input[name=grade]').filter(':checked'), function(el) {
							return $(el).val();
						}).join();
					}
					if(allDistrictCheck.prop('checked')) {
						data.provinceIdArray = [allDistrictCheck.val()].join();
					} else {
						data.provinceIdArray = $.map(container.find('.district input[name=district]').filter(':checked'), function(el) {
							return $(el).val();
						}).join();
					}
					validator.add(data.title, 'isNotEmpty', function() {
						alert('标题不能为空');
						hotTitle.val('').focus();
					}).add(data.specialId, 'isNotEmpty', function() {
						alert('专题id不能为空');
						postId.val('').focus();
					}).add(data.gradeIdArray, 'isNotEmpty', function() {
						alert('年级不能为空');
					}).add(data.provinceIdArray, 'isNotEmpty', function() {
						alert('地区不能为空');
					});
					if(!validator.start()) {
						Self.enableConfirm();
						return;
					}
					data.os = container.find('.operate-system').val();
					data.version = container.find('.app-version').val();
					ajaxPromise({
						url: window.basePath + 'tool/insertAnnouncement',
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
		}
	};
	return AnnouncementInfo;
});