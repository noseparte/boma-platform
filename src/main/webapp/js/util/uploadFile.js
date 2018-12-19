define('util/uploadFile', ['util/ajaxPromise'], function(require) {
	'use strict';
	var uploadFile,
		ajaxPromise = require('util/ajaxPromise');
	/**
	 * 批量上传文件
	 * @param  {Array} files  文件队列
	 * @param  {Object} config 配置参数
	 * @config {String} url 请求链接
	 * @config {String} name 请求参数名
	 * @config {Object} data 其他请求参数
	 * @return {Promise}
	 * @example
	 * 		seajs.use(['lib/jquery', util/uploadFile', 'util/artTemplate'], function($, uploader, tmpl) {
	 * 			uploader(files, {
	 * 				url: window.basePath + '',
	 * 				name: 'file'
	 * 			}).then(function(results) {
	 * 			var len, errorResults, errorTmpl, container;
	 * 			errorResults = results.filter(function(o) {
	 * 				return o.status !== 0;
	 * 			});
	 * 			len = errorResults.length;
	 * 			container = Self._container;
	 * 			if(len > 0) {
	 * 				errorTmpl = tmpl.compile([
	 * 					'<div style="color:#c00;">本组图片处理完毕，以下压缩包上传失败：</div>',
	 * 					'<ul>',
	 * 						'{{each data}}',
	 * 						'<li>',
	 * 							'{{$value.name}}-{{$value.msg}}',
	 * 						'</li>',
	 * 						'{{/each}}',
	 * 					'</ul>',
	 * 					'<div style="color:#c00;">请修复问题文件重新上传！</div>'
	 * 				].join(''));
	 * 				container.html(errorTmpl({data: errorResults}));
	 * 			} else {
	 * 				container.text('本组图片处理完毕，全部上传成功！');
	 * 			}
	 * 		});
	 */
	uploadFile = function(files, config) {
		var defaultConfig, i, len, formData, file, results = [];
		files = files || [];
		if(files.constructor === File) {
			files = [files];
		}
		len = files.length;
		if(len === 0) {
			return;
		}
		defaultConfig = {
			name: 'file',
			url: window.basePath + 'fileupload/uploadLocalImage'
		};
		config = $.extend(defaultConfig, config);
		config.data = config.data || {};
		return Promise.all(Array.prototype.map.call(files, function(file) {
			formData = new window.FormData();
			$.each(config.data, function(i, o) {
				formData.append(i, o);
			});
			formData.append(config.name, file, file.name);
			return ajaxPromise({
				url: config.url,
				method: 'POST',
				data: formData,
				// 自动生成boundray 提高文件传输效率
				contentType: false,
				processData: false,
				dataType: 'json'
			}, {
				resolveError: 1
			});
		}));
	};
	window.uploadFile = uploadFile;
	return uploadFile;
});