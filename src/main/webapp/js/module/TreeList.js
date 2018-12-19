/**
 * @description 树形菜单
 * @author jansesun(sunjian@xuexibao.cn)
 */
define('module/TreeList', ['lib/jquery'], function(require) {
	'use strict';
	var $ = require('lib/jquery'),
		TreeList;
	/**
	* @constructor 树形菜单
	* @param {String|jQuery} id 树形菜单id或者dom
	* @param {Object} config 扩展参数
	* @config {String} foldSelector 展开收起选择器
	* @config {String} unfoldClass 展开样式
	* @config {Boolean} isExclusive 是否互斥展开
	* @config {Function} getCurItem 获取当前树形节点对象
	* @example
	*	seajs.use('module/TreeList', function(TreeList) {
	*		var treeNav = new TreeList(nav, {
	*			foldSelector: '.nav-fold',
	*			unfoldClass: 'unfold',
	*			isExclusive: true
	*		});
	*   });
	*/
	TreeList = function(id, config) {
		var Self = this;
		if($.type(id) === 'string') {
			Self._body = $('#' + id);
		} else {
			Self._body = id;
		}
		$.extend(Self, config);
		Self.init();
	};
	TreeList.prototype = {
		/**
		* 导航栏初始化
		*/
		init: function() {
			var Self = this;
			Self.addEvent();
		},
		getCurItem: function(el) {
			return el;
		},
		/**
		* 绑定事件
		*/
		addEvent: function() {
			var Self = this, sameLevelReg, childReg, items;
			items = Self._body.children();
			Self._body.on('click', Self.foldSelector, function(e) {
				var el = $(this), index, curUnfold, curUnfoldIndex, curItem;
				curItem = Self.getCurItem(el);
				e.preventDefault();
				index = curItem.data('index') + '';
				var newSpan = '<span class="fa fa-chevron-down menu-arrow-icon-after"></span>';
				if(curItem.hasClass(Self.unfoldClass)) {
					// 收起子节点
					curItem.filter('.menu-arrow-icon').hide().append(newSpan);
					items.filter('[data-index^="' + index + '-"]').hide().removeClass(Self.unfoldClass);
				} else {
					// 收起同级展开项
					if(Self.isExclusive) {
						curItem.filter('.menu-arrow-icon').hide().removeClass(Self.unfoldClass).append(newSpan);
						sameLevelReg = new RegExp(index.replace(/\d+$/, '') + '\\d+');
						curUnfold = items.filter(function(i) {
							var item = $(this);
							return item.hasClass(Self.unfoldClass) && sameLevelReg.test(item.data('index') + '');
						});
						if(curUnfold[0]) {
							curUnfoldIndex = '' + curUnfold.data('index');
							items.filter('[data-index^="' + curUnfoldIndex + '-"]').hide().removeClass(Self.unfoldClass);
							curUnfold.removeClass(Self.unfoldClass);
						}
					}
					curItem.filter('.menu-arrow-icon').hide().removeClass(Self.unfoldClass).append(newSpan);
					// 展开子节点
					childReg = new RegExp('^' + index + '-\\d+$');
					items.filter(function(i) {
						var item = $(this);
						return childReg.test(item.data('index') + '');
					}).show();
				}
				curItem.toggleClass(Self.unfoldClass);
			});
		}
	};
	return TreeList;
});
