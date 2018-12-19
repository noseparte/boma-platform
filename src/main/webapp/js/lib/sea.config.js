(function() {
	// to be modified
	var base = window.basePath + 'js/';
	seajs
			.config({
				base : base,
				alias : {
					'lib/jquery' : 'lib/jquery.min.js',
					'module/Dialog' : 'module/Dialog_151105.js',
					'module/bootstrapModule' : 'module/bootstrapModule.js',
					'module/MenuInfo' : 'module/MenuInfo_151028.js',
					'module/RoleInfo' : 'module/RoleInfo_151105.js',
					'module/UserInfo' : 'module/UserInfo.js',
					'module/Validator' : 'module/Validator_151030.js',
					'page/login' : 'page/login.js',
					'util/artTemplate' : 'util/artTemplate_150909.js',
					'util/bootstrap.datetimepicker' : 'util/bootstrap-datetimepicker.min.js',
					'util/bootstrap.datetimepicker.zh-CN' : 'util/bootstrap-datetimepicker.zh-CN.js',
					'util/bootstrapModel' : 'util/bootstrapModel.js',
					'util/bootstrap-select.min' : 'util/bootstrap-select.min.js',
					'util/bootstrap-select-zh_CN.min' : 'util/bootstrap-select-zh_CN.min.js',
					'util/jquery.markitup' : 'util/jquery.markitup-1.1.14.min.js',
					'util/localizeImg' : 'util/localizeImg_150914.js',
					'util/uploadFile' : 'util/uploadFile_150914.js',
					// highcharts 图表控件 v6.0.2 不依赖jquery
					'lib/highcharts' : 'lib/highcharts.js',
					// highcharts table 控件
					'lib/highchartTable' : 'lib/highchartTable.js'
				}
			});
	if (window.MX && MX.load) {
		var module = seajs.Module, fetch = module.prototype.fetch, fetchingList = {};
		module.prototype.fetch = function(requestCache) {
			var mod = this;
			seajs.emit('fetch', mod);
			var uri = mod.uri, info, file, version, load;
			if (uri.indexOf(base) !== -1) {
				info = uri.split(base)[1].split('_');
				file = info[0];
				version = info[1];

				if (fetchingList[file]) {
					fetchingList[file].push(mod);
					return;
				}

				fetchingList[file] = [ mod ];

				load = {
					js : file,
					success : function() {
						var mods = fetchingList[file], m;
						delete fetchingList[file];
						m = mods.shift();
						while (m) {
							m.load();
							m = mods.shift();
						}
					}
				};
				if (version) {
					load.version = version.slice(0, -3);
				} else {
					load.js = file.slice(0, -3);
				}
				MX.load(load);
			} else {
				fetch.call(mod, requestCache);
			}
		};
	}
}());
