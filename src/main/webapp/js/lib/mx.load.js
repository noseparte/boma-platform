/**
 * MX加载器
 *            @example
 *            MX.load({
 *                js : 'page/roseLive',
 *                version : '140916',
 *                success : function(){
 *                    seajs.use('page/roseLive');
 *                }
 *            });
 *            
 *            MX.load({
 *                css : 'roseLive/style',
 *                version : '140916'
 *            });
 */
(function() {
	var base = window.basePath,
		setAttr = function(el, option) {
			var i;
			for(i in option) {
				el.setAttribute(i, option[i]);
			}
		},
		append = function(el) {
			document.getElementsByTagName('head')[0].appendChild(el);
		},
		getScript = function(url, callback) {
			var el = document.createElement('script');
			el.onload = function(){
				if (callback) {
					callback();
				}
				el = null;
			};
			setAttr(el, {
				type : 'text/javascript',
				src : url,
				async : 'true'
			});
			append(el);
		},
		getCss = function(url, callback){
			var style = document.createElement('link');
			setAttr(style, {
				rel : 'stylesheet'
			});
			append(style);
			setAttr(style, {
				href : url
			});
			if (callback){
				style.onload = function(){
					callback();
				};
			}
		};
	MX = window.MX || {};
	MX.load = function(option) {
		var isScript = option.js, // 是否为JS
			fileType = isScript ? '.js' : '.css', // 文件后缀名
			notDebug = location.search.indexOf('jsDebug') == -1, // 非开发模式
			name = option.js || option.css, // 模块名
			isNewApp = name.indexOf('http://') == -1, // 是否为新闻客户端素材
			path , // 路径
			url,
			urlHash;
		if(isNewApp) {
			name = (isScript ? 'js/' : 'css/') + name;
			path = (option.path || base) + name + (!notDebug && !isScript ? '.source' : '');
			url = path + (option.version ? ('_' + option.version) : '') + fileType;
		} else {
			url = name;
		}
		if(!notDebug) {
			urlHash = url.split('#');
			url = urlHash[0];
			url = url + (url.indexOf('?') != -1 ? '&' : '?') + 'r=' + Math.random();
			if(urlHash[1]) {
				url = url + '#' + urlHash[1];
			}
		}
		if (isScript){
			getScript(url, option.success);
		}
		else {
			getCss(url, option.success);
		}
	};
}());
