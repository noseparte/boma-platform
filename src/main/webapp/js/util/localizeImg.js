define('util/localizeImg', ['lib/jquery', 'util/ajaxPromise'], function(require) {
	var $ = require('lib/jquery'),
		ajaxPromise = require('util/ajaxPromise');
	 /**
	 * 图片本地化校验，没有被本地化的图片使用默认图片替代
	 * @param {Array} imgs 图片数组
	 * @return {Promise}
	 * @example
	 * 		seajs.use('util/localizeImg', function(localizeImg) {
	 * 			localizeImg([]).then(function(errorFlag) {
	 * 				if(!errorFlag) {
	 * 					// TODO
	 * 				}
	 * 			});
	 * 		});
	 */
	return function(imgs) {
		var internalReg, errorImg, remoteUrls = [];
		internalReg = /^https?:\/\/(?:(?:\d+\.){3}\d+:\d+|.*\.91xuexibao\.com)\/.*/;
		errorImg = window.basePath + 'image/edit/photo-default.png';
		imgs = [].filter.call(imgs, function(img) {
			var $img = $(img),
				imgUrl = $img .attr('src');
			if(!internalReg.test(imgUrl) || !$img.data('width')) {
				remoteUrls.push(encodeURIComponent(imgUrl));
				return true;
			}
		});
		if(remoteUrls[0]) {
			return ajaxPromise({
				url: window.basePath + 'fileupload/uploadRemoteImages',
				type: 'GET',
				dataType: 'json',
				data: {
					remoteUrls: remoteUrls.join()
				}
			}).then(function(data) {
				var errorFlag = false;
				$.each(imgs, function(i) {
					var imgInfo = data.result[i];
					if(!imgInfo.imageUrl) {
						errorFlag = true;
						$(this).attr('src',errorImg);
					} else {
						$(this).attr({
							'src': imgInfo.imageUrl,
							'data-width': imgInfo.width,
							'data-height': imgInfo.height
						});
					}
				});
				return errorFlag;
			});
		} else {
			return Promise.resolve(false);
		}
	};
});