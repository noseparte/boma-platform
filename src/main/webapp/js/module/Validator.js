define('module/Validator', [], function(require) {
	'use strict';
	var Validator, strategy;
	/**
	 * tests whether all elements in the array pass the test implemented by the provided function
	 * @param  {Function} callback Function to test for each element, taking tree arguments [currentValue, index, array]
	 * @param {Object} [thisArg] Value to use as this when executing callback
	 * @return {Boolean} test result
	 * @example
	 * 		this.cache.every(function(o) {
	 * 			return o();
	 * 		});
	 */
	Array.prototype.every = Array.prototype.every || function(callback, thisArg) {
		var i, len;
		for(i = 0, len = this.length; i < len; ++i) {
			if(!callback.call(thisArg, this[i], i, this)) {
				return false;
			}
		}
		return true;
	};
	strategy = {
		/**
		 * 非空
		 * @param  {Any}   value    值
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'isNotEmpty'
		 */
		isNotEmpty: function(value, callback) {
			if(!value) {
				callback();
				return false;
			}
			return true;
		},
		/**
		 * 正数
		 * @param  {Any}   value    值
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'isPositiveNum'
		 */
		isPositiveNum: function(value, callback) {
			if(isNaN(value) || value <= 0) {
				callback();
				return false;
			}
			return true;
		},
		/**
		 * 自然数
		 * @param  {Any}   value    值
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'isNaturalNum'
		 */
		isNaturalNum: function(value, callback) {
			if(isNaN(value) || value < 0) {
				callback();
				return false;
			}
			return true;
		},
		/**
		 * 手机号格式
		 * @param  {Any}   value    值
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'mobileFormat'
		 */
		mobileFormat: function(value, callback) {
			if(!/^1\d{10}$/.test(value)) {
				callback();
				return false;
			}
			return true;
		},
		/**
		 * 身份证号格式
		 * @param  {Any}   value    值
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'idNumberFormat'
		 */
		idNumberFormat: function(value, callback) {
			if(!/^\d{14,17}(?:\d|x)$/i.test(value)) {
				callback();
				return false;
			}
			return true;
		},
		/**
		 * 教师资格证号格式
		 * @param  {Any}   value    值
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'teacherCertificateFormat'
		 */
		teacherCertificateFormat: function(value, callback) {
			if(!/^\d{17}$/i.test(value)) {
				callback();
				return false;
			}
			return true;
		},
		/**
		 * 教龄合法性验证
		 * @param  {Any}   value    值
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'teachAge'
		 */
		teachAge: function(value, callback) {
			if(!/^\d{1,2}$/i.test(value)) {
				callback();
				return false;
			}
			return true;
		},
		/**
		 * 最大长度限制
		 * @param  {Any}   value    值
		 * @param  {Number}   length   长度
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'maxLength:3'
		 */
		maxLength: function(value, length, callback) {
			if(value.length > length) {
				callback();
				return false;
			}
			return true;
		},
		/**
		 * 最小长度限制
		 * @param  {Any}   value    值
		 * @param  {Number}   length   长度
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'minLength:3'
		 */
		minLength: function(value, length, callback) {
			if(value.length < length) {
				callback();
				return false;
			}
			return true;
		},
		/**
		 * 强等判断
		 * @param  {Any}   value    值
		 * @param  {Any}   anotherValue   对比值
		 * @param  {Function} callback 回调函数
		 * @return {Boolean}  验证结果
		 * @rule 'identical:xxx'  字符串对比
		 * @rule 'identical', 3
		 */
		identical: function(value, anotherValue, callback) {
			if(value !== anotherValue) {
				callback();
				return false;
			}
			return true;
		}
	};
	/**
	 * @constructor 验证器
	 * @example
	 * 		seajs.use('module/Validator', function(Validator) {
	 * 			var validator = new Validator()
	 * 		});
	 */
	Validator = function() {
		this.cache = [];
	};
	Validator.prototype = {
		/**
		 * 添加验证规则
		 * @param {Any}   value    值
		 * @param {String}   rule     规则
		 * @param {Function} callback... 不定参数 最后一个参数为回调函数
		 * @return {Validator} 支持链式调用
		 * @example
		 * 		validator.add(value, 'maxLength:3', function() {
		 * 			// TODO
		 * 		}).add(value, 'identical', 5, function() {
		 * 			// TODO
		 * 		});
		 */
		add: function(value, rule, callback) {
			var params = rule.split(':'), callback = params.slice.call(arguments, 2);
			this.cache.push(function() {
				var name = params.shift();
				params.unshift(value);
				params.push.apply(params, callback);
				return strategy[name].apply(null, params);
			});
			return this;
		},
		/**
		 * 开始验证
		 * @return {Boolean} 验证结果
		 * @example
		 * 		validator.start();
		 */
		start: function() {
			var flag = this.cache.every(function(o) {
				return o();
			});
			this.cache = [];
			return flag;
		}
	};
	return Validator;
});