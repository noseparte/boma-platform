define("module/MenuInfo", ["lib/jquery", "util/artTemplate", "module/Dialog", "module/Validator", "util/ajaxPromise"],
function(e) {
    "use strict";
    var l, o, t, s, a, i, n, c, r, d;
    return l = e("lib/jquery"),
    o = e("util/artTemplate"),
    t = e("module/Dialog"),
    s = e("module/Validator"),
    a = e("util/ajaxPromise"),
    n = function() {
        return a({
            url: window.basePath + "resources/listJson",
            type: "GET",
            dataType: "json"
        }).then(function(e) {
            return i = e.result.directoryList,
            i.unshift({
                id: "",
                name: "-----顶级目录-----",
                level: 1
            }),
            i
        })
    },
    String.prototype.repeat = String.prototype.repeat ||
    function(e) {
        return new Array(e + 1).join(this)
    },
    r = o.compile([
    	'<div class="form-horizontal">', 
    		'<div class="form-group">', 
    			'<label class="col-sm-2 control-label">菜单名称：</label>',
    			'<div class="col-sm-10">', 
    			  '<input type="text" value="{{name}}" class="menu-name form-control" maxLength="30"/>', 
    		 	"</div>", 
     		"</div>", 
     		'<div class="form-group">', 
     			'<label class="col-sm-2 control-label">菜单标识：</label>', 
     			'<div class="col-sm-10">', 
     				'<input type="text" value="{{sign}}" class="menu-sign form-control" maxLength="30"/>', 
    			"</div>", 
    		"</div>", 
    		'<div class="form-group">',
    			'<label class="col-sm-2 control-label">ICON',
    				'<a href="http://code.zoomla.cn/boot/font.html" target="_blank">【参考图标】</a>',
    			'</label>', 
    			'<div class="col-sm-10">',
    				'<input id="icon" name="icon" value="{{icon}}" type="text" value="fa-square-o" placeholder="请输入菜单图标" class="menu-icon form-control">',
				'</div>',
    		'</div>',
    		'<div class="form-group">', 
    			'<label class="col-sm-2 control-label">菜单url：</label>', 
    			'<div class="col-sm-10">', 
    				'<input type="text" value="{{link}}" class="menu-link form-control"/>', 
    			"</div>", 
    		"</div>", 
    		'<div class="form-group">', 
    			'<div class="col-sm-offset-2 col-sm-10">', 
    				'<div class="checkbox">', 
    					'<label><input class="menu-type" type="checkbox" value="1" {{if type==1}}checked{{/if}}>&nbsp;置为子目录</label>', 
					"</div>", 
				"</div>", 
    		"</div>", 
    		'<div class="form-group">', 
    			'<div class="col-sm-offset-2 col-sm-10">', 
    				'<div class="checkbox">', 
    					'<label><input class="menu-type" type="checkbox" value="2" {{if type==2}}checked{{/if}}>&nbsp;置为菜单</label>', 
    				"</div>", 
    			"</div>", 
    		"</div>", 
    		'<div class="form-group">', 
    			'<div class="col-sm-offset-2 col-sm-10">', 
    				'<div class="checkbox">', 
    					'<label><input class="menu-status" type="checkbox" {{if status}}checked{{/if}}>&nbsp;隐藏</label>', 
    				"</div>", 
    			"</div>", 
    		"</div>", 
    		'<div class="form-group">', 
    			'<label class="col-sm-2 control-label">菜单描述：</label>', 
    			'<div class="col-sm-10">', 
    				'<input type="text" value="{{description}}" class="menu-description form-control" maxLength="30"/>', 
    			"</div>", 
    		"</div>", 
    	"</div>"].join("")),
    d = o.compile(["{{each options}}", '<option value="{{$value.id}}">{{"&nbsp;".repeat(($value.level - 1) << 3)+$value.name}}</option>', "{{/each}}"].join("")),
    c = new t("modal-dialog"),
    i = {
        addMenu: function(e) {
            n().then(function(l) {
                c.show({
                    sizeClass: "modal-lg",
                    title: "创建菜单",
                    content: ['<div class="form-horizontal">', 
                    				'<div class="form-group">', 
                    					'<label class="col-sm-2 control-label">菜单名称：</label>', 
                						'<div class="col-sm-10">', 
                							'<input type="text" value="" class="menu-name form-control" maxLength="30" placeholder="请输入菜单名称"/>',
            							"</div>", 
        							"</div>",
        							'<div class="form-group">',
        								'<label class="col-sm-2 control-label">菜单标识：</label>', 
        								'<div class="col-sm-10">', 
        									'<input type="text" value="" class="menu-sign form-control" maxLength="30" placeholder="请输入菜单标识"/>', 
    									"</div>", 
									"</div>", 
									'<div class="form-group">', 
										'<label class="col-sm-2 control-label">ICON', 
											'<a href="http://code.zoomla.cn/boot/font.html" target="_blank">【参考图标】:</a>', 
										'</label>', 
										'<div class="col-sm-10">', 
											'<input id="icon" name="icon" type="text" value="fa-square-o" placeholder="请输入菜单图标" class="menu-icon form-control">', 
										'</div>', 
									'</div>',
									'<div class="form-group">', 
										'<label class="col-sm-2 control-label">菜单url：</label>', 
										'<div class="col-sm-10">', 
											'<input type="text" value="" class="menu-link form-control" placeholder="请输入菜单url"/>', 
										"</div>", 
									"</div>", 
									'<div class="form-group">', 
										'<label class="col-sm-2 control-label">上级菜单：</label>', 
										'<div class="col-sm-10">', 
											'<select class="menu-parent form-control"></select>', 
										"</div>", 
									"</div>", 
									'<div class="form-group">', 
										'<div class="col-sm-offset-2 col-sm-10">',	
											'<div class="checkbox">', 
												'<label><input class="menu-type" type="checkbox" value="1" {{if type}}checked{{/if}}>&nbsp;置为子目录</label>', 
											"</div>", 
										"</div>", 
									"</div>", 
									'<div class="form-group">', 
										'<div class="col-sm-offset-2 col-sm-10">', 
											'<div class="checkbox">', 
												'<label><input class="menu-type" type="checkbox" value="2" {{if type}}checked{{/if}}>&nbsp;置为菜单</label>', 
											"</div>", 
										"</div>", 
									"</div>", 
									'<div class="form-group">', 
										'<div class="col-sm-offset-2 col-sm-10">', 
											'<div class="checkbox">', 
												'<label><input class="menu-status" type="checkbox">&nbsp;隐藏</label>', 
											"</div>", 
										"</div>", 
									"</div>", 
									'<div class="form-group">', 
										'<label class="col-sm-2 control-label">菜单描述：</label>', 
										'<div class="col-sm-10">', 
											'<input type="text" value="" class="menu-description form-control" maxLength="30" placeholder="请输入菜单描述"/>',
										"</div>", 
									"</div>", 
								"</div>"].join(""),
                    source: e,
                    initial: function() {
                        var e, o = this;
                        e = o._container.find(".menu-parent"),
                        e.html(d({
                            options: l
                        }))
                    },
                    confirm: function() {
                        var e, l, o, t, i = this,
                        n = {},
                        c = new s;
                        return e = i._container,
                        l = e.find(".menu-name"),
                        n.name = l.val().trim(),
                        o = e.find(".menu-sign"),
                        n.resKey = o.val().trim(),
                        i = e.find(".menu-icon"),
                        n.icon = i.val().trim(),
                        t = e.find(".menu-link"),
                        n.resUrl = t.val().trim(),
                        n.type = $("input[class='menu-type']:checked").val(),
                        c.add(n.name, "isNotEmpty",
                        function() {
                            alert("请输入菜单名称"),
                            l.val("").focus()
                        }).add(n.resKey, "isNotEmpty",
                        function() {
                            alert("请输入菜单标识"),
                            o.val("").focus()
                        }).add(!n.type || n.resUrl, "isNotEmpty",
                		function() {
                        	alert("请输入菜单图标"),
                        	i.val("").focus()
                        }).add(n.icon , "isNotEmpty",
                        function() {
                            alert("请输入菜单url"),
                            t.val("").focus()
                        }),
                        c.start() ? (n.parentId = e.find(".menu-parent").val(), n.status = e.find(".menu-status").prop("checked") ? 1 : 0, n.description = e.find(".menu-description").val().trim(), void a({
                            url: window.basePath + "resources/commitEdit",
                            type: "POST",
                            data: n,
                            dataType: "json"
                        }).then(function(e) {
                            alert("添加成功"),
                            document.location.reload()
                        },
                        function() {
                            i.enableConfirm()
                        })) : void i.enableConfirm()
                    }
                })
            })
        },
        editMenu: function(e) {
            c.show({
                sizeClass: "modal-lg",
                title: "编辑菜单",
                content: r(e),
                force: 1,
                confirm: function() {
                    var l, o, t, g, i, n = this,
                    c = {},
                    r = new s;
                    return l = n._container,
                    o = l.find(".menu-name"),
                    c.name = o.val().trim(),
                    t = l.find(".menu-sign"),
                    c.resKey = t.val().trim(),
                    g = l.find(".menu-icon"),
                    c.icon = g.val().trim(),
                    i = l.find(".menu-link"),
                    c.resUrl = i.val().trim(),
                    c.type = $("input[class='menu-type']:checked").val(),
                    r.add(c.name, "isNotEmpty",
                    function() {
                        alert("请输入菜单名称"),
                        o.val("").focus()
                    }).add(c.resKey, "isNotEmpty",
                    function() {
                        alert("请输入菜单标识"),
                        t.val("").focus()
                    }).add(!c.type || c.resUrl, "isNotEmpty",
            		function() {
                    	alert("请输入菜单图标"),
                    	g.val("").focus()
                    }).add(c.icon , "isNotEmpty",
                    function() {
                        alert("请输入菜单url"),
                        i.val("").focus()
                    }),
                    r.start() ? (c.status = l.find(".menu-status").prop("checked") ? 1 : 0, c.description = l.find(".menu-description").val().trim(), c.id = e.id, void a({
                        url: window.basePath + "resources/commitEdit",
                        type: "POST",
                        data: c,
                        dataType: "json"
                    }).then(function(e) {
                        alert("编辑成功"),
                        document.location.reload()
                    },
                    function() {
                        n.enableConfirm()
                    })) : void n.enableConfirm()
                }
            })
        }
    }
});