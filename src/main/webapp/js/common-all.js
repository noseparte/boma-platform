//这个页面放所有公共的JS
(function($) {
	$.pagination = function(options) {
		var language = $.extend({}, $.pagination.language, options.language);
		var opts = $.extend({}, $.pagination.defaults, options);
		var render = $(opts.render);
		var page = 1, size = opts.pageSize;
		var load = function() {
			var data = opts.ajaxData;
			if($.isFunction(data)) {
				data = data();
			}
			data = $.extend({}, data, {page: (page - 1) , size: size});
			$.ajax({
				type: opts.ajaxType,
				url: opts.ajaxUrl,
				data: data,
				dataType: 'json',
				beforeSend: opts.beforeSend,
				complete: opts.complete,
				success: function(response) {				 
					if(response.error != 0) {
						if(response.code == '0-1' || response.code == '0-4') {
							if(window.location.pathname=="/index.html") return;
							App.alert('warning', '提示消息', response.message);
							setTimeout(function(){
								var domain = window.location.protocol + '//' + window.location.host;
								window.location.href = domain + '/index.html';
							},1000);
							return;
						}else{
							App.alert('warning', '提示消息', response.message);
						}							
					}					
					if(response.error == 0) {
						if(response.data.totalCount && response.data.totalCount > 0) {
							update(response.data.totalCount);
							if(response.data.list && response.data.list.length > 0) {
								opts.success(response.data.list);
							} else {
								if(page > 1) {
									page--;
									load();
								}
							}
						} else {
							opts.emptyData();
							render.empty();
						}
					} else {
						opts.pageError(response);
					}
				}
			});
		};
		var update = function(totalCount) {
			if(totalCount == 0) return;
			var pageCount = Math.ceil(totalCount/size);
			var pagination = $('<div class="easyweb-pagination">');
			var infos = $('<div class="infos">');
			infos.append(language.infos.replace('${currPage}', '<span class="p">' + page + '</span>').replace('${totalPage}', '<span class="p">' + pageCount + '</span>').replace('${start}', '<span class="s">' + ((page - 1) * size + 1) + '</span>').replace('${end}', '<span class="e">' + (page * size > totalCount ? totalCount : page * size) + '</span>').replace('${total}', '<span class="t">' + totalCount + '</span>'));
			var pages = $('<div class="pages">');
			pages.append($('<a class="top">').html(language.top));
			pages.append($('<a class="prev">').html(language.prev));
			var pageLength = opts.pageLength;
			if(pageCount < pageLength) {
				pageLength = pageCount;
			}
			var startPage = page - (Math.ceil(pageLength/2) - 1);
			var endPage = page + Math.floor(pageLength/2);
			if(startPage < 1) {
				startPage = 1;
				endPage = pageLength;
			}else if(endPage > pageCount) {
				startPage = pageCount - pageLength + 1;
				endPage = pageCount;
			}
			for (var i = startPage; i <= endPage; i++) {
				var thisPage = $('<a class="page">').html(i);
				if(i == page) {
					thisPage.addClass('selected');
				}
				pages.append(thisPage);
			}
			pages.append($('<a class="next">').html(language.next));
			pages.append($('<a class="end">').html(language.end));
			pages.find('.page').click(function() {
				var idx = $(this).html();
				idx = parseInt(idx);
				if(idx != page) {
					page = idx;
					load();
				}
			});
			pages.find('.top').click(function() {
				if(page > 1) {
					page = 1;
					load();
				}
			});
			pages.find('.prev').click(function() {
				if(page > 1) {
					page--;
					load();
				}
			});
			pages.find('.end').click(function() {
				if(page < pageCount) {
					page = pageCount;
					load();
				}
			});
			pages.find('.next').click(function() {
				if(page < pageCount) {
					page++;
					load();
				}
			});
			var go = $('<div class="go">').append($('<input type="text" />').val(page)).append($('<a class="btn-go">').html(language.go));
			go.find('.btn-go').click(function() {
				var idx = go.find('input[type="text"]').val();
				idx = parseInt(idx);
				if(idx > 0 && idx <= pageCount) {
					if(idx != page) {
						page = idx;
						load();
					}
				} else {
					opts.pageError(language.msg);
				}
			});
			if(!opts.hideInfos) {
				pagination.append(infos);
			}
			pagination.append(pages);
			if(!opts.hideGo) {
				pagination.append(go);
			}
			render.html(pagination);
		};
		var init = function() {
			page = 1;
			load();
		};
		return {
			init: init,
			reload: load
		};
	};
	
	$.pagination.language = {
		//infos: '当前第${currPage}/${totalPage}页，显示${start}至${end}条数据，总计${total}条数据。',
		infos: '记录总数：${total}，页数：${currPage}/${totalPage}',
		top: '首页',
		end: '尾页',
		prev: '上一页',
		next: '下一页',
		go: '搜索',
		msg: '请输入正确的页数。'
	};
	
	$.pagination.defaults = {
		render: '.pagination',
		hideInfos: false,
		hideGo: false,
		pageLength: 6,
		pageSize: 10,
		ajaxType: 'post',
		ajaxUrl: '',
		ajaxData: {},
		beforeSend: function() {},
		complete: function() {},
		success: function(list) {},
		pageError: function(response) {
			alert(response.message);
		},
		emptyData: function() {
			
		}
	};
})(jQuery);

//轮播插件，不过只有fade的效果
(function($) {
	$.fn.BannerLoop = function(options) {
		var defaults = {
			focus: true,
			delay: 3000
		}
		var opts = $.extend({}, defaults, options);
		$(this).each(function() {
			var items = $(this).find('.list > .item');
			var loop = $(this).find('.loop');
			if(items.length <= 1) return;
			var index = 0;
			var show = function() {
				$.each(items, function(i) {
					if($(this).is(':visible')) {
						$(this).stop().fadeOut(1500).removeClass('active');
					}
					if(i == index) {
						$(this).stop().fadeIn(1500);
					}
				});
				setLoop();
			}
			var setLoop = function() {
				loop.find('a').removeClass('active').eq(index).addClass('active');
			}
			var initLoop = function() {
				$.each(items, function(i) {
					if(i == 0) {
						loop.append('<a class="active"></a>');
					} else {
						loop.append('<a></a>');
					}
				});
				loop.find('a').each(function(i) {
					$(this).click(function() {
						stop();
						if(!$(this).hasClass('active')) {
							index = i;
							show();
						}
						start();
					});
				});
				loop.show();
			}
			initLoop();
			var timer = null;
			var start = function() {
				timer = setInterval(function() {
					if(index == items.length - 1) {
						index = 0;
					} else {
						index++;
					}
					show(index);
				}, opts.delay);
			}
			var stop = function() {
				if(timer) clearInterval(timer);
			}
			start();
			if(opts.focus) {
				$(this).hover(stop, start);
			}
		});
	}
})(jQuery);


//判断页面是否需要登陆
!function(){
	if ($('html').attr('login') === 'true') {
		if (!AppData.isLogin()) {
			var domain = window.location.protocol + '//' + window.location.host;
			window.location.href = domain + '/index.html';
		}
	}
}()





var App = function() {

	var getGlobalImgPath = function() {
		return '/img';
	}

	var location = function() {
		return window.location.protocol + '//' + window.location.host;
	}

	var initScroll = function(el) {
		if(!el) el = '.scroller';
	    $(el).each(function () {
	    	if($(this).attr('data-initialized')) return;
	    	var color = $(this).attr('data-handle-color') ? $(this).attr('data-handle-color') : '#2AC1CA';
	    	var distance = $(this).attr('data-handle-distance') ? $(this).attr('data-handle-distance') : '0px';
	    	var alwaysVisible = $(this).attr('data-always-visible') ? true : false;
	    	var railVisible = $(this).attr('data-rail-visible') ? true : false;
	        $(this).slimScroll({
	            allowPageScroll: false,
	            size: '7px',
	            borderRadius: '0px',
	            color: color,
	            wrapperClass: 'slim-scroll',
	            distance: distance,
	            position: 'right',
	            height: 'auto',
	            alwaysVisible: alwaysVisible,
	            railVisible: railVisible,
	            disableFadeOut: true
	        });
	        $(this).attr('data-initialized', 1);
	    });
	}
	var destroyScroll = function(el) {
        $(el).each(function() {
        	// destroy existing instance before updating the height
            if ($(this).attr("data-initialized") === "1") {
                $(this).removeAttr("data-initialized");
                $(this).removeAttr("style");
                var attrList = {};
                // store the custom attribures so later we will reassign.
                if ($(this).attr("data-handle-color")) {
                    attrList["data-handle-color"] = $(this).attr("data-handle-color");
                }
                if ($(this).attr("data-handle-distance")) {
                    attrList["data-handle-distance"] = $(this).attr("data-handle-distance");
                }
                if ($(this).attr("data-always-visible")) {
                    attrList["data-always-visible"] = $(this).attr("data-always-visible");
                }
                if ($(this).attr("data-rail-visible")) {
                    attrList["data-rail-visible"] = $(this).attr("data-rail-visible");
                }
                $(this).slimScroll({
                    wrapperClass: 'slim-scroll',
                    destroy: true
                });
                var the = $(this);
                // reassign custom attributes
                $.each(attrList, function(key, value) {
                    the.attr(key, value);
                });
            }
        });
    }
	var blockUI = function(options) {
        options = $.extend(true, {}, options);
        options.zIndex = 5000; 
        var html = '';
        if (options.animate) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
        } else if (options.iconOnly) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + getGlobalImgPath() + '/icon/loading-spinner-grey.gif" align=""></div>';
        } else if (options.textOnly) {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
        } else {
            html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + getGlobalImgPath() + '/icon/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : '正在加载中...') + '</span></div>';
        }

        if (options.target) { // element blocking
            var el = $(options.target);
            if (el.height() <= ($(window).height())) {
                options.cenrerY = true;
            }
            el.block({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 1000,
                centerY: options.cenrerY !== undefined ? options.cenrerY : false,
                css: {
                    top: '10%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                    opacity: options.boxed ? 0.05 : 0.1,
                    cursor: 'wait'
                }
            });
        } else { // page blocking
            $.blockUI({
                message: html,
                baseZ: options.zIndex ? options.zIndex : 1000,
                centerY: 0, 
                 css: {
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none',
//                     top: '10px', left: '', right: '10px'
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor ? options.overlayColor : '#555',
                    opacity: options.boxed ? 0 : 0,
                    cursor: 'wait'
                }
            });
        }
    }
	var unblockUI = function(target) {
        if (target) {
            $(target).unblock({
                onUnblock: function() {
                    $(target).css('position', '');
                    $(target).css('zoom', '');
                }
            });
        } else {
            $.unblockUI();
        }
    }
	var getUrl = function(key,isHash) {
		var path = window.location.search;
		if(isHash) path = window.location.hash;
		var search = path.substring(1), i, val, params = search.split("&");
	    for (i = 0; i < params.length; i++) {
	        val = params[i].split("=");
	        if (val[0] == key) {
	            return unescape(val[1]);
	        }
	    }
	}
	var getHash = function(key) {
		 return getUrl(key,1);
	}
// 	var addHash = function(map){
// 		$.each(function(){
			
// 		});
// 	}
	var confirm = function(type, title, content, autoClose, button1, button2, fn1, fn2) {
		if(title == undefined) title = '确认消息';
		if(autoClose == undefined) autoClose = 0;
		if(button1 == undefined) {
			button1 = '确定<i class="icon ok"></i>';
		}
		if(button2 == undefined) {
			button2 = '取消<i class="icon close"></i>';
		}
		if(fn1 == undefined) fn1 = function() {};
		if(fn2 == undefined) fn2 = function() {};
		content = '<div class="msg">' + content + '</div>';
		if(type == 'warning') {
			title = '<i class="icon warning"></i>' + title;
			content = '<i class="icon warning"></i>' + content;
		}
		if(type == 'info') {
			title = '<i class="icon info"></i>' + title;
			content = '<i class="icon info"></i>' + content;
		}
		if(type == 'question') {
			title = '<i class="icon question"></i>' + title;
			content = '<i class="icon question"></i>' + content;
		}
		if(type == 'success') {
			title = '<i class="icon success"></i>' + title;
			content = '<i class="icon success"></i>' + content;
		}
		var box = new jBox('Confirm', {
			title: title,
			content: content,
			confirmButton: button1,
			cancelButton: button2,
			overlay: true,
			blockScroll: false,
			closeOnClick: false,
			closeButton: 'title',
			confirm: fn1,
			cancel: fn2,
			addClass: 'common-confirm',
			zIndex: 20000,
			onInit: function() {
		    	this.open();
		    },
		    onCloseComplete: function() {
		    	this.destroy();
		    	box = undefined;
		    }
		});
		if(autoClose && autoClose != 0) {
			setTimeout(function() {
				if(box) box.close();
			}, autoClose);
		}
	}
	var alert = function(type, title, content, autoClose, button, fn, callback) {
		if(title == undefined) title = '提示消息';
		if(autoClose == undefined) autoClose = 0;
		if(button == undefined) {
			button = '关闭<i class="icon close"></i>';
		}
		if(fn == undefined) fn = function() {}
		content = '<div class="msg">' + content + '</div>';
		if(type == 'warning') {
			title = '<i class="icon warning"></i>' + title;
			content = '<i class="icon warning"></i>' + content;
		}
		if(type == 'info') {
			title = '<i class="icon info"></i>' + title;
			content = '<i class="icon info"></i>' + content;
		}
		if(type == 'question') {
			title = '<i class="icon question"></i>' + title;
			content = '<i class="icon question"></i>' + content;
		}
		if(type == 'success') {
			title = '<i class="icon success"></i>' + title;
			content = '<i class="icon success"></i>' + content;
		}
		var box = new jBox('Confirm', {
			title: title,
			content: content,
			confirmButton: button,
			overlay: true,
			closeOnClick: false,
			blockScroll: false,
			closeButton: 'title',
			confirm: fn,
			addClass: 'common-alert',
			zIndex: 20000,
			onInit: function() {
		    	this.open();
		    },
		    onCloseComplete: function() {
		    	this.destroy();
		    	box = undefined;
		    	if(callback != null && $.isFunction(callback)){
		    		callback();
		    	}

		    }
		});
		if(autoClose && autoClose != 0) {
			setTimeout(function() {
				if(box) box.close();
			}, autoClose);
		}
	}
	var notice = function(content, autoClose) {
		if(autoClose == undefined) autoClose = 3000;
		var noticeBox = new jBox('Notice', {
		    content: content,
		    autoClose: autoClose,
		    addClass: 'common-notice'
		});
	}
	var tips = function(title, content, autoClose) {
		$('.message-tips').remove();
		var messageTips = $('<div class="message-tips">');
		messageTips.append('<div class="title">' + title + '</div>');
		messageTips.append('<div class="content">' + content + '</div>');
		$('body').append(messageTips);
		var width = messageTips.width();
		var height = messageTips.height();
		var winWidth = $(window).width();
		messageTips.css({bottom: -height, right: ((winWidth - 1050) / 2 - width) / 2}).stop().animate({bottom: 202}, 1000, 'easeOutExpo');
		if(autoClose) {
			setTimeout(function() {
				messageTips.stop().animate({bottom: -height,}, 1000, 'easeOutExpo', function() {
					messageTips.remove();
				});
			}, autoClose);
		}
	}
	return {
		location: location,
		initScroll: initScroll,
		destroyScroll: destroyScroll,
		blockUI: blockUI,
		unblockUI: unblockUI,
		getUrl: getUrl,
		getHash: getHash,
		confirm: confirm,
		alert: alert,
		notice: notice,
		tips: tips
	}
}();



/**
 * 用户系统消息
 */
var UserSysMessage = function() {

	var idArray = [];
	var els = function() {
		return $('.sys-message-list');
	}

	// 更新方法
	var update = function(ids) {
		Will.ajax({ids: ids},'/api/account/clear-system-message', function(data){
 		});
	}

	// 播放声音
	var audio = function() {
		if($('.set-voice').find('.msg').hasClass('audio-on')) {
			$('audio#sys-message').remove();
			var audio = $('<audio id="sys-message" autoplay="autoplay">');
			audio.attr('src', '/audio/message.mp3').hide();
			$('body').append(audio);
		}
	}

	// 显示效果
	var show = function() {
		if(els().is(':hidden')) {
			var height = els().height();
			els().show().css({top: -height}).stop().animate({top: 120}, 1000, 'easeOutExpo');
		}
	}

	// 隐藏效果
	var hide = function() {
		els().hide();
	}

	// 有新的消息
	var lastTime = '';
	var add = function(data) {
		var count = 0;
		if(data&&data.length > 0) {
			$.each(data, function(i, val) {
				if(lastTime && lastTime >= val.time) {
					return;
				}
// 				var item =
// 				'<div class="item">\
// 					<div class="title">\
// 						<span class="type">' + DataFormat.formatUserSysMessageType(val.type) + '</span>\
// 						<span class="time">' + moment(val.time).format('HH:mm:ss') + '</span>\
// 					</div>\
// 					<div class="text">' + val.content + '</div>\
// 				</div>';
// 				els().find('.list').prepend(item);
// 				idArray.push(val.id);
// 				$('body').on('click','[data-command="clear-sysMsg"]',function(){
// 					$('.lobibox-notify-wrapper.top.right').remove();update();
//  				});
 				$('body').on('click','.lobibox-close',function(){
					$('.lobibox-notify-wrapper.top.right').remove();update();
 				});
				Lobibox.notify('info', {
					size: 'mini',
					title: DataFormat.formatUserSysMessageType(val.type)+ moment(val.time).format('HH:mm:ss')+'&nbsp;&nbsp;&nbsp;<a data-command="clear-sysMsg"></a>',
					msg: val.content,
					delay:false,
					position: "top right",
					closeOnClick: false, 
 				});
				count++;
			});
			if(count>0){
// 				show();
				audio();
			}
			lastTime = data[data.length-1].time;
		}
	}

	// 初始化
	var init = function() {
		if(!AppData.isLogin()) return;
		var mList = $('<div class="sys-message-list">');
		mList.append('<div class="title">通知列表<a class="clear">清空</a></div>');
		mList.append('<div class="wrapper"><div class="scroller" data-handle-color="#aaa" data-handle-distance="2px"><div class="list"></div></div></div>');
		mList.find('.clear').click(function() {
			update(idArray.toString());
			idArray = [];
			els().find('.list').empty();
			hide();
		});
		$('body').append(mList);
		App.initScroll('.scroller');
		start();
	}

    var start = function(){
		$.post('/api/account/list-system-message',{},Will.successRes(function(data){
			add(data);
		}));
        setTimeout(start,60000);
    }

	return {
		init: init,
		add: add
	}

}();

var load = function(name){
	$.ajaxSetup({async: false});
	//$(".bar").load("/bar.html")
	if(arguments.length==1) $('.'+name).load('/include-'+name+'.html');
	if(arguments.length==2) arguments[0].load(arguments[1]);
	$.ajaxSetup({async: true});
}

//各种通用的函数
var Will = function(){
	var checkCardId = function(e){var x=e.substr(e.length-1,1);var b=e.substr(0,e.length-1);var A=new Array();for(var w=b.length-1;w>-1;w--){A.push(b.substr(w,1))}var s=new Array();var a=new Array();var g=new Array();for(var v=0;v<A.length;v++){if((v+1)%2==1){if(parseInt(A[v])*2<9){s.push(parseInt(A[v])*2)}else{a.push(parseInt(A[v])*2)}}else{g.push(A[v])}}var d=new Array();var c=new Array();for(var y=0;y<a.length;y++){d.push(parseInt(a[y])%10);c.push(parseInt(a[y])/10)}var z=0;var u=0;var l=0;var f=0;var C=0;for(var r=0;r<s.length;r++){z=z+parseInt(s[r])}for(var q=0;q<g.length;q++){u=u+parseInt(g[q])}for(var o=0;o<d.length;o++){l=l+parseInt(d[o]);f=f+parseInt(c[o])}C=parseInt(z)+parseInt(u)+parseInt(l)+parseInt(f);var t=parseInt(C)%10==0?10:parseInt(C)%10;var B=10-t;if(x==B){return true}else{return false}};
	var getInputVals = function($html){
		var params = {};
		$html.find('input[name],select').each(function () {
			params[$(this).attr('name')] = $(this).val();
		});
		return params;
	}

	
	
	function question(msg,obj){
		var buttons = $.map(obj,function(ele,idx){
			var obj = $.extend({icon: 'glyphicon glyphicon-ok',
                cssClass: 'btn-success'},ele);
			obj.action = function(dialog) {						 
					if($.isFunction(ele.action)) ele.action(); 
					dialog.close();
				};
			return obj;
		});
		buttons.push(cancelButton);
		BootstrapDialog.show({
			title: '<i class="fa fa-question-circle fa-lg"></i>操作提示',
			message:msg,
			buttons:buttons
		});
	}
	var cancelButton = {
				label: '取消',
				icon: 'glyphicon glyphicon-remove',
                cssClass: 'btn-warning',
                autospin: true,
				action: function(dialog) {
					dialog.close();
				}
			};
	function confirm(msg,func){
		var dialog = new BootstrapDialog({
			cssClass:'confirm',
 			title: '<i class="fa fa-question-circle fa-lg"></i>确认消息',
			message:$('<span class="center-block"></span>').append(msg),
			buttons: [{
				label: '确定',
				icon: 'glyphicon glyphicon-ok',
                cssClass: 'btn-success',
                autospin: true,
				action: function(dialog) {						 
					if($.isFunction(func)) func(); 
					dialog.close();
				}
			}, cancelButton]
		});
		dialog.open();
		return dialog;
	}
	
	function info(msg){
		notify('info',msg)
	}
	function warning(msg){
		notify('warning',msg)
	}
	function error(msg){
		notify('error',msg)
	}
	function success(msg){
		notify('success',msg)
	}
	function notify(type,msg){
		var notify = Lobibox.notify(type, {
			size: 'mini',
			position: {left: ($(window).outerWidth() - Lobibox.notify.DEFAULTS.width)/2,top: $(window).outerHeight()/2},
			msg: msg,
			soundPath:'/audio/',
			delayIndicator: false,
			delay:false,
			delay:2000,
// 			showClass:'fadeIn',
// 			hideClass:'fadeOut',
// 			img: '/img/common/notify.png',
// 			img: '/favicon.ico',
			iconSource: "fontAwesome",
// 			title: ' ',
		});	 
		notify.$el.css('left' , ($(window).outerWidth() - notify.$el.width())/2);
// 		notify.$el.css('top' , ($(window).outerHeight() - notify.$el.height())/2);
	}
	
	var callbacks = [];
	function addHashChange(callback){
		callbacks.push(callback);
		if($.isFunction(callback)) callback();
		if(!window.onhashchange){
			var change = function() {
				$.each(callbacks,function(){
					if($.isFunction(this)) this();
				});
 			};
			window.onhashchange = change;
		}
	}

	var successRes = function(successCallback,errorCallback){
		return function(response) {
					unblockUI();
					if((typeof(response.error) == "undefined")){ //没有error,code,message的返回情况
						if($.isFunction(successCallback)) successCallback(response);
						return;
					}
					if(response.error != 0) {
						if(response.code == '0-1' || response.code == '0-4') {
							if(window.location.pathname=="/index.html") return;
							error(response.message);
							setTimeout(function(){
								var domain = window.location.protocol + '//' + window.location.host;
								window.location.href = domain + '/index.html';
							},1000);
							return;
						}else if(response.code == "105-03"){
							Will.info('您还没有设置密保，请立即设定！')
							PopBindSecurity();
						}else{
							if($.isFunction(errorCallback)) errorCallback(response.data,response);
							else error(response.message);
						}
 					}
					if(response.error == 0) {
						if($.isFunction(successCallback)) successCallback(response.data,response);
					}
				}
	}
	//ajax的封装
	var ajax = function(data , url , successCallback ,errorCallback, isAsync) {
		var asyncc = isAsync===0?false:true
		blockUI();
		$.ajax({
			type: 'post',
			url: url,
			data: data,
			timeout: 10000,
			dataType: 'json',
			async:asyncc,
			success:successRes(successCallback,errorCallback),
			error: function() {
				unblockUI();
			}
		});
 	}
	
	var $blocker =  '<div id="floatingBarsG" style="opacity:0.2">\
			<div class="blockG" id="rotateG_01"></div>\
			<div class="blockG" id="rotateG_02"></div>\
			<div class="blockG" id="rotateG_03"></div>\
			<div class="blockG" id="rotateG_04"></div>\
			<div class="blockG" id="rotateG_05"></div>\
			<div class="blockG" id="rotateG_06"></div>\
			<div class="blockG" id="rotateG_07"></div>\
			<div class="blockG" id="rotateG_08"></div>\
		</div>'  ;
	var blockUI = function(){
		App.blockUI({boxed:1});
	}

	var unblockUI = function(){
		App.unblockUI();
	}

	return { 
		ajax : ajax , 
		addHashChange:addHashChange, blockUI:blockUI,unblockUI:unblockUI,
		question:question,confirm:confirm , info:info,warning:warning,error:error,success:success,checkCardId:checkCardId,getInputVals:getInputVals,
		cancelButton:cancelButton,successRes:successRes
	}
}()


/**
 * 加载彩票列表
 */
var loadLottery = function(callback) {
	Will.ajax({},'/api/game-lottery/static-info', function(data,response){
		if($.isFunction(callback)) {
			callback(data);
		}
	});
}

/**
 * 初始化日期控件
 */
var initDatePicker = function($context) {
	if(!$context) $context=$('body');
	if($context.find('.d-range-picker').size()==0 && $context.find('.date-picker').size()==0) return;
	var opts = {
		format: 'YYYY-MM-DD',
		separator: ' 至 ',
		ranges: {
			'今天': [moment(), moment().add(1, 'days')],
			'最近三天': [moment().subtract(2, 'days'), moment().add(1, 'days')],
			'最近七天': [moment().subtract(6, 'days'), moment().add(1, 'days')]
		},
		locale: {
			applyLabel: '确认',
			cancelLabel: '清除',
			fromLabel: '开始',
			toLabel: '结束',
			customRangeLabel: '自定义日期',
			daysOfWeek: ['日', '一', '二', '三', '四', '五','六'],
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			firstDay: 1
		}
	}
	$context.find('.d-range-picker').each(function() {
		var opens = $(this).attr('data-time-opens');
		opts.opens = opens ? opens : 'left';
		var init = $(this).attr('data-time-init');
		if(init) {
			if(init > 0) {
				$(this).val(moment().format('YYYY-MM-DD') + ' 至 ' + moment().add(init, 'days').format('YYYY-MM-DD'));
			} else {
				$(this).val(moment().add(init, 'days').format('YYYY-MM-DD') + ' 至 ' + moment().add(1, 'days').format('YYYY-MM-DD'));
			}
		}
		$(this).daterangepicker(opts);
	});

	if(jQuery().datepicker) {
		$context.find('.date-picker').datepicker({
			language : 'zh-CN',
			orientation : 'left',
			autoclose : true,
			format : 'yyyy-mm-dd'
		}).on('changeDate show', function (e) {
 			$context.parents('form').bootstrapValidator('revalidateField', 'birthday');
		});
	}
}

//加减乘除计算
var compt = function(){
    function add(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
    }
     
    function sub(a, b) {
        var c, d, e;
        try {
            c = a.toString().split(".")[1].length;
        } catch (f) {
            c = 0;
        }
        try {
            d = b.toString().split(".")[1].length;
        } catch (f) {
            d = 0;
        }
        return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
    }
     
    function mul(a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {}
        try {
            c += e.split(".")[1].length;
        } catch (f) {}
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }
     
    function div(a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {}
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {}
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
    }
    return {
        add:add,sub:sub,mul:mul,div:div
    }
}();

var disableRightClick= function(){
	$(this).contextmenu(function() {
		return false;
	});
	$(this).mousedown(function(e) {
		if (e.button == 2) return false;
	});
}

var showOrNotShow = function(){
	if (!AppData.isLogin()) {
		$('#login-form').show();
		$('#will-user-info').hide();
		return false;
	} else {
		$('#login-form').hide();
		$('#will-user-info').show();
		// 隐藏或显示代理账户
		if (AppData.getMainAccount().type == 0) {
			$('[data-visible="proxy"]').hide();
		} else {
			$('[data-visible="proxy"]').show();
		}
	}
}

var kefu = function(){
	//在线客服弹出框
		$('[data-command="kefu"]').each(function() {
		var url = '/game-service.html';
		if(AppData.isLogin()){
			var username = AppData.getMainAccount().username;
			if(username) {
				url += '?username=' + username;
			}
		}
		$(this).attr('href', url);
		$(this).attr('target', '_blank');
	});
}

$('body').on('click','[data-status="disabled"]',function() {
	Will.info( '该功能暂时未开通，敬请期待！' );
});


$(document).ready(function() {
	//屏蔽右键
// 	disableRightClick();
	//系统消息初始化
 	UserSysMessage.init();
 	//隐藏或显示代理账户相关功能
 	showOrNotShow();
	//初始化日期控件
 	initDatePicker();
 	//在线客服弹出框
 	kefu();
});



 
//声音设置和切换
	$('[data-injection="set-voice"]').size() && (function() {
		
		var $html = $('<span class="set-voice parent-list" >设置声音\
						<div class="sub-list">\
							<i class="arrow"></i>\
							<div class="item">\
								<div class="label">中奖提示音：</div>\
								<div class="switch win audio-on"></div>\
								<div class="play win-play"></div>\
								<div style="clear: both;"></div>\
							</div>\
							<div class="item">\
								<div class="label">消息提示音：</div>\
								<div class="switch msg audio-on"></div>\
								<div class="play msg-play"></div>\
								<div style="clear: both;"></div>\
							</div>\
							<div class="item">\
								<div class="label">封单提示音：</div>\
								<div class="switch cd audio-on"></div>\
								<div class="play cd-play"></div>\
								<div style="clear: both;"></div>\
							</div>\
						</div>\
					</span>');
 		$('[data-injection="set-voice"]').append($html);
		if($.cookie('WIN-VOICE') && $.cookie('WIN-VOICE') === 'OFF'){
			$html.find('.win').addClass('audio-off');
			$html.find('.win').removeClass('audio-on');
		}else{
			$html.find('.win').addClass('audio-on');
			$html.find('.win').removeClass('audio-off');
		}

		$html.find('.win').click(function() {
			if($html.find('.win').hasClass('audio-on')) {
				$html.find('.win').addClass('audio-off');
				$html.find('.win').removeClass('audio-on');
				setCookie('WIN-VOICE', 'OFF');
				$html.find('audio#lottery-open').remove();
			}else{
				$html.find('.win').addClass('audio-on');
				$html.find('.win').removeClass('audio-off');
				
				setCookie('WIN-VOICE', 'ON');

			};
		});

		$html.find('.win-play').click(function(){
			if($html.find('.win').hasClass('audio-on')) {
				var lotteryOpen = $html.find('#lottery-open');
				if(lotteryOpen.size()) {
					lotteryOpen[0].play();
					return;
				}
				var audio = $('<audio id="lottery-open" autoplay="autoplay">');
				audio.attr('src', '/audio/lottery-open.mp3').hide();
				$html.append(audio);
			}
		})

		if($.cookie('MSG-VOICE') && $.cookie('MSG-VOICE') === 'OFF'){
			$html.find('.msg').addClass('audio-off');
			$html.find('.msg').removeClass('audio-on');
		}else{
			$html.find('.msg').addClass('audio-on');
			$html.find('.msg').removeClass('audio-off');
		}

		$html.find('.msg').click(function() {
			if($html.find('.msg').hasClass('audio-on')) {
				$html.find('.msg').addClass('audio-off');
				$html.find('.msg').removeClass('audio-on');
				setCookie('MSG-VOICE', 'OFF');
				$html.find('audio#sys-message').remove();
			}else{
				$html.find('.msg').addClass('audio-on');
				$html.find('.msg').removeClass('audio-off');
				setCookie('MSG-VOICE', 'ON');
			};
		});

		$html.find('.msg-play').click(function() {
			if($html.find('.msg').hasClass('audio-on')) {
				var sysMsg = $html.find('#sys-message');
				if(sysMsg.size()) {
					sysMsg[0].play();
					return;
				}
				var audio = $('<audio id="sys-message" autoplay="autoplay">');
				audio.attr('src', '/audio/message.mp3').hide();
				$html.append(audio);
			}
		})

		if($.cookie('CD-VOICE') && $.cookie('CD-VOICE') === 'OFF'){
			$html.find('.cd').addClass('audio-off');
			$html.find('.cd').removeClass('audio-on');
		}else{
			$html.find('.cd').addClass('audio-on');
			$html.find('.cd').removeClass('audio-off');
		}

		$html.find('.cd').click(function() {
			var lotteryCd = $('body').find('#lottery-cd');
			var lotteryCd2 = $html.find('#lotteryCd');
			if($html.find('.cd').hasClass('audio-on')) {
				$html.find('.cd').addClass('audio-off');
				$html.find('.cd').removeClass('audio-on');
				setCookie('CD-VOICE', 'OFF');
				if(lotteryCd.size()) {
					lotteryCd[0].pause();
				}
				if(lotteryCd2.size()) {
					lotteryCd2[0].pause();
				}
			}else{
				$html.find('.cd').addClass('audio-on');
				$html.find('.cd').removeClass('audio-off');
				setCookie('CD-VOICE', 'ON');
				if(lotteryCd.size()) {
					lotteryCd[0].play();
				}
			};
		});

		$html.find('.cd-play').click(function() {
			if($html.find('.cd').hasClass('audio-on')) {
				var lotteryCd = $html.find('#lotteryCd');
				if(lotteryCd.size()) {
					lotteryCd[0].play();
				} else {
					var audio = $('<audio id="lotteryCd" autoplay="autoplay">');
					audio.attr('src', '/audio/cd.mp3').hide();
					$html.append(audio);
				}

				setTimeout(function() {
					$html.find('audio#lotteryCd').remove();
				}, 3000)
				
			}
		});

		function setCookie(name,val){
			var expires = new Date(moment().startOf('year').add(1, 'years'));
			$.cookie(name, val, {expires: expires, path: '/'});
		}

	})();





 
 




 	//换肤
	window.location.pathname=="/lottery.html" && $('[data-injection="change-background"]').append(function(){
		var $html = $('<div class="bakImgBox">\
				<div class="bakBtn f12"><i class="demo-icon icon-picture-2">&#xecb2;</i>背景切换</div>\
				<div class="bakMid" style="display:none;">\
				  <ul>\
					<li><a class="xkImg" href="javascript:;">纯色1</a></li>\
					<li><a class="lxImg" href="javascript:;">纯色2</a></li>\
					<li><a class="ycImg" href="javascript:;">渐变1</a></li>\
					<li><a class="xyImg" href="javascript:;">渐变2</a></li>\
					<li><a class="csImg1" href="javascript:;">璀璨星空</a></li>\
					<li><a class="csImg2" href="javascript:;">山海黎乡</a></li>\
					<li><a class="csImg3" href="javascript:;">沙滩浴场</a></li>\
					<li><a class="csImg4" href="javascript:;">朦胧夕阳</a></li>\
				  </ul>\
				</div>\
           </div>');
		var oBakMid=$html.find('.bakMid');

		$html.find('.bakBtn').click(function(e){
			$html.find('.bakMid').stop().slideToggle();
			e.stopPropagation();
		})
		$(document).click(function(){
			$html.find('.bakMid').stop().slideUp()
		})
		var xkBtn=$html.find('.bakMid li a');
		var expires = new Date(moment().startOf('year').add(1, 'years'));
		
		xkBtn.click(function(){	
			$('body').attr('data-bg', $(this).parent().index()+1);
			var bbg = $('body').attr('data-bg');
			$.cookie('css', bbg, {expires: expires, path: '/'});
			$html.find('.bakMid').hide()
		})
		return $html;
		
			
		
		
		
		
	});
// 	skinBg();

//  		var bmoneyclass = $.cookie('hide');
// 		var moneylist = $.cookie('money');
 		
// 		var expires = new Date(moment().startOf('year').add(1, 'years'));
// 		if(bmoneyclass)$(".hidemoney").attr('class',bmoneyclass);
// 		if(moneylist)$('.moneylist.parent-list').attr('class',moneylist);
// 		$(".hidemoney").click(function(){
// 			$(this).toggleClass('showmoney');
// 			$('.moneylist.parent-list').toggleClass('mhide');
// 			var bmoneyclass = $(".hidemoney").attr('class');
// 			var moneylist = $('.moneylist.parent-list').attr('class');
// 			$.cookie('hide', bmoneyclass, {expires: expires, path: '/'});
// 			$.cookie('money', moneylist, {expires: expires, path: '/'});
// 			if($('.moneylist').attr('class')=="moneylist parent-list mhide"){
// 				var sublist = $('.moneylist .sub-list').html();
				
// 			}
// 		});
// 		if($('.moneylist').attr('class')=="moneylist parent-list mhide"){
// 			$('.moneylist .sub-list').hide()
// 		}
		var idx = $.cookie('balance-selected')-0;
		var isHide = $.cookie('balance-isHide')-0;
		var vue = new Vue({
 			template:'<span><span  v-show=!isHide class="moneylist parent-list">\
						<span class="outter" v-html="doms[idx].html"> </span>\
						<i class="arrow-bottom"></i>\
						<div  title="设为默认" class="sub-list money">\
							<div class="inner"><div v-for="id in reverseIdxs"  v-html="doms[id].html" v-on:click="add(id)"></div></div>\
						</div>\
					</span>\
					<span v-show=!!isHide class="TiaoWen"></span>\
					<span class="hidemoney" v-on:click="hide()"><a v-show=isHide class="hideMon  hidden-sm hidden-xs" href="javascript:;">显示金额</a><a  v-show=!isHide class="showMon  hidden-sm hidden-xs">隐藏金额</a></span></span>',

			data: {
				idx:(idx?idx:0),isHide:(isHide?isHide:0),
			  	doms:{
			  		0:{id:0,html:'<div  title="设为默认"  class="lotteryBalance"> <i class="bg-info badge visible-xs-inline-block">¥</i><i class="hidden-xs">彩票余额：¥</i>  <span  class="data" data-field="lotteryBalance">0.000</span></div>'},
					1:{id:1,html:'<div  title="设为默认"  class="baccaratBalance "> <i class="bg-info badge visible-xs-inline-block">¥</i><i class="hidden-xs">百家乐余额：¥</i>  <span  class="data" data-field="baccaratBalance">0.000</span></div>'}
			  	}
			},computed:{
			  	reverseIdxs:function(){
			  		var that = this;
			  		var Idxs = $.map(this.doms,function(ele,idx){
			  				if(!ele.id==that.idx) return ele.id;
			  		})
			  		return Idxs;
			  	}
			  },methods:{
			  	add:function(idx){
 			  		this.idx=idx;
 			  		var expires = new Date(moment().startOf('year').add(1, 'years'));
					$.cookie('balance-selected', this.idx, {expires: expires, path: '/'});
					
					setTimeout(function(){$('[data-field="lotteryBalance"]').html(AppData.getLotteryAccount().availableBalance);},1)
 			  	},hide:function(){
 			  		this.isHide=(!this.isHide?1:0);
 			  		var expires = new Date(moment().startOf('year').add(1, 'years'));
					$.cookie('balance-isHide', this.isHide, {expires: expires, path: '/'});
 			  	}
			  }
 		});
 		$('[data-injection="toolbar-balance"]').append(vue.$mount().$el);
 	//显示时间插件 
	function showLocale(objD){
        var str,colorhead,colorfoot;
        var yy = objD.getYear();
            if(yy<1900) yy = yy+1900;
        var MM = objD.getMonth()+1;
            if(MM<10) MM = '0' + MM;
        var dd = objD.getDate();
            if(dd<10) dd = '0' + dd;
        var hh = objD.getHours();
            if(hh<10) hh = '0' + hh;
        var mm = objD.getMinutes();
            if(mm<10) mm = '0' + mm;
        var ss = objD.getSeconds();
            if(ss<10) ss = '0' + ss;
        var ww = objD.getDay();
            if ( ww==0 ) colorhead="<font color=\"#fff\">";
            if ( ww > 0 && ww < 6 ) colorhead="<font color=\"#fff\">";
            if ( ww==6 ) colorhead="<font color=\"#fff\">";
            if (ww==0) ww="星期日";
            if (ww==1) ww="星期一";
            if (ww==2) ww="星期二";
            if (ww==3) ww="星期三";
            if (ww==4) ww="星期四";
            if (ww==5) ww="星期五";
            if (ww==6) ww="星期六";
            colorfoot="</font>"
                str = colorhead + yy + "年" + MM + "月" + dd + "日" + hh + ":" + mm + ":" + ss + " " + ww + colorfoot;
            return(str);
    }
	function tick(){
        var today;
        today = new Date();
        $('[data-injection="localTime"]').html(showLocale(today));
        window.setTimeout("tick()", 1000);
    }
    tick();


	//余额切换事件
	(function(){

		function changeIdx(clz){
			if(!clz) {
				if($.cookie('MONEY_CLZ'))   {
					clz = $.cookie('MONEY_CLZ');
				}else{
					 clz='.'+$('.moneylist .balances div').eq(0).attr('class');	
				}
			}                  
 			$('.moneylist .outter').empty().append($('.moneylist .balances').find(clz).clone());
			$('.moneylist .inner').empty().append($('.moneylist .balances').find(clz).siblings().clone());
			var expires = new Date(moment().startOf('year').add(1, 'years'));
			$.cookie('MONEY_CLZ', clz, {expires: expires, path: '/'});
		}
		changeIdx();
 		$('.moneylist .inner').delegate("div","click",function(){
			changeIdx('.'+$(this).attr('class'));
		});
		
	})
  

 //页面级别判断是否登陆,还有ajax级别的
if ($('html').attr('login') === 'true') {
	if (!AppData.isLogin()) {
		var domain = window.location.protocol + '//' + window.location.host;
		window.location.href = domain + '/index.html';
	}
}
//$(document).ready
//bar上各种用户信息的显示
(function() {
	
	var initTopBar = function() {
		if (!AppData.isLogin()) {
			$('.login-no').show();$('#login-form').show();
			$('.login-yes').hide();
			return false;
		} else {
			$('.login-yes').show();
			$('.login-no').hide();$('#login-form').hide();
		}
		var mainAccount = AppData.getMainAccount();
		var lotteryAccount = AppData.getLotteryAccount();
		var msgCount = AppData.getMsgCount();

		if (mainAccount.accountType == 0) {
			$('[data-visible="proxy"]').hide();
		} else {
			$('[data-visible="proxy"]').show();
		}

		var els = $('[data-init="topBar"]');

		if (els.length > 0) {
			var greeting = function() {
				var hour = moment().hour();
				if (hour >= 6 && hour < 11) {
					return '早上好';
				}
				if (hour >= 11 && hour < 13) {
					return '中午好';
				}
				if (hour >= 13 && hour < 19) {
					return '下午好';
				}
				if (hour >= 19 || hour < 6) {
					return '晚上好';
				}
			}
			els.find('[data-field="greeting"]').html(greeting());
			els.find('[data-field="nickname"]').html(mainAccount.nickname);
			els.find('[data-field="username"]').html(mainAccount.username);
			els.find('[data-field="lotteryBalance"]').html(
					lotteryAccount.availableBalance.toFixed(3));
			els.find('[data-field="baccaratBalance"]').html('0.000');
			els.find('[data-field="msgCount"]').html(msgCount);
		}
	}
	
	initTopBar();
	
	$('[data-command="logout"]').click(function() {
		MainCtrl.logout({
			success: function() {
				window.location.href = window.location.protocol + '//' + window.location.host;
			}
		});
	});
	
})();

 

 


 
 //手机导航点击效果
(function(){
	$('.menu-min').click(function(){
		$('.moboil-silid').stop().toggle('fast');
		$('body').toggleClass('overflow');
		$(this).toggleClass('activet');
		
	});
	//手机端金额显示
	var m_money = $('.c.c4 .balances').html();
	$('.m-money_min').append(m_money);
	$('.m-money a').click(function(){
		$(this).parent().toggleClass('act-silider')
	})
	//退出登录
// 	$('[data-command="logout"]').click(function() {
// 		MainCtrl.logout({
// 			success: function() {
// 				window.location.href = window.location.protocol + '//' + window.location.host;
// 			}
// 		});
// 	});
})
 
$(function(){
		var manager_menu = $('.manager-menu');
		if(location.pathname=="/manager.html") {
			var bindStatus = AppData.getMainAccount().bindStatus;
			Will.ajax({},'/api/account/get-bind-info',function(data){
				manager_menu.find('[data-field="nickname"]').html(AppData.getMainAccount().nickname);
			});
			manager_menu.find('[data-field="greeting"]').html(DataFormat.greeting())			 
		}	
});


var DengLuVue = new Vue({
 	template:'<div class="form-horizontal DengLuBiaoDan"> \
			<div  v-show="!isIpYiChang">\
				<div class="form-group">\
				  <div class="col-sm-12"><input type="text" v-model="req.username" name="username" @input="checkGuGe| debounce 500" class="form-control"  placeholder="请输入用户名" ></div><span class="glyphicon glyphicon-user"></span>\
				</div>     \
				<div class="form-group">   \
				  <div class="col-sm-12"><input type="password" v-model="req.password" name="password"  class="form-control" id="inputPassword" placeholder="请输入密码"></div><span class="glyphicon glyphicon-lock" ></span>\
				</div>\
				<div class="form-group googeltest" v-show="!!isGuGe">\
					<div class="col-sm-12"><input type="text" v-model="req.googleKey" name="googleKey"  class="form-control"  placeholder="请输入谷歌验证码"></div><span class="fa fa-google" ></span>\
				</div>\
				<div class="form-group YanZhengMa">\
				  <div class="col-sm-12"><input  class="form-control" v-model="req.securityCode" name="securityCode" id="yanzhenma" placeholder="验证码" @keyup.enter="DengLu"></div><span class="glyphicon glyphicon-pencil"></span><img @click="ShuaXin" id="regis-img" title="点击刷新验证码" height="" width="" src="{{YanZhenMa}}" />\
				</div>\
			</div>\
			<div  v-show="isIpYiChang" class="IpYiChang">\
				<div  v-for="question in IpYiChang.questionValue">\
					<div class="input-group ">\
						 <span class="input-group-addon"><i class="fa fa-question-circle"></i></span>\
						 <input type="text" class="form-control" v-model="question" name="question" readOnly=readOnly >\
						 <span class="input-group-addon " @click="ShuaXinWenTi"><i class="fa fa-refresh"></i></span>\
					  </div>\
					<div class="form-group" >\
					  <div class="col-sm-12"><input type="text" v-model="IpYiChang.answer[$index]" name="answer"  class="form-control"  placeholder="" ></div><span class="fa fa-key"></span>\
					</div>\
				</div>\
  			</div>\
			<div class="form-group"><a href="javascript:;" class="btn login-btn" data-command="login" @click="DengLu">立即登录</a></div>\
	  </div>',
	data: {
		 isGuGe:0,YanZhenMa:'/api/utils/login-security-code',req:{username:'',password:'',googleKey:'',securityCode:''},
		 isIpYiChang:0,IpYiChang:{questionId:[],questionValue:[1,2,3],verifyKey:""}
	},compiled:function(){
				$(this.$el).bootstrapValidator({
						feedbackIcons: {valid: 'glyphicon glyphicon-ok',invalid: 'glyphicon glyphicon-remove',validating: 'glyphicon glyphicon-refresh'},
						fields: {				 
							username: {
								validators: {notEmpty: {message: '用户名不能为空'}}
							},password: {
								validators: {notEmpty: {message: '密码不能为空'}}
							},googleKey: {
								validators: {notEmpty: {message: '谷歌验证码不能为空'},digits:{message: '谷歌验证码为数字'}}
							},securityCode: {
								validators: {notEmpty: {message: '验证码不能为空'}}
							}
						}
				});	
	},methods:{
		checkGuGe:function(){
			 $.post('/api/need-google-auth?username='+DengLuVue.req.username,{},Will.successRes(function(data){
				if(data && data.login){ DengLuVue.isGuGe=1;}
				else{DengLuVue.isGuGe=0;}
			}));
	  },ShuaXin:function(){
			this.YanZhenMa='/api/utils/login-security-code?' + new Date().getTime();
	  },ShuaXinWenTi:function(){
	  		var that = this;
	  		Will.ajax({},'/api/get-verify-question',function(data){
				that.IpYiChang.questionId = data.questionId ;
				that.IpYiChang.questionValue = data.questionValue ;
				setTimeout(that.DaAnYanZheng,0);
			});
 	  },DaAnYanZheng:function(){
 	  		$(this.$el).bootstrapValidator('addField', 'answer',  {
								validators: {notEmpty: {message: '答案不能为空'}}
							});
	  },DengLu:function(){
	  	var that = this;
		var flag = $(this.$el).data('bootstrapValidator').validate().isValid();
		if(!flag) return;	
		if(!that.isIpYiChang){
			Will.ajax(this.req,'/api/sf-login',function(data){
				if(data.ip){
					that.JiaZaiDongHua();
				}
				if(data.questionId){
					that.isIpYiChang = 1;
					that.IpYiChang = data;
					setTimeout(that.DaAnYanZheng,0);
 				}
			})
		}else{
			Will.ajax({verifyKey:that.IpYiChang.verifyKey,question:that.IpYiChang.questionId.toString(),answer:$.map(DengLuVue.$data.IpYiChang.answer,function(p1,p2){return p1;}).toString()},'/api/verify-login',function(data){
				if(data.ip) that.JiaZaiDongHua();
			});
		}			
	  },JiaZaiDongHua:function(){
			$('.login-div').find('.form-horizontal').fadeTo(500,0,function(){
				var i = 1;
				$('#loaded').show();
				$('#light-loader').show();
				var $load = $('#loaded').find('span');
				var show = false;
				var timer = setInterval(function(){
					i = i +1;
					if (i > 100) {
					  i = 100;
					  clearInterval(timer);
					  location.reload(false);
					}				        
					window.lightLoader.loop(i,function(){
					  !show && $('#loaded').show();
					  show = true;
					  $load.html(Math.round(i) + '%')
					});
				},0)
			});
	  }
	}
}).$mount();
$('[data-injection="DengLu"]').append(DengLuVue.$el);
