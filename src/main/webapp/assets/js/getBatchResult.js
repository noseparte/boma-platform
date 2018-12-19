(function($, win) {
	'use strict';
	win.getBatchResult = function(batchId, config) {
		var config = config || {};
		config = $.extend({
			displayMode: 1
		}, config);
		$.ajax({
			url: win.basePath + 'batchfileupload/getBatchResult',
			type: 'POST',
			data: {
				batchId: batchId
			},
			dataType: 'json',
			success: function(data) {
				var search = document.location.search.replace(/[?&]displayMode=[^&]*/, '');
				if(data.status === 0) {
					document.location.href = win.basePath + 'batchpicture/orcPictureViewSearch' + (search ? search + '&' : '?') + 'displayMode=' + config.displayMode;
				} else {
					alert(data.msg);
				}
			}
		});
	};
}(jQuery, window));