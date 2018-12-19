/* bootstrap-table-editable.js */
!
function(b) {
    b.extend(b.fn.bootstrapTable.defaults, {
        editable: !0,
        onEditableInit: function() {
            return ! 1
        },
        onEditableSave: function() {
            return ! 1
        },
        onEditableShown: function() {
            return ! 1
        },
        onEditableHidden: function() {
            return ! 1
        }
    });
    b.extend(b.fn.bootstrapTable.Constructor.EVENTS, {
        "editable-init.bs.table": "onEditableInit",
        "editable-save.bs.table": "onEditableSave",
        "editable-shown.bs.table": "onEditableShown",
        "editable-hidden.bs.table": "onEditableHidden"
    });
    var d = b.fn.bootstrapTable.Constructor,
    h = d.prototype.initTable,
    k = d.prototype.initBody;
    d.prototype.initTable = function() {
        var c = this;
        h.apply(this, Array.prototype.slice.apply(arguments));
        this.options.editable && b.each(this.columns,
        function(d, a) {
            if (a.editable) {
                var i = {},
                g = [],
                e = function(a, b) {
                    var c = a.replace(/([A-Z])/g,
                    function(a) {
                        return "-" + a.toLowerCase()
                    });
                    "editable-" == c.slice(0, 9) && (c = c.replace("editable-", "data-"), i[c] = b)
                };
                b.each(c.options, e);
                var f = a.formatter;
                a.formatter = function(d, j, h) {
                    d = f ? f(d, j, h) : d;
                    b.each(a, e);
                    b.each(i,
                    function(a, b) {
                        g.push(" " + a + '="' + b + '"')
                    });
                    return ['<a href="javascript:void(0)"', ' data-name="' + a.field + '"', ' data-pk="' + j[c.options.idField] + '"', ' data-value="' + d + '"', g.join(""), "></a>"].join("")
                }
            }
        })
    };
    d.prototype.initBody = function() {
        var c = this;
        k.apply(this, Array.prototype.slice.apply(arguments));
        this.options.editable && (b.each(this.columns,
        function(d, a) {
            a.editable && (c.$body.find('a[data-name="' + a.field + '"]').editable(a.editable).off("save").on("save",
            function(d, g) {
                var e = c.getData(),
                f = b(this).parents("tr[data-index]").data("index"),
                e = e[f],
                f = e[a.field];
                b(this).data("value", g.submitValue);
                e[a.field] = g.submitValue;
                c.trigger("editable-save", a.field, e, f, b(this))
            }), c.$body.find('a[data-name="' + a.field + '"]').editable(a.editable).off("shown").on("shown",
            function(d, g) {
                var e = c.getData(),
                f = b(this).parents("tr[data-index]").data("index");
                c.trigger("editable-shown", a.field, e[f], b(this), g)
            }), c.$body.find('a[data-name="' + a.field + '"]').editable(a.editable).off("hidden").on("hidden",
            function(d, g) {
                var e = c.getData(),
                f = b(this).parents("tr[data-index]").data("index");
                c.trigger("editable-hidden", a.field, e[f], b(this), g)
            }))
        }), this.trigger("editable-init"))
    }
} (jQuery);
/* bootstrap-table-mobile.js V1.1.0*/
!
function(b) {
    var i = function(l, k) {
        if (l.options.columnsHidden.length > 0) {
            b.each(l.columns,
            function(m, n) {
                if (l.options.columnsHidden.indexOf(n.field) !== -1) {
                    if (n.visible !== k) {
                        l.toggleColumn(b.fn.bootstrapTable.utils.getFieldIndex(l.columns, n.field), k, true)
                    }
                }
            })
        }
    };
    var c = function(k) {
        if (k.options.height || k.options.showFooter) {
            setTimeout(function() {
                k.resetView.call(k)
            },
            1)
        }
    };
    var j = function(m, l, k) {
        if (m.options.minHeight) {
            if ((l <= m.options.minWidth) && (k <= m.options.minHeight)) {
                g(m)
            } else {
                if ((l > m.options.minWidth) && (k > m.options.minHeight)) {
                    d(m)
                }
            }
        } else {
            if (l <= m.options.minWidth) {
                g(m)
            } else {
                if (l > m.options.minWidth) {
                    d(m)
                }
            }
        }
        c(m)
    };
    var g = function(k) {
        e(k, false);
        i(k, false)
    };
    var d = function(k) {
        e(k, true);
        i(k, true)
    };
    var e = function(l, k) {
        l.options.cardView = k;
        l.toggleView()
    };
    var h = function(k, m) {
        var l;
        return function() {
            var p = this,
            o = arguments;
            var n = function() {
                l = null;
                k.apply(p, o)
            };
            clearTimeout(l);
            l = setTimeout(n, m)
        }
    };
    b.extend(b.fn.bootstrapTable.defaults, {
        mobileResponsive: false,
        minWidth: 562,
        minHeight: undefined,
        heightThreshold: 100,
        checkOnInit: true,
        columnsHidden: []
    });
    var a = b.fn.bootstrapTable.Constructor,
    f = a.prototype.init;
    a.prototype.init = function() {
        f.apply(this, Array.prototype.slice.apply(arguments));
        if (!this.options.mobileResponsive) {
            return
        }
        if (!this.options.minWidth) {
            return
        }
        if (this.options.minWidth < 100 && this.options.resizable) {
            console.log("The minWidth when the resizable extension is active should be greater or equal than 100");
            this.options.minWidth = 100
        }
        var n = this,
        l = {
            width: b(window).width(),
            height: b(window).height()
        };
        b(window).on("resize orientationchange", h(function(p) {
            var o = b(this).height(),
            q = b(this).width();
            if (Math.abs(l.height - o) > n.options.heightThreshold || l.width != q) {
                j(n, q, o);
                l = {
                    width: q,
                    height: o
                }
            }
        },
        200));
        if (this.options.checkOnInit) {
            var k = b(window).height(),
            m = b(window).width();
            j(this, m, k);
            l = {
                width: m,
                height: k
            }
        }
    }
} (jQuery);
/* BreakingNews.js*/
(function() {
    $.fn.BreakingNews = function(a) {
        a = $.extend({
            background: "#FFF",
            title: "NEWS",
            titlecolor: "#FFF",
            titlebgcolor: "#5aa628",
            linkcolor: "#333",
            linkhovercolor: "#5aa628",
            fonttextsize: 16,
            isbold: !1,
            border: "none",
            width: "100%",
            autoplay: !0,
            timer: 3E3,
            modulid: "brekingnews",
            effect: "fade"
        },
        a);
        return this.each(function() {
            function c(c) {
                "next" == c ? $(a.modulid + " ul li").length > b ? b++:b = 1 : b = -1 == b - 2 ? $(a.modulid + " ul li").length: b - 1;
                "fade" == a.effect ? ($(a.modulid + " ul li").css({
                    display: "none"
                }), $(a.modulid + " ul li").eq(parseInt(b - 1)).fadeIn()) : $(a.modulid + " ul").animate({
                    marginTop: -($(a.modulid + " ul li").height() + 20) * (b - 1)
                })
            }
            a.modulid = "#" + $(this).attr("id");
            var d = a.modulid,
            b = 1;
            fontw = !0 == a.isbold ? "bold": "normal";
            "slide" == a.effect ? $(a.modulid + " ul li").css({
                display: "block"
            }) : $(a.modulid + " ul li").css({
                display: "none"
            });
            $(a.modulid + " .bn-title").html(a.title);
            $(a.modulid).css({
                width: a.width,
                background: a.background,
                border: a.border,
                "font-size": a.fonttextsize
            });
            $(a.modulid + " ul").css({
                left: $(a.modulid + " .bn-title").width() + 40
            });
            $(a.modulid + " .bn-title").css({
                background: a.titlebgcolor,
                color: a.titlecolor,
                "font-weight": fontw
            });
            $(a.modulid + " ul li a").css({
                color: a.linkcolor,
                "font-weight": fontw,
                height: parseInt(a.fonttextsize) + 6
            });
            $(a.modulid + " ul li").eq(parseInt(b - 1)).css({
                display: "block"
            });
            $(a.modulid + " ul li a").hover(function() {
                $(this).css({
                    color: a.linkhovercolor
                })
            },
            function() {
                $(this).css({
                    color: a.linkcolor
                })
            });
            $(a.modulid + " .bn-arrows span").click(function() {
                "bn-arrows-left" == $(this).attr("class") ? c("prev") : c("next")
            }); ! 0 == a.autoplay ? (d = setInterval(function() {
                c("next")
            },
            a.timer), $(a.modulid).hover(function() {
                clearInterval(d)
            },
            function() {
                d = setInterval(function() {
                    c("next")
                },
                a.timer)
            })) : clearInterval(d);
            $(window).resize(function() {
                360 > $(a.modulid).width() ? ($(a.modulid + " .bn-title").html("&nbsp;"), $(a.modulid + " .bn-title").css({
                    width: "4px",
                    padding: "10px 0px"
                }), $(a.modulid + " ul").css({
                    left: 4
                })) : ($(a.modulid + " .bn-title").html(a.title), $(a.modulid + " .bn-title").css({
                    width: "auto",
                    padding: "10px 20px"
                }), $(a.modulid + " ul").css({
                    left: $(a.modulid + " .bn-title").width() + 40
                }))
            })
        })
    }
})(jQuery);
/* lobibox.min.js */
var Lobibox = Lobibox || {}; !
function() {
    function LobiboxPrompt(type, options) {
        this.$input = null,
        this.$type = "prompt",
        this.$promptType = type,
        options = $.extend({},
        Lobibox.prompt.DEFAULT_OPTIONS, options),
        this.$options = this._processInput(options),
        this._init(),
        this.debug(this)
    }
    function LobiboxConfirm(options) {
        this.$type = "confirm",
        this.$options = this._processInput(options),
        this._init(),
        this.debug(this)
    }
    function LobiboxAlert(type, options) {
        this.$type = type,
        this.$options = this._processInput(options),
        this._init(),
        this.debug(this)
    }
    function LobiboxProgress(options) {
        this.$type = "progress",
        this.$progressBarElement = null,
        this.$options = this._processInput(options),
        this.$progress = 0,
        this._init(),
        this.debug(this)
    }
    function LobiboxWindow(type, options) {
        this.$type = type,
        this.$options = this._processInput(options),
        this._init(),
        this.debug(this)
    }
    Lobibox.counter = 0,
    Lobibox.prompt = function(type, options) {
        return new LobiboxPrompt(type, options)
    },
    Lobibox.confirm = function(options) {
        return new LobiboxConfirm(options)
    },
    Lobibox.progress = function(options) {
        return new LobiboxProgress(options)
    },
    Lobibox.error = {},
    Lobibox.success = {},
    Lobibox.warning = {},
    Lobibox.info = {},
    Lobibox.alert = function(type, options) {
        return ["success", "error", "warning", "info"].indexOf(type) > -1 ? new LobiboxAlert(type, options) : void 0
    },
    Lobibox.window = function(options) {
        return new LobiboxWindow("window", options)
    };
    var LobiboxBase = {
        $type: null,
        $el: null,
        $options: null,
        debug: function() {
            this.$options.debug && window.console.debug.apply(window.console, arguments)
        },
        _processInput: function(options) {
            if ($.isArray(options.buttons)) {
                for (var btns = {},
                i = 0; i < options.buttons.length; i++) btns[options.buttons[i]] = Lobibox.base.OPTIONS.buttons[options.buttons[i]];
                options.buttons = btns
            }
            options.customBtnClass = options.customBtnClass ? options.customBtnClass: Lobibox.base.DEFAULTS.customBtnClass;
            for (var i in options.buttons) if (options.buttons.hasOwnProperty(i)) {
                var btn = options.buttons[i];
                btn = $.extend({},
                Lobibox.base.OPTIONS.buttons[i], btn),
                btn["class"] || (btn["class"] = options.customBtnClass),
                options.buttons[i] = btn
            }
            return options = $.extend({},
            Lobibox.base.DEFAULTS, options),
            void 0 === options.showClass && (options.showClass = Lobibox.base.OPTIONS.showClass),
            void 0 === options.hideClass && (options.hideClass = Lobibox.base.OPTIONS.hideClass),
            void 0 === options.baseClass && (options.baseClass = Lobibox.base.OPTIONS.baseClass),
            void 0 === options.delayToRemove && (options.delayToRemove = Lobibox.base.OPTIONS.delayToRemove),
            options.iconClass || (options.iconClass = Lobibox.base.OPTIONS.icons[options.iconSource][this.$type]),
            options
        },
        _init: function() {
            var me = this;
            me._createMarkup(),
            me.setTitle(me.$options.title),
            me.$options.draggable && !me._isMobileScreen() && (me.$el.addClass("draggable"), me._enableDrag()),
            me.$options.closeButton && me._addCloseButton(),
            me.$options.closeOnEsc && $(document).on("keyup.lobibox",
            function(ev) {
                27 === ev.which && me.destroy()
            }),
            me.$options.baseClass && me.$el.addClass(me.$options.baseClass),
            me.$options.showClass && (me.$el.removeClass(me.$options.hideClass), me.$el.addClass(me.$options.showClass)),
            me.$el.data("lobibox", me)
        },
        _calculatePosition: function(position) {
            var top, me = this;
            top = "top" === position ? 30 : "bottom" === position ? $(window).outerHeight() - me.$el.outerHeight() - 30 : ($(window).outerHeight() - me.$el.outerHeight()) / 2;
            var left = ($(window).outerWidth() - me.$el.outerWidth()) / 2;
            return {
                left: left,
                top: top
            }
        },
        _createButton: function(type, op) {
            var me = this,
            btn = $("<button></button>").addClass(op["class"]).attr("data-type", type).html(op.text);
            return me.$options.callback && "function" == typeof me.$options.callback && btn.on("click.lobibox",
            function(ev) {
                var bt = $(this);
                me._onButtonClick(me.$options.buttons[type], type),
                me.$options.callback(me, bt.data("type"), ev)
            }),
            btn.click(function() {
                me._onButtonClick(me.$options.buttons[type], type)
            }),
            btn
        },
        _onButtonClick: function(buttonOptions, type) {
            var me = this; ("ok" === type && "prompt" === me.$type && me.isValid() || "prompt" !== me.$type || "ok" !== type) && buttonOptions && buttonOptions.closeOnClick && me.destroy()
        },
        _generateButtons: function() {
            var me = this,
            btns = [];
            for (var i in me.$options.buttons) if (me.$options.buttons.hasOwnProperty(i)) {
                var op = me.$options.buttons[i],
                btn = me._createButton(i, op);
                btns.push(btn)
            }
            return btns
        },
        _createMarkup: function() {
            var me = this,
            lobibox = $('<div class="lobibox"></div>');
            lobibox.attr("data-is-modal", me.$options.modal);
            var header = $('<div class="lobibox-header"></div>').append('<span class="lobibox-title"></span>'),
            body = $('<div class="lobibox-body"></div>');
            if (lobibox.append(header), lobibox.append(body), me.$options.buttons && !$.isEmptyObject(me.$options.buttons)) {
                var footer = $('<div class="lobibox-footer"></div>');
                footer.append(me._generateButtons()),
                lobibox.append(footer),
                Lobibox.base.OPTIONS.buttonsAlign.indexOf(me.$options.buttonsAlign) > -1 && footer.addClass("text-" + me.$options.buttonsAlign)
            }
            me.$el = lobibox.addClass(Lobibox.base.OPTIONS.modalClasses[me.$type])
        },
        _setSize: function() {
            var me = this;
            me.setWidth(me.$options.width),
            me.setHeight("auto" === me.$options.height ? me.$el.outerHeight() : me.$options.height)
        },
        _calculateBodyHeight: function(height) {
            var me = this,
            headerHeight = me.$el.find(".lobibox-header").outerHeight(),
            footerHeight = me.$el.find(".lobibox-footer").outerHeight();
            return height - (headerHeight ? headerHeight: 0) - (footerHeight ? footerHeight: 0)
        },
        _addBackdrop: function() {
            0 === $(".lobibox-backdrop").length && $("body").append('<div class="lobibox-backdrop"></div>')
        },
        _triggerEvent: function(type) {
            var me = this;
            me.$options[type] && "function" == typeof me.$options[type] && me.$options[type](me)
        },
        _calculateWidth: function(width) {
            var me = this;
            return width = Math.min(Math.max(width, me.$options.width), $(window).outerWidth()),
            width === $(window).outerWidth() && (width -= 2 * me.$options.horizontalOffset),
            width
        },
        _calculateHeight: function(height) {
            var me = this;
            return console.log(me.$options.height),
            height = Math.min(Math.max(height, me.$options.height), $(window).outerHeight()),
            height === $(window).outerHeight() && (height -= 2 * me.$options.verticalOffset),
            height
        },
        _addCloseButton: function() {
            var me = this,
            closeBtn = $('<span class="btn-close">&times;</span>');
            me.$el.find(".lobibox-header").append(closeBtn),
            closeBtn.on("mousedown",
            function(ev) {
                ev.stopPropagation()
            }),
            closeBtn.on("click.lobibox",
            function() {
                me.destroy()
            })
        },
        _position: function() {
            var me = this;
            me._setSize();
            var pos = me._calculatePosition();
            me.setPosition(pos.left, pos.top)
        },
        _isMobileScreen: function() {
            return $(window).outerWidth() < 768
        },
        _enableDrag: function() {
            var el = this.$el,
            heading = el.find(".lobibox-header");
            heading.on("mousedown.lobibox",
            function(ev) {
                el.attr("offset-left", ev.offsetX),
                el.attr("offset-top", ev.offsetY),
                el.attr("allow-drag", "true")
            }),
            $(document).on("mouseup.lobibox",
            function() {
                el.attr("allow-drag", "false")
            }),
            $(document).on("mousemove.lobibox",
            function(ev) {
                if ("true" === el.attr("allow-drag")) {
                    var left = ev.clientX - parseInt(el.attr("offset-left"), 10) - parseInt(el.css("border-left-width"), 10),
                    top = ev.clientY - parseInt(el.attr("offset-top"), 10) - parseInt(el.css("border-top-width"), 10);
                    el.css({
                        left: left,
                        top: top
                    })
                }
            })
        },
        _setContent: function(msg) {
            var me = this;
            return me.$el.find(".lobibox-body").html(msg),
            me
        },
        _beforeShow: function() {
            var me = this;
            me._triggerEvent("onShow")
        },
        _afterShow: function() {
            var me = this;
            Lobibox.counter++,
            me.$el.attr("data-nth", Lobibox.counter),
            me.$options.draggable || $(window).on("resize.lobibox-" + me.$el.attr("data-nth"),
            function() {
                me.refreshWidth(),
                me.refreshHeight(),
                me.$el.css("left", "50%").css("margin-left", "-" + me.$el.width() / 2 + "px"),
                me.$el.css("top", "50%").css("margin-top", "-" + me.$el.height() / 2 + "px")
            }),
            me._triggerEvent("shown")
        },
        _beforeClose: function() {
            var me = this;
            me._triggerEvent("beforeClose")
        },
        _afterClose: function() {
            var me = this;
            me.$options.draggable || $(window).off("resize.lobibox-" + me.$el.attr("data-nth")),
            me._triggerEvent("closed")
        },
        hide: function() {
            function callback() {
                me.$el.addClass("lobibox-hidden"),
                0 === $(".lobibox[data-is-modal=true]:not(.lobibox-hidden)").length && ($(".lobibox-backdrop").remove(), $("body").removeClass(Lobibox.base.OPTIONS.bodyClass))
            }
            var me = this;
            return me.$options.hideClass ? (me.$el.removeClass(me.$options.showClass), me.$el.addClass(me.$options.hideClass), setTimeout(function() {
                callback()
            },
            me.$options.delayToRemove)) : callback(),
            this
        },
        destroy: function() {
            function callback() {
                me.$el.remove(),
                0 === $(".lobibox[data-is-modal=true]").length && ($(".lobibox-backdrop").remove(), $("body").removeClass(Lobibox.base.OPTIONS.bodyClass)),
                me._afterClose()
            }
            var me = this;
            return me._beforeClose(),
            me.$options.hideClass ? (me.$el.removeClass(me.$options.showClass).addClass(me.$options.hideClass), setTimeout(function() {
                callback()
            },
            me.$options.delayToRemove)) : callback(),
            this
        },
        setWidth: function(width) {
            var me = this;
            return me.$el.css("width", me._calculateWidth(width)),
            me
        },
        refreshWidth: function() {
            this.setWidth(this.$el.width())
        },
        refreshHeight: function() {
            this.setHeight(this.$el.height())
        },
        setHeight: function(height) {
            var me = this;
            return me.$el.css("height", me._calculateHeight(height)).find(".lobibox-body").css("height", me._calculateBodyHeight(me.$el.innerHeight())),
            me
        },
        setSize: function(width, height) {
            var me = this;
            return me.setWidth(width),
            me.setHeight(height),
            me
        },
        setPosition: function(left, top) {
            var pos;
            return "number" == typeof left && "number" == typeof top ? pos = {
                left: left,
                top: top
            }: "string" == typeof left && (pos = this._calculatePosition(left)),
            this.$el.css(pos),
            this
        },
        setTitle: function(title) {
            return this.$el.find(".lobibox-title").html(title)
        },
        getTitle: function() {
            return this.$el.find(".lobibox-title").html()
        },
        show: function() {
            var me = this,
            $body = $("body");
            if (me._beforeShow(), me.$el.removeClass("lobibox-hidden"), $body.append(me.$el), me.$options.buttons) {
                var buttons = me.$el.find(".lobibox-footer").children();
                buttons[0].focus()
            }
            return me.$options.modal && ($body.addClass(Lobibox.base.OPTIONS.bodyClass), me._addBackdrop()),
            me.$options.delay !== !1 && setTimeout(function() {
                me.destroy()
            },
            me.$options.delay),
            me._afterShow(),
            me
        }
    };
    Lobibox.base = {},
    Lobibox.base.OPTIONS = {
        bodyClass: "lobibox-open",
        modalClasses: {
            error: "lobibox-error",
            success: "lobibox-success",
            info: "lobibox-info",
            warning: "lobibox-warning",
            confirm: "lobibox-confirm",
            progress: "lobibox-progress",
            prompt: "lobibox-prompt",
            "default": "lobibox-default",
            window: "lobibox-window"
        },
        buttonsAlign: ["left", "center", "right"],
        buttons: {
            ok: {
                "class": "lobibox-btn lobibox-btn-default",
                text: "OK",
                closeOnClick: !0
            },
            cancel: {
                "class": "lobibox-btn lobibox-btn-cancel",
                text: "Cancel",
                closeOnClick: !0
            },
            yes: {
                "class": "lobibox-btn lobibox-btn-yes",
                text: "Yes",
                closeOnClick: !0
            },
            no: {
                "class": "lobibox-btn lobibox-btn-no",
                text: "No",
                closeOnClick: !0
            }
        },
        icons: {
            bootstrap: {
                confirm: "glyphicon glyphicon-question-sign",
                success: "glyphicon glyphicon-ok-sign",
                error: "glyphicon glyphicon-remove-sign",
                warning: "glyphicon glyphicon-exclamation-sign",
                info: "glyphicon glyphicon-info-sign"
            },
            fontAwesome: {
                confirm: "fa fa-question-circle",
                success: "fa fa-check-circle",
                error: "fa fa-times-circle",
                warning: "fa fa-exclamation-circle",
                info: "fa fa-info-circle"
            }
        }
    },
    Lobibox.base.DEFAULTS = {
        horizontalOffset: 5,
        verticalOffset: 5,
        width: 600,
        height: "auto",
        closeButton: !0,
        draggable: !1,
        customBtnClass: "lobibox-btn lobibox-btn-default",
        modal: !0,
        debug: !1,
        buttonsAlign: "center",
        closeOnEsc: !0,
        delayToRemove: 200,
        delay: !1,
        baseClass: "animated-super-fast",
        showClass: "zoomIn",
        hideClass: "zoomOut",
        iconSource: "bootstrap",
        onShow: null,
        shown: null,
        beforeClose: null,
        closed: null
    },
    LobiboxPrompt.prototype = $.extend({},
    LobiboxBase, {
        constructor: LobiboxPrompt,
        _processInput: function(options) {
            var me = this,
            mergedOptions = LobiboxBase._processInput.call(me, options);
            return mergedOptions.buttons = {
                ok: Lobibox.base.OPTIONS.buttons.ok,
                cancel: Lobibox.base.OPTIONS.buttons.cancel
            },
            options = $.extend({},
            mergedOptions, LobiboxPrompt.DEFAULT_OPTIONS, options)
        },
        _init: function() {
            var me = this;
            LobiboxBase._init.call(me),
            me.show()
        },
        _afterShow: function() {
            var me = this;
            me._setContent(me._createInput())._position(),
            me.$input.focus(),
            LobiboxBase._afterShow.call(me)
        },
        _createInput: function() {
            var label, me = this;
            return me.$input = me.$options.multiline ? $("<textarea></textarea>").attr("rows", me.$options.lines) : $('<input type="' + me.$promptType + '"/>'),
            me.$input.addClass("lobibox-input").attr(me.$options.attrs),
            me.$options.value && me.setValue(me.$options.value),
            me.$options.label && (label = $("<label>" + me.$options.label + "</label>")),
            $("<div></div>").append(label, me.$input)
        },
        setValue: function(val) {
            return this.$input.val(val),
            this
        },
        getValue: function() {
            return this.$input.val()
        },
        isValid: function() {
            var me = this,
            $error = me.$el.find(".lobibox-input-error-message");
            return me.$options.required && !me.getValue() ? (me.$input.addClass("invalid"), 0 === $error.length && (me.$el.find(".lobibox-body").append('<p class="lobibox-input-error-message">' + me.$options.errorMessage + "</p>"), me._position(), me.$input.focus()), !1) : (me.$input.removeClass("invalid"), $error.remove(), me._position(), me.$input.focus(), !0)
        }
    }),
    LobiboxPrompt.DEFAULT_OPTIONS = {
        width: 400,
        attrs: {},
        value: "",
        multiline: !1,
        lines: 3,
        type: "text",
        label: "",
        required: !0,
        errorMessage: "The field is required"
    },
    LobiboxConfirm.prototype = $.extend({},
    LobiboxBase, {
        constructor: LobiboxConfirm,
        _processInput: function(options) {
            var me = this,
            mergedOptions = LobiboxBase._processInput.call(me, options);
            return mergedOptions.buttons = {
                yes: Lobibox.base.OPTIONS.buttons.yes,
                no: Lobibox.base.OPTIONS.buttons.no
            },
            options = $.extend({},
            mergedOptions, Lobibox.confirm.DEFAULTS, options)
        },
        _init: function() {
            var me = this;
            LobiboxBase._init.call(me),
            me.show()
        },
        _afterShow: function() {
            var me = this,
            d = $("<div></div>");
            me.$options.iconClass && d.append($('<div class="lobibox-icon-wrapper"></div>').append('<i class="lobibox-icon ' + me.$options.iconClass + '"></i>')),
            d.append('<div class="lobibox-body-text-wrapper"><span class="lobibox-body-text">' + me.$options.msg + "</span></div>"),
            me._setContent(d.html()),
            me._position(),
            LobiboxBase._afterShow.call(me)
        }
    }),
    Lobibox.confirm.DEFAULTS = {
        title: "Question",
        width: 500
    },
    LobiboxAlert.prototype = $.extend({},
    LobiboxBase, {
        constructor: LobiboxAlert,
        _processInput: function(options) {
            var me = this,
            mergedOptions = LobiboxBase._processInput.call(me, options);
            return mergedOptions.buttons = {
                ok: Lobibox.base.OPTIONS.buttons.ok
            },
            options = $.extend({},
            mergedOptions, Lobibox.alert.OPTIONS[me.$type], Lobibox.alert.DEFAULTS, options)
        },
        _init: function() {
            var me = this;
            LobiboxBase._init.call(me),
            me.show()
        },
        _afterShow: function() {
            var me = this,
            d = $("<div></div>");
            me.$options.iconClass && d.append($('<div class="lobibox-icon-wrapper"></div>').append('<i class="lobibox-icon ' + me.$options.iconClass + '"></i>')),
            d.append('<div class="lobibox-body-text-wrapper"><span class="lobibox-body-text">' + me.$options.msg + "</span></div>"),
            me._setContent(d.html()),
            me._position(),
            LobiboxBase._afterShow.call(me)
        }
    }),
    Lobibox.alert.OPTIONS = {
        warning: {
            title: "Warning"
        },
        info: {
            title: "Information"
        },
        success: {
            title: "Success"
        },
        error: {
            title: "Error"
        }
    },
    Lobibox.alert.DEFAULTS = {},
    LobiboxProgress.prototype = $.extend({},
    LobiboxBase, {
        constructor: LobiboxProgress,
        _processInput: function(options) {
            var me = this,
            mergedOptions = LobiboxBase._processInput.call(me, options);
            return options = $.extend({},
            mergedOptions, Lobibox.progress.DEFAULTS, options)
        },
        _init: function() {
            var me = this;
            LobiboxBase._init.call(me),
            me.show()
        },
        _afterShow: function() {
            var me = this;
            me.$progressBarElement = me.$options.progressTpl ? $(me.$options.progressTpl) : me._createProgressbar();
            var label;
            me.$options.label && (label = $("<label>" + me.$options.label + "</label>"));
            var innerHTML = $("<div></div>").append(label, me.$progressBarElement);
            me._setContent(innerHTML),
            me._position(),
            LobiboxBase._afterShow.call(me)
        },
        _createProgressbar: function() {
            var me = this,
            outer = $('<div class="lobibox-progress-bar-wrapper lobibox-progress-outer"></div>').append('<div class="lobibox-progress-bar lobibox-progress-element"></div>');
            return me.$options.showProgressLabel && outer.append('<span class="lobibox-progress-text" data-role="progress-text"></span>'),
            outer
        },
        setProgress: function(progress) {
            var me = this;
            if (100 !== me.$progress) return progress = Math.min(100, Math.max(0, progress)),
            me.$progress = progress,
            me._triggerEvent("progressUpdated"),
            100 === me.$progress && me._triggerEvent("progressCompleted"),
            me.$el.find(".lobibox-progress-element").css("width", progress.toFixed(1) + "%"),
            me.$el.find('[data-role="progress-text"]').html(progress.toFixed(1) + "%"),
            me
        },
        getProgress: function() {
            return this.$progress
        }
    }),
    Lobibox.progress.DEFAULTS = {
        width: 500,
        showProgressLabel: !0,
        label: "",
        progressTpl: !1,
        progressUpdated: null,
        progressCompleted: null
    },
    LobiboxWindow.prototype = $.extend({},
    LobiboxBase, {
        constructor: LobiboxWindow,
        _processInput: function(options) {
            var me = this,
            mergedOptions = LobiboxBase._processInput.call(me, options);
            return options.content && "function" == typeof options.content && (options.content = options.content()),
            options.content instanceof jQuery && (options.content = options.content.clone()),
            options = $.extend({},
            mergedOptions, Lobibox.window.DEFAULTS, options)
        },
        _init: function() {
            var me = this;
            LobiboxBase._init.call(me),
            me.setContent(me.$options.content),
            me.$options.url && me.$options.autoload ? (me.$options.showAfterLoad || me.show(), me.load(function() {
                me.$options.showAfterLoad && me.show()
            })) : me.show()
        },
        _afterShow: function() {
            var me = this;
            me._position(),
            LobiboxBase._afterShow.call(me)
        },
        setParams: function(params) {
            var me = this;
            return me.$options.params = params,
            me
        },
        getParams: function() {
            var me = this;
            return me.$options.params
        },
        setLoadMethod: function(method) {
            var me = this;
            return me.$options.loadMethod = method,
            me
        },
        getLoadMethod: function() {
            var me = this;
            return me.$options.loadMethod
        },
        setContent: function(content) {
            var me = this;
            return me.$options.content = content,
            me.$el.find(".lobibox-body").html("").append(content),
            me
        },
        getContent: function() {
            var me = this;
            return me.$options.content
        },
        setUrl: function(url) {
            return this.$options.url = url,
            this
        },
        getUrl: function() {
            return this.$options.url
        },
        load: function(callback) {
            var me = this;
            return me.$options.url ? ($.ajax(me.$options.url, {
                method: me.$options.loadMethod,
                data: me.$options.params
            }).done(function(res) {
                me.setContent(res),
                callback && "function" == typeof callback && callback(res)
            }), me) : me
        }
    }),
    Lobibox.window.DEFAULTS = {
        width: 480,
        height: 600,
        content: "",
        url: "",
        draggable: !0,
        autoload: !0,
        loadMethod: "GET",
        showAfterLoad: !0,
        params: {}
    }
} (),
Math.randomString = function(n) {
    for (var text = "",
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    i = 0; n > i; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text
};
var Lobibox = Lobibox || {}; !
function() {
    var LobiboxNotify = function(type, options) {
        this.$type = null,
        this.$options = null,
        this.$el = null;
        var me = this,
        _processInput = function(options) {
            return ("mini" === options.size || "large" === options.size) && (options = $.extend({},
            Lobibox.notify.OPTIONS[options.size], options)),
            options = $.extend({},
            Lobibox.notify.OPTIONS[me.$type], Lobibox.notify.DEFAULTS, options),
            "mini" !== options.size && options.title === !0 ? options.title = Lobibox.notify.OPTIONS[me.$type].title: "mini" === options.size && options.title === !0 && (options.title = !1),
            options.icon === !0 && (options.icon = Lobibox.notify.OPTIONS.icons[options.iconSource][me.$type]),
            options.sound === !0 && (options.sound = Lobibox.notify.OPTIONS[me.$type].sound),
            options.sound && (options.sound = options.soundPath + options.sound + options.soundExt),
            options
        },
        _init = function() {
            var $notify = _createNotify();
            if ("mini" === me.$options.size && $notify.addClass("notify-mini"), "string" == typeof me.$options.position) {
                var $wrapper = _createNotifyWrapper();
                _appendInWrapper($notify, $wrapper),
                $wrapper.hasClass("center") && $wrapper.css("margin-left", "-" + $wrapper.width() / 2 + "px")
            } else $("body").append($notify),
            $notify.css({
                position: "fixed",
                left: me.$options.position.left,
                top: me.$options.position.top
            });
            if (me.$el = $notify, me.$options.sound) {
                var snd = new Audio(me.$options.sound);
                snd.play()
            }
            me.$options.rounded && me.$el.addClass("rounded")
        },
        _appendInWrapper = function($el, $wrapper) {
            if ("normal" === me.$options.size) $wrapper.hasClass("bottom") ? $wrapper.prepend($el) : $wrapper.append($el);
            else if ("mini" === me.$options.size) $wrapper.hasClass("bottom") ? $wrapper.prepend($el) : $wrapper.append($el);
            else if ("large" === me.$options.size) {
                var tabPane = _createTabPane().append($el),
                $li = _createTabControl(tabPane.attr("id"));
                $wrapper.find(".lb-notify-wrapper").append(tabPane),
                $wrapper.find(".lb-notify-tabs").append($li),
                _activateTab($li),
                $li.find(">a").click(function() {
                    _activateTab($li)
                })
            }
        },
        _activateTab = function($li) {
            $li.closest(".lb-notify-tabs").find(">li").removeClass("active"),
            $li.addClass("active");
            var $current = $($li.find(">a").attr("href"));
            $current.closest(".lb-notify-wrapper").find(">.lb-tab-pane").removeClass("active"),
            $current.addClass("active")
        },
        _createTabControl = function(tabPaneId) {
            var $li = $("<li></li>", {
                "class": Lobibox.notify.OPTIONS[me.$type]["class"]
            });
            return $("<a></a>", {
                href: "#" + tabPaneId
            }).append('<i class="tab-control-icon ' + me.$options.icon + '"></i>').appendTo($li),
            $li
        },
        _createTabPane = function() {
            return $("<div></div>", {
                "class": "lb-tab-pane",
                id: Math.randomString(10)
            })
        },
        _createNotifyWrapper = function() {
            var $wrapper, selector = ("large" === me.$options.size ? ".lobibox-notify-wrapper-large": ".lobibox-notify-wrapper") + "." + me.$options.position.replace(/\s/gi, ".");
            return $wrapper = $(selector),
            0 === $wrapper.length && ($wrapper = $("<div></div>").addClass(selector.replace(/\./g, " ").trim()).appendTo($("body")), "large" === me.$options.size && $wrapper.append($('<ul class="lb-notify-tabs"></ul>')).append($('<div class="lb-notify-wrapper"></div>'))),
            $wrapper
        },
        _createNotify = function() {
            var $iconEl, $innerIconEl, $iconWrapper, $body, $msg, OPTS = Lobibox.notify.OPTIONS,
            $notify = $("<div></div>", {
                "class": "lobibox-notify " + OPTS[me.$type]["class"] + " " + OPTS["class"] + " " + me.$options.showClass
            });
            return $iconWrapper = $('<div class="lobibox-notify-icon-wrapper"></div>').appendTo($notify),
            $iconEl = $('<div class="lobibox-notify-icon"></div>').appendTo($iconWrapper),
            $innerIconEl = $("<div></div>").appendTo($iconEl),
            me.$options.img ? $innerIconEl.append('<img src="' + me.$options.img + '"/>') : me.$options.icon ? $innerIconEl.append('<div class="icon-el"><i class="' + me.$options.icon + '"></i></div>') : $notify.addClass("without-icon"),
            $msg = $('<div class="lobibox-notify-msg">' + me.$options.msg + "</div>"),
            me.$options.messageHeight !== !1 && $msg.css("max-height", me.$options.messageHeight),
            $body = $("<div></div>", {
                "class": "lobibox-notify-body"
            }).append($msg).appendTo($notify),
            me.$options.title && $body.prepend('<div class="lobibox-notify-title">' + me.$options.title + "<div>"),
            _addCloseButton($notify),
            ("normal" === me.$options.size || "mini" === me.$options.size) && (_addCloseOnClick($notify), _addDelay($notify)),
            me.$options.width && $notify.css("width", _calculateWidth(me.$options.width)),
            $notify
        },
        _addCloseButton = function($el) {
            me.$options.closable && $('<span class="lobibox-close">&times;</span>').click(function() {
                me.remove()
            }).appendTo($el)
        },
        _addCloseOnClick = function($el) {
            me.$options.closeOnClick && $el.click(function() {
                me.remove()
            })
        },
        _addDelay = function($el) {
            if (me.$options.delay) {
                if (me.$options.delayIndicator) {
                    var delay = $('<div class="lobibox-delay-indicator"><div></div></div>');
                    $el.append(delay)
                }
                var time = 0,
                interval = 1e3 / 30,
                timer = setInterval(function() {
                    time += interval;
                    var width = 100 * time / me.$options.delay;
                    width >= 100 && (width = 100, me.remove(), timer = clearInterval(timer)),
                    me.$options.delayIndicator && delay.find("div").css("width", width + "%")
                },
                interval);
                me.$options.pauseDelayOnHover && $el.on("mouseenter.lobibox",
                function() {
                    interval = 0
                }).on("mouseleave.lobibox",
                function() {
                    interval = 1e3 / 30
                })
            }
        },
        _findTabToActivate = function($li) {
            var $itemToActivate = $li.prev();
            return 0 === $itemToActivate.length && ($itemToActivate = $li.next()),
            0 === $itemToActivate.length ? null: $itemToActivate
        },
        _calculateWidth = function(width) {
            return width = Math.min($(window).outerWidth(), width)
        };
        this.remove = function() {
            me.$el.removeClass(me.$options.showClass).addClass(me.$options.hideClass);
            var parent = me.$el.parent(),
            wrapper = parent.closest(".lobibox-notify-wrapper-large"),
            href = "#" + parent.attr("id"),
            $li = wrapper.find('>.lb-notify-tabs>li:has(a[href="' + href + '"])');
            return $li.addClass(Lobibox.notify.OPTIONS["class"]).addClass(me.$options.hideClass),
            setTimeout(function() {
                if ("normal" === me.$options.size || "mini" === me.$options.size) me.$el.remove();
                else if ("large" === me.$options.size) {
                    var $newLi = _findTabToActivate($li);
                    $newLi && _activateTab($newLi),
                    $li.remove(),
                    parent.remove()
                }
            },
            500),
            me
        },
        this.$type = type,
        this.$options = _processInput(options),
        _init()
    };
    Lobibox.notify = function(type, options) {
        if (["default", "info", "warning", "error", "success"].indexOf(type) > -1) {
            var lobibox = new LobiboxNotify(type, options);
            return lobibox.$el.data("lobibox", lobibox),
            lobibox
        }
    },
    Lobibox.notify.closeAll = function() {
        var ll = $(".lobibox-notify");
        ll.each(function(ind, el) {
            $(el).data("lobibox").remove()
        })
    },
    Lobibox.notify.DEFAULTS = {
        title: !0,
        size: "normal",
        soundPath: "sounds/",
        soundExt: ".ogg",
        showClass: "fadeInDown",
        hideClass: "zoomOut",
        icon: !0,
        msg: "",
        img: null,
        closable: !0,
        hideCloseButton: !1,
        delay: 5e3,
        delayIndicator: !0,
        closeOnClick: !0,
        width: 400,
        sound: !0,
        position: "bottom right",
        iconSource: "bootstrap",
        rounded: !1,
        messageHeight: 60,
        pauseDelayOnHover: !0
    },
    Lobibox.notify.OPTIONS = {
        "class": "animated-fast",
        large: {
            width: 500,
            messageHeight: 96
        },
        mini: {
            "class": "notify-mini",
            messageHeight: 32
        },
        "default": {
            "class": "lobibox-notify-default",
            title: "Default",
            sound: !1
        },
        success: {
            "class": "lobibox-notify-success",
            title: "Success",
            sound: "sound2"
        },
        error: {
            "class": "lobibox-notify-error",
            title: "Error",
            sound: "sound4"
        },
        warning: {
            "class": "lobibox-notify-warning",
            title: "Warning",
            sound: "sound5"
        },
        info: {
            "class": "lobibox-notify-info",
            title: "Information",
            sound: "sound6"
        },
        icons: {
            bootstrap: {
                success: "glyphicon glyphicon-ok-sign",
                error: "glyphicon glyphicon-remove-sign",
                warning: "glyphicon glyphicon-exclamation-sign",
                info: "glyphicon glyphicon-info-sign"
            },
            fontAwesome: {
                success: "fa fa-check-circle",
                error: "fa fa-times-circle",
                warning: "fa fa-exclamation-circle",
                info: "fa fa-info-circle"
            }
        }
    }
} ();
/* Swiper 3.3.1*/
!
function() {
    "use strict";
    function e(e) {
        e.fn.swiper = function(a) {
            var r;
            return e(this).each(function() {
                var e = new t(this, a);
                r || (r = e)
            }),
            r
        }
    }
    var a, t = function(e, i) {
        function s(e) {
            return Math.floor(e)
        }
        function n() {
            b.autoplayTimeoutId = setTimeout(function() {
                b.params.loop ? (b.fixLoop(), b._slideNext(), b.emit("onAutoplay", b)) : b.isEnd ? i.autoplayStopOnLast ? b.stopAutoplay() : (b._slideTo(0), b.emit("onAutoplay", b)) : (b._slideNext(), b.emit("onAutoplay", b))
            },
            b.params.autoplay)
        }
        function o(e, t) {
            var r = a(e.target);
            if (!r.is(t)) if ("string" == typeof t) r = r.parents(t);
            else if (t.nodeType) {
                var i;
                return r.parents().each(function(e, a) {
                    a === t && (i = t)
                }),
                i ? t: void 0
            }
            if (0 !== r.length) return r[0]
        }
        function l(e, a) {
            a = a || {};
            var t = window.MutationObserver || window.WebkitMutationObserver,
            r = new t(function(e) {
                e.forEach(function(e) {
                    b.onResize(!0),
                    b.emit("onObserverUpdate", b, e)
                })
            });
            r.observe(e, {
                attributes: "undefined" == typeof a.attributes ? !0 : a.attributes,
                childList: "undefined" == typeof a.childList ? !0 : a.childList,
                characterData: "undefined" == typeof a.characterData ? !0 : a.characterData
            }),
            b.observers.push(r)
        }
        function p(e) {
            e.originalEvent && (e = e.originalEvent);
            var a = e.keyCode || e.charCode;
            if (!b.params.allowSwipeToNext && (b.isHorizontal() && 39 === a || !b.isHorizontal() && 40 === a)) return ! 1;
            if (!b.params.allowSwipeToPrev && (b.isHorizontal() && 37 === a || !b.isHorizontal() && 38 === a)) return ! 1;
            if (! (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || document.activeElement && document.activeElement.nodeName && ("input" === document.activeElement.nodeName.toLowerCase() || "textarea" === document.activeElement.nodeName.toLowerCase()))) {
                if (37 === a || 39 === a || 38 === a || 40 === a) {
                    var t = !1;
                    if (b.container.parents(".swiper-slide").length > 0 && 0 === b.container.parents(".swiper-slide-active").length) return;
                    var r = {
                        left: window.pageXOffset,
                        top: window.pageYOffset
                    },
                    i = window.innerWidth,
                    s = window.innerHeight,
                    n = b.container.offset();
                    b.rtl && (n.left = n.left - b.container[0].scrollLeft);
                    for (var o = [[n.left, n.top], [n.left + b.width, n.top], [n.left, n.top + b.height], [n.left + b.width, n.top + b.height]], l = 0; l < o.length; l++) {
                        var p = o[l];
                        p[0] >= r.left && p[0] <= r.left + i && p[1] >= r.top && p[1] <= r.top + s && (t = !0)
                    }
                    if (!t) return
                }
                b.isHorizontal() ? ((37 === a || 39 === a) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), (39 === a && !b.rtl || 37 === a && b.rtl) && b.slideNext(), (37 === a && !b.rtl || 39 === a && b.rtl) && b.slidePrev()) : ((38 === a || 40 === a) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), 40 === a && b.slideNext(), 38 === a && b.slidePrev())
            }
        }
        function d(e) {
            e.originalEvent && (e = e.originalEvent);
            var a = b.mousewheel.event,
            t = 0,
            r = b.rtl ? -1 : 1;
            if ("mousewheel" === a) if (b.params.mousewheelForceToAxis) if (b.isHorizontal()) {
                if (! (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY))) return;
                t = e.wheelDeltaX * r
            } else {
                if (! (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX))) return;
                t = e.wheelDeltaY
            } else t = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? -e.wheelDeltaX * r: -e.wheelDeltaY;
            else if ("DOMMouseScroll" === a) t = -e.detail;
            else if ("wheel" === a) if (b.params.mousewheelForceToAxis) if (b.isHorizontal()) {
                if (! (Math.abs(e.deltaX) > Math.abs(e.deltaY))) return;
                t = -e.deltaX * r
            } else {
                if (! (Math.abs(e.deltaY) > Math.abs(e.deltaX))) return;
                t = -e.deltaY
            } else t = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX * r: -e.deltaY;
            if (0 !== t) {
                if (b.params.mousewheelInvert && (t = -t), b.params.freeMode) {
                    var i = b.getWrapperTranslate() + t * b.params.mousewheelSensitivity,
                    s = b.isBeginning,
                    n = b.isEnd;
                    if (i >= b.minTranslate() && (i = b.minTranslate()), i <= b.maxTranslate() && (i = b.maxTranslate()), b.setWrapperTransition(0), b.setWrapperTranslate(i), b.updateProgress(), b.updateActiveIndex(), (!s && b.isBeginning || !n && b.isEnd) && b.updateClasses(), b.params.freeModeSticky ? (clearTimeout(b.mousewheel.timeout), b.mousewheel.timeout = setTimeout(function() {
                        b.slideReset()
                    },
                    300)) : b.params.lazyLoading && b.lazy && b.lazy.load(), 0 === i || i === b.maxTranslate()) return
                } else {
                    if ((new window.Date).getTime() - b.mousewheel.lastScrollTime > 60) if (0 > t) if (b.isEnd && !b.params.loop || b.animating) {
                        if (b.params.mousewheelReleaseOnEdges) return ! 0
                    } else b.slideNext();
                    else if (b.isBeginning && !b.params.loop || b.animating) {
                        if (b.params.mousewheelReleaseOnEdges) return ! 0
                    } else b.slidePrev();
                    b.mousewheel.lastScrollTime = (new window.Date).getTime()
                }
                return b.params.autoplay && b.stopAutoplay(),
                e.preventDefault ? e.preventDefault() : e.returnValue = !1,
                !1
            }
        }
        function u(e, t) {
            e = a(e);
            var r, i, s, n = b.rtl ? -1 : 1;
            r = e.attr("data-swiper-parallax") || "0",
            i = e.attr("data-swiper-parallax-x"),
            s = e.attr("data-swiper-parallax-y"),
            i || s ? (i = i || "0", s = s || "0") : b.isHorizontal() ? (i = r, s = "0") : (s = r, i = "0"),
            i = i.indexOf("%") >= 0 ? parseInt(i, 10) * t * n + "%": i * t * n + "px",
            s = s.indexOf("%") >= 0 ? parseInt(s, 10) * t + "%": s * t + "px",
            e.transform("translate3d(" + i + ", " + s + ",0px)")
        }
        function c(e) {
            return 0 !== e.indexOf("on") && (e = e[0] !== e[0].toUpperCase() ? "on" + e[0].toUpperCase() + e.substring(1) : "on" + e),
            e
        }
        if (! (this instanceof t)) return new t(e, i);
        var m = {
            direction: "horizontal",
            touchEventsTarget: "container",
            initialSlide: 0,
            speed: 300,
            autoplay: !1,
            autoplayDisableOnInteraction: !0,
            autoplayStopOnLast: !1,
            iOSEdgeSwipeDetection: !1,
            iOSEdgeSwipeThreshold: 20,
            freeMode: !1,
            freeModeMomentum: !0,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: !0,
            freeModeMomentumBounceRatio: 1,
            freeModeSticky: !1,
            freeModeMinimumVelocity: .02,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: !0
            },
            flip: {
                slideShadows: !0,
                limitRotation: !0
            },
            cube: {
                slideShadows: !0,
                shadow: !0,
                shadowOffset: 20,
                shadowScale: .94
            },
            fade: {
                crossFade: !1
            },
            parallax: !1,
            scrollbar: null,
            scrollbarHide: !0,
            scrollbarDraggable: !1,
            scrollbarSnapOnRelease: !1,
            keyboardControl: !1,
            mousewheelControl: !1,
            mousewheelReleaseOnEdges: !1,
            mousewheelInvert: !1,
            mousewheelForceToAxis: !1,
            mousewheelSensitivity: 1,
            hashnav: !1,
            breakpoints: void 0,
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: "column",
            slidesPerGroup: 1,
            centeredSlides: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: !0,
            onlyExternal: !1,
            threshold: 0,
            touchMoveStopPropagation: !0,
            uniqueNavElements: !0,
            pagination: null,
            paginationElement: "span",
            paginationClickable: !1,
            paginationHide: !1,
            paginationBulletRender: null,
            paginationProgressRender: null,
            paginationFractionRender: null,
            paginationCustomRender: null,
            paginationType: "bullets",
            resistance: !0,
            resistanceRatio: .85,
            nextButton: null,
            prevButton: null,
            watchSlidesProgress: !1,
            watchSlidesVisibility: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            lazyLoading: !1,
            lazyLoadingInPrevNext: !1,
            lazyLoadingInPrevNextAmount: 1,
            lazyLoadingOnTransitionStart: !1,
            preloadImages: !0,
            updateOnImagesReady: !0,
            loop: !1,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            control: void 0,
            controlInverse: !1,
            controlBy: "slide",
            allowSwipeToPrev: !0,
            allowSwipeToNext: !0,
            swipeHandler: null,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            slideClass: "swiper-slide",
            slideActiveClass: "swiper-slide-active",
            slideVisibleClass: "swiper-slide-visible",
            slideDuplicateClass: "swiper-slide-duplicate",
            slideNextClass: "swiper-slide-next",
            slidePrevClass: "swiper-slide-prev",
            wrapperClass: "swiper-wrapper",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            buttonDisabledClass: "swiper-button-disabled",
            paginationCurrentClass: "swiper-pagination-current",
            paginationTotalClass: "swiper-pagination-total",
            paginationHiddenClass: "swiper-pagination-hidden",
            paginationProgressbarClass: "swiper-pagination-progressbar",
            observer: !1,
            observeParents: !1,
            a11y: !1,
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
            firstSlideMessage: "This is the first slide",
            lastSlideMessage: "This is the last slide",
            paginationBulletMessage: "Go to slide {{index}}",
            runCallbacksOnInit: !0
        },
        h = i && i.virtualTranslate;
        i = i || {};
        var f = {};
        for (var g in i) if ("object" != typeof i[g] || null === i[g] || (i[g].nodeType || i[g] === window || i[g] === document || "undefined" != typeof r && i[g] instanceof r || "undefined" != typeof jQuery && i[g] instanceof jQuery)) f[g] = i[g];
        else {
            f[g] = {};
            for (var v in i[g]) f[g][v] = i[g][v]
        }
        for (var w in m) if ("undefined" == typeof i[w]) i[w] = m[w];
        else if ("object" == typeof i[w]) for (var y in m[w])"undefined" == typeof i[w][y] && (i[w][y] = m[w][y]);
        var b = this;
        if (b.params = i, b.originalParams = f, b.classNames = [], "undefined" != typeof a && "undefined" != typeof r && (a = r), ("undefined" != typeof a || (a = "undefined" == typeof r ? window.Dom7 || window.Zepto || window.jQuery: r)) && (b.$ = a, b.currentBreakpoint = void 0, b.getActiveBreakpoint = function() {
            if (!b.params.breakpoints) return ! 1;
            var e, a = !1,
            t = [];
            for (e in b.params.breakpoints) b.params.breakpoints.hasOwnProperty(e) && t.push(e);
            t.sort(function(e, a) {
                return parseInt(e, 10) > parseInt(a, 10)
            });
            for (var r = 0; r < t.length; r++) e = t[r],
            e >= window.innerWidth && !a && (a = e);
            return a || "max"
        },
        b.setBreakpoint = function() {
            var e = b.getActiveBreakpoint();
            if (e && b.currentBreakpoint !== e) {
                var a = e in b.params.breakpoints ? b.params.breakpoints[e] : b.originalParams,
                t = b.params.loop && a.slidesPerView !== b.params.slidesPerView;
                for (var r in a) b.params[r] = a[r];
                b.currentBreakpoint = e,
                t && b.destroyLoop && b.reLoop(!0)
            }
        },
        b.params.breakpoints && b.setBreakpoint(), b.container = a(e), 0 !== b.container.length)) {
            if (b.container.length > 1) {
                var x = [];
                return b.container.each(function() {
                    x.push(new t(this, i))
                }),
                x
            }
            b.container[0].swiper = b,
            b.container.data("swiper", b),
            b.classNames.push("swiper-container-" + b.params.direction),
            b.params.freeMode && b.classNames.push("swiper-container-free-mode"),
            b.support.flexbox || (b.classNames.push("swiper-container-no-flexbox"), b.params.slidesPerColumn = 1),
            b.params.autoHeight && b.classNames.push("swiper-container-autoheight"),
            (b.params.parallax || b.params.watchSlidesVisibility) && (b.params.watchSlidesProgress = !0),
            ["cube", "coverflow", "flip"].indexOf(b.params.effect) >= 0 && (b.support.transforms3d ? (b.params.watchSlidesProgress = !0, b.classNames.push("swiper-container-3d")) : b.params.effect = "slide"),
            "slide" !== b.params.effect && b.classNames.push("swiper-container-" + b.params.effect),
            "cube" === b.params.effect && (b.params.resistanceRatio = 0, b.params.slidesPerView = 1, b.params.slidesPerColumn = 1, b.params.slidesPerGroup = 1, b.params.centeredSlides = !1, b.params.spaceBetween = 0, b.params.virtualTranslate = !0, b.params.setWrapperSize = !1),
            ("fade" === b.params.effect || "flip" === b.params.effect) && (b.params.slidesPerView = 1, b.params.slidesPerColumn = 1, b.params.slidesPerGroup = 1, b.params.watchSlidesProgress = !0, b.params.spaceBetween = 0, b.params.setWrapperSize = !1, "undefined" == typeof h && (b.params.virtualTranslate = !0)),
            b.params.grabCursor && b.support.touch && (b.params.grabCursor = !1),
            b.wrapper = b.container.children("." + b.params.wrapperClass),
            b.params.pagination && (b.paginationContainer = a(b.params.pagination), b.params.uniqueNavElements && "string" == typeof b.params.pagination && b.paginationContainer.length > 1 && 1 === b.container.find(b.params.pagination).length && (b.paginationContainer = b.container.find(b.params.pagination)), "bullets" === b.params.paginationType && b.params.paginationClickable ? b.paginationContainer.addClass("swiper-pagination-clickable") : b.params.paginationClickable = !1, b.paginationContainer.addClass("swiper-pagination-" + b.params.paginationType)),
            (b.params.nextButton || b.params.prevButton) && (b.params.nextButton && (b.nextButton = a(b.params.nextButton), b.params.uniqueNavElements && "string" == typeof b.params.nextButton && b.nextButton.length > 1 && 1 === b.container.find(b.params.nextButton).length && (b.nextButton = b.container.find(b.params.nextButton))), b.params.prevButton && (b.prevButton = a(b.params.prevButton), b.params.uniqueNavElements && "string" == typeof b.params.prevButton && b.prevButton.length > 1 && 1 === b.container.find(b.params.prevButton).length && (b.prevButton = b.container.find(b.params.prevButton)))),
            b.isHorizontal = function() {
                return "horizontal" === b.params.direction
            },
            b.rtl = b.isHorizontal() && ("rtl" === b.container[0].dir.toLowerCase() || "rtl" === b.container.css("direction")),
            b.rtl && b.classNames.push("swiper-container-rtl"),
            b.rtl && (b.wrongRTL = "-webkit-box" === b.wrapper.css("display")),
            b.params.slidesPerColumn > 1 && b.classNames.push("swiper-container-multirow"),
            b.device.android && b.classNames.push("swiper-container-android"),
            b.container.addClass(b.classNames.join(" ")),
            b.translate = 0,
            b.progress = 0,
            b.velocity = 0,
            b.lockSwipeToNext = function() {
                b.params.allowSwipeToNext = !1
            },
            b.lockSwipeToPrev = function() {
                b.params.allowSwipeToPrev = !1
            },
            b.lockSwipes = function() {
                b.params.allowSwipeToNext = b.params.allowSwipeToPrev = !1
            },
            b.unlockSwipeToNext = function() {
                b.params.allowSwipeToNext = !0
            },
            b.unlockSwipeToPrev = function() {
                b.params.allowSwipeToPrev = !0
            },
            b.unlockSwipes = function() {
                b.params.allowSwipeToNext = b.params.allowSwipeToPrev = !0
            },
            b.params.grabCursor && (b.container[0].style.cursor = "move", b.container[0].style.cursor = "-webkit-grab", b.container[0].style.cursor = "-moz-grab", b.container[0].style.cursor = "grab"),
            b.imagesToLoad = [],
            b.imagesLoaded = 0,
            b.loadImage = function(e, a, t, r, i) {
                function s() {
                    i && i()
                }
                var n;
                e.complete && r ? s() : a ? (n = new window.Image, n.onload = s, n.onerror = s, t && (n.srcset = t), a && (n.src = a)) : s()
            },
            b.preloadImages = function() {
                function e() {
                    "undefined" != typeof b && null !== b && (void 0 !== b.imagesLoaded && b.imagesLoaded++, b.imagesLoaded === b.imagesToLoad.length && (b.params.updateOnImagesReady && b.update(), b.emit("onImagesReady", b)))
                }
                b.imagesToLoad = b.container.find("img");
                for (var a = 0; a < b.imagesToLoad.length; a++) b.loadImage(b.imagesToLoad[a], b.imagesToLoad[a].currentSrc || b.imagesToLoad[a].getAttribute("src"), b.imagesToLoad[a].srcset || b.imagesToLoad[a].getAttribute("srcset"), !0, e)
            },
            b.autoplayTimeoutId = void 0,
            b.autoplaying = !1,
            b.autoplayPaused = !1,
            b.startAutoplay = function() {
                return "undefined" != typeof b.autoplayTimeoutId ? !1 : b.params.autoplay ? b.autoplaying ? !1 : (b.autoplaying = !0, b.emit("onAutoplayStart", b), void n()) : !1
            },
            b.stopAutoplay = function(e) {
                b.autoplayTimeoutId && (b.autoplayTimeoutId && clearTimeout(b.autoplayTimeoutId), b.autoplaying = !1, b.autoplayTimeoutId = void 0, b.emit("onAutoplayStop", b))
            },
            b.pauseAutoplay = function(e) {
                b.autoplayPaused || (b.autoplayTimeoutId && clearTimeout(b.autoplayTimeoutId), b.autoplayPaused = !0, 0 === e ? (b.autoplayPaused = !1, n()) : b.wrapper.transitionEnd(function() {
                    b && (b.autoplayPaused = !1, b.autoplaying ? n() : b.stopAutoplay())
                }))
            },
            b.minTranslate = function() {
                return - b.snapGrid[0]
            },
            b.maxTranslate = function() {
                return - b.snapGrid[b.snapGrid.length - 1]
            },
            b.updateAutoHeight = function() {
                var e = b.slides.eq(b.activeIndex)[0];
                if ("undefined" != typeof e) {
                    var a = e.offsetHeight;
                    a && b.wrapper.css("height", a + "px")
                }
            },
            b.updateContainerSize = function() {
                var e, a;
                e = "undefined" != typeof b.params.width ? b.params.width: b.container[0].clientWidth,
                a = "undefined" != typeof b.params.height ? b.params.height: b.container[0].clientHeight,
                0 === e && b.isHorizontal() || 0 === a && !b.isHorizontal() || (e = e - parseInt(b.container.css("padding-left"), 10) - parseInt(b.container.css("padding-right"), 10), a = a - parseInt(b.container.css("padding-top"), 10) - parseInt(b.container.css("padding-bottom"), 10), b.width = e, b.height = a, b.size = b.isHorizontal() ? b.width: b.height)
            },
            b.updateSlidesSize = function() {
                b.slides = b.wrapper.children("." + b.params.slideClass),
                b.snapGrid = [],
                b.slidesGrid = [],
                b.slidesSizesGrid = [];
                var e, a = b.params.spaceBetween,
                t = -b.params.slidesOffsetBefore,
                r = 0,
                i = 0;
                if ("undefined" != typeof b.size) {
                    "string" == typeof a && a.indexOf("%") >= 0 && (a = parseFloat(a.replace("%", "")) / 100 * b.size),
                    b.virtualSize = -a,
                    b.rtl ? b.slides.css({
                        marginLeft: "",
                        marginTop: ""
                    }) : b.slides.css({
                        marginRight: "",
                        marginBottom: ""
                    });
                    var n;
                    b.params.slidesPerColumn > 1 && (n = Math.floor(b.slides.length / b.params.slidesPerColumn) === b.slides.length / b.params.slidesPerColumn ? b.slides.length: Math.ceil(b.slides.length / b.params.slidesPerColumn) * b.params.slidesPerColumn, "auto" !== b.params.slidesPerView && "row" === b.params.slidesPerColumnFill && (n = Math.max(n, b.params.slidesPerView * b.params.slidesPerColumn)));
                    var o, l = b.params.slidesPerColumn,
                    p = n / l,
                    d = p - (b.params.slidesPerColumn * p - b.slides.length);
                    for (e = 0; e < b.slides.length; e++) {
                        o = 0;
                        var u = b.slides.eq(e);
                        if (b.params.slidesPerColumn > 1) {
                            var c, m, h;
                            "column" === b.params.slidesPerColumnFill ? (m = Math.floor(e / l), h = e - m * l, (m > d || m === d && h === l - 1) && ++h >= l && (h = 0, m++), c = m + h * n / l, u.css({
                                "-webkit-box-ordinal-group": c,
                                "-moz-box-ordinal-group": c,
                                "-ms-flex-order": c,
                                "-webkit-order": c,
                                order: c
                            })) : (h = Math.floor(e / p), m = e - h * p),
                            u.css({
                                "margin-top": 0 !== h && b.params.spaceBetween && b.params.spaceBetween + "px"
                            }).attr("data-swiper-column", m).attr("data-swiper-row", h)
                        }
                        "none" !== u.css("display") && ("auto" === b.params.slidesPerView ? (o = b.isHorizontal() ? u.outerWidth(!0) : u.outerHeight(!0), b.params.roundLengths && (o = s(o))) : (o = (b.size - (b.params.slidesPerView - 1) * a) / b.params.slidesPerView, b.params.roundLengths && (o = s(o)), b.isHorizontal() ? b.slides[e].style.width = o + "px": b.slides[e].style.height = o + "px"), b.slides[e].swiperSlideSize = o, b.slidesSizesGrid.push(o), b.params.centeredSlides ? (t = t + o / 2 + r / 2 + a, 0 === e && (t = t - b.size / 2 - a), Math.abs(t) < .001 && (t = 0), i % b.params.slidesPerGroup === 0 && b.snapGrid.push(t), b.slidesGrid.push(t)) : (i % b.params.slidesPerGroup === 0 && b.snapGrid.push(t), b.slidesGrid.push(t), t = t + o + a), b.virtualSize += o + a, r = o, i++)
                    }
                    b.virtualSize = Math.max(b.virtualSize, b.size) + b.params.slidesOffsetAfter;
                    var f;
                    if (b.rtl && b.wrongRTL && ("slide" === b.params.effect || "coverflow" === b.params.effect) && b.wrapper.css({
                        width: b.virtualSize + b.params.spaceBetween + "px"
                    }), (!b.support.flexbox || b.params.setWrapperSize) && (b.isHorizontal() ? b.wrapper.css({
                        width: b.virtualSize + b.params.spaceBetween + "px"
                    }) : b.wrapper.css({
                        height: b.virtualSize + b.params.spaceBetween + "px"
                    })), b.params.slidesPerColumn > 1 && (b.virtualSize = (o + b.params.spaceBetween) * n, b.virtualSize = Math.ceil(b.virtualSize / b.params.slidesPerColumn) - b.params.spaceBetween, b.wrapper.css({
                        width: b.virtualSize + b.params.spaceBetween + "px"
                    }), b.params.centeredSlides)) {
                        for (f = [], e = 0; e < b.snapGrid.length; e++) b.snapGrid[e] < b.virtualSize + b.snapGrid[0] && f.push(b.snapGrid[e]);
                        b.snapGrid = f
                    }
                    if (!b.params.centeredSlides) {
                        for (f = [], e = 0; e < b.snapGrid.length; e++) b.snapGrid[e] <= b.virtualSize - b.size && f.push(b.snapGrid[e]);
                        b.snapGrid = f,
                        Math.floor(b.virtualSize - b.size) - Math.floor(b.snapGrid[b.snapGrid.length - 1]) > 1 && b.snapGrid.push(b.virtualSize - b.size)
                    }
                    0 === b.snapGrid.length && (b.snapGrid = [0]),
                    0 !== b.params.spaceBetween && (b.isHorizontal() ? b.rtl ? b.slides.css({
                        marginLeft: a + "px"
                    }) : b.slides.css({
                        marginRight: a + "px"
                    }) : b.slides.css({
                        marginBottom: a + "px"
                    })),
                    b.params.watchSlidesProgress && b.updateSlidesOffset()
                }
            },
            b.updateSlidesOffset = function() {
                for (var e = 0; e < b.slides.length; e++) b.slides[e].swiperSlideOffset = b.isHorizontal() ? b.slides[e].offsetLeft: b.slides[e].offsetTop
            },
            b.updateSlidesProgress = function(e) {
                if ("undefined" == typeof e && (e = b.translate || 0), 0 !== b.slides.length) {
                    "undefined" == typeof b.slides[0].swiperSlideOffset && b.updateSlidesOffset();
                    var a = -e;
                    b.rtl && (a = e),
                    b.slides.removeClass(b.params.slideVisibleClass);
                    for (var t = 0; t < b.slides.length; t++) {
                        var r = b.slides[t],
                        i = (a - r.swiperSlideOffset) / (r.swiperSlideSize + b.params.spaceBetween);
                        if (b.params.watchSlidesVisibility) {
                            var s = -(a - r.swiperSlideOffset),
                            n = s + b.slidesSizesGrid[t],
                            o = s >= 0 && s < b.size || n > 0 && n <= b.size || 0 >= s && n >= b.size;
                            o && b.slides.eq(t).addClass(b.params.slideVisibleClass)
                        }
                        r.progress = b.rtl ? -i: i
                    }
                }
            },
            b.updateProgress = function(e) {
                "undefined" == typeof e && (e = b.translate || 0);
                var a = b.maxTranslate() - b.minTranslate(),
                t = b.isBeginning,
                r = b.isEnd;
                0 === a ? (b.progress = 0, b.isBeginning = b.isEnd = !0) : (b.progress = (e - b.minTranslate()) / a, b.isBeginning = b.progress <= 0, b.isEnd = b.progress >= 1),
                b.isBeginning && !t && b.emit("onReachBeginning", b),
                b.isEnd && !r && b.emit("onReachEnd", b),
                b.params.watchSlidesProgress && b.updateSlidesProgress(e),
                b.emit("onProgress", b, b.progress)
            },
            b.updateActiveIndex = function() {
                var e, a, t, r = b.rtl ? b.translate: -b.translate;
                for (a = 0; a < b.slidesGrid.length; a++)"undefined" != typeof b.slidesGrid[a + 1] ? r >= b.slidesGrid[a] && r < b.slidesGrid[a + 1] - (b.slidesGrid[a + 1] - b.slidesGrid[a]) / 2 ? e = a: r >= b.slidesGrid[a] && r < b.slidesGrid[a + 1] && (e = a + 1) : r >= b.slidesGrid[a] && (e = a); (0 > e || "undefined" == typeof e) && (e = 0),
                t = Math.floor(e / b.params.slidesPerGroup),
                t >= b.snapGrid.length && (t = b.snapGrid.length - 1),
                e !== b.activeIndex && (b.snapIndex = t, b.previousIndex = b.activeIndex, b.activeIndex = e, b.updateClasses())
            },
            b.updateClasses = function() {
                b.slides.removeClass(b.params.slideActiveClass + " " + b.params.slideNextClass + " " + b.params.slidePrevClass);
                var e = b.slides.eq(b.activeIndex);
                e.addClass(b.params.slideActiveClass);
                var t = e.next("." + b.params.slideClass).addClass(b.params.slideNextClass);
                b.params.loop && 0 === t.length && b.slides.eq(0).addClass(b.params.slideNextClass);
                var r = e.prev("." + b.params.slideClass).addClass(b.params.slidePrevClass);
                if (b.params.loop && 0 === r.length && b.slides.eq( - 1).addClass(b.params.slidePrevClass), b.paginationContainer && b.paginationContainer.length > 0) {
                    var i, s = b.params.loop ? Math.ceil((b.slides.length - 2 * b.loopedSlides) / b.params.slidesPerGroup) : b.snapGrid.length;
                    if (b.params.loop ? (i = Math.ceil((b.activeIndex - b.loopedSlides) / b.params.slidesPerGroup), i > b.slides.length - 1 - 2 * b.loopedSlides && (i -= b.slides.length - 2 * b.loopedSlides), i > s - 1 && (i -= s), 0 > i && "bullets" !== b.params.paginationType && (i = s + i)) : i = "undefined" != typeof b.snapIndex ? b.snapIndex: b.activeIndex || 0, "bullets" === b.params.paginationType && b.bullets && b.bullets.length > 0 && (b.bullets.removeClass(b.params.bulletActiveClass), b.paginationContainer.length > 1 ? b.bullets.each(function() {
                        a(this).index() === i && a(this).addClass(b.params.bulletActiveClass)
                    }) : b.bullets.eq(i).addClass(b.params.bulletActiveClass)), "fraction" === b.params.paginationType && (b.paginationContainer.find("." + b.params.paginationCurrentClass).text(i + 1), b.paginationContainer.find("." + b.params.paginationTotalClass).text(s)), "progress" === b.params.paginationType) {
                        var n = (i + 1) / s,
                        o = n,
                        l = 1;
                        b.isHorizontal() || (l = n, o = 1),
                        b.paginationContainer.find("." + b.params.paginationProgressbarClass).transform("translate3d(0,0,0) scaleX(" + o + ") scaleY(" + l + ")").transition(b.params.speed)
                    }
                    "custom" === b.params.paginationType && b.params.paginationCustomRender && (b.paginationContainer.html(b.params.paginationCustomRender(b, i + 1, s)), b.emit("onPaginationRendered", b, b.paginationContainer[0]))
                }
                b.params.loop || (b.params.prevButton && b.prevButton && b.prevButton.length > 0 && (b.isBeginning ? (b.prevButton.addClass(b.params.buttonDisabledClass), b.params.a11y && b.a11y && b.a11y.disable(b.prevButton)) : (b.prevButton.removeClass(b.params.buttonDisabledClass), b.params.a11y && b.a11y && b.a11y.enable(b.prevButton))), b.params.nextButton && b.nextButton && b.nextButton.length > 0 && (b.isEnd ? (b.nextButton.addClass(b.params.buttonDisabledClass), b.params.a11y && b.a11y && b.a11y.disable(b.nextButton)) : (b.nextButton.removeClass(b.params.buttonDisabledClass), b.params.a11y && b.a11y && b.a11y.enable(b.nextButton))))
            },
            b.updatePagination = function() {
                if (b.params.pagination && b.paginationContainer && b.paginationContainer.length > 0) {
                    var e = "";
                    if ("bullets" === b.params.paginationType) {
                        for (var a = b.params.loop ? Math.ceil((b.slides.length - 2 * b.loopedSlides) / b.params.slidesPerGroup) : b.snapGrid.length, t = 0; a > t; t++) e += b.params.paginationBulletRender ? b.params.paginationBulletRender(t, b.params.bulletClass) : "<" + b.params.paginationElement + ' class="' + b.params.bulletClass + '"></' + b.params.paginationElement + ">";
                        b.paginationContainer.html(e),
                        b.bullets = b.paginationContainer.find("." + b.params.bulletClass),
                        b.params.paginationClickable && b.params.a11y && b.a11y && b.a11y.initPagination()
                    }
                    "fraction" === b.params.paginationType && (e = b.params.paginationFractionRender ? b.params.paginationFractionRender(b, b.params.paginationCurrentClass, b.params.paginationTotalClass) : '<span class="' + b.params.paginationCurrentClass + '"></span> / <span class="' + b.params.paginationTotalClass + '"></span>', b.paginationContainer.html(e)),
                    "progress" === b.params.paginationType && (e = b.params.paginationProgressRender ? b.params.paginationProgressRender(b, b.params.paginationProgressbarClass) : '<span class="' + b.params.paginationProgressbarClass + '"></span>', b.paginationContainer.html(e)),
                    "custom" !== b.params.paginationType && b.emit("onPaginationRendered", b, b.paginationContainer[0])
                }
            },
            b.update = function(e) {
                function a() {
                    r = Math.min(Math.max(b.translate, b.maxTranslate()), b.minTranslate()),
                    b.setWrapperTranslate(r),
                    b.updateActiveIndex(),
                    b.updateClasses()
                }
                if (b.updateContainerSize(), b.updateSlidesSize(), b.updateProgress(), b.updatePagination(), b.updateClasses(), b.params.scrollbar && b.scrollbar && b.scrollbar.set(), e) {
                    var t, r;
                    b.controller && b.controller.spline && (b.controller.spline = void 0),
                    b.params.freeMode ? (a(), b.params.autoHeight && b.updateAutoHeight()) : (t = ("auto" === b.params.slidesPerView || b.params.slidesPerView > 1) && b.isEnd && !b.params.centeredSlides ? b.slideTo(b.slides.length - 1, 0, !1, !0) : b.slideTo(b.activeIndex, 0, !1, !0), t || a())
                } else b.params.autoHeight && b.updateAutoHeight()
            },
            b.onResize = function(e) {
                b.params.breakpoints && b.setBreakpoint();
                var a = b.params.allowSwipeToPrev,
                t = b.params.allowSwipeToNext;
                b.params.allowSwipeToPrev = b.params.allowSwipeToNext = !0,
                b.updateContainerSize(),
                b.updateSlidesSize(),
                ("auto" === b.params.slidesPerView || b.params.freeMode || e) && b.updatePagination(),
                b.params.scrollbar && b.scrollbar && b.scrollbar.set(),
                b.controller && b.controller.spline && (b.controller.spline = void 0);
                var r = !1;
                if (b.params.freeMode) {
                    var i = Math.min(Math.max(b.translate, b.maxTranslate()), b.minTranslate());
                    b.setWrapperTranslate(i),
                    b.updateActiveIndex(),
                    b.updateClasses(),
                    b.params.autoHeight && b.updateAutoHeight()
                } else b.updateClasses(),
                r = ("auto" === b.params.slidesPerView || b.params.slidesPerView > 1) && b.isEnd && !b.params.centeredSlides ? b.slideTo(b.slides.length - 1, 0, !1, !0) : b.slideTo(b.activeIndex, 0, !1, !0);
                b.params.lazyLoading && !r && b.lazy && b.lazy.load(),
                b.params.allowSwipeToPrev = a,
                b.params.allowSwipeToNext = t
            };
            var T = ["mousedown", "mousemove", "mouseup"];
            window.navigator.pointerEnabled ? T = ["pointerdown", "pointermove", "pointerup"] : window.navigator.msPointerEnabled && (T = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]),
            b.touchEvents = {
                start: b.support.touch || !b.params.simulateTouch ? "touchstart": T[0],
                move: b.support.touch || !b.params.simulateTouch ? "touchmove": T[1],
                end: b.support.touch || !b.params.simulateTouch ? "touchend": T[2]
            },
            (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && ("container" === b.params.touchEventsTarget ? b.container: b.wrapper).addClass("swiper-wp8-" + b.params.direction),
            b.initEvents = function(e) {
                var a = e ? "off": "on",
                t = e ? "removeEventListener": "addEventListener",
                r = "container" === b.params.touchEventsTarget ? b.container[0] : b.wrapper[0],
                s = b.support.touch ? r: document,
                n = b.params.nested ? !0 : !1;
                b.browser.ie ? (r[t](b.touchEvents.start, b.onTouchStart, !1), s[t](b.touchEvents.move, b.onTouchMove, n), s[t](b.touchEvents.end, b.onTouchEnd, !1)) : (b.support.touch && (r[t](b.touchEvents.start, b.onTouchStart, !1), r[t](b.touchEvents.move, b.onTouchMove, n), r[t](b.touchEvents.end, b.onTouchEnd, !1)), !i.simulateTouch || b.device.ios || b.device.android || (r[t]("mousedown", b.onTouchStart, !1), document[t]("mousemove", b.onTouchMove, n), document[t]("mouseup", b.onTouchEnd, !1))),
                window[t]("resize", b.onResize),
                b.params.nextButton && b.nextButton && b.nextButton.length > 0 && (b.nextButton[a]("click", b.onClickNext), b.params.a11y && b.a11y && b.nextButton[a]("keydown", b.a11y.onEnterKey)),
                b.params.prevButton && b.prevButton && b.prevButton.length > 0 && (b.prevButton[a]("click", b.onClickPrev), b.params.a11y && b.a11y && b.prevButton[a]("keydown", b.a11y.onEnterKey)),
                b.params.pagination && b.params.paginationClickable && (b.paginationContainer[a]("click", "." + b.params.bulletClass, b.onClickIndex), b.params.a11y && b.a11y && b.paginationContainer[a]("keydown", "." + b.params.bulletClass, b.a11y.onEnterKey)),
                (b.params.preventClicks || b.params.preventClicksPropagation) && r[t]("click", b.preventClicks, !0)
            },
            b.attachEvents = function() {
                b.initEvents()
            },
            b.detachEvents = function() {
                b.initEvents(!0)
            },
            b.allowClick = !0,
            b.preventClicks = function(e) {
                b.allowClick || (b.params.preventClicks && e.preventDefault(), b.params.preventClicksPropagation && b.animating && (e.stopPropagation(), e.stopImmediatePropagation()))
            },
            b.onClickNext = function(e) {
                e.preventDefault(),
                (!b.isEnd || b.params.loop) && b.slideNext()
            },
            b.onClickPrev = function(e) {
                e.preventDefault(),
                (!b.isBeginning || b.params.loop) && b.slidePrev()
            },
            b.onClickIndex = function(e) {
                e.preventDefault();
                var t = a(this).index() * b.params.slidesPerGroup;
                b.params.loop && (t += b.loopedSlides),
                b.slideTo(t)
            },
            b.updateClickedSlide = function(e) {
                var t = o(e, "." + b.params.slideClass),
                r = !1;
                if (t) for (var i = 0; i < b.slides.length; i++) b.slides[i] === t && (r = !0);
                if (!t || !r) return b.clickedSlide = void 0,
                void(b.clickedIndex = void 0);
                if (b.clickedSlide = t, b.clickedIndex = a(t).index(), b.params.slideToClickedSlide && void 0 !== b.clickedIndex && b.clickedIndex !== b.activeIndex) {
                    var s, n = b.clickedIndex;
                    if (b.params.loop) {
                        if (b.animating) return;
                        s = a(b.clickedSlide).attr("data-swiper-slide-index"),
                        b.params.centeredSlides ? n < b.loopedSlides - b.params.slidesPerView / 2 || n > b.slides.length - b.loopedSlides + b.params.slidesPerView / 2 ? (b.fixLoop(), n = b.wrapper.children("." + b.params.slideClass + '[data-swiper-slide-index="' + s + '"]:not(.swiper-slide-duplicate)').eq(0).index(), setTimeout(function() {
                            b.slideTo(n)
                        },
                        0)) : b.slideTo(n) : n > b.slides.length - b.params.slidesPerView ? (b.fixLoop(), n = b.wrapper.children("." + b.params.slideClass + '[data-swiper-slide-index="' + s + '"]:not(.swiper-slide-duplicate)').eq(0).index(), setTimeout(function() {
                            b.slideTo(n)
                        },
                        0)) : b.slideTo(n)
                    } else b.slideTo(n)
                }
            };
            var S, C, z, M, E, P, k, I, L, B, D = "input, select, textarea, button",
            H = Date.now(),
            A = [];
            b.animating = !1,
            b.touches = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                diff: 0
            };
            var G, O;
            if (b.onTouchStart = function(e) {
                if (e.originalEvent && (e = e.originalEvent), G = "touchstart" === e.type, G || !("which" in e) || 3 !== e.which) {
                    if (b.params.noSwiping && o(e, "." + b.params.noSwipingClass)) return void(b.allowClick = !0);
                    if (!b.params.swipeHandler || o(e, b.params.swipeHandler)) {
                        var t = b.touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX: e.pageX,
                        r = b.touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY: e.pageY;
                        if (! (b.device.ios && b.params.iOSEdgeSwipeDetection && t <= b.params.iOSEdgeSwipeThreshold)) {
                            if (S = !0, C = !1, z = !0, E = void 0, O = void 0, b.touches.startX = t, b.touches.startY = r, M = Date.now(), b.allowClick = !0, b.updateContainerSize(), b.swipeDirection = void 0, b.params.threshold > 0 && (I = !1), "touchstart" !== e.type) {
                                var i = !0;
                                a(e.target).is(D) && (i = !1),
                                document.activeElement && a(document.activeElement).is(D) && document.activeElement.blur(),
                                i && e.preventDefault()
                            }
                            b.emit("onTouchStart", b, e)
                        }
                    }
                }
            },
            b.onTouchMove = function(e) {
                if (e.originalEvent && (e = e.originalEvent), !G || "mousemove" !== e.type) {
                    if (e.preventedByNestedSwiper) return b.touches.startX = "touchmove" === e.type ? e.targetTouches[0].pageX: e.pageX,
                    void(b.touches.startY = "touchmove" === e.type ? e.targetTouches[0].pageY: e.pageY);
                    if (b.params.onlyExternal) return b.allowClick = !1,
                    void(S && (b.touches.startX = b.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX: e.pageX, b.touches.startY = b.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY: e.pageY, M = Date.now()));
                    if (G && document.activeElement && e.target === document.activeElement && a(e.target).is(D)) return C = !0,
                    void(b.allowClick = !1);
                    if (z && b.emit("onTouchMove", b, e), !(e.targetTouches && e.targetTouches.length > 1)) {
                        if (b.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX: e.pageX, b.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY: e.pageY, "undefined" == typeof E) {
                            var t = 180 * Math.atan2(Math.abs(b.touches.currentY - b.touches.startY), Math.abs(b.touches.currentX - b.touches.startX)) / Math.PI;
                            E = b.isHorizontal() ? t > b.params.touchAngle: 90 - t > b.params.touchAngle
                        }
                        if (E && b.emit("onTouchMoveOpposite", b, e), "undefined" == typeof O && b.browser.ieTouch && (b.touches.currentX !== b.touches.startX || b.touches.currentY !== b.touches.startY) && (O = !0), S) {
                            if (E) return void(S = !1);
                            if (O || !b.browser.ieTouch) {
                                b.allowClick = !1,
                                b.emit("onSliderMove", b, e),
                                e.preventDefault(),
                                b.params.touchMoveStopPropagation && !b.params.nested && e.stopPropagation(),
                                C || (i.loop && b.fixLoop(), k = b.getWrapperTranslate(), b.setWrapperTransition(0), b.animating && b.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"), b.params.autoplay && b.autoplaying && (b.params.autoplayDisableOnInteraction ? b.stopAutoplay() : b.pauseAutoplay()), B = !1, b.params.grabCursor && (b.container[0].style.cursor = "move", b.container[0].style.cursor = "-webkit-grabbing", b.container[0].style.cursor = "-moz-grabbin", b.container[0].style.cursor = "grabbing")),
                                C = !0;
                                var r = b.touches.diff = b.isHorizontal() ? b.touches.currentX - b.touches.startX: b.touches.currentY - b.touches.startY;
                                r *= b.params.touchRatio,
                                b.rtl && (r = -r),
                                b.swipeDirection = r > 0 ? "prev": "next",
                                P = r + k;
                                var s = !0;
                                if (r > 0 && P > b.minTranslate() ? (s = !1, b.params.resistance && (P = b.minTranslate() - 1 + Math.pow( - b.minTranslate() + k + r, b.params.resistanceRatio))) : 0 > r && P < b.maxTranslate() && (s = !1, b.params.resistance && (P = b.maxTranslate() + 1 - Math.pow(b.maxTranslate() - k - r, b.params.resistanceRatio))), s && (e.preventedByNestedSwiper = !0), !b.params.allowSwipeToNext && "next" === b.swipeDirection && k > P && (P = k), !b.params.allowSwipeToPrev && "prev" === b.swipeDirection && P > k && (P = k), b.params.followFinger) {
                                    if (b.params.threshold > 0) {
                                        if (! (Math.abs(r) > b.params.threshold || I)) return void(P = k);
                                        if (!I) return I = !0,
                                        b.touches.startX = b.touches.currentX,
                                        b.touches.startY = b.touches.currentY,
                                        P = k,
                                        void(b.touches.diff = b.isHorizontal() ? b.touches.currentX - b.touches.startX: b.touches.currentY - b.touches.startY)
                                    } (b.params.freeMode || b.params.watchSlidesProgress) && b.updateActiveIndex(),
                                    b.params.freeMode && (0 === A.length && A.push({
                                        position: b.touches[b.isHorizontal() ? "startX": "startY"],
                                        time: M
                                    }), A.push({
                                        position: b.touches[b.isHorizontal() ? "currentX": "currentY"],
                                        time: (new window.Date).getTime()
                                    })),
                                    b.updateProgress(P),
                                    b.setWrapperTranslate(P)
                                }
                            }
                        }
                    }
                }
            },
            b.onTouchEnd = function(e) {
                if (e.originalEvent && (e = e.originalEvent), z && b.emit("onTouchEnd", b, e), z = !1, S) {
                    b.params.grabCursor && C && S && (b.container[0].style.cursor = "move", b.container[0].style.cursor = "-webkit-grab", b.container[0].style.cursor = "-moz-grab", b.container[0].style.cursor = "grab");
                    var t = Date.now(),
                    r = t - M;
                    if (b.allowClick && (b.updateClickedSlide(e), b.emit("onTap", b, e), 300 > r && t - H > 300 && (L && clearTimeout(L), L = setTimeout(function() {
                        b && (b.params.paginationHide && b.paginationContainer.length > 0 && !a(e.target).hasClass(b.params.bulletClass) && b.paginationContainer.toggleClass(b.params.paginationHiddenClass), b.emit("onClick", b, e))
                    },
                    300)), 300 > r && 300 > t - H && (L && clearTimeout(L), b.emit("onDoubleTap", b, e))), H = Date.now(), setTimeout(function() {
                        b && (b.allowClick = !0)
                    },
                    0), !S || !C || !b.swipeDirection || 0 === b.touches.diff || P === k) return void(S = C = !1);
                    S = C = !1;
                    var i;
                    if (i = b.params.followFinger ? b.rtl ? b.translate: -b.translate: -P, b.params.freeMode) {
                        if (i < -b.minTranslate()) return void b.slideTo(b.activeIndex);
                        if (i > -b.maxTranslate()) return void(b.slides.length < b.snapGrid.length ? b.slideTo(b.snapGrid.length - 1) : b.slideTo(b.slides.length - 1));
                        if (b.params.freeModeMomentum) {
                            if (A.length > 1) {
                                var s = A.pop(),
                                n = A.pop(),
                                o = s.position - n.position,
                                l = s.time - n.time;
                                b.velocity = o / l,
                                b.velocity = b.velocity / 2,
                                Math.abs(b.velocity) < b.params.freeModeMinimumVelocity && (b.velocity = 0),
                                (l > 150 || (new window.Date).getTime() - s.time > 300) && (b.velocity = 0)
                            } else b.velocity = 0;
                            A.length = 0;
                            var p = 1e3 * b.params.freeModeMomentumRatio,
                            d = b.velocity * p,
                            u = b.translate + d;
                            b.rtl && (u = -u);
                            var c, m = !1,
                            h = 20 * Math.abs(b.velocity) * b.params.freeModeMomentumBounceRatio;
                            if (u < b.maxTranslate()) b.params.freeModeMomentumBounce ? (u + b.maxTranslate() < -h && (u = b.maxTranslate() - h), c = b.maxTranslate(), m = !0, B = !0) : u = b.maxTranslate();
                            else if (u > b.minTranslate()) b.params.freeModeMomentumBounce ? (u - b.minTranslate() > h && (u = b.minTranslate() + h), c = b.minTranslate(), m = !0, B = !0) : u = b.minTranslate();
                            else if (b.params.freeModeSticky) {
                                var f, g = 0;
                                for (g = 0; g < b.snapGrid.length; g += 1) if (b.snapGrid[g] > -u) {
                                    f = g;
                                    break
                                }
                                u = Math.abs(b.snapGrid[f] - u) < Math.abs(b.snapGrid[f - 1] - u) || "next" === b.swipeDirection ? b.snapGrid[f] : b.snapGrid[f - 1],
                                b.rtl || (u = -u)
                            }
                            if (0 !== b.velocity) p = b.rtl ? Math.abs(( - u - b.translate) / b.velocity) : Math.abs((u - b.translate) / b.velocity);
                            else if (b.params.freeModeSticky) return void b.slideReset();
                            b.params.freeModeMomentumBounce && m ? (b.updateProgress(c), b.setWrapperTransition(p), b.setWrapperTranslate(u), b.onTransitionStart(), b.animating = !0, b.wrapper.transitionEnd(function() {
                                b && B && (b.emit("onMomentumBounce", b), b.setWrapperTransition(b.params.speed), b.setWrapperTranslate(c), b.wrapper.transitionEnd(function() {
                                    b && b.onTransitionEnd()
                                }))
                            })) : b.velocity ? (b.updateProgress(u), b.setWrapperTransition(p), b.setWrapperTranslate(u), b.onTransitionStart(), b.animating || (b.animating = !0, b.wrapper.transitionEnd(function() {
                                b && b.onTransitionEnd()
                            }))) : b.updateProgress(u),
                            b.updateActiveIndex()
                        }
                        return void((!b.params.freeModeMomentum || r >= b.params.longSwipesMs) && (b.updateProgress(), b.updateActiveIndex()))
                    }
                    var v, w = 0,
                    y = b.slidesSizesGrid[0];
                    for (v = 0; v < b.slidesGrid.length; v += b.params.slidesPerGroup)"undefined" != typeof b.slidesGrid[v + b.params.slidesPerGroup] ? i >= b.slidesGrid[v] && i < b.slidesGrid[v + b.params.slidesPerGroup] && (w = v, y = b.slidesGrid[v + b.params.slidesPerGroup] - b.slidesGrid[v]) : i >= b.slidesGrid[v] && (w = v, y = b.slidesGrid[b.slidesGrid.length - 1] - b.slidesGrid[b.slidesGrid.length - 2]);
                    var x = (i - b.slidesGrid[w]) / y;
                    if (r > b.params.longSwipesMs) {
                        if (!b.params.longSwipes) return void b.slideTo(b.activeIndex);
                        "next" === b.swipeDirection && (x >= b.params.longSwipesRatio ? b.slideTo(w + b.params.slidesPerGroup) : b.slideTo(w)),
                        "prev" === b.swipeDirection && (x > 1 - b.params.longSwipesRatio ? b.slideTo(w + b.params.slidesPerGroup) : b.slideTo(w))
                    } else {
                        if (!b.params.shortSwipes) return void b.slideTo(b.activeIndex);
                        "next" === b.swipeDirection && b.slideTo(w + b.params.slidesPerGroup),
                        "prev" === b.swipeDirection && b.slideTo(w)
                    }
                }
            },
            b._slideTo = function(e, a) {
                return b.slideTo(e, a, !0, !0)
            },
            b.slideTo = function(e, a, t, r) {
                "undefined" == typeof t && (t = !0),
                "undefined" == typeof e && (e = 0),
                0 > e && (e = 0),
                b.snapIndex = Math.floor(e / b.params.slidesPerGroup),
                b.snapIndex >= b.snapGrid.length && (b.snapIndex = b.snapGrid.length - 1);
                var i = -b.snapGrid[b.snapIndex];
                b.params.autoplay && b.autoplaying && (r || !b.params.autoplayDisableOnInteraction ? b.pauseAutoplay(a) : b.stopAutoplay()),
                b.updateProgress(i);
                for (var s = 0; s < b.slidesGrid.length; s++) - Math.floor(100 * i) >= Math.floor(100 * b.slidesGrid[s]) && (e = s);
                return ! b.params.allowSwipeToNext && i < b.translate && i < b.minTranslate() ? !1 : !b.params.allowSwipeToPrev && i > b.translate && i > b.maxTranslate() && (b.activeIndex || 0) !== e ? !1 : ("undefined" == typeof a && (a = b.params.speed), b.previousIndex = b.activeIndex || 0, b.activeIndex = e, b.rtl && -i === b.translate || !b.rtl && i === b.translate ? (b.params.autoHeight && b.updateAutoHeight(), b.updateClasses(), "slide" !== b.params.effect && b.setWrapperTranslate(i), !1) : (b.updateClasses(), b.onTransitionStart(t), 0 === a ? (b.setWrapperTranslate(i), b.setWrapperTransition(0), b.onTransitionEnd(t)) : (b.setWrapperTranslate(i), b.setWrapperTransition(a), b.animating || (b.animating = !0, b.wrapper.transitionEnd(function() {
                    b && b.onTransitionEnd(t)
                }))), !0))
            },
            b.onTransitionStart = function(e) {
                "undefined" == typeof e && (e = !0),
                b.params.autoHeight && b.updateAutoHeight(),
                b.lazy && b.lazy.onTransitionStart(),
                e && (b.emit("onTransitionStart", b), b.activeIndex !== b.previousIndex && (b.emit("onSlideChangeStart", b), b.activeIndex > b.previousIndex ? b.emit("onSlideNextStart", b) : b.emit("onSlidePrevStart", b)))
            },
            b.onTransitionEnd = function(e) {
                b.animating = !1,
                b.setWrapperTransition(0),
                "undefined" == typeof e && (e = !0),
                b.lazy && b.lazy.onTransitionEnd(),
                e && (b.emit("onTransitionEnd", b), b.activeIndex !== b.previousIndex && (b.emit("onSlideChangeEnd", b), b.activeIndex > b.previousIndex ? b.emit("onSlideNextEnd", b) : b.emit("onSlidePrevEnd", b))),
                b.params.hashnav && b.hashnav && b.hashnav.setHash()
            },
            b.slideNext = function(e, a, t) {
                if (b.params.loop) {
                    if (b.animating) return ! 1;
                    b.fixLoop();
                    b.container[0].clientLeft;
                    return b.slideTo(b.activeIndex + b.params.slidesPerGroup, a, e, t)
                }
                return b.slideTo(b.activeIndex + b.params.slidesPerGroup, a, e, t)
            },
            b._slideNext = function(e) {
                return b.slideNext(!0, e, !0)
            },
            b.slidePrev = function(e, a, t) {
                if (b.params.loop) {
                    if (b.animating) return ! 1;
                    b.fixLoop();
                    b.container[0].clientLeft;
                    return b.slideTo(b.activeIndex - 1, a, e, t)
                }
                return b.slideTo(b.activeIndex - 1, a, e, t)
            },
            b._slidePrev = function(e) {
                return b.slidePrev(!0, e, !0)
            },
            b.slideReset = function(e, a, t) {
                return b.slideTo(b.activeIndex, a, e)
            },
            b.setWrapperTransition = function(e, a) {
                b.wrapper.transition(e),
                "slide" !== b.params.effect && b.effects[b.params.effect] && b.effects[b.params.effect].setTransition(e),
                b.params.parallax && b.parallax && b.parallax.setTransition(e),
                b.params.scrollbar && b.scrollbar && b.scrollbar.setTransition(e),
                b.params.control && b.controller && b.controller.setTransition(e, a),
                b.emit("onSetTransition", b, e)
            },
            b.setWrapperTranslate = function(e, a, t) {
                var r = 0,
                i = 0,
                n = 0;
                b.isHorizontal() ? r = b.rtl ? -e: e: i = e,
                b.params.roundLengths && (r = s(r), i = s(i)),
                b.params.virtualTranslate || (b.support.transforms3d ? b.wrapper.transform("translate3d(" + r + "px, " + i + "px, " + n + "px)") : b.wrapper.transform("translate(" + r + "px, " + i + "px)")),
                b.translate = b.isHorizontal() ? r: i;
                var o, l = b.maxTranslate() - b.minTranslate();
                o = 0 === l ? 0 : (e - b.minTranslate()) / l,
                o !== b.progress && b.updateProgress(e),
                a && b.updateActiveIndex(),
                "slide" !== b.params.effect && b.effects[b.params.effect] && b.effects[b.params.effect].setTranslate(b.translate),
                b.params.parallax && b.parallax && b.parallax.setTranslate(b.translate),
                b.params.scrollbar && b.scrollbar && b.scrollbar.setTranslate(b.translate),
                b.params.control && b.controller && b.controller.setTranslate(b.translate, t),
                b.emit("onSetTranslate", b, b.translate)
            },
            b.getTranslate = function(e, a) {
                var t, r, i, s;
                return "undefined" == typeof a && (a = "x"),
                b.params.virtualTranslate ? b.rtl ? -b.translate: b.translate: (i = window.getComputedStyle(e, null), window.WebKitCSSMatrix ? (r = i.transform || i.webkitTransform, r.split(",").length > 6 && (r = r.split(", ").map(function(e) {
                    return e.replace(",", ".")
                }).join(", ")), s = new window.WebKitCSSMatrix("none" === r ? "": r)) : (s = i.MozTransform || i.OTransform || i.MsTransform || i.msTransform || i.transform || i.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), t = s.toString().split(",")), "x" === a && (r = window.WebKitCSSMatrix ? s.m41: 16 === t.length ? parseFloat(t[12]) : parseFloat(t[4])), "y" === a && (r = window.WebKitCSSMatrix ? s.m42: 16 === t.length ? parseFloat(t[13]) : parseFloat(t[5])), b.rtl && r && (r = -r), r || 0)
            },
            b.getWrapperTranslate = function(e) {
                return "undefined" == typeof e && (e = b.isHorizontal() ? "x": "y"),
                b.getTranslate(b.wrapper[0], e)
            },
            b.observers = [], b.initObservers = function() {
                if (b.params.observeParents) for (var e = b.container.parents(), a = 0; a < e.length; a++) l(e[a]);
                l(b.container[0], {
                    childList: !1
                }),
                l(b.wrapper[0], {
                    attributes: !1
                })
            },
            b.disconnectObservers = function() {
                for (var e = 0; e < b.observers.length; e++) b.observers[e].disconnect();
                b.observers = []
            },
            b.createLoop = function() {
                b.wrapper.children("." + b.params.slideClass + "." + b.params.slideDuplicateClass).remove();
                var e = b.wrapper.children("." + b.params.slideClass);
                "auto" !== b.params.slidesPerView || b.params.loopedSlides || (b.params.loopedSlides = e.length),
                b.loopedSlides = parseInt(b.params.loopedSlides || b.params.slidesPerView, 10),
                b.loopedSlides = b.loopedSlides + b.params.loopAdditionalSlides,
                b.loopedSlides > e.length && (b.loopedSlides = e.length);
                var t, r = [],
                i = [];
                for (e.each(function(t, s) {
                    var n = a(this);
                    t < b.loopedSlides && i.push(s),
                    t < e.length && t >= e.length - b.loopedSlides && r.push(s),
                    n.attr("data-swiper-slide-index", t)
                }), t = 0; t < i.length; t++) b.wrapper.append(a(i[t].cloneNode(!0)).addClass(b.params.slideDuplicateClass));
                for (t = r.length - 1; t >= 0; t--) b.wrapper.prepend(a(r[t].cloneNode(!0)).addClass(b.params.slideDuplicateClass))
            },
            b.destroyLoop = function() {
                b.wrapper.children("." + b.params.slideClass + "." + b.params.slideDuplicateClass).remove(),
                b.slides.removeAttr("data-swiper-slide-index")
            },
            b.reLoop = function(e) {
                var a = b.activeIndex - b.loopedSlides;
                b.destroyLoop(),
                b.createLoop(),
                b.updateSlidesSize(),
                e && b.slideTo(a + b.loopedSlides, 0, !1)
            },
            b.fixLoop = function() {
                var e;
                b.activeIndex < b.loopedSlides ? (e = b.slides.length - 3 * b.loopedSlides + b.activeIndex, e += b.loopedSlides, b.slideTo(e, 0, !1, !0)) : ("auto" === b.params.slidesPerView && b.activeIndex >= 2 * b.loopedSlides || b.activeIndex > b.slides.length - 2 * b.params.slidesPerView) && (e = -b.slides.length + b.activeIndex + b.loopedSlides, e += b.loopedSlides, b.slideTo(e, 0, !1, !0))
            },
            b.appendSlide = function(e) {
                if (b.params.loop && b.destroyLoop(), "object" == typeof e && e.length) for (var a = 0; a < e.length; a++) e[a] && b.wrapper.append(e[a]);
                else b.wrapper.append(e);
                b.params.loop && b.createLoop(),
                b.params.observer && b.support.observer || b.update(!0)
            },
            b.prependSlide = function(e) {
                b.params.loop && b.destroyLoop();
                var a = b.activeIndex + 1;
                if ("object" == typeof e && e.length) {
                    for (var t = 0; t < e.length; t++) e[t] && b.wrapper.prepend(e[t]);
                    a = b.activeIndex + e.length
                } else b.wrapper.prepend(e);
                b.params.loop && b.createLoop(),
                b.params.observer && b.support.observer || b.update(!0),
                b.slideTo(a, 0, !1)
            },
            b.removeSlide = function(e) {
                b.params.loop && (b.destroyLoop(), b.slides = b.wrapper.children("." + b.params.slideClass));
                var a, t = b.activeIndex;
                if ("object" == typeof e && e.length) {
                    for (var r = 0; r < e.length; r++) a = e[r],
                    b.slides[a] && b.slides.eq(a).remove(),
                    t > a && t--;
                    t = Math.max(t, 0)
                } else a = e,
                b.slides[a] && b.slides.eq(a).remove(),
                t > a && t--,
                t = Math.max(t, 0);
                b.params.loop && b.createLoop(),
                b.params.observer && b.support.observer || b.update(!0),
                b.params.loop ? b.slideTo(t + b.loopedSlides, 0, !1) : b.slideTo(t, 0, !1)
            },
            b.removeAllSlides = function() {
                for (var e = [], a = 0; a < b.slides.length; a++) e.push(a);
                b.removeSlide(e)
            },
            b.effects = {
                fade: {
                    setTranslate: function() {
                        for (var e = 0; e < b.slides.length; e++) {
                            var a = b.slides.eq(e),
                            t = a[0].swiperSlideOffset,
                            r = -t;
                            b.params.virtualTranslate || (r -= b.translate);
                            var i = 0;
                            b.isHorizontal() || (i = r, r = 0);
                            var s = b.params.fade.crossFade ? Math.max(1 - Math.abs(a[0].progress), 0) : 1 + Math.min(Math.max(a[0].progress, -1), 0);
                            a.css({
                                opacity: s
                            }).transform("translate3d(" + r + "px, " + i + "px, 0px)")
                        }
                    },
                    setTransition: function(e) {
                        if (b.slides.transition(e), b.params.virtualTranslate && 0 !== e) {
                            var a = !1;
                            b.slides.transitionEnd(function() {
                                if (!a && b) {
                                    a = !0,
                                    b.animating = !1;
                                    for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], t = 0; t < e.length; t++) b.wrapper.trigger(e[t])
                                }
                            })
                        }
                    }
                },
                flip: {
                    setTranslate: function() {
                        for (var e = 0; e < b.slides.length; e++) {
                            var t = b.slides.eq(e),
                            r = t[0].progress;
                            b.params.flip.limitRotation && (r = Math.max(Math.min(t[0].progress, 1), -1));
                            var i = t[0].swiperSlideOffset,
                            s = -180 * r,
                            n = s,
                            o = 0,
                            l = -i,
                            p = 0;
                            if (b.isHorizontal() ? b.rtl && (n = -n) : (p = l, l = 0, o = -n, n = 0), t[0].style.zIndex = -Math.abs(Math.round(r)) + b.slides.length, b.params.flip.slideShadows) {
                                var d = b.isHorizontal() ? t.find(".swiper-slide-shadow-left") : t.find(".swiper-slide-shadow-top"),
                                u = b.isHorizontal() ? t.find(".swiper-slide-shadow-right") : t.find(".swiper-slide-shadow-bottom");
                                0 === d.length && (d = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "left": "top") + '"></div>'), t.append(d)),
                                0 === u.length && (u = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "right": "bottom") + '"></div>'), t.append(u)),
                                d.length && (d[0].style.opacity = Math.max( - r, 0)),
                                u.length && (u[0].style.opacity = Math.max(r, 0))
                            }
                            t.transform("translate3d(" + l + "px, " + p + "px, 0px) rotateX(" + o + "deg) rotateY(" + n + "deg)")
                        }
                    },
                    setTransition: function(e) {
                        if (b.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), b.params.virtualTranslate && 0 !== e) {
                            var t = !1;
                            b.slides.eq(b.activeIndex).transitionEnd(function() {
                                if (!t && b && a(this).hasClass(b.params.slideActiveClass)) {
                                    t = !0,
                                    b.animating = !1;
                                    for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], r = 0; r < e.length; r++) b.wrapper.trigger(e[r])
                                }
                            })
                        }
                    }
                },
                cube: {
                    setTranslate: function() {
                        var e, t = 0;
                        b.params.cube.shadow && (b.isHorizontal() ? (e = b.wrapper.find(".swiper-cube-shadow"), 0 === e.length && (e = a('<div class="swiper-cube-shadow"></div>'), b.wrapper.append(e)), e.css({
                            height: b.width + "px"
                        })) : (e = b.container.find(".swiper-cube-shadow"), 0 === e.length && (e = a('<div class="swiper-cube-shadow"></div>'), b.container.append(e))));
                        for (var r = 0; r < b.slides.length; r++) {
                            var i = b.slides.eq(r),
                            s = 90 * r,
                            n = Math.floor(s / 360);
                            b.rtl && (s = -s, n = Math.floor( - s / 360));
                            var o = Math.max(Math.min(i[0].progress, 1), -1),
                            l = 0,
                            p = 0,
                            d = 0;
                            r % 4 === 0 ? (l = 4 * -n * b.size, d = 0) : (r - 1) % 4 === 0 ? (l = 0, d = 4 * -n * b.size) : (r - 2) % 4 === 0 ? (l = b.size + 4 * n * b.size, d = b.size) : (r - 3) % 4 === 0 && (l = -b.size, d = 3 * b.size + 4 * b.size * n),
                            b.rtl && (l = -l),
                            b.isHorizontal() || (p = l, l = 0);
                            var u = "rotateX(" + (b.isHorizontal() ? 0 : -s) + "deg) rotateY(" + (b.isHorizontal() ? s: 0) + "deg) translate3d(" + l + "px, " + p + "px, " + d + "px)";
                            if (1 >= o && o > -1 && (t = 90 * r + 90 * o, b.rtl && (t = 90 * -r - 90 * o)), i.transform(u), b.params.cube.slideShadows) {
                                var c = b.isHorizontal() ? i.find(".swiper-slide-shadow-left") : i.find(".swiper-slide-shadow-top"),
                                m = b.isHorizontal() ? i.find(".swiper-slide-shadow-right") : i.find(".swiper-slide-shadow-bottom");
                                0 === c.length && (c = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "left": "top") + '"></div>'), i.append(c)),
                                0 === m.length && (m = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "right": "bottom") + '"></div>'), i.append(m)),
                                c.length && (c[0].style.opacity = Math.max( - o, 0)),
                                m.length && (m[0].style.opacity = Math.max(o, 0))
                            }
                        }
                        if (b.wrapper.css({
                            "-webkit-transform-origin": "50% 50% -" + b.size / 2 + "px",
                            "-moz-transform-origin": "50% 50% -" + b.size / 2 + "px",
                            "-ms-transform-origin": "50% 50% -" + b.size / 2 + "px",
                            "transform-origin": "50% 50% -" + b.size / 2 + "px"
                        }), b.params.cube.shadow) if (b.isHorizontal()) e.transform("translate3d(0px, " + (b.width / 2 + b.params.cube.shadowOffset) + "px, " + -b.width / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + b.params.cube.shadowScale + ")");
                        else {
                            var h = Math.abs(t) - 90 * Math.floor(Math.abs(t) / 90),
                            f = 1.5 - (Math.sin(2 * h * Math.PI / 360) / 2 + Math.cos(2 * h * Math.PI / 360) / 2),
                            g = b.params.cube.shadowScale,
                            v = b.params.cube.shadowScale / f,
                            w = b.params.cube.shadowOffset;
                            e.transform("scale3d(" + g + ", 1, " + v + ") translate3d(0px, " + (b.height / 2 + w) + "px, " + -b.height / 2 / v + "px) rotateX(-90deg)")
                        }
                        var y = b.isSafari || b.isUiWebView ? -b.size / 2 : 0;
                        b.wrapper.transform("translate3d(0px,0," + y + "px) rotateX(" + (b.isHorizontal() ? 0 : t) + "deg) rotateY(" + (b.isHorizontal() ? -t: 0) + "deg)")
                    },
                    setTransition: function(e) {
                        b.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),
                        b.params.cube.shadow && !b.isHorizontal() && b.container.find(".swiper-cube-shadow").transition(e)
                    }
                },
                coverflow: {
                    setTranslate: function() {
                        for (var e = b.translate,
                        t = b.isHorizontal() ? -e + b.width / 2 : -e + b.height / 2, r = b.isHorizontal() ? b.params.coverflow.rotate: -b.params.coverflow.rotate, i = b.params.coverflow.depth, s = 0, n = b.slides.length; n > s; s++) {
                            var o = b.slides.eq(s),
                            l = b.slidesSizesGrid[s],
                            p = o[0].swiperSlideOffset,
                            d = (t - p - l / 2) / l * b.params.coverflow.modifier,
                            u = b.isHorizontal() ? r * d: 0,
                            c = b.isHorizontal() ? 0 : r * d,
                            m = -i * Math.abs(d),
                            h = b.isHorizontal() ? 0 : b.params.coverflow.stretch * d,
                            f = b.isHorizontal() ? b.params.coverflow.stretch * d: 0;
                            Math.abs(f) < .001 && (f = 0),
                            Math.abs(h) < .001 && (h = 0),
                            Math.abs(m) < .001 && (m = 0),
                            Math.abs(u) < .001 && (u = 0),
                            Math.abs(c) < .001 && (c = 0);
                            var g = "translate3d(" + f + "px," + h + "px," + m + "px)  rotateX(" + c + "deg) rotateY(" + u + "deg)";
                            if (o.transform(g), o[0].style.zIndex = -Math.abs(Math.round(d)) + 1, b.params.coverflow.slideShadows) {
                                var v = b.isHorizontal() ? o.find(".swiper-slide-shadow-left") : o.find(".swiper-slide-shadow-top"),
                                w = b.isHorizontal() ? o.find(".swiper-slide-shadow-right") : o.find(".swiper-slide-shadow-bottom");
                                0 === v.length && (v = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "left": "top") + '"></div>'), o.append(v)),
                                0 === w.length && (w = a('<div class="swiper-slide-shadow-' + (b.isHorizontal() ? "right": "bottom") + '"></div>'), o.append(w)),
                                v.length && (v[0].style.opacity = d > 0 ? d: 0),
                                w.length && (w[0].style.opacity = -d > 0 ? -d: 0)
                            }
                        }
                        if (b.browser.ie) {
                            var y = b.wrapper[0].style;
                            y.perspectiveOrigin = t + "px 50%"
                        }
                    },
                    setTransition: function(e) {
                        b.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)
                    }
                }
            },
            b.lazy = {
                initialImageLoaded: !1,
                loadImageInSlide: function(e, t) {
                    if ("undefined" != typeof e && ("undefined" == typeof t && (t = !0), 0 !== b.slides.length)) {
                        var r = b.slides.eq(e),
                        i = r.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)"); ! r.hasClass("swiper-lazy") || r.hasClass("swiper-lazy-loaded") || r.hasClass("swiper-lazy-loading") || (i = i.add(r[0])),
                        0 !== i.length && i.each(function() {
                            var e = a(this);
                            e.addClass("swiper-lazy-loading");
                            var i = e.attr("data-background"),
                            s = e.attr("data-src"),
                            n = e.attr("data-srcset");
                            b.loadImage(e[0], s || i, n, !1,
                            function() {
                                if (i ? (e.css("background-image", 'url("' + i + '")'), e.removeAttr("data-background")) : (n && (e.attr("srcset", n), e.removeAttr("data-srcset")), s && (e.attr("src", s), e.removeAttr("data-src"))), e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"), r.find(".swiper-lazy-preloader, .preloader").remove(), b.params.loop && t) {
                                    var a = r.attr("data-swiper-slide-index");
                                    if (r.hasClass(b.params.slideDuplicateClass)) {
                                        var o = b.wrapper.children('[data-swiper-slide-index="' + a + '"]:not(.' + b.params.slideDuplicateClass + ")");
                                        b.lazy.loadImageInSlide(o.index(), !1)
                                    } else {
                                        var l = b.wrapper.children("." + b.params.slideDuplicateClass + '[data-swiper-slide-index="' + a + '"]');
                                        b.lazy.loadImageInSlide(l.index(), !1)
                                    }
                                }
                                b.emit("onLazyImageReady", b, r[0], e[0])
                            }),
                            b.emit("onLazyImageLoad", b, r[0], e[0])
                        })
                    }
                },
                load: function() {
                    var e;
                    if (b.params.watchSlidesVisibility) b.wrapper.children("." + b.params.slideVisibleClass).each(function() {
                        b.lazy.loadImageInSlide(a(this).index())
                    });
                    else if (b.params.slidesPerView > 1) for (e = b.activeIndex; e < b.activeIndex + b.params.slidesPerView; e++) b.slides[e] && b.lazy.loadImageInSlide(e);
                    else b.lazy.loadImageInSlide(b.activeIndex);
                    if (b.params.lazyLoadingInPrevNext) if (b.params.slidesPerView > 1 || b.params.lazyLoadingInPrevNextAmount && b.params.lazyLoadingInPrevNextAmount > 1) {
                        var t = b.params.lazyLoadingInPrevNextAmount,
                        r = b.params.slidesPerView,
                        i = Math.min(b.activeIndex + r + Math.max(t, r), b.slides.length),
                        s = Math.max(b.activeIndex - Math.max(r, t), 0);
                        for (e = b.activeIndex + b.params.slidesPerView; i > e; e++) b.slides[e] && b.lazy.loadImageInSlide(e);
                        for (e = s; e < b.activeIndex; e++) b.slides[e] && b.lazy.loadImageInSlide(e)
                    } else {
                        var n = b.wrapper.children("." + b.params.slideNextClass);
                        n.length > 0 && b.lazy.loadImageInSlide(n.index());
                        var o = b.wrapper.children("." + b.params.slidePrevClass);
                        o.length > 0 && b.lazy.loadImageInSlide(o.index())
                    }
                },
                onTransitionStart: function() {
                    b.params.lazyLoading && (b.params.lazyLoadingOnTransitionStart || !b.params.lazyLoadingOnTransitionStart && !b.lazy.initialImageLoaded) && b.lazy.load()
                },
                onTransitionEnd: function() {
                    b.params.lazyLoading && !b.params.lazyLoadingOnTransitionStart && b.lazy.load()
                }
            },
            b.scrollbar = {
                isTouched: !1,
                setDragPosition: function(e) {
                    var a = b.scrollbar,
                    t = b.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageX: e.pageX || e.clientX: "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageY: e.pageY || e.clientY,
                    r = t - a.track.offset()[b.isHorizontal() ? "left": "top"] - a.dragSize / 2,
                    i = -b.minTranslate() * a.moveDivider,
                    s = -b.maxTranslate() * a.moveDivider;
                    i > r ? r = i: r > s && (r = s),
                    r = -r / a.moveDivider,
                    b.updateProgress(r),
                    b.setWrapperTranslate(r, !0)
                },
                dragStart: function(e) {
                    var a = b.scrollbar;
                    a.isTouched = !0,
                    e.preventDefault(),
                    e.stopPropagation(),
                    a.setDragPosition(e),
                    clearTimeout(a.dragTimeout),
                    a.track.transition(0),
                    b.params.scrollbarHide && a.track.css("opacity", 1),
                    b.wrapper.transition(100),
                    a.drag.transition(100),
                    b.emit("onScrollbarDragStart", b)
                },
                dragMove: function(e) {
                    var a = b.scrollbar;
                    a.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, a.setDragPosition(e), b.wrapper.transition(0), a.track.transition(0), a.drag.transition(0), b.emit("onScrollbarDragMove", b))
                },
                dragEnd: function(e) {
                    var a = b.scrollbar;
                    a.isTouched && (a.isTouched = !1, b.params.scrollbarHide && (clearTimeout(a.dragTimeout), a.dragTimeout = setTimeout(function() {
                        a.track.css("opacity", 0),
                        a.track.transition(400)
                    },
                    1e3)), b.emit("onScrollbarDragEnd", b), b.params.scrollbarSnapOnRelease && b.slideReset())
                },
                enableDraggable: function() {
                    var e = b.scrollbar,
                    t = b.support.touch ? e.track: document;
                    a(e.track).on(b.touchEvents.start, e.dragStart),
                    a(t).on(b.touchEvents.move, e.dragMove),
                    a(t).on(b.touchEvents.end, e.dragEnd)
                },
                disableDraggable: function() {
                    var e = b.scrollbar,
                    t = b.support.touch ? e.track: document;
                    a(e.track).off(b.touchEvents.start, e.dragStart),
                    a(t).off(b.touchEvents.move, e.dragMove),
                    a(t).off(b.touchEvents.end, e.dragEnd)
                },
                set: function() {
                    if (b.params.scrollbar) {
                        var e = b.scrollbar;
                        e.track = a(b.params.scrollbar),
                        b.params.uniqueNavElements && "string" == typeof b.params.scrollbar && e.track.length > 1 && 1 === b.container.find(b.params.scrollbar).length && (e.track = b.container.find(b.params.scrollbar)),
                        e.drag = e.track.find(".swiper-scrollbar-drag"),
                        0 === e.drag.length && (e.drag = a('<div class="swiper-scrollbar-drag"></div>'), e.track.append(e.drag)),
                        e.drag[0].style.width = "",
                        e.drag[0].style.height = "",
                        e.trackSize = b.isHorizontal() ? e.track[0].offsetWidth: e.track[0].offsetHeight,
                        e.divider = b.size / b.virtualSize,
                        e.moveDivider = e.divider * (e.trackSize / b.size),
                        e.dragSize = e.trackSize * e.divider,
                        b.isHorizontal() ? e.drag[0].style.width = e.dragSize + "px": e.drag[0].style.height = e.dragSize + "px",
                        e.divider >= 1 ? e.track[0].style.display = "none": e.track[0].style.display = "",
                        b.params.scrollbarHide && (e.track[0].style.opacity = 0)
                    }
                },
                setTranslate: function() {
                    if (b.params.scrollbar) {
                        var e, a = b.scrollbar,
                        t = (b.translate || 0, a.dragSize);
                        e = (a.trackSize - a.dragSize) * b.progress,
                        b.rtl && b.isHorizontal() ? (e = -e, e > 0 ? (t = a.dragSize - e, e = 0) : -e + a.dragSize > a.trackSize && (t = a.trackSize + e)) : 0 > e ? (t = a.dragSize + e, e = 0) : e + a.dragSize > a.trackSize && (t = a.trackSize - e),
                        b.isHorizontal() ? (b.support.transforms3d ? a.drag.transform("translate3d(" + e + "px, 0, 0)") : a.drag.transform("translateX(" + e + "px)"), a.drag[0].style.width = t + "px") : (b.support.transforms3d ? a.drag.transform("translate3d(0px, " + e + "px, 0)") : a.drag.transform("translateY(" + e + "px)"), a.drag[0].style.height = t + "px"),
                        b.params.scrollbarHide && (clearTimeout(a.timeout), a.track[0].style.opacity = 1, a.timeout = setTimeout(function() {
                            a.track[0].style.opacity = 0,
                            a.track.transition(400)
                        },
                        1e3))
                    }
                },
                setTransition: function(e) {
                    b.params.scrollbar && b.scrollbar.drag.transition(e)
                }
            },
            b.controller = {
                LinearSpline: function(e, a) {
                    this.x = e,
                    this.y = a,
                    this.lastIndex = e.length - 1;
                    var t, r;
                    this.x.length;
                    this.interpolate = function(e) {
                        return e ? (r = i(this.x, e), t = r - 1, (e - this.x[t]) * (this.y[r] - this.y[t]) / (this.x[r] - this.x[t]) + this.y[t]) : 0
                    };
                    var i = function() {
                        var e, a, t;
                        return function(r, i) {
                            for (a = -1, e = r.length; e - a > 1;) r[t = e + a >> 1] <= i ? a = t: e = t;
                            return e
                        }
                    } ()
                },
                getInterpolateFunction: function(e) {
                    b.controller.spline || (b.controller.spline = b.params.loop ? new b.controller.LinearSpline(b.slidesGrid, e.slidesGrid) : new b.controller.LinearSpline(b.snapGrid, e.snapGrid))
                },
                setTranslate: function(e, a) {
                    function r(a) {
                        e = a.rtl && "horizontal" === a.params.direction ? -b.translate: b.translate,
                        "slide" === b.params.controlBy && (b.controller.getInterpolateFunction(a), s = -b.controller.spline.interpolate( - e)),
                        s && "container" !== b.params.controlBy || (i = (a.maxTranslate() - a.minTranslate()) / (b.maxTranslate() - b.minTranslate()), s = (e - b.minTranslate()) * i + a.minTranslate()),
                        b.params.controlInverse && (s = a.maxTranslate() - s),
                        a.updateProgress(s),
                        a.setWrapperTranslate(s, !1, b),
                        a.updateActiveIndex()
                    }
                    var i, s, n = b.params.control;
                    if (b.isArray(n)) for (var o = 0; o < n.length; o++) n[o] !== a && n[o] instanceof t && r(n[o]);
                    else n instanceof t && a !== n && r(n)
                },
                setTransition: function(e, a) {
                    function r(a) {
                        a.setWrapperTransition(e, b),
                        0 !== e && (a.onTransitionStart(), a.wrapper.transitionEnd(function() {
                            s && (a.params.loop && "slide" === b.params.controlBy && a.fixLoop(), a.onTransitionEnd())
                        }))
                    }
                    var i, s = b.params.control;
                    if (b.isArray(s)) for (i = 0; i < s.length; i++) s[i] !== a && s[i] instanceof t && r(s[i]);
                    else s instanceof t && a !== s && r(s)
                }
            },
            b.hashnav = {
                init: function() {
                    if (b.params.hashnav) {
                        b.hashnav.initialized = !0;
                        var e = document.location.hash.replace("#", "");
                        if (e) for (var a = 0,
                        t = 0,
                        r = b.slides.length; r > t; t++) {
                            var i = b.slides.eq(t),
                            s = i.attr("data-hash");
                            if (s === e && !i.hasClass(b.params.slideDuplicateClass)) {
                                var n = i.index();
                                b.slideTo(n, a, b.params.runCallbacksOnInit, !0)
                            }
                        }
                    }
                },
                setHash: function() {
                    b.hashnav.initialized && b.params.hashnav && (document.location.hash = b.slides.eq(b.activeIndex).attr("data-hash") || "")
                }
            },
            b.disableKeyboardControl = function() {
                b.params.keyboardControl = !1,
                a(document).off("keydown", p)
            },
            b.enableKeyboardControl = function() {
                b.params.keyboardControl = !0,
                a(document).on("keydown", p)
            },
            b.mousewheel = {
                event: !1,
                lastScrollTime: (new window.Date).getTime()
            },
            b.params.mousewheelControl) {
                try {
                    new window.WheelEvent("wheel"),
                    b.mousewheel.event = "wheel"
                } catch(N) { (window.WheelEvent || b.container[0] && "wheel" in b.container[0]) && (b.mousewheel.event = "wheel")
                } ! b.mousewheel.event && window.WheelEvent,
                b.mousewheel.event || void 0 === document.onmousewheel || (b.mousewheel.event = "mousewheel"),
                b.mousewheel.event || (b.mousewheel.event = "DOMMouseScroll")
            }
            b.disableMousewheelControl = function() {
                return b.mousewheel.event ? (b.container.off(b.mousewheel.event, d), !0) : !1
            },
            b.enableMousewheelControl = function() {
                return b.mousewheel.event ? (b.container.on(b.mousewheel.event, d), !0) : !1
            },
            b.parallax = {
                setTranslate: function() {
                    b.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        u(this, b.progress)
                    }),
                    b.slides.each(function() {
                        var e = a(this);
                        e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                            var a = Math.min(Math.max(e[0].progress, -1), 1);
                            u(this, a)
                        })
                    })
                },
                setTransition: function(e) {
                    "undefined" == typeof e && (e = b.params.speed),
                    b.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        var t = a(this),
                        r = parseInt(t.attr("data-swiper-parallax-duration"), 10) || e;
                        0 === e && (r = 0),
                        t.transition(r)
                    })
                }
            },
            b._plugins = [];
            for (var R in b.plugins) {
                var W = b.plugins[R](b, b.params[R]);
                W && b._plugins.push(W)
            }
            return b.callPlugins = function(e) {
                for (var a = 0; a < b._plugins.length; a++) e in b._plugins[a] && b._plugins[a][e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            },
            b.emitterEventListeners = {},
            b.emit = function(e) {
                b.params[e] && b.params[e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                var a;
                if (b.emitterEventListeners[e]) for (a = 0; a < b.emitterEventListeners[e].length; a++) b.emitterEventListeners[e][a](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                b.callPlugins && b.callPlugins(e, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            },
            b.on = function(e, a) {
                return e = c(e),
                b.emitterEventListeners[e] || (b.emitterEventListeners[e] = []),
                b.emitterEventListeners[e].push(a),
                b
            },
            b.off = function(e, a) {
                var t;
                if (e = c(e), "undefined" == typeof a) return b.emitterEventListeners[e] = [],
                b;
                if (b.emitterEventListeners[e] && 0 !== b.emitterEventListeners[e].length) {
                    for (t = 0; t < b.emitterEventListeners[e].length; t++) b.emitterEventListeners[e][t] === a && b.emitterEventListeners[e].splice(t, 1);
                    return b
                }
            },
            b.once = function(e, a) {
                e = c(e);
                var t = function() {
                    a(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]),
                    b.off(e, t)
                };
                return b.on(e, t),
                b
            },
            b.a11y = {
                makeFocusable: function(e) {
                    return e.attr("tabIndex", "0"),
                    e
                },
                addRole: function(e, a) {
                    return e.attr("role", a),
                    e
                },
                addLabel: function(e, a) {
                    return e.attr("aria-label", a),
                    e
                },
                disable: function(e) {
                    return e.attr("aria-disabled", !0),
                    e
                },
                enable: function(e) {
                    return e.attr("aria-disabled", !1),
                    e
                },
                onEnterKey: function(e) {
                    13 === e.keyCode && (a(e.target).is(b.params.nextButton) ? (b.onClickNext(e), b.isEnd ? b.a11y.notify(b.params.lastSlideMessage) : b.a11y.notify(b.params.nextSlideMessage)) : a(e.target).is(b.params.prevButton) && (b.onClickPrev(e), b.isBeginning ? b.a11y.notify(b.params.firstSlideMessage) : b.a11y.notify(b.params.prevSlideMessage)), a(e.target).is("." + b.params.bulletClass) && a(e.target)[0].click())
                },
                liveRegion: a('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
                notify: function(e) {
                    var a = b.a11y.liveRegion;
                    0 !== a.length && (a.html(""), a.html(e))
                },
                init: function() {
                    b.params.nextButton && b.nextButton && b.nextButton.length > 0 && (b.a11y.makeFocusable(b.nextButton), b.a11y.addRole(b.nextButton, "button"), b.a11y.addLabel(b.nextButton, b.params.nextSlideMessage)),
                    b.params.prevButton && b.prevButton && b.prevButton.length > 0 && (b.a11y.makeFocusable(b.prevButton), b.a11y.addRole(b.prevButton, "button"), b.a11y.addLabel(b.prevButton, b.params.prevSlideMessage)),
                    a(b.container).append(b.a11y.liveRegion)
                },
                initPagination: function() {
                    b.params.pagination && b.params.paginationClickable && b.bullets && b.bullets.length && b.bullets.each(function() {
                        var e = a(this);
                        b.a11y.makeFocusable(e),
                        b.a11y.addRole(e, "button"),
                        b.a11y.addLabel(e, b.params.paginationBulletMessage.replace(/{{index}}/, e.index() + 1))
                    })
                },
                destroy: function() {
                    b.a11y.liveRegion && b.a11y.liveRegion.length > 0 && b.a11y.liveRegion.remove()
                }
            },
            b.init = function() {
                b.params.loop && b.createLoop(),
                b.updateContainerSize(),
                b.updateSlidesSize(),
                b.updatePagination(),
                b.params.scrollbar && b.scrollbar && (b.scrollbar.set(), b.params.scrollbarDraggable && b.scrollbar.enableDraggable()),
                "slide" !== b.params.effect && b.effects[b.params.effect] && (b.params.loop || b.updateProgress(), b.effects[b.params.effect].setTranslate()),
                b.params.loop ? b.slideTo(b.params.initialSlide + b.loopedSlides, 0, b.params.runCallbacksOnInit) : (b.slideTo(b.params.initialSlide, 0, b.params.runCallbacksOnInit), 0 === b.params.initialSlide && (b.parallax && b.params.parallax && b.parallax.setTranslate(), b.lazy && b.params.lazyLoading && (b.lazy.load(), b.lazy.initialImageLoaded = !0))),
                b.attachEvents(),
                b.params.observer && b.support.observer && b.initObservers(),
                b.params.preloadImages && !b.params.lazyLoading && b.preloadImages(),
                b.params.autoplay && b.startAutoplay(),
                b.params.keyboardControl && b.enableKeyboardControl && b.enableKeyboardControl(),
                b.params.mousewheelControl && b.enableMousewheelControl && b.enableMousewheelControl(),
                b.params.hashnav && b.hashnav && b.hashnav.init(),
                b.params.a11y && b.a11y && b.a11y.init(),
                b.emit("onInit", b)
            },
            b.cleanupStyles = function() {
                b.container.removeClass(b.classNames.join(" ")).removeAttr("style"),
                b.wrapper.removeAttr("style"),
                b.slides && b.slides.length && b.slides.removeClass([b.params.slideVisibleClass, b.params.slideActiveClass, b.params.slideNextClass, b.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"),
                b.paginationContainer && b.paginationContainer.length && b.paginationContainer.removeClass(b.params.paginationHiddenClass),
                b.bullets && b.bullets.length && b.bullets.removeClass(b.params.bulletActiveClass),
                b.params.prevButton && a(b.params.prevButton).removeClass(b.params.buttonDisabledClass),
                b.params.nextButton && a(b.params.nextButton).removeClass(b.params.buttonDisabledClass),
                b.params.scrollbar && b.scrollbar && (b.scrollbar.track && b.scrollbar.track.length && b.scrollbar.track.removeAttr("style"), b.scrollbar.drag && b.scrollbar.drag.length && b.scrollbar.drag.removeAttr("style"))
            },
            b.destroy = function(e, a) {
                b.detachEvents(),
                b.stopAutoplay(),
                b.params.scrollbar && b.scrollbar && b.params.scrollbarDraggable && b.scrollbar.disableDraggable(),
                b.params.loop && b.destroyLoop(),
                a && b.cleanupStyles(),
                b.disconnectObservers(),
                b.params.keyboardControl && b.disableKeyboardControl && b.disableKeyboardControl(),
                b.params.mousewheelControl && b.disableMousewheelControl && b.disableMousewheelControl(),
                b.params.a11y && b.a11y && b.a11y.destroy(),
                b.emit("onDestroy"),
                e !== !1 && (b = null)
            },
            b.init(),
            b
        }
    };
    t.prototype = {
        isSafari: function() {
            var e = navigator.userAgent.toLowerCase();
            return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0
        } (),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
        isArray: function(e) {
            return "[object Array]" === Object.prototype.toString.apply(e)
        },
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1
        },
        device: function() {
            var e = navigator.userAgent,
            a = e.match(/(Android);?[\s\/]+([\d.]+)?/),
            t = e.match(/(iPad).*OS\s([\d_]+)/),
            r = e.match(/(iPod)(.*OS\s([\d_]+))?/),
            i = !t && e.match(/(iPhone\sOS)\s([\d_]+)/);
            return {
                ios: t || i || r,
                android: a
            }
        } (),
        support: {
            touch: window.Modernizr && Modernizr.touch === !0 ||
            function() {
                return !! ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
            } (),
            transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 ||
            function() {
                var e = document.createElement("div").style;
                return "webkitPerspective" in e || "MozPerspective" in e || "OPerspective" in e || "MsPerspective" in e || "perspective" in e
            } (),
            flexbox: function() {
                for (var e = document.createElement("div").style, a = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), t = 0; t < a.length; t++) if (a[t] in e) return ! 0
            } (),
            observer: function() {
                return "MutationObserver" in window || "WebkitMutationObserver" in window
            } ()
        },
        plugins: {}
    };
    for (var r = (function() {
        var e = function(e) {
            var a = this,
            t = 0;
            for (t = 0; t < e.length; t++) a[t] = e[t];
            return a.length = e.length,
            this
        },
        a = function(a, t) {
            var r = [],
            i = 0;
            if (a && !t && a instanceof e) return a;
            if (a) if ("string" == typeof a) {
                var s, n, o = a.trim();
                if (o.indexOf("<") >= 0 && o.indexOf(">") >= 0) {
                    var l = "div";
                    for (0 === o.indexOf("<li") && (l = "ul"), 0 === o.indexOf("<tr") && (l = "tbody"), (0 === o.indexOf("<td") || 0 === o.indexOf("<th")) && (l = "tr"), 0 === o.indexOf("<tbody") && (l = "table"), 0 === o.indexOf("<option") && (l = "select"), n = document.createElement(l), n.innerHTML = a, i = 0; i < n.childNodes.length; i++) r.push(n.childNodes[i])
                } else for (s = t || "#" !== a[0] || a.match(/[ .<>:~]/) ? (t || document).querySelectorAll(a) : [document.getElementById(a.split("#")[1])], i = 0; i < s.length; i++) s[i] && r.push(s[i])
            } else if (a.nodeType || a === window || a === document) r.push(a);
            else if (a.length > 0 && a[0].nodeType) for (i = 0; i < a.length; i++) r.push(a[i]);
            return new e(r)
        };
        return e.prototype = {
            addClass: function(e) {
                if ("undefined" == typeof e) return this;
                for (var a = e.split(" "), t = 0; t < a.length; t++) for (var r = 0; r < this.length; r++) this[r].classList.add(a[t]);
                return this
            },
            removeClass: function(e) {
                for (var a = e.split(" "), t = 0; t < a.length; t++) for (var r = 0; r < this.length; r++) this[r].classList.remove(a[t]);
                return this
            },
            hasClass: function(e) {
                return this[0] ? this[0].classList.contains(e) : !1
            },
            toggleClass: function(e) {
                for (var a = e.split(" "), t = 0; t < a.length; t++) for (var r = 0; r < this.length; r++) this[r].classList.toggle(a[t]);
                return this
            },
            attr: function(e, a) {
                if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;
                for (var t = 0; t < this.length; t++) if (2 === arguments.length) this[t].setAttribute(e, a);
                else for (var r in e) this[t][r] = e[r],
                this[t].setAttribute(r, e[r]);
                return this
            },
            removeAttr: function(e) {
                for (var a = 0; a < this.length; a++) this[a].removeAttribute(e);
                return this
            },
            data: function(e, a) {
                if ("undefined" != typeof a) {
                    for (var t = 0; t < this.length; t++) {
                        var r = this[t];
                        r.dom7ElementDataStorage || (r.dom7ElementDataStorage = {}),
                        r.dom7ElementDataStorage[e] = a
                    }
                    return this
                }
                if (this[0]) {
                    var i = this[0].getAttribute("data-" + e);
                    return i ? i: this[0].dom7ElementDataStorage && e in this[0].dom7ElementDataStorage ? this[0].dom7ElementDataStorage[e] : void 0
                }
            },
            transform: function(e) {
                for (var a = 0; a < this.length; a++) {
                    var t = this[a].style;
                    t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform = e
                }
                return this
            },
            transition: function(e) {
                "string" != typeof e && (e += "ms");
                for (var a = 0; a < this.length; a++) {
                    var t = this[a].style;
                    t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e
                }
                return this
            },
            on: function(e, t, r, i) {
                function s(e) {
                    var i = e.target;
                    if (a(i).is(t)) r.call(i, e);
                    else for (var s = a(i).parents(), n = 0; n < s.length; n++) a(s[n]).is(t) && r.call(s[n], e)
                }
                var n, o, l = e.split(" ");
                for (n = 0; n < this.length; n++) if ("function" == typeof t || t === !1) for ("function" == typeof t && (r = arguments[1], i = arguments[2] || !1), o = 0; o < l.length; o++) this[n].addEventListener(l[o], r, i);
                else for (o = 0; o < l.length; o++) this[n].dom7LiveListeners || (this[n].dom7LiveListeners = []),
                this[n].dom7LiveListeners.push({
                    listener: r,
                    liveListener: s
                }),
                this[n].addEventListener(l[o], s, i);
                return this
            },
            off: function(e, a, t, r) {
                for (var i = e.split(" "), s = 0; s < i.length; s++) for (var n = 0; n < this.length; n++) if ("function" == typeof a || a === !1)"function" == typeof a && (t = arguments[1], r = arguments[2] || !1),
                this[n].removeEventListener(i[s], t, r);
                else if (this[n].dom7LiveListeners) for (var o = 0; o < this[n].dom7LiveListeners.length; o++) this[n].dom7LiveListeners[o].listener === t && this[n].removeEventListener(i[s], this[n].dom7LiveListeners[o].liveListener, r);
                return this
            },
            once: function(e, a, t, r) {
                function i(n) {
                    t(n),
                    s.off(e, a, i, r)
                }
                var s = this;
                "function" == typeof a && (a = !1, t = arguments[1], r = arguments[2]),
                s.on(e, a, i, r)
            },
            trigger: function(e, a) {
                for (var t = 0; t < this.length; t++) {
                    var r;
                    try {
                        r = new window.CustomEvent(e, {
                            detail: a,
                            bubbles: !0,
                            cancelable: !0
                        })
                    } catch(i) {
                        r = document.createEvent("Event"),
                        r.initEvent(e, !0, !0),
                        r.detail = a
                    }
                    this[t].dispatchEvent(r)
                }
                return this
            },
            transitionEnd: function(e) {
                function a(s) {
                    if (s.target === this) for (e.call(this, s), t = 0; t < r.length; t++) i.off(r[t], a)
                }
                var t, r = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"],
                i = this;
                if (e) for (t = 0; t < r.length; t++) i.on(r[t], a);
                return this
            },
            width: function() {
                return this[0] === window ? window.innerWidth: this.length > 0 ? parseFloat(this.css("width")) : null
            },
            outerWidth: function(e) {
                return this.length > 0 ? e ? this[0].offsetWidth + parseFloat(this.css("margin-right")) + parseFloat(this.css("margin-left")) : this[0].offsetWidth: null
            },
            height: function() {
                return this[0] === window ? window.innerHeight: this.length > 0 ? parseFloat(this.css("height")) : null
            },
            outerHeight: function(e) {
                return this.length > 0 ? e ? this[0].offsetHeight + parseFloat(this.css("margin-top")) + parseFloat(this.css("margin-bottom")) : this[0].offsetHeight: null
            },
            offset: function() {
                if (this.length > 0) {
                    var e = this[0],
                    a = e.getBoundingClientRect(),
                    t = document.body,
                    r = e.clientTop || t.clientTop || 0,
                    i = e.clientLeft || t.clientLeft || 0,
                    s = window.pageYOffset || e.scrollTop,
                    n = window.pageXOffset || e.scrollLeft;
                    return {
                        top: a.top + s - r,
                        left: a.left + n - i
                    }
                }
                return null
            },
            css: function(e, a) {
                var t;
                if (1 === arguments.length) {
                    if ("string" != typeof e) {
                        for (t = 0; t < this.length; t++) for (var r in e) this[t].style[r] = e[r];
                        return this
                    }
                    if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(e)
                }
                if (2 === arguments.length && "string" == typeof e) {
                    for (t = 0; t < this.length; t++) this[t].style[e] = a;
                    return this
                }
                return this
            },
            each: function(e) {
                for (var a = 0; a < this.length; a++) e.call(this[a], a, this[a]);
                return this
            },
            html: function(e) {
                if ("undefined" == typeof e) return this[0] ? this[0].innerHTML: void 0;
                for (var a = 0; a < this.length; a++) this[a].innerHTML = e;
                return this
            },
            text: function(e) {
                if ("undefined" == typeof e) return this[0] ? this[0].textContent.trim() : null;
                for (var a = 0; a < this.length; a++) this[a].textContent = e;
                return this
            },
            is: function(t) {
                if (!this[0]) return ! 1;
                var r, i;
                if ("string" == typeof t) {
                    var s = this[0];
                    if (s === document) return t === document;
                    if (s === window) return t === window;
                    if (s.matches) return s.matches(t);
                    if (s.webkitMatchesSelector) return s.webkitMatchesSelector(t);
                    if (s.mozMatchesSelector) return s.mozMatchesSelector(t);
                    if (s.msMatchesSelector) return s.msMatchesSelector(t);
                    for (r = a(t), i = 0; i < r.length; i++) if (r[i] === this[0]) return ! 0;
                    return ! 1
                }
                if (t === document) return this[0] === document;
                if (t === window) return this[0] === window;
                if (t.nodeType || t instanceof e) {
                    for (r = t.nodeType ? [t] : t, i = 0; i < r.length; i++) if (r[i] === this[0]) return ! 0;
                    return ! 1
                }
                return ! 1
            },
            index: function() {
                if (this[0]) {
                    for (var e = this[0], a = 0; null !== (e = e.previousSibling);) 1 === e.nodeType && a++;
                    return a
                }
            },
            eq: function(a) {
                if ("undefined" == typeof a) return this;
                var t, r = this.length;
                return a > r - 1 ? new e([]) : 0 > a ? (t = r + a, new e(0 > t ? [] : [this[t]])) : new e([this[a]])
            },
            append: function(a) {
                var t, r;
                for (t = 0; t < this.length; t++) if ("string" == typeof a) {
                    var i = document.createElement("div");
                    for (i.innerHTML = a; i.firstChild;) this[t].appendChild(i.firstChild)
                } else if (a instanceof e) for (r = 0; r < a.length; r++) this[t].appendChild(a[r]);
                else this[t].appendChild(a);
                return this
            },
            prepend: function(a) {
                var t, r;
                for (t = 0; t < this.length; t++) if ("string" == typeof a) {
                    var i = document.createElement("div");
                    for (i.innerHTML = a, r = i.childNodes.length - 1; r >= 0; r--) this[t].insertBefore(i.childNodes[r], this[t].childNodes[0])
                } else if (a instanceof e) for (r = 0; r < a.length; r++) this[t].insertBefore(a[r], this[t].childNodes[0]);
                else this[t].insertBefore(a, this[t].childNodes[0]);
                return this
            },
            insertBefore: function(e) {
                for (var t = a(e), r = 0; r < this.length; r++) if (1 === t.length) t[0].parentNode.insertBefore(this[r], t[0]);
                else if (t.length > 1) for (var i = 0; i < t.length; i++) t[i].parentNode.insertBefore(this[r].cloneNode(!0), t[i])
            },
            insertAfter: function(e) {
                for (var t = a(e), r = 0; r < this.length; r++) if (1 === t.length) t[0].parentNode.insertBefore(this[r], t[0].nextSibling);
                else if (t.length > 1) for (var i = 0; i < t.length; i++) t[i].parentNode.insertBefore(this[r].cloneNode(!0), t[i].nextSibling)
            },
            next: function(t) {
                return new e(this.length > 0 ? t ? this[0].nextElementSibling && a(this[0].nextElementSibling).is(t) ? [this[0].nextElementSibling] : [] : this[0].nextElementSibling ? [this[0].nextElementSibling] : [] : [])
            },
            nextAll: function(t) {
                var r = [],
                i = this[0];
                if (!i) return new e([]);
                for (; i.nextElementSibling;) {
                    var s = i.nextElementSibling;
                    t ? a(s).is(t) && r.push(s) : r.push(s),
                    i = s
                }
                return new e(r)
            },
            prev: function(t) {
                return new e(this.length > 0 ? t ? this[0].previousElementSibling && a(this[0].previousElementSibling).is(t) ? [this[0].previousElementSibling] : [] : this[0].previousElementSibling ? [this[0].previousElementSibling] : [] : [])
            },
            prevAll: function(t) {
                var r = [],
                i = this[0];
                if (!i) return new e([]);
                for (; i.previousElementSibling;) {
                    var s = i.previousElementSibling;
                    t ? a(s).is(t) && r.push(s) : r.push(s),
                    i = s
                }
                return new e(r)
            },
            parent: function(e) {
                for (var t = [], r = 0; r < this.length; r++) e ? a(this[r].parentNode).is(e) && t.push(this[r].parentNode) : t.push(this[r].parentNode);
                return a(a.unique(t))
            },
            parents: function(e) {
                for (var t = [], r = 0; r < this.length; r++) for (var i = this[r].parentNode; i;) e ? a(i).is(e) && t.push(i) : t.push(i),
                i = i.parentNode;
                return a(a.unique(t))
            },
            find: function(a) {
                for (var t = [], r = 0; r < this.length; r++) for (var i = this[r].querySelectorAll(a), s = 0; s < i.length; s++) t.push(i[s]);
                return new e(t)
            },
            children: function(t) {
                for (var r = [], i = 0; i < this.length; i++) for (var s = this[i].childNodes, n = 0; n < s.length; n++) t ? 1 === s[n].nodeType && a(s[n]).is(t) && r.push(s[n]) : 1 === s[n].nodeType && r.push(s[n]);
                return new e(a.unique(r))
            },
            remove: function() {
                for (var e = 0; e < this.length; e++) this[e].parentNode && this[e].parentNode.removeChild(this[e]);
                return this
            },
            add: function() {
                var e, t, r = this;
                for (e = 0; e < arguments.length; e++) {
                    var i = a(arguments[e]);
                    for (t = 0; t < i.length; t++) r[r.length] = i[t],
                    r.length++
                }
                return r
            }
        },
        a.fn = e.prototype,
        a.unique = function(e) {
            for (var a = [], t = 0; t < e.length; t++) - 1 === a.indexOf(e[t]) && a.push(e[t]);
            return a
        },
        a
    } ()), i = ["jQuery", "Zepto", "Dom7"], s = 0; s < i.length; s++) window[i[s]] && e(window[i[s]]);
    var n;
    n = "undefined" == typeof r ? window.Dom7 || window.Zepto || window.jQuery: r,
    n && ("transitionEnd" in n.fn || (n.fn.transitionEnd = function(e) {
        function a(s) {
            if (s.target === this) for (e.call(this, s), t = 0; t < r.length; t++) i.off(r[t], a)
        }
        var t, r = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"],
        i = this;
        if (e) for (t = 0; t < r.length; t++) i.on(r[t], a);
        return this
    }), "transform" in n.fn || (n.fn.transform = function(e) {
        for (var a = 0; a < this.length; a++) {
            var t = this[a].style;
            t.webkitTransform = t.MsTransform = t.msTransform = t.MozTransform = t.OTransform = t.transform = e
        }
        return this
    }), "transition" in n.fn || (n.fn.transition = function(e) {
        "string" != typeof e && (e += "ms");
        for (var a = 0; a < this.length; a++) {
            var t = this[a].style;
            t.webkitTransitionDuration = t.MsTransitionDuration = t.msTransitionDuration = t.MozTransitionDuration = t.OTransitionDuration = t.transitionDuration = e
        }
        return this
    })),
    window.Swiper = t
} (),
"undefined" != typeof module ? module.exports = window.Swiper: "function" == typeof define && define.amd && define([],
function() {
    "use strict";
    return window.Swiper
});
/* BootstrapValidator v0.5.1*/
if ("undefined" == typeof jQuery) throw new Error("BootstrapValidator's JavaScript requires jQuery"); !
function(a) {
    var b = function(b, c) {
        this.$form = a(b),
        this.options = a.extend({},
        a.fn.bootstrapValidator.DEFAULT_OPTIONS, c),
        this.$invalidFields = a([]),
        this.$submitButton = null,
        this.$hiddenButton = null,
        this.STATUS_NOT_VALIDATED = "NOT_VALIDATED",
        this.STATUS_VALIDATING = "VALIDATING",
        this.STATUS_INVALID = "INVALID",
        this.STATUS_VALID = "VALID";
        var d = function() {
            for (var a = 3,
            b = document.createElement("div"), c = b.all || []; b.innerHTML = "<!--[if gt IE " + ++a + "]><br><![endif]-->", c[0];);
            return a > 4 ? a: !a
        } (),
        e = document.createElement("div");
        this._changeEvent = 9 !== d && "oninput" in e ? "input": "keyup",
        this._submitIfValid = null,
        this._cacheFields = {},
        this._init()
    };
    b.prototype = {
        constructor: b,
        _init: function() {
            var b = this,
            c = {
                container: this.$form.attr("data-bv-container"),
                events: {
                    formInit: this.$form.attr("data-bv-events-form-init"),
                    formError: this.$form.attr("data-bv-events-form-error"),
                    formSuccess: this.$form.attr("data-bv-events-form-success"),
                    fieldAdded: this.$form.attr("data-bv-events-field-added"),
                    fieldRemoved: this.$form.attr("data-bv-events-field-removed"),
                    fieldInit: this.$form.attr("data-bv-events-field-init"),
                    fieldError: this.$form.attr("data-bv-events-field-error"),
                    fieldSuccess: this.$form.attr("data-bv-events-field-success"),
                    fieldStatus: this.$form.attr("data-bv-events-field-status"),
                    validatorError: this.$form.attr("data-bv-events-validator-error"),
                    validatorSuccess: this.$form.attr("data-bv-events-validator-success")
                },
                excluded: this.$form.attr("data-bv-excluded"),
                feedbackIcons: {
                    valid: this.$form.attr("data-bv-feedbackicons-valid"),
                    invalid: this.$form.attr("data-bv-feedbackicons-invalid"),
                    validating: this.$form.attr("data-bv-feedbackicons-validating")
                },
                group: this.$form.attr("data-bv-group"),
                live: this.$form.attr("data-bv-live"),
                message: this.$form.attr("data-bv-message"),
                onError: this.$form.attr("data-bv-onerror"),
                onSuccess: this.$form.attr("data-bv-onsuccess"),
                submitButtons: this.$form.attr("data-bv-submitbuttons"),
                threshold: this.$form.attr("data-bv-threshold"),
                trigger: this.$form.attr("data-bv-trigger"),
                verbose: this.$form.attr("data-bv-verbose"),
                fields: {}
            };
            this.$form.attr("novalidate", "novalidate").addClass(this.options.elementClass).on("submit.bv",
            function(a) {
                a.preventDefault(),
                b.validate()
            }).on("click.bv", this.options.submitButtons,
            function() {
                b.$submitButton = a(this),
                b._submitIfValid = !0
            }).find("[name], [data-bv-field]").each(function() {
                var d = a(this),
                e = d.attr("name") || d.attr("data-bv-field"),
                f = b._parseOptions(d);
                f && (d.attr("data-bv-field", e), c.fields[e] = a.extend({},
                f, c.fields[e]))
            }),
            this.options = a.extend(!0, this.options, c),
            this.$hiddenButton = a("<button/>").attr("type", "submit").prependTo(this.$form).addClass("bv-hidden-submit").css({
                display: "none",
                width: 0,
                height: 0
            }),
            this.$form.on("click.bv", '[type="submit"]',
            function(c) {
                if (!c.isDefaultPrevented()) {
                    var d = a(c.target),
                    e = d.is('[type="submit"]') ? d.eq(0) : d.parent('[type="submit"]').eq(0); ! b.options.submitButtons || e.is(b.options.submitButtons) || e.is(b.$hiddenButton) || b.$form.off("submit.bv").submit()
                }
            });
            for (var d in this.options.fields) this._initField(d);
            this.$form.trigger(a.Event(this.options.events.formInit), {
                bv: this,
                options: this.options
            }),
            this.options.onSuccess && this.$form.on(this.options.events.formSuccess,
            function(c) {
                a.fn.bootstrapValidator.helpers.call(b.options.onSuccess, [c])
            }),
            this.options.onError && this.$form.on(this.options.events.formError,
            function(c) {
                a.fn.bootstrapValidator.helpers.call(b.options.onError, [c])
            })
        },
        _parseOptions: function(b) {
            var c, d, e, f, g, h, i, j = b.attr("name") || b.attr("data-bv-field"),
            k = {};
            for (d in a.fn.bootstrapValidator.validators) if (c = a.fn.bootstrapValidator.validators[d], e = b.attr("data-bv-" + d.toLowerCase()) + "", i = "function" == typeof c.enableByHtml5 ? c.enableByHtml5(b) : null, i && "false" !== e || i !== !0 && ("" === e || "true" === e)) {
                c.html5Attributes = a.extend({},
                {
                    message: "message",
                    onerror: "onError",
                    onsuccess: "onSuccess"
                },
                c.html5Attributes),
                k[d] = a.extend({},
                i === !0 ? {}: i, k[d]);
                for (h in c.html5Attributes) f = c.html5Attributes[h],
                g = b.attr("data-bv-" + d.toLowerCase() + "-" + h),
                g && ("true" === g ? g = !0 : "false" === g && (g = !1), k[d][f] = g)
            }
            var l = {
                container: b.attr("data-bv-container"),
                excluded: b.attr("data-bv-excluded"),
                feedbackIcons: b.attr("data-bv-feedbackicons"),
                group: b.attr("data-bv-group"),
                message: b.attr("data-bv-message"),
                onError: b.attr("data-bv-onerror"),
                onStatus: b.attr("data-bv-onstatus"),
                onSuccess: b.attr("data-bv-onsuccess"),
                selector: b.attr("data-bv-selector"),
                threshold: b.attr("data-bv-threshold"),
                trigger: b.attr("data-bv-trigger"),
                verbose: b.attr("data-bv-verbose"),
                validators: k
            },
            m = a.isEmptyObject(l),
            n = a.isEmptyObject(k);
            return ! n || !m && this.options.fields && this.options.fields[j] ? (l.validators = k, l) : null
        },
        _initField: function(b) {
            var c = a([]);
            switch (typeof b) {
            case "object":
                c = b,
                b = b.attr("data-bv-field");
                break;
            case "string":
                c = this.getFieldElements(b),
                c.attr("data-bv-field", b)
            }
            if (0 !== c.length && null !== this.options.fields[b] && null !== this.options.fields[b].validators) {
                var d;
                for (d in this.options.fields[b].validators) a.fn.bootstrapValidator.validators[d] || delete this.options.fields[b].validators[d];
                null === this.options.fields[b].enabled && (this.options.fields[b].enabled = !0);
                for (var e = this,
                f = c.length,
                g = c.attr("type"), h = 1 === f || "radio" === g || "checkbox" === g, i = "radio" === g || "checkbox" === g || "file" === g || "SELECT" === c.eq(0).get(0).tagName ? "change": this._changeEvent, j = (this.options.fields[b].trigger || this.options.trigger || i).split(" "), k = a.map(j,
                function(a) {
                    return a + ".update.bv"
                }).join(" "), l = 0; f > l; l++) {
                    var m = c.eq(l),
                    n = this.options.fields[b].group || this.options.group,
                    o = m.parents(n),
                    p = "function" == typeof(this.options.fields[b].container || this.options.container) ? (this.options.fields[b].container || this.options.container).call(this, m, this) : this.options.fields[b].container || this.options.container,
                    q = p && "tooltip" !== p && "popover" !== p ? a(p) : this._getMessageContainer(m, n);
                    p && "tooltip" !== p && "popover" !== p && q.addClass("has-error"),
                    q.find('.help-block[data-bv-validator][data-bv-for="' + b + '"]').remove(),
                    o.find('i[data-bv-icon-for="' + b + '"]').remove(),
                    m.off(k).on(k,
                    function() {
                        e.updateStatus(a(this), e.STATUS_NOT_VALIDATED)
                    }),
                    m.data("bv.messages", q);
                    for (d in this.options.fields[b].validators) m.data("bv.result." + d, this.STATUS_NOT_VALIDATED),
                    h && l !== f - 1 || a("<small/>").css("display", "none").addClass("help-block").attr("data-bv-validator", d).attr("data-bv-for", b).attr("data-bv-result", this.STATUS_NOT_VALIDATED).html(this._getMessage(b, d)).appendTo(q),
                    "function" == typeof a.fn.bootstrapValidator.validators[d].init && a.fn.bootstrapValidator.validators[d].init(this, m, this.options.fields[b].validators[d]);
                    if (this.options.fields[b].feedbackIcons !== !1 && "false" !== this.options.fields[b].feedbackIcons && this.options.feedbackIcons && this.options.feedbackIcons.validating && this.options.feedbackIcons.invalid && this.options.feedbackIcons.valid && (!h || l === f - 1)) {
                        o.addClass("has-feedback");
                        var r = a("<i/>").css("display", "none").addClass("form-control-feedback").attr("data-bv-icon-for", b).insertAfter(m);
                        if ("checkbox" === g || "radio" === g) {
                            var s = m.parent();
                            s.hasClass(g) ? r.insertAfter(s) : s.parent().hasClass(g) && r.insertAfter(s.parent())
                        }
                        0 === o.find("label").length && r.addClass("bv-no-label"),
                        0 !== o.find(".input-group").length && r.addClass("bv-icon-input-group").insertAfter(o.find(".input-group").eq(0)),
                        p && m.off("focus.bv").on("focus.bv",
                        function() {
                            switch (p) {
                            case "tooltip":
                                r.tooltip("show");
                                break;
                            case "popover":
                                r.popover("show")
                            }
                        }).off("blur.bv").on("blur.bv",
                        function() {
                            switch (p) {
                            case "tooltip":
                                r.tooltip("hide");
                                break;
                            case "popover":
                                r.popover("hide")
                            }
                        })
                    }
                }
                switch (c.on(this.options.events.fieldSuccess,
                function(b, c) {
                    var d = e.getOptions(c.field, null, "onSuccess");
                    d && a.fn.bootstrapValidator.helpers.call(d, [b, c])
                }).on(this.options.events.fieldError,
                function(b, c) {
                    var d = e.getOptions(c.field, null, "onError");
                    d && a.fn.bootstrapValidator.helpers.call(d, [b, c])
                }).on(this.options.events.fieldStatus,
                function(b, c) {
                    var d = e.getOptions(c.field, null, "onStatus");
                    d && a.fn.bootstrapValidator.helpers.call(d, [b, c])
                }).on(this.options.events.validatorError,
                function(b, c) {
                    var d = e.getOptions(c.field, c.validator, "onError");
                    d && a.fn.bootstrapValidator.helpers.call(d, [b, c])
                }).on(this.options.events.validatorSuccess,
                function(b, c) {
                    var d = e.getOptions(c.field, c.validator, "onSuccess");
                    d && a.fn.bootstrapValidator.helpers.call(d, [b, c])
                }), k = a.map(j,
                function(a) {
                    return a + ".live.bv"
                }).join(" "), this.options.live) {
                case "submitted":
                    break;
                case "disabled":
                    c.off(k);
                    break;
                case "enabled":
                default:
                    c.off(k).on(k,
                    function() {
                        e._exceedThreshold(a(this)) && e.validateField(a(this))
                    })
                }
                c.trigger(a.Event(this.options.events.fieldInit), {
                    bv: this,
                    field: b,
                    element: c
                })
            }
        },
        _getMessage: function(b, c) {
            if (! (this.options.fields[b] && a.fn.bootstrapValidator.validators[c] && this.options.fields[b].validators && this.options.fields[b].validators[c])) return "";
            var d = this.options.fields[b].validators[c];
            switch (!0) {
            case !! d.message: return d.message;
            case !! this.options.fields[b].message: return this.options.fields[b].message;
            case !! a.fn.bootstrapValidator.i18n[c] : return a.fn.bootstrapValidator.i18n[c]["default"];
            default:
                return this.options.message
            }
        },
        _getMessageContainer: function(a, b) {
            var c = a.parent();
            if (c.is(b)) return c;
            var d = c.attr("class");
            if (!d) return this._getMessageContainer(c, b);
            d = d.split(" ");
            for (var e = d.length,
            f = 0; e > f; f++) if (/^col-(xs|sm|md|lg)-\d+$/.test(d[f]) || /^col-(xs|sm|md|lg)-offset-\d+$/.test(d[f])) return c;
            return this._getMessageContainer(c, b)
        },
        _submit: function() {
            var b = this.isValid(),
            c = b ? this.options.events.formSuccess: this.options.events.formError,
            d = a.Event(c);
            this.$form.trigger(d),
            this.$submitButton && (b ? this._onSuccess(d) : this._onError(d))
        },
        _isExcluded: function(b) {
            var c = b.attr("data-bv-excluded"),
            d = b.attr("data-bv-field") || b.attr("name");
            switch (!0) {
            case !! d && this.options.fields && this.options.fields[d] && ("true" === this.options.fields[d].excluded || this.options.fields[d].excluded === !0) : case "true" === c: case "" === c: return ! 0;
            case !! d && this.options.fields && this.options.fields[d] && ("false" === this.options.fields[d].excluded || this.options.fields[d].excluded === !1) : case "false" === c: return ! 1;
            default:
                if (this.options.excluded) {
                    "string" == typeof this.options.excluded && (this.options.excluded = a.map(this.options.excluded.split(","),
                    function(b) {
                        return a.trim(b)
                    }));
                    for (var e = this.options.excluded.length,
                    f = 0; e > f; f++) if ("string" == typeof this.options.excluded[f] && b.is(this.options.excluded[f]) || "function" == typeof this.options.excluded[f] && this.options.excluded[f].call(this, b, this) === !0) return ! 0
                }
                return ! 1
            }
        },
        _exceedThreshold: function(b) {
            var c = b.attr("data-bv-field"),
            d = this.options.fields[c].threshold || this.options.threshold;
            if (!d) return ! 0;
            var e = -1 !== a.inArray(b.attr("type"), ["button", "checkbox", "file", "hidden", "image", "radio", "reset", "submit"]);
            return e || b.val().length >= d
        },
        _onError: function(b) {
            if (!b.isDefaultPrevented()) {
                if ("submitted" === this.options.live) {
                    this.options.live = "enabled";
                    var c = this;
                    for (var d in this.options.fields) !
                    function(b) {
                        var e = c.getFieldElements(b);
                        if (e.length) {
                            var f = a(e[0]).attr("type"),
                            g = "radio" === f || "checkbox" === f || "file" === f || "SELECT" === a(e[0]).get(0).tagName ? "change": c._changeEvent,
                            h = c.options.fields[d].trigger || c.options.trigger || g,
                            i = a.map(h.split(" "),
                            function(a) {
                                return a + ".live.bv"
                            }).join(" ");
                            e.off(i).on(i,
                            function() {
                                c._exceedThreshold(a(this)) && c.validateField(a(this))
                            })
                        }
                    } (d)
                }
                var e = this.$invalidFields.eq(0);
                if (e) {
                    var f, g = e.parents(".tab-pane");
                    g && (f = g.attr("id")) && a('a[href="#' + f + '"][data-toggle="tab"]').tab("show"),
                    e.focus()
                }
            }
        },
        _onSuccess: function(a) {
            a.isDefaultPrevented() || this.disableSubmitButtons(!0).defaultSubmit()
        },
        _onFieldValidated: function(b, c) {
            var d = b.attr("data-bv-field"),
            e = this.options.fields[d].validators,
            f = {},
            g = 0,
            h = {
                bv: this,
                field: d,
                element: b,
                validator: c,
                result: b.data("bv.response." + c)
            };
            if (c) switch (b.data("bv.result." + c)) {
            case this.STATUS_INVALID:
                b.trigger(a.Event(this.options.events.validatorError), h);
                break;
            case this.STATUS_VALID:
                b.trigger(a.Event(this.options.events.validatorSuccess), h)
            }
            f[this.STATUS_NOT_VALIDATED] = 0,
            f[this.STATUS_VALIDATING] = 0,
            f[this.STATUS_INVALID] = 0,
            f[this.STATUS_VALID] = 0;
            for (var i in e) if (e[i].enabled !== !1) {
                g++;
                var j = b.data("bv.result." + i);
                j && f[j]++
            }
            f[this.STATUS_VALID] === g ? (this.$invalidFields = this.$invalidFields.not(b), b.trigger(a.Event(this.options.events.fieldSuccess), h)) : 0 === f[this.STATUS_NOT_VALIDATED] && 0 === f[this.STATUS_VALIDATING] && f[this.STATUS_INVALID] > 0 && (this.$invalidFields = this.$invalidFields.add(b), b.trigger(a.Event(this.options.events.fieldError), h))
        },
        getFieldElements: function(b) {
            return this._cacheFields[b] || (this._cacheFields[b] = this.options.fields[b] && this.options.fields[b].selector ? a(this.options.fields[b].selector) : this.$form.find('[name="' + b + '"]')),
            this._cacheFields[b]
        },
        getOptions: function(a, b, c) {
            if (!a) return this.options;
            if ("object" == typeof a && (a = a.attr("data-bv-field")), !this.options.fields[a]) return null;
            var d = this.options.fields[a];
            return b ? d.validators && d.validators[b] ? c ? d.validators[b][c] : d.validators[b] : null: c ? d[c] : d
        },
        disableSubmitButtons: function(a) {
            return a ? "disabled" !== this.options.live && this.$form.find(this.options.submitButtons).attr("disabled", "disabled") : this.$form.find(this.options.submitButtons).removeAttr("disabled"),
            this
        },
        validate: function() {
            if (!this.options.fields) return this;
            this.disableSubmitButtons(!0);
            for (var a in this.options.fields) this.validateField(a);
            return this._submit(),
            this
        },
        validateField: function(b) {
            var c = a([]);
            switch (typeof b) {
            case "object":
                c = b,
                b = b.attr("data-bv-field");
                break;
            case "string":
                c = this.getFieldElements(b)
            }
            if (0 === c.length || this.options.fields[b] && this.options.fields[b].enabled === !1) return this;
            for (var d, e, f = this,
            g = c.attr("type"), h = "radio" === g || "checkbox" === g ? 1 : c.length, i = "radio" === g || "checkbox" === g, j = this.options.fields[b].validators, k = "true" === this.options.fields[b].verbose || this.options.fields[b].verbose === !0 || "true" === this.options.verbose || this.options.verbose === !0, l = 0; h > l; l++) {
                var m = c.eq(l);
                if (!this._isExcluded(m)) {
                    var n = !1;
                    for (d in j) {
                        if (m.data("bv.dfs." + d) && m.data("bv.dfs." + d).reject(), n) break;
                        var o = m.data("bv.result." + d);
                        if (o !== this.STATUS_VALID && o !== this.STATUS_INVALID) if (j[d].enabled !== !1) {
                            if (m.data("bv.result." + d, this.STATUS_VALIDATING), e = a.fn.bootstrapValidator.validators[d].validate(this, m, j[d]), "object" == typeof e && e.resolve) this.updateStatus(i ? b: m, this.STATUS_VALIDATING, d),
                            m.data("bv.dfs." + d, e),
                            e.done(function(a, b, c) {
                                a.removeData("bv.dfs." + b).data("bv.response." + b, c),
                                c.message && f.updateMessage(a, b, c.message),
                                f.updateStatus(i ? a.attr("data-bv-field") : a, c.valid ? f.STATUS_VALID: f.STATUS_INVALID, b),
                                c.valid && f._submitIfValid === !0 ? f._submit() : c.valid || k || (n = !0)
                            });
                            else if ("object" == typeof e && void 0 !== e.valid && void 0 !== e.message) {
                                if (m.data("bv.response." + d, e), this.updateMessage(i ? b: m, d, e.message), this.updateStatus(i ? b: m, e.valid ? this.STATUS_VALID: this.STATUS_INVALID, d), !e.valid && !k) break
                            } else if ("boolean" == typeof e && (m.data("bv.response." + d, e), this.updateStatus(i ? b: m, e ? this.STATUS_VALID: this.STATUS_INVALID, d), !e && !k)) break
                        } else this.updateStatus(i ? b: m, this.STATUS_VALID, d);
                        else this._onFieldValidated(m, d)
                    }
                }
            }
            return this
        },
        updateMessage: function(b, c, d) {
            var e = a([]);
            switch (typeof b) {
            case "object":
                e = b,
                b = b.attr("data-bv-field");
                break;
            case "string":
                e = this.getFieldElements(b)
            }
            e.each(function() {
                a(this).data("bv.messages").find('.help-block[data-bv-validator="' + c + '"][data-bv-for="' + b + '"]').html(d)
            })
        },
        updateStatus: function(b, c, d) {
            var e = a([]);
            switch (typeof b) {
            case "object":
                e = b,
                b = b.attr("data-bv-field");
                break;
            case "string":
                e = this.getFieldElements(b)
            }
            c === this.STATUS_NOT_VALIDATED && (this._submitIfValid = !1);
            for (var f = this,
            g = e.attr("type"), h = this.options.fields[b].group || this.options.group, i = "radio" === g || "checkbox" === g ? 1 : e.length, j = 0; i > j; j++) {
                var k = e.eq(j);
                if (!this._isExcluded(k)) {
                    var l = k.parents(h),
                    m = k.data("bv.messages"),
                    n = m.find('.help-block[data-bv-validator][data-bv-for="' + b + '"]'),
                    o = d ? n.filter('[data-bv-validator="' + d + '"]') : n,
                    p = l.find('.form-control-feedback[data-bv-icon-for="' + b + '"]'),
                    q = "function" == typeof(this.options.fields[b].container || this.options.container) ? (this.options.fields[b].container || this.options.container).call(this, k, this) : this.options.fields[b].container || this.options.container,
                    r = null;
                    if (d) k.data("bv.result." + d, c);
                    else for (var s in this.options.fields[b].validators) k.data("bv.result." + s, c);
                    o.attr("data-bv-result", c);
                    var t, u, v = k.parents(".tab-pane");
                    switch (v && (t = v.attr("id")) && (u = a('a[href="#' + t + '"][data-toggle="tab"]').parent()), c) {
                    case this.STATUS_VALIDATING:
                        r = null,
                        this.disableSubmitButtons(!0),
                        l.removeClass("has-success").removeClass("has-error"),
                        p && p.removeClass(this.options.feedbackIcons.valid).removeClass(this.options.feedbackIcons.invalid).addClass(this.options.feedbackIcons.validating).show(),
                        u && u.removeClass("bv-tab-success").removeClass("bv-tab-error");
                        break;
                    case this.STATUS_INVALID:
                        r = !1,
                        this.disableSubmitButtons(!0),
                        l.removeClass("has-success").addClass("has-error"),
                        p && p.removeClass(this.options.feedbackIcons.valid).removeClass(this.options.feedbackIcons.validating).addClass(this.options.feedbackIcons.invalid).show(),
                        u && u.removeClass("bv-tab-success").addClass("bv-tab-error");
                        break;
                    case this.STATUS_VALID:
                        r = 0 === n.filter('[data-bv-result="' + this.STATUS_NOT_VALIDATED + '"]').length ? n.filter('[data-bv-result="' + this.STATUS_VALID + '"]').length === n.length: null,
                        null !== r && (this.disableSubmitButtons(this.$submitButton ? !this.isValid() : !r), p && p.removeClass(this.options.feedbackIcons.invalid).removeClass(this.options.feedbackIcons.validating).removeClass(this.options.feedbackIcons.valid).addClass(r ? this.options.feedbackIcons.valid: this.options.feedbackIcons.invalid).show()),
                        l.removeClass("has-error has-success").addClass(this.isValidContainer(l) ? "has-success": "has-error"),
                        u && u.removeClass("bv-tab-success").removeClass("bv-tab-error").addClass(this.isValidContainer(v) ? "bv-tab-success": "bv-tab-error");
                        break;
                    case this.STATUS_NOT_VALIDATED:
                    default:
                        r = null,
                        this.disableSubmitButtons(!1),
                        l.removeClass("has-success").removeClass("has-error"),
                        p && p.removeClass(this.options.feedbackIcons.valid).removeClass(this.options.feedbackIcons.invalid).removeClass(this.options.feedbackIcons.validating).hide(),
                        u && u.removeClass("bv-tab-success").removeClass("bv-tab-error")
                    }
                    switch (!0) {
                    case p && "tooltip" === q: r === !1 ? p.css("cursor", "pointer").tooltip("destroy").tooltip({
                            container: "body",
                            html: !0,
                            placement: "top",
                            title: n.filter('[data-bv-result="' + f.STATUS_INVALID + '"]').eq(0).html()
                        }) : p.tooltip("hide");
                        break;
                    case p && "popover" === q: r === !1 ? p.css("cursor", "pointer").popover("destroy").popover({
                            container: "body",
                            content: n.filter('[data-bv-result="' + f.STATUS_INVALID + '"]').eq(0).html(),
                            html: !0,
                            placement: "top",
                            trigger: "hover click"
                        }) : p.popover("hide");
                        break;
                    default:
                        c === this.STATUS_INVALID ? o.show() : o.hide()
                    }
                    k.trigger(a.Event(this.options.events.fieldStatus), {
                        bv: this,
                        field: b,
                        element: k,
                        status: c
                    }),
                    this._onFieldValidated(k, d)
                }
            }
            return this
        },
        isValid: function() {
            for (var a in this.options.fields) if (!this.isValidField(a)) return ! 1;
            return ! 0
        },
        isValidField: function(b) {
            var c = a([]);
            switch (typeof b) {
            case "object":
                c = b,
                b = b.attr("data-bv-field");
                break;
            case "string":
                c = this.getFieldElements(b)
            }
            if (0 === c.length || null === this.options.fields[b] || this.options.fields[b].enabled === !1) return ! 0;
            for (var d, e, f, g = c.attr("type"), h = "radio" === g || "checkbox" === g ? 1 : c.length, i = 0; h > i; i++) if (d = c.eq(i), !this._isExcluded(d)) for (e in this.options.fields[b].validators) if (this.options.fields[b].validators[e].enabled !== !1 && (f = d.data("bv.result." + e), f !== this.STATUS_VALID)) return ! 1;
            return ! 0
        },
        isValidContainer: function(b) {
            var c = this,
            d = {},
            e = "string" == typeof b ? a(b) : b;
            if (0 === e.length) return ! 0;
            e.find("[data-bv-field]").each(function() {
                var b = a(this),
                e = b.attr("data-bv-field");
                c._isExcluded(b) || d[e] || (d[e] = b)
            });
            for (var f in d) {
                var g = d[f];
                if (g.data("bv.messages").find('.help-block[data-bv-validator][data-bv-for="' + f + '"]').filter('[data-bv-result="' + this.STATUS_INVALID + '"]').length > 0) return ! 1
            }
            return ! 0
        },
        defaultSubmit: function() {
            this.$submitButton && a("<input/>").attr("type", "hidden").attr("data-bv-submit-hidden", "").attr("name", this.$submitButton.attr("name")).val(this.$submitButton.val()).appendTo(this.$form),
            this.$form.off("submit.bv").submit()
        },
        getInvalidFields: function() {
            return this.$invalidFields
        },
        getSubmitButton: function() {
            return this.$submitButton
        },
        getMessages: function(b, c) {
            var d = this,
            e = [],
            f = a([]);
            switch (!0) {
            case b && "object" == typeof b: f = b;
                break;
            case b && "string" == typeof b: var g = this.getFieldElements(b);
                if (g.length > 0) {
                    var h = g.attr("type");
                    f = "radio" === h || "checkbox" === h ? g.eq(0) : g
                }
                break;
            default:
                f = this.$invalidFields
            }
            var i = c ? '[data-bv-validator="' + c + '"]': "";
            return f.each(function() {
                e = e.concat(a(this).data("bv.messages").find('.help-block[data-bv-for="' + a(this).attr("data-bv-field") + '"][data-bv-result="' + d.STATUS_INVALID + '"]' + i).map(function() {
                    var b = a(this).attr("data-bv-validator"),
                    c = a(this).attr("data-bv-for");
                    return d.options.fields[c].validators[b].enabled === !1 ? "": a(this).html()
                }).get())
            }),
            e
        },
        updateOption: function(a, b, c, d) {
            return "object" == typeof a && (a = a.attr("data-bv-field")),
            this.options.fields[a] && this.options.fields[a].validators[b] && (this.options.fields[a].validators[b][c] = d, this.updateStatus(a, this.STATUS_NOT_VALIDATED, b)),
            this
        },
        addField: function(b, c) {
            var d = a([]);
            switch (typeof b) {
            case "object":
                d = b,
                b = b.attr("data-bv-field") || b.attr("name");
                break;
            case "string":
                delete this._cacheFields[b],
                d = this.getFieldElements(b)
            }
            d.attr("data-bv-field", b);
            for (var e = d.attr("type"), f = "radio" === e || "checkbox" === e ? 1 : d.length, g = 0; f > g; g++) {
                var h = d.eq(g),
                i = this._parseOptions(h);
                i = null === i ? c: a.extend(!0, c, i),
                this.options.fields[b] = a.extend(!0, this.options.fields[b], i),
                this._cacheFields[b] = this._cacheFields[b] ? this._cacheFields[b].add(h) : h,
                this._initField("checkbox" === e || "radio" === e ? b: h)
            }
            return this.disableSubmitButtons(!1),
            this.$form.trigger(a.Event(this.options.events.fieldAdded), {
                field: b,
                element: d,
                options: this.options.fields[b]
            }),
            this
        },
        removeField: function(b) {
            var c = a([]);
            switch (typeof b) {
            case "object":
                c = b,
                b = b.attr("data-bv-field") || b.attr("name"),
                c.attr("data-bv-field", b);
                break;
            case "string":
                c = this.getFieldElements(b)
            }
            if (0 === c.length) return this;
            for (var d = c.attr("type"), e = "radio" === d || "checkbox" === d ? 1 : c.length, f = 0; e > f; f++) {
                var g = c.eq(f);
                this.$invalidFields = this.$invalidFields.not(g),
                this._cacheFields[b] = this._cacheFields[b].not(g)
            }
            return this._cacheFields[b] && 0 !== this._cacheFields[b].length || delete this.options.fields[b],
            ("checkbox" === d || "radio" === d) && this._initField(b),
            this.disableSubmitButtons(!1),
            this.$form.trigger(a.Event(this.options.events.fieldRemoved), {
                field: b,
                element: c
            }),
            this
        },
        resetField: function(b, c) {
            var d = a([]);
            switch (typeof b) {
            case "object":
                d = b,
                b = b.attr("data-bv-field");
                break;
            case "string":
                d = this.getFieldElements(b)
            }
            var e = d.length;
            if (this.options.fields[b]) for (var f = 0; e > f; f++) for (var g in this.options.fields[b].validators) d.eq(f).removeData("bv.dfs." + g);
            if (this.updateStatus(b, this.STATUS_NOT_VALIDATED), c) {
                var h = d.attr("type");
                "radio" === h || "checkbox" === h ? d.removeAttr("checked").removeAttr("selected") : d.val("")
            }
            return this
        },
        resetForm: function(b) {
            for (var c in this.options.fields) this.resetField(c, b);
            return this.$invalidFields = a([]),
            this.$submitButton = null,
            this.disableSubmitButtons(!1),
            this
        },
        revalidateField: function(a) {
            return this.updateStatus(a, this.STATUS_NOT_VALIDATED).validateField(a),
            this
        },
        enableFieldValidators: function(a, b, c) {
            var d = this.options.fields[a].validators;
            if (c && d && d[c] && d[c].enabled !== b) this.options.fields[a].validators[c].enabled = b,
            this.updateStatus(a, this.STATUS_NOT_VALIDATED, c);
            else if (!c && this.options.fields[a].enabled !== b) {
                this.options.fields[a].enabled = b;
                for (var e in d) this.enableFieldValidators(a, b, e)
            }
            return this
        },
        getDynamicOption: function(b, c) {
            var d = "string" == typeof b ? this.getFieldElements(b) : b,
            e = d.val();
            if ("function" == typeof c) return a.fn.bootstrapValidator.helpers.call(c, [e, this, d]);
            if ("string" == typeof c) {
                var f = this.getFieldElements(c);
                return f.length ? f.val() : a.fn.bootstrapValidator.helpers.call(c, [e, this, d]) || c
            }
            return null
        },
        destroy: function() {
            var b, c, d, e, f, g;
            for (b in this.options.fields) {
                c = this.getFieldElements(b),
                g = this.options.fields[b].group || this.options.group;
                for (var h = 0; h < c.length; h++) {
                    if (d = c.eq(h), d.data("bv.messages").find('.help-block[data-bv-validator][data-bv-for="' + b + '"]').remove().end().end().removeData("bv.messages").parents(g).removeClass("has-feedback has-error has-success").end().off(".bv").removeAttr("data-bv-field"), f = d.parents(g).find('i[data-bv-icon-for="' + b + '"]')) {
                        var i = "function" == typeof(this.options.fields[b].container || this.options.container) ? (this.options.fields[b].container || this.options.container).call(this, d, this) : this.options.fields[b].container || this.options.container;
                        switch (i) {
                        case "tooltip":
                            f.tooltip("destroy").remove();
                            break;
                        case "popover":
                            f.popover("destroy").remove();
                            break;
                        default:
                            f.remove()
                        }
                    }
                    for (e in this.options.fields[b].validators) d.data("bv.dfs." + e) && d.data("bv.dfs." + e).reject(),
                    d.removeData("bv.result." + e).removeData("bv.response." + e).removeData("bv.dfs." + e),
                    "function" == typeof a.fn.bootstrapValidator.validators[e].destroy && a.fn.bootstrapValidator.validators[e].destroy(this, d, this.options.fields[b].validators[e])
                }
            }
            this.disableSubmitButtons(!1),
            this.$hiddenButton.remove(),
            this.$form.removeClass(this.options.elementClass).off(".bv").removeData("bootstrapValidator").find("[data-bv-submit-hidden]").remove().end().find('[type="submit"]').off("click.bv")
        }
    },
    a.fn.bootstrapValidator = function(c) {
        var d = arguments;
        return this.each(function() {
            var e = a(this),
            f = e.data("bootstrapValidator"),
            g = "object" == typeof c && c;
            f || (f = new b(this, g), e.data("bootstrapValidator", f)),
            "string" == typeof c && f[c].apply(f, Array.prototype.slice.call(d, 1))
        })
    },
    a.fn.bootstrapValidator.DEFAULT_OPTIONS = {
        elementClass: "bv-form",
        message: "This value is not valid",
        group: ".form-group",
        container: null,
        threshold: null,
        excluded: [":disabled", ":hidden", ":not(:visible)"],
        feedbackIcons: {
            valid: null,
            invalid: null,
            validating: null
        },
        submitButtons: '[type="submit"]',
        live: "enabled",
        fields: null,
        events: {
            formInit: "init.form.bv",
            formError: "error.form.bv",
            formSuccess: "success.form.bv",
            fieldAdded: "added.field.bv",
            fieldRemoved: "removed.field.bv",
            fieldInit: "init.field.bv",
            fieldError: "error.field.bv",
            fieldSuccess: "success.field.bv",
            fieldStatus: "status.field.bv",
            validatorError: "error.validator.bv",
            validatorSuccess: "success.validator.bv"
        },
        verbose: !0
    },
    a.fn.bootstrapValidator.validators = {},
    a.fn.bootstrapValidator.i18n = {},
    a.fn.bootstrapValidator.Constructor = b,
    a.fn.bootstrapValidator.helpers = {
        call: function(a, b) {
            if ("function" == typeof a) return a.apply(this, b);
            if ("string" == typeof a) {
                "()" === a.substring(a.length - 2) && (a = a.substring(0, a.length - 2));
                for (var c = a.split("."), d = c.pop(), e = window, f = 0; f < c.length; f++) e = e[c[f]];
                return "undefined" == typeof e[d] ? null: e[d].apply(this, b)
            }
        },
        format: function(b, c) {
            a.isArray(c) || (c = [c]);
            for (var d in c) b = b.replace("%s", c[d]);
            return b
        },
        date: function(a, b, c, d) {
            if (isNaN(a) || isNaN(b) || isNaN(c)) return ! 1;
            if (c.length > 2 || b.length > 2 || a.length > 4) return ! 1;
            if (c = parseInt(c, 10), b = parseInt(b, 10), a = parseInt(a, 10), 1e3 > a || a > 9999 || 0 >= b || b > 12) return ! 1;
            var e = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if ((a % 400 === 0 || a % 100 !== 0 && a % 4 === 0) && (e[1] = 29), 0 >= c || c > e[b - 1]) return ! 1;
            if (d === !0) {
                var f = new Date,
                g = f.getFullYear(),
                h = f.getMonth(),
                i = f.getDate();
                return g > a || a === g && h > b - 1 || a === g && b - 1 === h && i > c
            }
            return ! 0
        },
        luhn: function(a) {
            for (var b = a.length,
            c = 0,
            d = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]], e = 0; b--;) e += d[c][parseInt(a.charAt(b), 10)],
            c ^= 1;
            return e % 10 === 0 && e > 0
        },
        mod11And10: function(a) {
            for (var b = 5,
            c = a.length,
            d = 0; c > d; d++) b = (2 * (b || 10) % 11 + parseInt(a.charAt(d), 10)) % 10;
            return 1 === b
        },
        mod37And36: function(a, b) {
            b = b || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (var c = b.length,
            d = a.length,
            e = Math.floor(c / 2), f = 0; d > f; f++) e = (2 * (e || c) % (c + 1) + b.indexOf(a.charAt(f))) % c;
            return 1 === e
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.base64 = a.extend(a.fn.bootstrapValidator.i18n.base64 || {},
    {
        "default": "Please enter a valid base 64 encoded"
    }),
    a.fn.bootstrapValidator.validators.base64 = {
        validate: function(a, b) {
            var c = b.val();
            return "" === c ? !0 : /^(?:[A-Za-z0-9+/] {
                4
            }) * ( ? :[A - Za - z0 - 9 + /]{2}==|[A-Za-z0-9+/] {
                3
            } = |[A - Za - z0 - 9 + /]{4})$/.test(c)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.between = a.extend(a.fn.bootstrapValidator.i18n.between || {},
    {
        "default": "Please enter a value between %s and %s",
        notInclusive: "Please enter a value between %s and %s strictly"
    }),
    a.fn.bootstrapValidator.validators.between = {
        html5Attributes: {
            message: "message",
            min: "min",
            max: "max",
            inclusive: "inclusive"
        },
        enableByHtml5: function(a) {
            return "range" === a.attr("type") ? {
                min: a.attr("min"),
                max: a.attr("max")
            }: !1
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            if (!a.isNumeric(e)) return ! 1;
            var f = a.isNumeric(d.min) ? d.min: b.getDynamicOption(c, d.min),
            g = a.isNumeric(d.max) ? d.max: b.getDynamicOption(c, d.max);
            return e = parseFloat(e),
            d.inclusive === !0 || void 0 === d.inclusive ? {
                valid: e >= f && g >= e,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.between["default"], [f, g])
            }: {
                valid: e > f && g > e,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.between.notInclusive, [f, g])
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.validators.blank = {
        validate: function() {
            return ! 0
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.callback = a.extend(a.fn.bootstrapValidator.i18n.callback || {},
    {
        "default": "Please enter a valid value"
    }),
    a.fn.bootstrapValidator.validators.callback = {
        html5Attributes: {
            message: "message",
            callback: "callback"
        },
        validate: function(b, c, d) {
            var e = c.val(),
            f = new a.Deferred,
            g = {
                valid: !0
            };
            if (d.callback) {
                var h = a.fn.bootstrapValidator.helpers.call(d.callback, [e, b, c]);
                g = "boolean" == typeof h ? {
                    valid: h
                }: h
            }
            return f.resolve(c, "callback", g),
            f
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.choice = a.extend(a.fn.bootstrapValidator.i18n.choice || {},
    {
        "default": "Please enter a valid value",
        less: "Please choose %s options at minimum",
        more: "Please choose %s options at maximum",
        between: "Please choose %s - %s options"
    }),
    a.fn.bootstrapValidator.validators.choice = {
        html5Attributes: {
            message: "message",
            min: "min",
            max: "max"
        },
        validate: function(b, c, d) {
            var e = c.is("select") ? b.getFieldElements(c.attr("data-bv-field")).find("option").filter(":selected").length: b.getFieldElements(c.attr("data-bv-field")).filter(":checked").length,
            f = d.min ? a.isNumeric(d.min) ? d.min: b.getDynamicOption(c, d.min) : null,
            g = d.max ? a.isNumeric(d.max) ? d.max: b.getDynamicOption(c, d.max) : null,
            h = !0,
            i = d.message || a.fn.bootstrapValidator.i18n.choice["default"];
            switch ((f && e < parseInt(f, 10) || g && e > parseInt(g, 10)) && (h = !1), !0) {
            case !! f && !!g: i = a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.choice.between, [parseInt(f, 10), parseInt(g, 10)]);
                break;
            case !! f: i = a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.choice.less, parseInt(f, 10));
                break;
            case !! g: i = a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.choice.more, parseInt(g, 10))
            }
            return {
                valid: h,
                message: i
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.creditCard = a.extend(a.fn.bootstrapValidator.i18n.creditCard || {},
    {
        "default": "Please enter a valid credit card number"
    }),
    a.fn.bootstrapValidator.validators.creditCard = {
        validate: function(b, c) {
            var d = c.val();
            if ("" === d) return ! 0;
            if (/[^0-9-\s]+/.test(d)) return ! 1;
            if (d = d.replace(/\D/g, ""), !a.fn.bootstrapValidator.helpers.luhn(d)) return ! 1;
            var e, f, g = {
                AMERICAN_EXPRESS: {
                    length: [15],
                    prefix: ["34", "37"]
                },
                DINERS_CLUB: {
                    length: [14],
                    prefix: ["300", "301", "302", "303", "304", "305", "36"]
                },
                DINERS_CLUB_US: {
                    length: [16],
                    prefix: ["54", "55"]
                },
                DISCOVER: {
                    length: [16],
                    prefix: ["6011", "622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925", "644", "645", "646", "647", "648", "649", "65"]
                },
                JCB: {
                    length: [16],
                    prefix: ["3528", "3529", "353", "354", "355", "356", "357", "358"]
                },
                LASER: {
                    length: [16, 17, 18, 19],
                    prefix: ["6304", "6706", "6771", "6709"]
                },
                MAESTRO: {
                    length: [12, 13, 14, 15, 16, 17, 18, 19],
                    prefix: ["5018", "5020", "5038", "6304", "6759", "6761", "6762", "6763", "6764", "6765", "6766"]
                },
                MASTERCARD: {
                    length: [16],
                    prefix: ["51", "52", "53", "54", "55"]
                },
                SOLO: {
                    length: [16, 18, 19],
                    prefix: ["6334", "6767"]
                },
                UNIONPAY: {
                    length: [16, 17, 18, 19],
                    prefix: ["622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925"]
                },
                VISA: {
                    length: [16],
                    prefix: ["4"]
                }
            };
            for (e in g) for (f in g[e].prefix) if (d.substr(0, g[e].prefix[f].length) === g[e].prefix[f] && -1 !== a.inArray(d.length, g[e].length)) return ! 0;
            return ! 1
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.cusip = a.extend(a.fn.bootstrapValidator.i18n.cusip || {},
    {
        "default": "Please enter a valid CUSIP number"
    }),
    a.fn.bootstrapValidator.validators.cusip = {
        validate: function(b, c) {
            var d = c.val();
            if ("" === d) return ! 0;
            if (d = d.toUpperCase(), !/^[0-9A-Z]{9}$/.test(d)) return ! 1;
            for (var e = a.map(d.split(""),
            function(a) {
                var b = a.charCodeAt(0);
                return b >= "A".charCodeAt(0) && b <= "Z".charCodeAt(0) ? b - "A".charCodeAt(0) + 10 : a
            }), f = e.length, g = 0, h = 0; f - 1 > h; h++) {
                var i = parseInt(e[h], 10);
                h % 2 !== 0 && (i *= 2),
                i > 9 && (i -= 9),
                g += i
            }
            return g = (10 - g % 10) % 10,
            g === e[f - 1]
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.cvv = a.extend(a.fn.bootstrapValidator.i18n.cvv || {},
    {
        "default": "Please enter a valid CVV number"
    }),
    a.fn.bootstrapValidator.validators.cvv = {
        html5Attributes: {
            message: "message",
            ccfield: "creditCardField"
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            if (!/^[0-9]{3,4}$/.test(e)) return ! 1;
            if (!d.creditCardField) return ! 0;
            var f = b.getFieldElements(d.creditCardField).val();
            if ("" === f) return ! 0;
            f = f.replace(/\D/g, "");
            var g, h, i = {
                AMERICAN_EXPRESS: {
                    length: [15],
                    prefix: ["34", "37"]
                },
                DINERS_CLUB: {
                    length: [14],
                    prefix: ["300", "301", "302", "303", "304", "305", "36"]
                },
                DINERS_CLUB_US: {
                    length: [16],
                    prefix: ["54", "55"]
                },
                DISCOVER: {
                    length: [16],
                    prefix: ["6011", "622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925", "644", "645", "646", "647", "648", "649", "65"]
                },
                JCB: {
                    length: [16],
                    prefix: ["3528", "3529", "353", "354", "355", "356", "357", "358"]
                },
                LASER: {
                    length: [16, 17, 18, 19],
                    prefix: ["6304", "6706", "6771", "6709"]
                },
                MAESTRO: {
                    length: [12, 13, 14, 15, 16, 17, 18, 19],
                    prefix: ["5018", "5020", "5038", "6304", "6759", "6761", "6762", "6763", "6764", "6765", "6766"]
                },
                MASTERCARD: {
                    length: [16],
                    prefix: ["51", "52", "53", "54", "55"]
                },
                SOLO: {
                    length: [16, 18, 19],
                    prefix: ["6334", "6767"]
                },
                UNIONPAY: {
                    length: [16, 17, 18, 19],
                    prefix: ["622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925"]
                },
                VISA: {
                    length: [16],
                    prefix: ["4"]
                }
            },
            j = null;
            for (g in i) for (h in i[g].prefix) if (f.substr(0, i[g].prefix[h].length) === i[g].prefix[h] && -1 !== a.inArray(f.length, i[g].length)) {
                j = g;
                break
            }
            return null === j ? !1 : "AMERICAN_EXPRESS" === j ? 4 === e.length: 3 === e.length
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.date = a.extend(a.fn.bootstrapValidator.i18n.date || {},
    {
        "default": "Please enter a valid date"
    }),
    a.fn.bootstrapValidator.validators.date = {
        html5Attributes: {
            message: "message",
            format: "format",
            separator: "separator"
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            d.format = d.format || "MM/DD/YYYY",
            "date" === c.attr("type") && (d.format = "YYYY-MM-DD");
            var f = d.format.split(" "),
            g = f[0],
            h = f.length > 1 ? f[1] : null,
            i = f.length > 2 ? f[2] : null,
            j = e.split(" "),
            k = j[0],
            l = j.length > 1 ? j[1] : null;
            if (f.length !== j.length) return ! 1;
            var m = d.separator;
            if (m || (m = -1 !== k.indexOf("/") ? "/": -1 !== k.indexOf("-") ? "-": null), null === m || -1 === k.indexOf(m)) return ! 1;
            if (k = k.split(m), g = g.split(m), k.length !== g.length) return ! 1;
            var n = k[a.inArray("YYYY", g)],
            o = k[a.inArray("MM", g)],
            p = k[a.inArray("DD", g)];
            if (!n || !o || !p || 4 !== n.length) return ! 1;
            var q = null,
            r = null,
            s = null;
            if (h) {
                if (h = h.split(":"), l = l.split(":"), h.length !== l.length) return ! 1;
                if (r = l.length > 0 ? l[0] : null, q = l.length > 1 ? l[1] : null, s = l.length > 2 ? l[2] : null) {
                    if (isNaN(s) || s.length > 2) return ! 1;
                    if (s = parseInt(s, 10), 0 > s || s > 60) return ! 1
                }
                if (r) {
                    if (isNaN(r) || r.length > 2) return ! 1;
                    if (r = parseInt(r, 10), 0 > r || r >= 24 || i && r > 12) return ! 1
                }
                if (q) {
                    if (isNaN(q) || q.length > 2) return ! 1;
                    if (q = parseInt(q, 10), 0 > q || q > 59) return ! 1
                }
            }
            return a.fn.bootstrapValidator.helpers.date(n, o, p)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.different = a.extend(a.fn.bootstrapValidator.i18n.different || {},
    {
        "default": "Please enter a different value"
    }),
    a.fn.bootstrapValidator.validators.different = {
        html5Attributes: {
            message: "message",
            field: "field"
        },
        validate: function(a, b, c) {
            var d = b.val();
            if ("" === d) return ! 0;
            for (var e = c.field.split(","), f = !0, g = 0; g < e.length; g++) {
                var h = a.getFieldElements(e[g]);
                if (null != h && 0 !== h.length) {
                    var i = h.val();
                    d === i ? f = !1 : "" !== i && a.updateStatus(h, a.STATUS_VALID, "different")
                }
            }
            return f
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.digits = a.extend(a.fn.bootstrapValidator.i18n.digits || {},
    {
        "default": "Please enter only digits"
    }),
    a.fn.bootstrapValidator.validators.digits = {
        validate: function(a, b) {
            var c = b.val();
            return "" === c ? !0 : /^\d+$/.test(c)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.ean = a.extend(a.fn.bootstrapValidator.i18n.ean || {},
    {
        "default": "Please enter a valid EAN number"
    }),
    a.fn.bootstrapValidator.validators.ean = {
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            if (!/^(\d{8}|\d{12}|\d{13})$/.test(c)) return ! 1;
            for (var d = c.length,
            e = 0,
            f = 8 === d ? [3, 1] : [1, 3], g = 0; d - 1 > g; g++) e += parseInt(c.charAt(g), 10) * f[g % 2];
            return e = (10 - e % 10) % 10,
            e + "" === c.charAt(d - 1)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.emailAddress = a.extend(a.fn.bootstrapValidator.i18n.emailAddress || {},
    {
        "default": "Please enter a valid email address"
    }),
    a.fn.bootstrapValidator.validators.emailAddress = {
        html5Attributes: {
            message: "message",
            multiple: "multiple",
            separator: "separator"
        },
        enableByHtml5: function(a) {
            return "email" === a.attr("type")
        },
        validate: function(a, b, c) {
            var d = b.val();
            if ("" === d) return ! 0;
            var e = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            f = c.multiple === !0 || "true" === c.multiple;
            if (f) {
                for (var g = c.separator || /[,;]/,
                h = this._splitEmailAddresses(d, g), i = 0; i < h.length; i++) if (!e.test(h[i])) return ! 1;
                return ! 0
            }
            return e.test(d)
        },
        _splitEmailAddresses: function(a, b) {
            for (var c = a.split(/"/), d = c.length, e = [], f = "", g = 0; d > g; g++) if (g % 2 === 0) {
                var h = c[g].split(b),
                i = h.length;
                if (1 === i) f += h[0];
                else {
                    e.push(f + h[0]);
                    for (var j = 1; i - 1 > j; j++) e.push(h[j]);
                    f = h[i - 1]
                }
            } else f += '"' + c[g],
            d - 1 > g && (f += '"');
            return e.push(f),
            e
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.file = a.extend(a.fn.bootstrapValidator.i18n.file || {},
    {
        "default": "Please choose a valid file"
    }),
    a.fn.bootstrapValidator.validators.file = {
        html5Attributes: {
            extension: "extension",
            maxsize: "maxSize",
            minsize: "minSize",
            message: "message",
            type: "type"
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            var f, g = d.extension ? d.extension.toLowerCase().split(",") : null,
            h = d.type ? d.type.toLowerCase().split(",") : null,
            i = window.File && window.FileList && window.FileReader;
            if (i) for (var j = c.get(0).files, k = j.length, l = 0; k > l; l++) {
                if (d.minSize && j[l].size < parseInt(d.minSize, 10)) return ! 1;
                if (d.maxSize && j[l].size > parseInt(d.maxSize, 10)) return ! 1;
                if (f = j[l].name.substr(j[l].name.lastIndexOf(".") + 1), g && -1 === a.inArray(f.toLowerCase(), g)) return ! 1;
                if (j[l].type && h && -1 === a.inArray(j[l].type.toLowerCase(), h)) return ! 1
            } else if (f = e.substr(e.lastIndexOf(".") + 1), g && -1 === a.inArray(f.toLowerCase(), g)) return ! 1;
            return ! 0
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.greaterThan = a.extend(a.fn.bootstrapValidator.i18n.greaterThan || {},
    {
        "default": "Please enter a value greater than or equal to %s",
        notInclusive: "Please enter a value greater than %s"
    }),
    a.fn.bootstrapValidator.validators.greaterThan = {
        html5Attributes: {
            message: "message",
            value: "value",
            inclusive: "inclusive"
        },
        enableByHtml5: function(a) {
            var b = a.attr("type"),
            c = a.attr("min");
            return c && "date" !== b ? {
                value: c
            }: !1
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            if (!a.isNumeric(e)) return ! 1;
            var f = a.isNumeric(d.value) ? d.value: b.getDynamicOption(c, d.value);
            return e = parseFloat(e),
            d.inclusive === !0 || void 0 === d.inclusive ? {
                valid: e >= f,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.greaterThan["default"], f)
            }: {
                valid: e > f,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.greaterThan.notInclusive, f)
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.grid = a.extend(a.fn.bootstrapValidator.i18n.grid || {},
    {
        "default": "Please enter a valid GRId number"
    }),
    a.fn.bootstrapValidator.validators.grid = {
        validate: function(b, c) {
            var d = c.val();
            return "" === d ? !0 : (d = d.toUpperCase(), /^[GRID:]*([0-9A-Z]{2})[-\s]*([0-9A-Z]{5})[-\s]*([0-9A-Z]{10})[-\s]*([0-9A-Z]{1})$/g.test(d) ? (d = d.replace(/\s/g, "").replace(/-/g, ""), "GRID:" === d.substr(0, 5) && (d = d.substr(5)), a.fn.bootstrapValidator.helpers.mod37And36(d)) : !1)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.hex = a.extend(a.fn.bootstrapValidator.i18n.hex || {},
    {
        "default": "Please enter a valid hexadecimal number"
    }),
    a.fn.bootstrapValidator.validators.hex = {
        validate: function(a, b) {
            var c = b.val();
            return "" === c ? !0 : /^[0-9a-fA-F]+$/.test(c)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.hexColor = a.extend(a.fn.bootstrapValidator.i18n.hexColor || {},
    {
        "default": "Please enter a valid hex color"
    }),
    a.fn.bootstrapValidator.validators.hexColor = {
        enableByHtml5: function(a) {
            return "color" === a.attr("type")
        },
        validate: function(a, b) {
            var c = b.val();
            return "" === c ? !0 : /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(c)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.iban = a.extend(a.fn.bootstrapValidator.i18n.iban || {},
    {
        "default": "Please enter a valid IBAN number",
        countryNotSupported: "The country code %s is not supported",
        country: "Please enter a valid IBAN number in %s",
        countries: {
            AD: "Andorra",
            AE: "United Arab Emirates",
            AL: "Albania",
            AO: "Angola",
            AT: "Austria",
            AZ: "Azerbaijan",
            BA: "Bosnia and Herzegovina",
            BE: "Belgium",
            BF: "Burkina Faso",
            BG: "Bulgaria",
            BH: "Bahrain",
            BI: "Burundi",
            BJ: "Benin",
            BR: "Brazil",
            CH: "Switzerland",
            CI: "Ivory Coast",
            CM: "Cameroon",
            CR: "Costa Rica",
            CV: "Cape Verde",
            CY: "Cyprus",
            CZ: "Czech Republic",
            DE: "Germany",
            DK: "Denmark",
            DO: "Dominica",
            DZ: "Algeria",
            EE: "Estonia",
            ES: "Spain",
            FI: "Finland",
            FO: "Faroe Islands",
            FR: "France",
            GB: "United Kingdom",
            GE: "Georgia",
            GI: "Gibraltar",
            GL: "Greenland",
            GR: "Greece",
            GT: "Guatemala",
            HR: "Croatia",
            HU: "Hungary",
            IE: "Ireland",
            IL: "Israel",
            IR: "Iran",
            IS: "Iceland",
            IT: "Italy",
            JO: "Jordan",
            KW: "Kuwait",
            KZ: "Kazakhstan",
            LB: "Lebanon",
            LI: "Liechtenstein",
            LT: "Lithuania",
            LU: "Luxembourg",
            LV: "Latvia",
            MC: "Monaco",
            MD: "Moldova",
            ME: "Montenegro",
            MG: "Madagascar",
            MK: "Macedonia",
            ML: "Mali",
            MR: "Mauritania",
            MT: "Malta",
            MU: "Mauritius",
            MZ: "Mozambique",
            NL: "Netherlands",
            NO: "Norway",
            PK: "Pakistan",
            PL: "Poland",
            PS: "Palestine",
            PT: "Portugal",
            QA: "Qatar",
            RO: "Romania",
            RS: "Serbia",
            SA: "Saudi Arabia",
            SE: "Sweden",
            SI: "Slovenia",
            SK: "Slovakia",
            SM: "San Marino",
            SN: "Senegal",
            TN: "Tunisia",
            TR: "Turkey",
            VG: "Virgin Islands, British"
        }
    }),
    a.fn.bootstrapValidator.validators.iban = {
        html5Attributes: {
            message: "message",
            country: "country"
        },
        REGEX: {
            AD: "AD[0-9]{2}[0-9]{4}[0-9]{4}[A-Z0-9]{12}",
            AE: "AE[0-9]{2}[0-9]{3}[0-9]{16}",
            AL: "AL[0-9]{2}[0-9]{8}[A-Z0-9]{16}",
            AO: "AO[0-9]{2}[0-9]{21}",
            AT: "AT[0-9]{2}[0-9]{5}[0-9]{11}",
            AZ: "AZ[0-9]{2}[A-Z]{4}[A-Z0-9]{20}",
            BA: "BA[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{8}[0-9]{2}",
            BE: "BE[0-9]{2}[0-9]{3}[0-9]{7}[0-9]{2}",
            BF: "BF[0-9]{2}[0-9]{23}",
            BG: "BG[0-9]{2}[A-Z]{4}[0-9]{4}[0-9]{2}[A-Z0-9]{8}",
            BH: "BH[0-9]{2}[A-Z]{4}[A-Z0-9]{14}",
            BI: "BI[0-9]{2}[0-9]{12}",
            BJ: "BJ[0-9]{2}[A-Z]{1}[0-9]{23}",
            BR: "BR[0-9]{2}[0-9]{8}[0-9]{5}[0-9]{10}[A-Z][A-Z0-9]",
            CH: "CH[0-9]{2}[0-9]{5}[A-Z0-9]{12}",
            CI: "CI[0-9]{2}[A-Z]{1}[0-9]{23}",
            CM: "CM[0-9]{2}[0-9]{23}",
            CR: "CR[0-9]{2}[0-9]{3}[0-9]{14}",
            CV: "CV[0-9]{2}[0-9]{21}",
            CY: "CY[0-9]{2}[0-9]{3}[0-9]{5}[A-Z0-9]{16}",
            CZ: "CZ[0-9]{2}[0-9]{20}",
            DE: "DE[0-9]{2}[0-9]{8}[0-9]{10}",
            DK: "DK[0-9]{2}[0-9]{14}",
            DO: "DO[0-9]{2}[A-Z0-9]{4}[0-9]{20}",
            DZ: "DZ[0-9]{2}[0-9]{20}",
            EE: "EE[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{11}[0-9]{1}",
            ES: "ES[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{1}[0-9]{1}[0-9]{10}",
            FI: "FI[0-9]{2}[0-9]{6}[0-9]{7}[0-9]{1}",
            FO: "FO[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}",
            FR: "FR[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}",
            GB: "GB[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}",
            GE: "GE[0-9]{2}[A-Z]{2}[0-9]{16}",
            GI: "GI[0-9]{2}[A-Z]{4}[A-Z0-9]{15}",
            GL: "GL[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}",
            GR: "GR[0-9]{2}[0-9]{3}[0-9]{4}[A-Z0-9]{16}",
            GT: "GT[0-9]{2}[A-Z0-9]{4}[A-Z0-9]{20}",
            HR: "HR[0-9]{2}[0-9]{7}[0-9]{10}",
            HU: "HU[0-9]{2}[0-9]{3}[0-9]{4}[0-9]{1}[0-9]{15}[0-9]{1}",
            IE: "IE[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}",
            IL: "IL[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{13}",
            IR: "IR[0-9]{2}[0-9]{22}",
            IS: "IS[0-9]{2}[0-9]{4}[0-9]{2}[0-9]{6}[0-9]{10}",
            IT: "IT[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}",
            JO: "JO[0-9]{2}[A-Z]{4}[0-9]{4}[0]{8}[A-Z0-9]{10}",
            KW: "KW[0-9]{2}[A-Z]{4}[0-9]{22}",
            KZ: "KZ[0-9]{2}[0-9]{3}[A-Z0-9]{13}",
            LB: "LB[0-9]{2}[0-9]{4}[A-Z0-9]{20}",
            LI: "LI[0-9]{2}[0-9]{5}[A-Z0-9]{12}",
            LT: "LT[0-9]{2}[0-9]{5}[0-9]{11}",
            LU: "LU[0-9]{2}[0-9]{3}[A-Z0-9]{13}",
            LV: "LV[0-9]{2}[A-Z]{4}[A-Z0-9]{13}",
            MC: "MC[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}",
            MD: "MD[0-9]{2}[A-Z0-9]{20}",
            ME: "ME[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}",
            MG: "MG[0-9]{2}[0-9]{23}",
            MK: "MK[0-9]{2}[0-9]{3}[A-Z0-9]{10}[0-9]{2}",
            ML: "ML[0-9]{2}[A-Z]{1}[0-9]{23}",
            MR: "MR13[0-9]{5}[0-9]{5}[0-9]{11}[0-9]{2}",
            MT: "MT[0-9]{2}[A-Z]{4}[0-9]{5}[A-Z0-9]{18}",
            MU: "MU[0-9]{2}[A-Z]{4}[0-9]{2}[0-9]{2}[0-9]{12}[0-9]{3}[A-Z]{3}",
            MZ: "MZ[0-9]{2}[0-9]{21}",
            NL: "NL[0-9]{2}[A-Z]{4}[0-9]{10}",
            NO: "NO[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{1}",
            PK: "PK[0-9]{2}[A-Z]{4}[A-Z0-9]{16}",
            PL: "PL[0-9]{2}[0-9]{8}[0-9]{16}",
            PS: "PS[0-9]{2}[A-Z]{4}[A-Z0-9]{21}",
            PT: "PT[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{11}[0-9]{2}",
            QA: "QA[0-9]{2}[A-Z]{4}[A-Z0-9]{21}",
            RO: "RO[0-9]{2}[A-Z]{4}[A-Z0-9]{16}",
            RS: "RS[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}",
            SA: "SA[0-9]{2}[0-9]{2}[A-Z0-9]{18}",
            SE: "SE[0-9]{2}[0-9]{3}[0-9]{16}[0-9]{1}",
            SI: "SI[0-9]{2}[0-9]{5}[0-9]{8}[0-9]{2}",
            SK: "SK[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{10}",
            SM: "SM[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}",
            SN: "SN[0-9]{2}[A-Z]{1}[0-9]{23}",
            TN: "TN59[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}",
            TR: "TR[0-9]{2}[0-9]{5}[A-Z0-9]{1}[A-Z0-9]{16}",
            VG: "VG[0-9]{2}[A-Z]{4}[0-9]{16}"
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            e = e.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
            var f = d.country;
            if (f ? "string" == typeof f && this.REGEX[f] || (f = b.getDynamicOption(c, f)) : f = e.substr(0, 2), !this.REGEX[f]) return {
                valid: !1,
                message: a.fn.bootstrapValidator.helpers.format(a.fn.bootstrapValidator.i18n.iban.countryNotSupported, f)
            };
            if (!new RegExp("^" + this.REGEX[f] + "$").test(e)) return {
                valid: !1,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.iban.country, a.fn.bootstrapValidator.i18n.iban.countries[f])
            };
            e = e.substr(4) + e.substr(0, 4),
            e = a.map(e.split(""),
            function(a) {
                var b = a.charCodeAt(0);
                return b >= "A".charCodeAt(0) && b <= "Z".charCodeAt(0) ? b - "A".charCodeAt(0) + 10 : a
            }),
            e = e.join("");
            for (var g = parseInt(e.substr(0, 1), 10), h = e.length, i = 1; h > i; ++i) g = (10 * g + parseInt(e.substr(i, 1), 10)) % 97;
            return {
                valid: 1 === g,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.iban.country, a.fn.bootstrapValidator.i18n.iban.countries[f])
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.id = a.extend(a.fn.bootstrapValidator.i18n.id || {},
    {
        "default": "Please enter a valid identification number",
        countryNotSupported: "The country code %s is not supported",
        country: "Please enter a valid identification number in %s",
        countries: {
            BA: "Bosnia and Herzegovina",
            BG: "Bulgaria",
            BR: "Brazil",
            CH: "Switzerland",
            CL: "Chile",
            CN: "China",
            CZ: "Czech Republic",
            DK: "Denmark",
            EE: "Estonia",
            ES: "Spain",
            FI: "Finland",
            HR: "Croatia",
            IE: "Ireland",
            IS: "Iceland",
            LT: "Lithuania",
            LV: "Latvia",
            ME: "Montenegro",
            MK: "Macedonia",
            NL: "Netherlands",
            RO: "Romania",
            RS: "Serbia",
            SE: "Sweden",
            SI: "Slovenia",
            SK: "Slovakia",
            SM: "San Marino",
            TH: "Thailand",
            ZA: "South Africa"
        }
    }),
    a.fn.bootstrapValidator.validators.id = {
        html5Attributes: {
            message: "message",
            country: "country"
        },
        COUNTRY_CODES: ["BA", "BG", "BR", "CH", "CL", "CN", "CZ", "DK", "EE", "ES", "FI", "HR", "IE", "IS", "LT", "LV", "ME", "MK", "NL", "RO", "RS", "SE", "SI", "SK", "SM", "TH", "ZA"],
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            var f = d.country;
            if (f ? ("string" != typeof f || -1 === a.inArray(f.toUpperCase(), this.COUNTRY_CODES)) && (f = b.getDynamicOption(c, f)) : f = e.substr(0, 2), -1 === a.inArray(f, this.COUNTRY_CODES)) return {
                valid: !1,
                message: a.fn.bootstrapValidator.helpers.format(a.fn.bootstrapValidator.i18n.id.countryNotSupported, f)
            };
            var g = ["_", f.toLowerCase()].join("");
            return this[g](e) ? !0 : {
                valid: !1,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.id.country, a.fn.bootstrapValidator.i18n.id.countries[f.toUpperCase()])
            }
        },
        _validateJMBG: function(a, b) {
            if (!/^\d{13}$/.test(a)) return ! 1;
            var c = parseInt(a.substr(0, 2), 10),
            d = parseInt(a.substr(2, 2), 10),
            e = (parseInt(a.substr(4, 3), 10), parseInt(a.substr(7, 2), 10)),
            f = parseInt(a.substr(12, 1), 10);
            if (c > 31 || d > 12) return ! 1;
            for (var g = 0,
            h = 0; 6 > h; h++) g += (7 - h) * (parseInt(a.charAt(h), 10) + parseInt(a.charAt(h + 6), 10));
            if (g = 11 - g % 11, (10 === g || 11 === g) && (g = 0), g !== f) return ! 1;
            switch (b.toUpperCase()) {
            case "BA":
                return e >= 10 && 19 >= e;
            case "MK":
                return e >= 41 && 49 >= e;
            case "ME":
                return e >= 20 && 29 >= e;
            case "RS":
                return e >= 70 && 99 >= e;
            case "SI":
                return e >= 50 && 59 >= e;
            default:
                return ! 0
            }
        },
        _ba: function(a) {
            return this._validateJMBG(a, "BA")
        },
        _mk: function(a) {
            return this._validateJMBG(a, "MK")
        },
        _me: function(a) {
            return this._validateJMBG(a, "ME")
        },
        _rs: function(a) {
            return this._validateJMBG(a, "RS")
        },
        _si: function(a) {
            return this._validateJMBG(a, "SI")
        },
        _bg: function(b) {
            if (!/^\d{10}$/.test(b) && !/^\d{6}\s\d{3}\s\d{1}$/.test(b)) return ! 1;
            b = b.replace(/\s/g, "");
            var c = parseInt(b.substr(0, 2), 10) + 1900,
            d = parseInt(b.substr(2, 2), 10),
            e = parseInt(b.substr(4, 2), 10);
            if (d > 40 ? (c += 100, d -= 40) : d > 20 && (c -= 100, d -= 20), !a.fn.bootstrapValidator.helpers.date(c, d, e)) return ! 1;
            for (var f = 0,
            g = [2, 4, 8, 5, 10, 9, 7, 3, 6], h = 0; 9 > h; h++) f += parseInt(b.charAt(h), 10) * g[h];
            return f = f % 11 % 10,
            f + "" === b.substr(9, 1)
        },
        _br: function(a) {
            if (/^1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11}|0{11}$/.test(a)) return ! 1;
            if (!/^\d{11}$/.test(a) && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(a)) return ! 1;
            a = a.replace(/\./g, "").replace(/-/g, "");
            for (var b = 0,
            c = 0; 9 > c; c++) b += (10 - c) * parseInt(a.charAt(c), 10);
            if (b = 11 - b % 11, (10 === b || 11 === b) && (b = 0), b + "" !== a.charAt(9)) return ! 1;
            var d = 0;
            for (c = 0; 10 > c; c++) d += (11 - c) * parseInt(a.charAt(c), 10);
            return d = 11 - d % 11,
            (10 === d || 11 === d) && (d = 0),
            d + "" === a.charAt(10)
        },
        _ch: function(a) {
            if (!/^756[\.]{0,1}[0-9]{4}[\.]{0,1}[0-9]{4}[\.]{0,1}[0-9]{2}$/.test(a)) return ! 1;
            a = a.replace(/\D/g, "").substr(3);
            for (var b = a.length,
            c = 0,
            d = 8 === b ? [3, 1] : [1, 3], e = 0; b - 1 > e; e++) c += parseInt(a.charAt(e), 10) * d[e % 2];
            return c = 10 - c % 10,
            c + "" === a.charAt(b - 1)
        },
        _cl: function(a) {
            if (!/^\d{7,8}[-]{0,1}[0-9K]$/i.test(a)) return ! 1;
            for (a = a.replace(/\-/g, ""); a.length < 9;) a = "0" + a;
            for (var b = 0,
            c = [3, 2, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b = 11 - b % 11,
            11 === b ? b = 0 : 10 === b && (b = "K"),
            b + "" === a.charAt(8).toUpperCase()
        },
        _cn: function(b) {
            if (b = b.trim(), !/^\d{15}$/.test(b) && !/^\d{17}[\dXx]{1}$/.test(b)) return ! 1;
            var c = {
                11 : {
                    0 : [0],
                    1 : [[0, 9], [11, 17]],
                    2 : [0, 28, 29]
                },
                12 : {
                    0 : [0],
                    1 : [[0, 16]],
                    2 : [0, 21, 23, 25]
                },
                13 : {
                    0 : [0],
                    1 : [[0, 5], 7, 8, 21, [23, 33], [81, 85]],
                    2 : [[0, 5], [7, 9], [23, 25], 27, 29, 30, 81, 83],
                    3 : [[0, 4], [21, 24]],
                    4 : [[0, 4], 6, 21, [23, 35], 81],
                    5 : [[0, 3], [21, 35], 81, 82],
                    6 : [[0, 4], [21, 38], [81, 84]],
                    7 : [[0, 3], 5, 6, [21, 33]],
                    8 : [[0, 4], [21, 28]],
                    9 : [[0, 3], [21, 30], [81, 84]],
                    10 : [[0, 3], [22, 26], 28, 81, 82],
                    11 : [[0, 2], [21, 28], 81, 82]
                },
                14 : {
                    0 : [0],
                    1 : [0, 1, [5, 10], [21, 23], 81],
                    2 : [[0, 3], 11, 12, [21, 27]],
                    3 : [[0, 3], 11, 21, 22],
                    4 : [[0, 2], 11, 21, [23, 31], 81],
                    5 : [[0, 2], 21, 22, 24, 25, 81],
                    6 : [[0, 3], [21, 24]],
                    7 : [[0, 2], [21, 29], 81],
                    8 : [[0, 2], [21, 30], 81, 82],
                    9 : [[0, 2], [21, 32], 81],
                    10 : [[0, 2], [21, 34], 81, 82],
                    11 : [[0, 2], [21, 30], 81, 82],
                    23 : [[0, 3], 22, 23, [25, 30], 32, 33]
                },
                15 : {
                    0 : [0],
                    1 : [[0, 5], [21, 25]],
                    2 : [[0, 7], [21, 23]],
                    3 : [[0, 4]],
                    4 : [[0, 4], [21, 26], [28, 30]],
                    5 : [[0, 2], [21, 26], 81],
                    6 : [[0, 2], [21, 27]],
                    7 : [[0, 3], [21, 27], [81, 85]],
                    8 : [[0, 2], [21, 26]],
                    9 : [[0, 2], [21, 29], 81],
                    22 : [[0, 2], [21, 24]],
                    25 : [[0, 2], [22, 31]],
                    26 : [[0, 2], [24, 27], [29, 32], 34],
                    28 : [0, 1, [22, 27]],
                    29 : [0, [21, 23]]
                },
                21 : {
                    0 : [0],
                    1 : [[0, 6], [11, 14], [22, 24], 81],
                    2 : [[0, 4], [11, 13], 24, [81, 83]],
                    3 : [[0, 4], 11, 21, 23, 81],
                    4 : [[0, 4], 11, [21, 23]],
                    5 : [[0, 5], 21, 22],
                    6 : [[0, 4], 24, 81, 82],
                    7 : [[0, 3], 11, 26, 27, 81, 82],
                    8 : [[0, 4], 11, 81, 82],
                    9 : [[0, 5], 11, 21, 22],
                    10 : [[0, 5], 11, 21, 81],
                    11 : [[0, 3], 21, 22],
                    12 : [[0, 2], 4, 21, 23, 24, 81, 82],
                    13 : [[0, 3], 21, 22, 24, 81, 82],
                    14 : [[0, 4], 21, 22, 81]
                },
                22 : {
                    0 : [0],
                    1 : [[0, 6], 12, 22, [81, 83]],
                    2 : [[0, 4], 11, 21, [81, 84]],
                    3 : [[0, 3], 22, 23, 81, 82],
                    4 : [[0, 3], 21, 22],
                    5 : [[0, 3], 21, 23, 24, 81, 82],
                    6 : [[0, 2], 4, 5, [21, 23], 25, 81],
                    7 : [[0, 2], [21, 24], 81],
                    8 : [[0, 2], 21, 22, 81, 82],
                    24 : [[0, 6], 24, 26]
                },
                23 : {
                    0 : [0],
                    1 : [[0, 12], 21, [23, 29], [81, 84]],
                    2 : [[0, 8], 21, [23, 25], 27, [29, 31], 81],
                    3 : [[0, 7], 21, 81, 82],
                    4 : [[0, 7], 21, 22],
                    5 : [[0, 3], 5, 6, [21, 24]],
                    6 : [[0, 6], [21, 24]],
                    7 : [[0, 16], 22, 81],
                    8 : [[0, 5], 11, 22, 26, 28, 33, 81, 82],
                    9 : [[0, 4], 21],
                    10 : [[0, 5], 24, 25, 81, [83, 85]],
                    11 : [[0, 2], 21, 23, 24, 81, 82],
                    12 : [[0, 2], [21, 26], [81, 83]],
                    27 : [[0, 4], [21, 23]]
                },
                31 : {
                    0 : [0],
                    1 : [0, 1, [3, 10], [12, 20]],
                    2 : [0, 30]
                },
                32 : {
                    0 : [0],
                    1 : [[0, 7], 11, [13, 18], 24, 25],
                    2 : [[0, 6], 11, 81, 82],
                    3 : [[0, 5], 11, 12, [21, 24], 81, 82],
                    4 : [[0, 2], 4, 5, 11, 12, 81, 82],
                    5 : [[0, 9], [81, 85]],
                    6 : [[0, 2], 11, 12, 21, 23, [81, 84]],
                    7 : [0, 1, 3, 5, 6, [21, 24]],
                    8 : [[0, 4], 11, 26, [29, 31]],
                    9 : [[0, 3], [21, 25], 28, 81, 82],
                    10 : [[0, 3], 11, 12, 23, 81, 84, 88],
                    11 : [[0, 2], 11, 12, [81, 83]],
                    12 : [[0, 4], [81, 84]],
                    13 : [[0, 2], 11, [21, 24]]
                },
                33 : {
                    0 : [0],
                    1 : [[0, 6], [8, 10], 22, 27, 82, 83, 85],
                    2 : [0, 1, [3, 6], 11, 12, 25, 26, [81, 83]],
                    3 : [[0, 4], 22, 24, [26, 29], 81, 82],
                    4 : [[0, 2], 11, 21, 24, [81, 83]],
                    5 : [[0, 3], [21, 23]],
                    6 : [[0, 2], 21, 24, [81, 83]],
                    7 : [[0, 3], 23, 26, 27, [81, 84]],
                    8 : [[0, 3], 22, 24, 25, 81],
                    9 : [[0, 3], 21, 22],
                    10 : [[0, 4], [21, 24], 81, 82],
                    11 : [[0, 2], [21, 27], 81]
                },
                34 : {
                    0 : [0],
                    1 : [[0, 4], 11, [21, 24], 81],
                    2 : [[0, 4], 7, 8, [21, 23], 25],
                    3 : [[0, 4], 11, [21, 23]],
                    4 : [[0, 6], 21],
                    5 : [[0, 4], 6, [21, 23]],
                    6 : [[0, 4], 21],
                    7 : [[0, 3], 11, 21],
                    8 : [[0, 3], 11, [22, 28], 81],
                    10 : [[0, 4], [21, 24]],
                    11 : [[0, 3], 22, [24, 26], 81, 82],
                    12 : [[0, 4], 21, 22, 25, 26, 82],
                    13 : [[0, 2], [21, 24]],
                    14 : [[0, 2], [21, 24]],
                    15 : [[0, 3], [21, 25]],
                    16 : [[0, 2], [21, 23]],
                    17 : [[0, 2], [21, 23]],
                    18 : [[0, 2], [21, 25], 81]
                },
                35 : {
                    0 : [0],
                    1 : [[0, 5], 11, [21, 25], 28, 81, 82],
                    2 : [[0, 6], [11, 13]],
                    3 : [[0, 5], 22],
                    4 : [[0, 3], 21, [23, 30], 81],
                    5 : [[0, 5], 21, [24, 27], [81, 83]],
                    6 : [[0, 3], [22, 29], 81],
                    7 : [[0, 2], [21, 25], [81, 84]],
                    8 : [[0, 2], [21, 25], 81],
                    9 : [[0, 2], [21, 26], 81, 82]
                },
                36 : {
                    0 : [0],
                    1 : [[0, 5], 11, [21, 24]],
                    2 : [[0, 3], 22, 81],
                    3 : [[0, 2], 13, [21, 23]],
                    4 : [[0, 3], 21, [23, 30], 81, 82],
                    5 : [[0, 2], 21],
                    6 : [[0, 2], 22, 81],
                    7 : [[0, 2], [21, 35], 81, 82],
                    8 : [[0, 3], [21, 30], 81],
                    9 : [[0, 2], [21, 26], [81, 83]],
                    10 : [[0, 2], [21, 30]],
                    11 : [[0, 2], [21, 30], 81]
                },
                37 : {
                    0 : [0],
                    1 : [[0, 5], 12, 13, [24, 26], 81],
                    2 : [[0, 3], 5, [11, 14], [81, 85]],
                    3 : [[0, 6], [21, 23]],
                    4 : [[0, 6], 81],
                    5 : [[0, 3], [21, 23]],
                    6 : [[0, 2], [11, 13], 34, [81, 87]],
                    7 : [[0, 5], 24, 25, [81, 86]],
                    8 : [[0, 2], 11, [26, 32], [81, 83]],
                    9 : [[0, 3], 11, 21, 23, 82, 83],
                    10 : [[0, 2], [81, 83]],
                    11 : [[0, 3], 21, 22],
                    12 : [[0, 3]],
                    13 : [[0, 2], 11, 12, [21, 29]],
                    14 : [[0, 2], [21, 28], 81, 82],
                    15 : [[0, 2], [21, 26], 81],
                    16 : [[0, 2], [21, 26]],
                    17 : [[0, 2], [21, 28]]
                },
                41 : {
                    0 : [0],
                    1 : [[0, 6], 8, 22, [81, 85]],
                    2 : [[0, 5], 11, [21, 25]],
                    3 : [[0, 7], 11, [22, 29], 81],
                    4 : [[0, 4], 11, [21, 23], 25, 81, 82],
                    5 : [[0, 3], 5, 6, 22, 23, 26, 27, 81],
                    6 : [[0, 3], 11, 21, 22],
                    7 : [[0, 4], 11, 21, [24, 28], 81, 82],
                    8 : [[0, 4], 11, [21, 23], 25, [81, 83]],
                    9 : [[0, 2], 22, 23, [26, 28]],
                    10 : [[0, 2], [23, 25], 81, 82],
                    11 : [[0, 4], [21, 23]],
                    12 : [[0, 2], 21, 22, 24, 81, 82],
                    13 : [[0, 3], [21, 30], 81],
                    14 : [[0, 3], [21, 26], 81],
                    15 : [[0, 3], [21, 28]],
                    16 : [[0, 2], [21, 28], 81],
                    17 : [[0, 2], [21, 29]],
                    90 : [0, 1]
                },
                42 : {
                    0 : [0],
                    1 : [[0, 7], [11, 17]],
                    2 : [[0, 5], 22, 81],
                    3 : [[0, 3], [21, 25], 81],
                    5 : [[0, 6], [25, 29], [81, 83]],
                    6 : [[0, 2], 6, 7, [24, 26], [82, 84]],
                    7 : [[0, 4]],
                    8 : [[0, 2], 4, 21, 22, 81],
                    9 : [[0, 2], [21, 23], 81, 82, 84],
                    10 : [[0, 3], [22, 24], 81, 83, 87],
                    11 : [[0, 2], [21, 27], 81, 82],
                    12 : [[0, 2], [21, 24], 81],
                    13 : [[0, 3], 21, 81],
                    28 : [[0, 2], 22, 23, [25, 28]],
                    90 : [0, [4, 6], 21]
                },
                43 : {
                    0 : [0],
                    1 : [[0, 5], 11, 12, 21, 22, 24, 81],
                    2 : [[0, 4], 11, 21, [23, 25], 81],
                    3 : [[0, 2], 4, 21, 81, 82],
                    4 : [0, 1, [5, 8], 12, [21, 24], 26, 81, 82],
                    5 : [[0, 3], 11, [21, 25], [27, 29], 81],
                    6 : [[0, 3], 11, 21, 23, 24, 26, 81, 82],
                    7 : [[0, 3], [21, 26], 81],
                    8 : [[0, 2], 11, 21, 22],
                    9 : [[0, 3], [21, 23], 81],
                    10 : [[0, 3], [21, 28], 81],
                    11 : [[0, 3], [21, 29]],
                    12 : [[0, 2], [21, 30], 81],
                    13 : [[0, 2], 21, 22, 81, 82],
                    31 : [0, 1, [22, 27], 30]
                },
                44 : {
                    0 : [0],
                    1 : [[0, 7], [11, 16], 83, 84],
                    2 : [[0, 5], 21, 22, 24, 29, 32, 33, 81, 82],
                    3 : [0, 1, [3, 8]],
                    4 : [[0, 4]],
                    5 : [0, 1, [6, 15], 23, 82, 83],
                    6 : [0, 1, [4, 8]],
                    7 : [0, 1, [3, 5], 81, [83, 85]],
                    8 : [[0, 4], 11, 23, 25, [81, 83]],
                    9 : [[0, 3], 23, [81, 83]],
                    12 : [[0, 3], [23, 26], 83, 84],
                    13 : [[0, 3], [22, 24], 81],
                    14 : [[0, 2], [21, 24], 26, 27, 81],
                    15 : [[0, 2], 21, 23, 81],
                    16 : [[0, 2], [21, 25]],
                    17 : [[0, 2], 21, 23, 81],
                    18 : [[0, 3], 21, 23, [25, 27], 81, 82],
                    19 : [0],
                    20 : [0],
                    51 : [[0, 3], 21, 22],
                    52 : [[0, 3], 21, 22, 24, 81],
                    53 : [[0, 2], [21, 23], 81]
                },
                45 : {
                    0 : [0],
                    1 : [[0, 9], [21, 27]],
                    2 : [[0, 5], [21, 26]],
                    3 : [[0, 5], 11, 12, [21, 32]],
                    4 : [0, 1, [3, 6], 11, [21, 23], 81],
                    5 : [[0, 3], 12, 21],
                    6 : [[0, 3], 21, 81],
                    7 : [[0, 3], 21, 22],
                    8 : [[0, 4], 21, 81],
                    9 : [[0, 3], [21, 24], 81],
                    10 : [[0, 2], [21, 31]],
                    11 : [[0, 2], [21, 23]],
                    12 : [[0, 2], [21, 29], 81],
                    13 : [[0, 2], [21, 24], 81],
                    14 : [[0, 2], [21, 25], 81]
                },
                46 : {
                    0 : [0],
                    1 : [0, 1, [5, 8]],
                    2 : [0, 1],
                    3 : [0, [21, 23]],
                    90 : [[0, 3], [5, 7], [21, 39]]
                },
                50 : {
                    0 : [0],
                    1 : [[0, 19]],
                    2 : [0, [22, 38], [40, 43]],
                    3 : [0, [81, 84]]
                },
                51 : {
                    0 : [0],
                    1 : [0, 1, [4, 8], [12, 15], [21, 24], 29, 31, 32, [81, 84]],
                    3 : [[0, 4], 11, 21, 22],
                    4 : [[0, 3], 11, 21, 22],
                    5 : [[0, 4], 21, 22, 24, 25],
                    6 : [0, 1, 3, 23, 26, [81, 83]],
                    7 : [0, 1, 3, 4, [22, 27], 81],
                    8 : [[0, 2], 11, 12, [21, 24]],
                    9 : [[0, 4], [21, 23]],
                    10 : [[0, 2], 11, 24, 25, 28],
                    11 : [[0, 2], [11, 13], 23, 24, 26, 29, 32, 33, 81],
                    13 : [[0, 4], [21, 25], 81],
                    14 : [[0, 2], [21, 25]],
                    15 : [[0, 3], [21, 29]],
                    16 : [[0, 3], [21, 23], 81],
                    17 : [[0, 3], [21, 25], 81],
                    18 : [[0, 3], [21, 27]],
                    19 : [[0, 3], [21, 23]],
                    20 : [[0, 2], 21, 22, 81],
                    32 : [0, [21, 33]],
                    33 : [0, [21, 38]],
                    34 : [0, 1, [22, 37]]
                },
                52 : {
                    0 : [0],
                    1 : [[0, 3], [11, 15], [21, 23], 81],
                    2 : [0, 1, 3, 21, 22],
                    3 : [[0, 3], [21, 30], 81, 82],
                    4 : [[0, 2], [21, 25]],
                    5 : [[0, 2], [21, 27]],
                    6 : [[0, 3], [21, 28]],
                    22 : [0, 1, [22, 30]],
                    23 : [0, 1, [22, 28]],
                    24 : [0, 1, [22, 28]],
                    26 : [0, 1, [22, 36]],
                    27 : [[0, 2], 22, 23, [25, 32]]
                },
                53 : {
                    0 : [0],
                    1 : [[0, 3], [11, 14], 21, 22, [24, 29], 81],
                    3 : [[0, 2], [21, 26], 28, 81],
                    4 : [[0, 2], [21, 28]],
                    5 : [[0, 2], [21, 24]],
                    6 : [[0, 2], [21, 30]],
                    7 : [[0, 2], [21, 24]],
                    8 : [[0, 2], [21, 29]],
                    9 : [[0, 2], [21, 27]],
                    23 : [0, 1, [22, 29], 31],
                    25 : [[0, 4], [22, 32]],
                    26 : [0, 1, [21, 28]],
                    27 : [0, 1, [22, 30]],
                    28 : [0, 1, 22, 23],
                    29 : [0, 1, [22, 32]],
                    31 : [0, 2, 3, [22, 24]],
                    34 : [0, [21, 23]],
                    33 : [0, 21, [23, 25]],
                    35 : [0, [21, 28]]
                },
                54 : {
                    0 : [0],
                    1 : [[0, 2], [21, 27]],
                    21 : [0, [21, 29], 32, 33],
                    22 : [0, [21, 29], [31, 33]],
                    23 : [0, 1, [22, 38]],
                    24 : [0, [21, 31]],
                    25 : [0, [21, 27]],
                    26 : [0, [21, 27]]
                },
                61 : {
                    0 : [0],
                    1 : [[0, 4], [11, 16], 22, [24, 26]],
                    2 : [[0, 4], 22],
                    3 : [[0, 4], [21, 24], [26, 31]],
                    4 : [[0, 4], [22, 31], 81],
                    5 : [[0, 2], [21, 28], 81, 82],
                    6 : [[0, 2], [21, 32]],
                    7 : [[0, 2], [21, 30]],
                    8 : [[0, 2], [21, 31]],
                    9 : [[0, 2], [21, 29]],
                    10 : [[0, 2], [21, 26]]
                },
                62 : {
                    0 : [0],
                    1 : [[0, 5], 11, [21, 23]],
                    2 : [0, 1],
                    3 : [[0, 2], 21],
                    4 : [[0, 3], [21, 23]],
                    5 : [[0, 3], [21, 25]],
                    6 : [[0, 2], [21, 23]],
                    7 : [[0, 2], [21, 25]],
                    8 : [[0, 2], [21, 26]],
                    9 : [[0, 2], [21, 24], 81, 82],
                    10 : [[0, 2], [21, 27]],
                    11 : [[0, 2], [21, 26]],
                    12 : [[0, 2], [21, 28]],
                    24 : [0, 21, [24, 29]],
                    26 : [0, 21, [23, 30]],
                    29 : [0, 1, [21, 27]],
                    30 : [0, 1, [21, 27]]
                },
                63 : {
                    0 : [0],
                    1 : [[0, 5], [21, 23]],
                    2 : [0, 2, [21, 25]],
                    21 : [0, [21, 23], [26, 28]],
                    22 : [0, [21, 24]],
                    23 : [0, [21, 24]],
                    25 : [0, [21, 25]],
                    26 : [0, [21, 26]],
                    27 : [0, 1, [21, 26]],
                    28 : [[0, 2], [21, 23]]
                },
                64 : {
                    0 : [0],
                    1 : [0, 1, [4, 6], 21, 22, 81],
                    2 : [[0, 3], 5, [21, 23]],
                    3 : [[0, 3], [21, 24], 81],
                    4 : [[0, 2], [21, 25]],
                    5 : [[0, 2], 21, 22]
                },
                65 : {
                    0 : [0],
                    1 : [[0, 9], 21],
                    2 : [[0, 5]],
                    21 : [0, 1, 22, 23],
                    22 : [0, 1, 22, 23],
                    23 : [[0, 3], [23, 25], 27, 28],
                    28 : [0, 1, [22, 29]],
                    29 : [0, 1, [22, 29]],
                    30 : [0, 1, [22, 24]],
                    31 : [0, 1, [21, 31]],
                    32 : [0, 1, [21, 27]],
                    40 : [0, 2, 3, [21, 28]],
                    42 : [[0, 2], 21, [23, 26]],
                    43 : [0, 1, [21, 26]],
                    90 : [[0, 4]],
                    27 : [[0, 2], 22, 23]
                },
                71 : {
                    0 : [0]
                },
                81 : {
                    0 : [0]
                },
                82 : {
                    0 : [0]
                }
            },
            d = parseInt(b.substr(0, 2), 10),
            e = parseInt(b.substr(2, 2), 10),
            f = parseInt(b.substr(4, 2), 10);
            if (!c[d] || !c[d][e]) return ! 1;
            for (var g = !1,
            h = c[d][e], i = 0; i < h.length; i++) if (a.isArray(h[i]) && h[i][0] <= f && f <= h[i][1] || !a.isArray(h[i]) && f === h[i]) {
                g = !0;
                break
            }
            if (!g) return ! 1;
            var j;
            j = 18 === b.length ? b.substr(6, 8) : "19" + b.substr(6, 6);
            var k = parseInt(j.substr(0, 4), 10),
            l = parseInt(j.substr(4, 2), 10),
            m = parseInt(j.substr(6, 2), 10);
            if (!a.fn.bootstrapValidator.helpers.date(k, l, m)) return ! 1;
            if (18 === b.length) {
                var n = 0,
                o = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                for (i = 0; 17 > i; i++) n += parseInt(b.charAt(i), 10) * o[i];
                n = (12 - n % 11) % 11;
                var p = "X" !== b.charAt(17).toUpperCase() ? parseInt(b.charAt(17), 10) : 10;
                return p === n
            }
            return ! 0
        },
        _cz: function(b) {
            if (!/^\d{9,10}$/.test(b)) return ! 1;
            var c = 1900 + parseInt(b.substr(0, 2), 10),
            d = parseInt(b.substr(2, 2), 10) % 50 % 20,
            e = parseInt(b.substr(4, 2), 10);
            if (9 === b.length) {
                if (c >= 1980 && (c -= 100), c > 1953) return ! 1
            } else 1954 > c && (c += 100);
            if (!a.fn.bootstrapValidator.helpers.date(c, d, e)) return ! 1;
            if (10 === b.length) {
                var f = parseInt(b.substr(0, 9), 10) % 11;
                return 1985 > c && (f %= 10),
                f + "" === b.substr(9, 1)
            }
            return ! 0
        },
        _dk: function(b) {
            if (!/^[0-9]{6}[-]{0,1}[0-9]{4}$/.test(b)) return ! 1;
            b = b.replace(/-/g, "");
            var c = parseInt(b.substr(0, 2), 10),
            d = parseInt(b.substr(2, 2), 10),
            e = parseInt(b.substr(4, 2), 10);
            switch (!0) {
            case - 1 !== "5678".indexOf(b.charAt(6)) && e >= 58 : e += 1800;
                break;
            case - 1 !== "0123".indexOf(b.charAt(6)) : case - 1 !== "49".indexOf(b.charAt(6)) && e >= 37 : e += 1900;
                break;
            default:
                e += 2e3
            }
            return a.fn.bootstrapValidator.helpers.date(e, d, c)
        },
        _ee: function(a) {
            return this._lt(a)
        },
        _es: function(a) {
            if (!/^[0-9A-Z]{8}[-]{0,1}[0-9A-Z]$/.test(a) && !/^[XYZ][-]{0,1}[0-9]{7}[-]{0,1}[0-9A-Z]$/.test(a)) return ! 1;
            a = a.replace(/-/g, "");
            var b = "XYZ".indexOf(a.charAt(0)); - 1 !== b && (a = b + a.substr(1) + "");
            var c = parseInt(a.substr(0, 8), 10);
            return c = "TRWAGMYFPDXBNJZSQVHLCKE" [c % 23],
            c === a.substr(8, 1)
        },
        _fi: function(b) {
            if (!/^[0-9]{6}[-+A][0-9]{3}[0-9ABCDEFHJKLMNPRSTUVWXY]$/.test(b)) return ! 1;
            var c = parseInt(b.substr(0, 2), 10),
            d = parseInt(b.substr(2, 2), 10),
            e = parseInt(b.substr(4, 2), 10),
            f = {
                "+": 1800,
                "-": 1900,
                A: 2e3
            };
            if (e = f[b.charAt(6)] + e, !a.fn.bootstrapValidator.helpers.date(e, d, c)) return ! 1;
            var g = parseInt(b.substr(7, 3), 10);
            if (2 > g) return ! 1;
            var h = b.substr(0, 6) + b.substr(7, 3) + "";
            return h = parseInt(h, 10),
            "0123456789ABCDEFHJKLMNPRSTUVWXY".charAt(h % 31) === b.charAt(10)
        },
        _hr: function(b) {
            return /^[0-9]{11}$/.test(b) ? a.fn.bootstrapValidator.helpers.mod11And10(b) : !1
        },
        _ie: function(a) {
            if (!/^\d{7}[A-W][AHWTX]?$/.test(a)) return ! 1;
            var b = function(a) {
                for (; a.length < 7;) a = "0" + a;
                for (var b = "WABCDEFGHIJKLMNOPQRSTUV",
                c = 0,
                d = 0; 7 > d; d++) c += parseInt(a.charAt(d), 10) * (8 - d);
                return c += 9 * b.indexOf(a.substr(7)),
                b[c % 23]
            };
            return 9 !== a.length || "A" !== a.charAt(8) && "H" !== a.charAt(8) ? a.charAt(7) === b(a.substr(0, 7)) : a.charAt(7) === b(a.substr(0, 7) + a.substr(8) + "")
        },
        _is: function(b) {
            if (!/^[0-9]{6}[-]{0,1}[0-9]{4}$/.test(b)) return ! 1;
            b = b.replace(/-/g, "");
            var c = parseInt(b.substr(0, 2), 10),
            d = parseInt(b.substr(2, 2), 10),
            e = parseInt(b.substr(4, 2), 10),
            f = parseInt(b.charAt(9), 10);
            if (e = 9 === f ? 1900 + e: 100 * (20 + f) + e, !a.fn.bootstrapValidator.helpers.date(e, d, c, !0)) return ! 1;
            for (var g = 0,
            h = [3, 2, 7, 6, 5, 4, 3, 2], i = 0; 8 > i; i++) g += parseInt(b.charAt(i), 10) * h[i];
            return g = 11 - g % 11,
            g + "" === b.charAt(8)
        },
        _lt: function(b) {
            if (!/^[0-9]{11}$/.test(b)) return ! 1;
            var c = parseInt(b.charAt(0), 10),
            d = parseInt(b.substr(1, 2), 10),
            e = parseInt(b.substr(3, 2), 10),
            f = parseInt(b.substr(5, 2), 10),
            g = c % 2 === 0 ? 17 + c / 2 : 17 + (c + 1) / 2;
            if (d = 100 * g + d, !a.fn.bootstrapValidator.helpers.date(d, e, f, !0)) return ! 1;
            for (var h = 0,
            i = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1], j = 0; 10 > j; j++) h += parseInt(b.charAt(j), 10) * i[j];
            if (h %= 11, 10 !== h) return h + "" === b.charAt(10);
            for (h = 0, i = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3], j = 0; 10 > j; j++) h += parseInt(b.charAt(j), 10) * i[j];
            return h %= 11,
            10 === h && (h = 0),
            h + "" === b.charAt(10)
        },
        _lv: function(b) {
            if (!/^[0-9]{6}[-]{0,1}[0-9]{5}$/.test(b)) return ! 1;
            b = b.replace(/\D/g, "");
            var c = parseInt(b.substr(0, 2), 10),
            d = parseInt(b.substr(2, 2), 10),
            e = parseInt(b.substr(4, 2), 10);
            if (e = e + 1800 + 100 * parseInt(b.charAt(6), 10), !a.fn.bootstrapValidator.helpers.date(e, d, c, !0)) return ! 1;
            for (var f = 0,
            g = [10, 5, 8, 4, 2, 1, 6, 3, 7, 9], h = 0; 10 > h; h++) f += parseInt(b.charAt(h), 10) * g[h];
            return f = (f + 1) % 11 % 10,
            f + "" === b.charAt(10)
        },
        _nl: function(a) {
            for (; a.length < 9;) a = "0" + a;
            if (!/^[0-9]{4}[.]{0,1}[0-9]{2}[.]{0,1}[0-9]{3}$/.test(a)) return ! 1;
            if (a = a.replace(/\./g, ""), 0 === parseInt(a, 10)) return ! 1;
            for (var b = 0,
            c = a.length,
            d = 0; c - 1 > d; d++) b += (9 - d) * parseInt(a.charAt(d), 10);
            return b %= 11,
            10 === b && (b = 0),
            b + "" === a.charAt(c - 1)
        },
        _ro: function(b) {
            if (!/^[0-9]{13}$/.test(b)) return ! 1;
            var c = parseInt(b.charAt(0), 10);
            if (0 === c || 7 === c || 8 === c) return ! 1;
            var d = parseInt(b.substr(1, 2), 10),
            e = parseInt(b.substr(3, 2), 10),
            f = parseInt(b.substr(5, 2), 10),
            g = {
                1 : 1900,
                2 : 1900,
                3 : 1800,
                4 : 1800,
                5 : 2e3,
                6 : 2e3
            };
            if (f > 31 && e > 12) return ! 1;
            if (9 !== c && (d = g[c + ""] + d, !a.fn.bootstrapValidator.helpers.date(d, e, f))) return ! 1;
            for (var h = 0,
            i = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9], j = b.length, k = 0; j - 1 > k; k++) h += parseInt(b.charAt(k), 10) * i[k];
            return h %= 11,
            10 === h && (h = 1),
            h + "" === b.charAt(j - 1)
        },
        _se: function(b) {
            if (!/^[0-9]{10}$/.test(b) && !/^[0-9]{6}[-|+][0-9]{4}$/.test(b)) return ! 1;
            b = b.replace(/[^0-9]/g, "");
            var c = parseInt(b.substr(0, 2), 10) + 1900,
            d = parseInt(b.substr(2, 2), 10),
            e = parseInt(b.substr(4, 2), 10);
            return a.fn.bootstrapValidator.helpers.date(c, d, e) ? a.fn.bootstrapValidator.helpers.luhn(b) : !1
        },
        _sk: function(a) {
            return this._cz(a)
        },
        _sm: function(a) {
            return /^\d{5}$/.test(a)
        },
        _th: function(a) {
            if (13 !== a.length) return ! 1;
            for (var b = 0,
            c = 0; 12 > c; c++) b += parseInt(a.charAt(c), 10) * (13 - c);
            return (11 - b % 11) % 10 === parseInt(a.charAt(12), 10)
        },
        _za: function(b) {
            if (!/^[0-9]{10}[0|1][8|9][0-9]$/.test(b)) return ! 1;
            var c = parseInt(b.substr(0, 2), 10),
            d = (new Date).getFullYear() % 100,
            e = parseInt(b.substr(2, 2), 10),
            f = parseInt(b.substr(4, 2), 10);
            return c = c >= d ? c + 1900 : c + 2e3,
            a.fn.bootstrapValidator.helpers.date(c, e, f) ? a.fn.bootstrapValidator.helpers.luhn(b) : !1
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.identical = a.extend(a.fn.bootstrapValidator.i18n.identical || {},
    {
        "default": "Please enter the same value"
    }),
    a.fn.bootstrapValidator.validators.identical = {
        html5Attributes: {
            message: "message",
            field: "field"
        },
        validate: function(a, b, c) {
            var d = b.val();
            if ("" === d) return ! 0;
            var e = a.getFieldElements(c.field);
            return null === e || 0 === e.length ? !0 : d === e.val() ? (a.updateStatus(c.field, a.STATUS_VALID, "identical"), !0) : !1
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.imei = a.extend(a.fn.bootstrapValidator.i18n.imei || {},
    {
        "default": "Please enter a valid IMEI number"
    }),
    a.fn.bootstrapValidator.validators.imei = {
        validate: function(b, c) {
            var d = c.val();
            if ("" === d) return ! 0;
            switch (!0) {
            case / ^\d {
                    15
                }
                $ / .test(d) : case / ^\d {
                    2
                } - \d {
                    6
                } - \d {
                    6
                } - \d {
                    1
                }
                $ / .test(d) : case / ^\d {
                    2
                }\s\d {
                    6
                }\s\d {
                    6
                }\s\d {
                    1
                }
                $ / .test(d) : return d = d.replace(/[^0-9]/g, ""),
                a.fn.bootstrapValidator.helpers.luhn(d);
            case / ^\d {
                    14
                }
                $ / .test(d) : case / ^\d {
                    16
                }
                $ / .test(d) : case / ^\d {
                    2
                } - \d {
                    6
                } - \d {
                    6
                } ( | -\d {
                    2
                }) $ / .test(d) : case / ^\d {
                    2
                }\s\d {
                    6
                }\s\d {
                    6
                } ( | \s\d {
                    2
                }) $ / .test(d) : return ! 0;
            default:
                return ! 1
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.imo = a.extend(a.fn.bootstrapValidator.i18n.imo || {},
    {
        "default": "Please enter a valid IMO number"
    }),
    a.fn.bootstrapValidator.validators.imo = {
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            if (!/^IMO \d{7}$/i.test(c)) return ! 1;
            for (var d = 0,
            e = c.replace(/^.*(\d{7})$/, "$1"), f = 6; f >= 1; f--) d += e.slice(6 - f, -f) * (f + 1);
            return d % 10 === parseInt(e.charAt(6), 10)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.integer = a.extend(a.fn.bootstrapValidator.i18n.integer || {},
    {
        "default": "Please enter a valid number"
    }),
    a.fn.bootstrapValidator.validators.integer = {
        enableByHtml5: function(a) {
            return "number" === a.attr("type") && (void 0 === a.attr("step") || a.attr("step") % 1 === 0)
        },
        validate: function(a, b) {
            if (this.enableByHtml5(b) && b.get(0).validity && b.get(0).validity.badInput === !0) return ! 1;
            var c = b.val();
            return "" === c ? !0 : /^(?:-?(?:0|[1-9][0-9]*))$/.test(c)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.ip = a.extend(a.fn.bootstrapValidator.i18n.ip || {},
    {
        "default": "Please enter a valid IP address",
        ipv4: "Please enter a valid IPv4 address",
        ipv6: "Please enter a valid IPv6 address"
    }),
    a.fn.bootstrapValidator.validators.ip = {
        html5Attributes: {
            message: "message",
            ipv4: "ipv4",
            ipv6: "ipv6"
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            d = a.extend({},
            {
                ipv4: !0,
                ipv6: !0
            },
            d);
            var f, g = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            h = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
            i = !1;
            switch (!0) {
            case d.ipv4 && !d.ipv6: i = g.test(e),
                f = d.message || a.fn.bootstrapValidator.i18n.ip.ipv4;
                break;
            case ! d.ipv4 && d.ipv6: i = h.test(e),
                f = d.message || a.fn.bootstrapValidator.i18n.ip.ipv6;
                break;
            case d.ipv4 && d.ipv6: default:
                i = g.test(e) || h.test(e),
                f = d.message || a.fn.bootstrapValidator.i18n.ip["default"]
            }
            return {
                valid: i,
                message: f
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.isbn = a.extend(a.fn.bootstrapValidator.i18n.isbn || {},
    {
        "default": "Please enter a valid ISBN number"
    }),
    a.fn.bootstrapValidator.validators.isbn = {
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            var d;
            switch (!0) {
            case / ^\d {
                    9
                } [\dX] $ / .test(c) : case 13 === c.length && /^(\d+)-(\d+)-(\d+)-([\dX])$/.test(c) : case 13 === c.length && /^(\d+)\s(\d+)\s(\d+)\s([\dX])$/.test(c) : d = "ISBN10";
                break;
            case / ^ (978 | 979)\d {
                    9
                } [\dX] $ / .test(c) : case 17 === c.length && /^(978|979)-(\d+)-(\d+)-(\d+)-([\dX])$/.test(c) : case 17 === c.length && /^(978|979)\s(\d+)\s(\d+)\s(\d+)\s([\dX])$/.test(c) : d = "ISBN13";
                break;
            default:
                return ! 1
            }
            c = c.replace(/[^0-9X]/gi, "");
            var e, f, g = c.split(""),
            h = g.length,
            i = 0;
            switch (d) {
            case "ISBN10":
                for (i = 0, e = 0; h - 1 > e; e++) i += parseInt(g[e], 10) * (10 - e);
                return f = 11 - i % 11,
                11 === f ? f = 0 : 10 === f && (f = "X"),
                f + "" === g[h - 1];
            case "ISBN13":
                for (i = 0, e = 0; h - 1 > e; e++) i += e % 2 === 0 ? parseInt(g[e], 10) : 3 * parseInt(g[e], 10);
                return f = 10 - i % 10,
                10 === f && (f = "0"),
                f + "" === g[h - 1];
            default:
                return ! 1
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.isin = a.extend(a.fn.bootstrapValidator.i18n.isin || {},
    {
        "default": "Please enter a valid ISIN number"
    }),
    a.fn.bootstrapValidator.validators.isin = {
        COUNTRY_CODES: "AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW",
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            c = c.toUpperCase();
            var d = new RegExp("^(" + this.COUNTRY_CODES + ")[0-9A-Z]{10}$");
            if (!d.test(c)) return ! 1;
            for (var e = "",
            f = c.length,
            g = 0; f - 1 > g; g++) {
                var h = c.charCodeAt(g);
                e += h > 57 ? (h - 55).toString() : c.charAt(g)
            }
            var i = "",
            j = e.length,
            k = j % 2 !== 0 ? 0 : 1;
            for (g = 0; j > g; g++) i += parseInt(e[g], 10) * (g % 2 === k ? 2 : 1) + "";
            var l = 0;
            for (g = 0; g < i.length; g++) l += parseInt(i.charAt(g), 10);
            return l = (10 - l % 10) % 10,
            l + "" === c.charAt(f - 1)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.ismn = a.extend(a.fn.bootstrapValidator.i18n.ismn || {},
    {
        "default": "Please enter a valid ISMN number"
    }),
    a.fn.bootstrapValidator.validators.ismn = {
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            var d;
            switch (!0) {
            case / ^M\d {
                    9
                }
                $ / .test(c) : case / ^M - \d {
                    4
                } - \d {
                    4
                } - \d {
                    1
                }
                $ / .test(c) : case / ^M\s\d {
                    4
                }\s\d {
                    4
                }\s\d {
                    1
                }
                $ / .test(c) : d = "ISMN10";
                break;
            case / ^9790\d {
                    9
                }
                $ / .test(c) : case / ^979 - 0 - \d {
                    4
                } - \d {
                    4
                } - \d {
                    1
                }
                $ / .test(c) : case / ^979\s0\s\d {
                    4
                }\s\d {
                    4
                }\s\d {
                    1
                }
                $ / .test(c) : d = "ISMN13";
                break;
            default:
                return ! 1
            }
            "ISMN10" === d && (c = "9790" + c.substr(1)),
            c = c.replace(/[^0-9]/gi, "");
            for (var e = c.length,
            f = 0,
            g = [1, 3], h = 0; e - 1 > h; h++) f += parseInt(c.charAt(h), 10) * g[h % 2];
            return f = 10 - f % 10,
            f + "" === c.charAt(e - 1)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.issn = a.extend(a.fn.bootstrapValidator.i18n.issn || {},
    {
        "default": "Please enter a valid ISSN number"
    }),
    a.fn.bootstrapValidator.validators.issn = {
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            if (!/^\d{4}\-\d{3}[\dX]$/.test(c)) return ! 1;
            c = c.replace(/[^0-9X]/gi, "");
            var d = c.split(""),
            e = d.length,
            f = 0;
            "X" === d[7] && (d[7] = 10);
            for (var g = 0; e > g; g++) f += parseInt(d[g], 10) * (8 - g);
            return f % 11 === 0
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.lessThan = a.extend(a.fn.bootstrapValidator.i18n.lessThan || {},
    {
        "default": "Please enter a value less than or equal to %s",
        notInclusive: "Please enter a value less than %s"
    }),
    a.fn.bootstrapValidator.validators.lessThan = {
        html5Attributes: {
            message: "message",
            value: "value",
            inclusive: "inclusive"
        },
        enableByHtml5: function(a) {
            var b = a.attr("type"),
            c = a.attr("max");
            return c && "date" !== b ? {
                value: c
            }: !1
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            if (!a.isNumeric(e)) return ! 1;
            var f = a.isNumeric(d.value) ? d.value: b.getDynamicOption(c, d.value);
            return e = parseFloat(e),
            d.inclusive === !0 || void 0 === d.inclusive ? {
                valid: f >= e,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.lessThan["default"], f)
            }: {
                valid: f > e,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.lessThan.notInclusive, f)
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.mac = a.extend(a.fn.bootstrapValidator.i18n.mac || {},
    {
        "default": "Please enter a valid MAC address"
    }),
    a.fn.bootstrapValidator.validators.mac = {
        validate: function(a, b) {
            var c = b.val();
            return "" === c ? !0 : /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/.test(c)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.meid = a.extend(a.fn.bootstrapValidator.i18n.meid || {},
    {
        "default": "Please enter a valid MEID number"
    }),
    a.fn.bootstrapValidator.validators.meid = {
        validate: function(b, c) {
            var d = c.val();
            if ("" === d) return ! 0;
            switch (!0) {
            case / ^[0 - 9A - F] {
                    15
                }
                $ / i.test(d) : case / ^[0 - 9A - F] {
                    2
                } [ - ][0 - 9A - F] {
                    6
                } [ - ][0 - 9A - F] {
                    6
                } [ - ][0 - 9A - F] $ / i.test(d) : case / ^\d {
                    19
                }
                $ / .test(d) : case / ^\d {
                    5
                } [ - ]\d {
                    5
                } [ - ]\d {
                    4
                } [ - ]\d {
                    4
                } [ - ]\d$ / .test(d) : var e = d.charAt(d.length - 1);
                if (d = d.replace(/[- ]/g, ""), d.match(/^\d*$/i)) return a.fn.bootstrapValidator.helpers.luhn(d);
                d = d.slice(0, -1);
                for (var f = "",
                g = 1; 13 >= g; g += 2) f += (2 * parseInt(d.charAt(g), 16)).toString(16);
                var h = 0;
                for (g = 0; g < f.length; g++) h += parseInt(f.charAt(g), 16);
                return h % 10 === 0 ? "0" === e: e === (2 * (10 * Math.floor((h + 10) / 10) - h)).toString(16);
            case / ^[0 - 9A - F] {
                    14
                }
                $ / i.test(d) : case / ^[0 - 9A - F] {
                    2
                } [ - ][0 - 9A - F] {
                    6
                } [ - ][0 - 9A - F] {
                    6
                }
                $ / i.test(d) : case / ^\d {
                    18
                }
                $ / .test(d) : case / ^\d {
                    5
                } [ - ]\d {
                    5
                } [ - ]\d {
                    4
                } [ - ]\d {
                    4
                }
                $ / .test(d) : return ! 0;
            default:
                return ! 1
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.notEmpty = a.extend(a.fn.bootstrapValidator.i18n.notEmpty || {},
    {
        "default": "Please enter a value"
    }),
    a.fn.bootstrapValidator.validators.notEmpty = {
        enableByHtml5: function(a) {
            var b = a.attr("required") + "";
            return "required" === b || "true" === b
        },
        validate: function(b, c) {
            var d = c.attr("type");
            return "radio" === d || "checkbox" === d ? b.getFieldElements(c.attr("data-bv-field")).filter(":checked").length > 0 : "number" === d && c.get(0).validity && c.get(0).validity.badInput === !0 ? !0 : "" !== a.trim(c.val())
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.numeric = a.extend(a.fn.bootstrapValidator.i18n.numeric || {},
    {
        "default": "Please enter a valid float number"
    }),
    a.fn.bootstrapValidator.validators.numeric = {
        html5Attributes: {
            message: "message",
            separator: "separator"
        },
        enableByHtml5: function(a) {
            return "number" === a.attr("type") && void 0 !== a.attr("step") && a.attr("step") % 1 !== 0
        },
        validate: function(a, b, c) {
            if (this.enableByHtml5(b) && b.get(0).validity && b.get(0).validity.badInput === !0) return ! 1;
            var d = b.val();
            if ("" === d) return ! 0;
            var e = c.separator || ".";
            return "." !== e && (d = d.replace(e, ".")),
            !isNaN(parseFloat(d)) && isFinite(d)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.phone = a.extend(a.fn.bootstrapValidator.i18n.phone || {},
    {
        "default": "Please enter a valid phone number",
        countryNotSupported: "The country code %s is not supported",
        country: "Please enter a valid phone number in %s",
        countries: {
            BR: "Brazil",
            CN: "China",
            CZ: "Czech Republic",
            DK: "Denmark",
            ES: "Spain",
            FR: "France",
            GB: "United Kingdom",
            MA: "Morocco",
            PK: "Pakistan",
            RO: "Romania",
            RU: "Russia",
            SK: "Slovakia",
            TH: "Thailand",
            US: "USA",
            VE: "Venezuela"
        }
    }),
    a.fn.bootstrapValidator.validators.phone = {
        html5Attributes: {
            message: "message",
            country: "country"
        },
        COUNTRY_CODES: ["BR", "CN", "CZ", "DK", "ES", "FR", "GB", "MA", "PK", "RO", "RU", "SK", "TH", "US", "VE"],
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            var f = d.country;
            if (("string" != typeof f || -1 === a.inArray(f, this.COUNTRY_CODES)) && (f = b.getDynamicOption(c, f)), !f || -1 === a.inArray(f.toUpperCase(), this.COUNTRY_CODES)) return {
                valid: !1,
                message: a.fn.bootstrapValidator.helpers.format(a.fn.bootstrapValidator.i18n.phone.countryNotSupported, f)
            };
            var g = !0;
            switch (f.toUpperCase()) {
            case "BR":
                e = a.trim(e),
                g = /^(([\d]{4}[-.\s]{1}[\d]{2,3}[-.\s]{1}[\d]{2}[-.\s]{1}[\d]{2})|([\d]{4}[-.\s]{1}[\d]{3}[-.\s]{1}[\d]{4})|((\(?\+?[0-9]{2}\)?\s?)?(\(?\d{2}\)?\s?)?\d{4,5}[-.\s]?\d{4}))$/.test(e);
                break;
            case "CN":
                e = a.trim(e),
                g = /^((00|\+)?(86(?:-| )))?((\d{11})|(\d{3}[- ]{1}\d{4}[- ]{1}\d{4})|((\d{2,4}[- ]){1}(\d{7,8}|(\d{3,4}[- ]{1}\d{4}))([- ]{1}\d{1,4})?))$/.test(e);
                break;
            case "CZ":
                g = /^(((00)([- ]?)|\+)(420)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(e);
                break;
            case "DK":
                e = a.trim(e),
                g = /^(\+45|0045|\(45\))?\s?[2-9](\s?\d){7}$/.test(e);
                break;
            case "ES":
                e = a.trim(e),
                g = /^(?:(?:(?:\+|00)34\D?))?(?:9|6)(?:\d\D?){8}$/.test(e);
                break;
            case "FR":
                e = a.trim(e),
                g = /^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/.test(e);
                break;
            case "GB":
                e = a.trim(e),
                g = /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/.test(e);
                break;
            case "MA":
                e = a.trim(e),
                g = /^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\(0\)[\s]?)?)|0){1}(?:5[\s.-]?[2-3]|6[\s.-]?[13-9]){1}[0-9]{1}(?:[\s.-]?\d{2}){3}$/.test(e);
                break;
            case "PK":
                e = a.trim(e),
                g = /^0?3[0-9]{2}[0-9]{7}$/.test(e);
                break;
            case "RO":
                g = /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/g.test(e);
                break;
            case "RU":
                g = /^((8|\+7|007)[\-\.\/ ]?)?([\(\/\.]?\d{3}[\)\/\.]?[\-\.\/ ]?)?[\d\-\.\/ ]{7,10}$/g.test(e);
                break;
            case "SK":
                g = /^(((00)([- ]?)|\+)(420)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(e);
                break;
            case "TH":
                g = /^0\(?([6|8-9]{2})*-([0-9]{3})*-([0-9]{4})$/.test(e);
                break;
            case "VE":
                e = a.trim(e),
                g = /^0(?:2(?:12|4[0-9]|5[1-9]|6[0-9]|7[0-8]|8[1-35-8]|9[1-5]|3[45789])|4(?:1[246]|2[46]))\d{7}$/.test(e);
                break;
            case "US":
            default:
                e = e.replace(/\D/g, ""),
                g = /^(?:(1\-?)|(\+1 ?))?\(?(\d{3})[\)\-\.]?(\d{3})[\-\.]?(\d{4})$/.test(e) && 10 === e.length
            }
            return {
                valid: g,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.phone.country, a.fn.bootstrapValidator.i18n.phone.countries[f])
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.regexp = a.extend(a.fn.bootstrapValidator.i18n.regexp || {},
    {
        "default": "Please enter a value matching the pattern"
    }),
    a.fn.bootstrapValidator.validators.regexp = {
        html5Attributes: {
            message: "message",
            regexp: "regexp"
        },
        enableByHtml5: function(a) {
            var b = a.attr("pattern");
            return b ? {
                regexp: b
            }: !1
        },
        validate: function(a, b, c) {
            var d = b.val();
            if ("" === d) return ! 0;
            var e = "string" == typeof c.regexp ? new RegExp(c.regexp) : c.regexp;
            return e.test(d)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.remote = a.extend(a.fn.bootstrapValidator.i18n.remote || {},
    {
        "default": "Please enter a valid value"
    }),
    a.fn.bootstrapValidator.validators.remote = {
        html5Attributes: {
            message: "message",
            name: "name",
            type: "type",
            url: "url",
            delay: "delay"
        },
        destroy: function(a, b) {
            b.data("bv.remote.timer") && (clearTimeout(b.data("bv.remote.timer")), b.removeData("bv.remote.timer"))
        },
        validate: function(b, c, d) {
            function e() {
                var b = a.ajax({
                    type: k,
                    headers: l,
                    url: j,
                    dataType: "json",
                    data: i
                });
                return b.then(function(a) {
                    a.valid = a.valid === !0 || "true" === a.valid,
                    g.resolve(c, "remote", a)
                }),
                g.fail(function() {
                    b.abort()
                }),
                g
            }
            var f = c.val(),
            g = new a.Deferred;
            if ("" === f) return g.resolve(c, "remote", {
                valid: !0
            }),
            g;
            var h = c.attr("data-bv-field"),
            i = d.data || {},
            j = d.url,
            k = d.type || "GET",
            l = d.headers || {};
            return "function" == typeof i && (i = i.call(this, b)),
            "function" == typeof j && (j = j.call(this, b)),
            i[d.name || h] = f,
            d.delay ? (c.data("bv.remote.timer") && clearTimeout(c.data("bv.remote.timer")), c.data("bv.remote.timer", setTimeout(e, d.delay)), g) : e()
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.rtn = a.extend(a.fn.bootstrapValidator.i18n.rtn || {},
    {
        "default": "Please enter a valid RTN number"
    }),
    a.fn.bootstrapValidator.validators.rtn = {
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            if (!/^\d{9}$/.test(c)) return ! 1;
            for (var d = 0,
            e = 0; e < c.length; e += 3) d += 3 * parseInt(c.charAt(e), 10) + 7 * parseInt(c.charAt(e + 1), 10) + parseInt(c.charAt(e + 2), 10);
            return 0 !== d && d % 10 === 0
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.sedol = a.extend(a.fn.bootstrapValidator.i18n.sedol || {},
    {
        "default": "Please enter a valid SEDOL number"
    }),
    a.fn.bootstrapValidator.validators.sedol = {
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            if (c = c.toUpperCase(), !/^[0-9A-Z]{7}$/.test(c)) return ! 1;
            for (var d = 0,
            e = [1, 3, 1, 7, 3, 9, 1], f = c.length, g = 0; f - 1 > g; g++) d += e[g] * parseInt(c.charAt(g), 36);
            return d = (10 - d % 10) % 10,
            d + "" === c.charAt(f - 1)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.siren = a.extend(a.fn.bootstrapValidator.i18n.siren || {},
    {
        "default": "Please enter a valid SIREN number"
    }),
    a.fn.bootstrapValidator.validators.siren = {
        validate: function(b, c) {
            var d = c.val();
            return "" === d ? !0 : /^\d{9}$/.test(d) ? a.fn.bootstrapValidator.helpers.luhn(d) : !1
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.siret = a.extend(a.fn.bootstrapValidator.i18n.siret || {},
    {
        "default": "Please enter a valid SIRET number"
    }),
    a.fn.bootstrapValidator.validators.siret = {
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            for (var d, e = 0,
            f = c.length,
            g = 0; f > g; g++) d = parseInt(c.charAt(g), 10),
            g % 2 === 0 && (d = 2 * d, d > 9 && (d -= 9)),
            e += d;
            return e % 10 === 0
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.step = a.extend(a.fn.bootstrapValidator.i18n.step || {},
    {
        "default": "Please enter a valid step of %s"
    }),
    a.fn.bootstrapValidator.validators.step = {
        html5Attributes: {
            message: "message",
            base: "baseValue",
            step: "step"
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            if (d = a.extend({},
            {
                baseValue: 0,
                step: 1
            },
            d), e = parseFloat(e), !a.isNumeric(e)) return ! 1;
            var f = function(a, b) {
                var c = Math.pow(10, b);
                a *= c;
                var d = a > 0 | -(0 > a),
                e = a % 1 === .5 * d;
                return e ? (Math.floor(a) + (d > 0)) / c: Math.round(a) / c
            },
            g = function(a, b) {
                if (0 === b) return 1;
                var c = (a + "").split("."),
                d = (b + "").split("."),
                e = (1 === c.length ? 0 : c[1].length) + (1 === d.length ? 0 : d[1].length);
                return f(a - b * Math.floor(a / b), e)
            },
            h = g(e - d.baseValue, d.step);
            return {
                valid: 0 === h || h === d.step,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.step["default"], [d.step])
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.stringCase = a.extend(a.fn.bootstrapValidator.i18n.stringCase || {},
    {
        "default": "Please enter only lowercase characters",
        upper: "Please enter only uppercase characters"
    }),
    a.fn.bootstrapValidator.validators.stringCase = {
        html5Attributes: {
            message: "message",
            "case": "case"
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            var f = (d["case"] || "lower").toLowerCase();
            return {
                valid: "upper" === f ? e === e.toUpperCase() : e === e.toLowerCase(),
                message: d.message || ("upper" === f ? a.fn.bootstrapValidator.i18n.stringCase.upper: a.fn.bootstrapValidator.i18n.stringCase["default"])
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.stringLength = a.extend(a.fn.bootstrapValidator.i18n.stringLength || {},
    {
        "default": "Please enter a value with valid length",
        less: "Please enter less than %s characters",
        more: "Please enter more than %s characters",
        between: "Please enter value between %s and %s characters long"
    }),
    a.fn.bootstrapValidator.validators.stringLength = {
        html5Attributes: {
            message: "message",
            min: "min",
            max: "max"
        },
        enableByHtml5: function(b) {
            var c = {},
            d = b.attr("maxlength"),
            e = b.attr("minlength");
            return d && (c.max = parseInt(d, 10)),
            e && (c.min = parseInt(e, 10)),
            a.isEmptyObject(c) ? !1 : c
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            var f = a.isNumeric(d.min) ? d.min: b.getDynamicOption(c, d.min),
            g = a.isNumeric(d.max) ? d.max: b.getDynamicOption(c, d.max),
            h = e.length,
            i = !0,
            j = d.message || a.fn.bootstrapValidator.i18n.stringLength["default"];
            switch ((f && h < parseInt(f, 10) || g && h > parseInt(g, 10)) && (i = !1), !0) {
            case !! f && !!g: j = a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.stringLength.between, [parseInt(f, 10), parseInt(g, 10)]);
                break;
            case !! f: j = a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.stringLength.more, parseInt(f, 10));
                break;
            case !! g: j = a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.stringLength.less, parseInt(g, 10))
            }
            return {
                valid: i,
                message: j
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.uri = a.extend(a.fn.bootstrapValidator.i18n.uri || {},
    {
        "default": "Please enter a valid URI"
    }),
    a.fn.bootstrapValidator.validators.uri = {
        html5Attributes: {
            message: "message",
            allowlocal: "allowLocal",
            protocol: "protocol"
        },
        enableByHtml5: function(a) {
            return "url" === a.attr("type")
        },
        validate: function(a, b, c) {
            var d = b.val();
            if ("" === d) return ! 0;
            var e = c.allowLocal === !0 || "true" === c.allowLocal,
            f = (c.protocol || "http, https, ftp").split(",").join("|").replace(/\s/g, ""),
            g = new RegExp("^(?:(?:" + f + ")://)(?:\\S+(?::\\S*)?@)?(?:" + (e ? "": "(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})") + "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + (e ? "?": "") + ")(?::\\d{2,5})?(?:/[^\\s]*)?$", "i");
            return g.test(d)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.uuid = a.extend(a.fn.bootstrapValidator.i18n.uuid || {},
    {
        "default": "Please enter a valid UUID number",
        version: "Please enter a valid UUID version %s number"
    }),
    a.fn.bootstrapValidator.validators.uuid = {
        html5Attributes: {
            message: "message",
            version: "version"
        },
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            var f = {
                3 : /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
                4 : /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
                5 : /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
                all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
            },
            g = d.version ? d.version + "": "all";
            return {
                valid: null === f[g] ? !0 : f[g].test(e),
                message: d.version ? a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.uuid.version, d.version) : d.message || a.fn.bootstrapValidator.i18n.uuid["default"]
            }
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.vat = a.extend(a.fn.bootstrapValidator.i18n.vat || {},
    {
        "default": "Please enter a valid VAT number",
        countryNotSupported: "The country code %s is not supported",
        country: "Please enter a valid VAT number in %s",
        countries: {
            AT: "Austria",
            BE: "Belgium",
            BG: "Bulgaria",
            BR: "Brazil",
            CH: "Switzerland",
            CY: "Cyprus",
            CZ: "Czech Republic",
            DE: "Germany",
            DK: "Denmark",
            EE: "Estonia",
            ES: "Spain",
            FI: "Finland",
            FR: "France",
            GB: "United Kingdom",
            GR: "Greek",
            EL: "Greek",
            HU: "Hungary",
            HR: "Croatia",
            IE: "Ireland",
            IS: "Iceland",
            IT: "Italy",
            LT: "Lithuania",
            LU: "Luxembourg",
            LV: "Latvia",
            MT: "Malta",
            NL: "Netherlands",
            NO: "Norway",
            PL: "Poland",
            PT: "Portugal",
            RO: "Romania",
            RU: "Russia",
            RS: "Serbia",
            SE: "Sweden",
            SI: "Slovenia",
            SK: "Slovakia",
            VE: "Venezuela",
            ZA: "South Africa"
        }
    }),
    a.fn.bootstrapValidator.validators.vat = {
        html5Attributes: {
            message: "message",
            country: "country"
        },
        COUNTRY_CODES: ["AT", "BE", "BG", "BR", "CH", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LT", "LU", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "RU", "RS", "SE", "SK", "SI", "VE", "ZA"],
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e) return ! 0;
            var f = d.country;
            if (f ? ("string" != typeof f || -1 === a.inArray(f.toUpperCase(), this.COUNTRY_CODES)) && (f = b.getDynamicOption(c, f)) : f = e.substr(0, 2), -1 === a.inArray(f, this.COUNTRY_CODES)) return {
                valid: !1,
                message: a.fn.bootstrapValidator.helpers.format(a.fn.bootstrapValidator.i18n.vat.countryNotSupported, f)
            };
            var g = ["_", f.toLowerCase()].join("");
            return this[g](e) ? !0 : {
                valid: !1,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.vat.country, a.fn.bootstrapValidator.i18n.vat.countries[f.toUpperCase()])
            }
        },
        _at: function(a) {
            if (/^ATU[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^U[0-9]{8}$/.test(a)) return ! 1;
            a = a.substr(1);
            for (var b = 0,
            c = [1, 2, 1, 2, 1, 2, 1], d = 0, e = 0; 7 > e; e++) d = parseInt(a.charAt(e), 10) * c[e],
            d > 9 && (d = Math.floor(d / 10) + d % 10),
            b += d;
            return b = 10 - (b + 4) % 10,
            10 === b && (b = 0),
            b + "" === a.substr(7, 1)
        },
        _be: function(a) {
            if (/^BE[0]{0,1}[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0]{0,1}[0-9]{9}$/.test(a)) return ! 1;
            if (9 === a.length && (a = "0" + a), "0" === a.substr(1, 1)) return ! 1;
            var b = parseInt(a.substr(0, 8), 10) + parseInt(a.substr(8, 2), 10);
            return b % 97 === 0
        },
        _bg: function(b) {
            if (/^BG[0-9]{9,10}$/.test(b) && (b = b.substr(2)), !/^[0-9]{9,10}$/.test(b)) return ! 1;
            var c = 0,
            d = 0;
            if (9 === b.length) {
                for (d = 0; 8 > d; d++) c += parseInt(b.charAt(d), 10) * (d + 1);
                if (c %= 11, 10 === c) for (c = 0, d = 0; 8 > d; d++) c += parseInt(b.charAt(d), 10) * (d + 3);
                return c %= 10,
                c + "" === b.substr(8)
            }
            if (10 === b.length) {
                var e = function(b) {
                    var c = parseInt(b.substr(0, 2), 10) + 1900,
                    d = parseInt(b.substr(2, 2), 10),
                    e = parseInt(b.substr(4, 2), 10);
                    if (d > 40 ? (c += 100, d -= 40) : d > 20 && (c -= 100, d -= 20), !a.fn.bootstrapValidator.helpers.date(c, d, e)) return ! 1;
                    for (var f = 0,
                    g = [2, 4, 8, 5, 10, 9, 7, 3, 6], h = 0; 9 > h; h++) f += parseInt(b.charAt(h), 10) * g[h];
                    return f = f % 11 % 10,
                    f + "" === b.substr(9, 1)
                },
                f = function(a) {
                    for (var b = 0,
                    c = [21, 19, 17, 13, 11, 9, 7, 3, 1], d = 0; 9 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
                    return b %= 10,
                    b + "" === a.substr(9, 1)
                },
                g = function(a) {
                    for (var b = 0,
                    c = [4, 3, 2, 7, 6, 5, 4, 3, 2], d = 0; 9 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
                    return b = 11 - b % 11,
                    10 === b ? !1 : (11 === b && (b = 0), b + "" === a.substr(9, 1))
                };
                return e(b) || f(b) || g(b)
            }
            return ! 1
        },
        _br: function(a) {
            if ("" === a) return ! 0;
            var b = a.replace(/[^\d]+/g, "");
            if ("" === b || 14 !== b.length) return ! 1;
            if ("00000000000000" === b || "11111111111111" === b || "22222222222222" === b || "33333333333333" === b || "44444444444444" === b || "55555555555555" === b || "66666666666666" === b || "77777777777777" === b || "88888888888888" === b || "99999999999999" === b) return ! 1;
            for (var c = b.length - 2,
            d = b.substring(0, c), e = b.substring(c), f = 0, g = c - 7, h = c; h >= 1; h--) f += parseInt(d.charAt(c - h), 10) * g--,
            2 > g && (g = 9);
            var i = 2 > f % 11 ? 0 : 11 - f % 11;
            if (i !== parseInt(e.charAt(0), 10)) return ! 1;
            for (c += 1, d = b.substring(0, c), f = 0, g = c - 7, h = c; h >= 1; h--) f += parseInt(d.charAt(c - h), 10) * g--,
            2 > g && (g = 9);
            return i = 2 > f % 11 ? 0 : 11 - f % 11,
            i === parseInt(e.charAt(1), 10)
        },
        _ch: function(a) {
            if (/^CHE[0-9]{9}(MWST)?$/.test(a) && (a = a.substr(2)), !/^E[0-9]{9}(MWST)?$/.test(a)) return ! 1;
            a = a.substr(1);
            for (var b = 0,
            c = [5, 4, 3, 2, 7, 6, 5, 4], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b = 11 - b % 11,
            10 === b ? !1 : (11 === b && (b = 0), b + "" === a.substr(8, 1))
        },
        _cy: function(a) {
            if (/^CY[0-5|9]{1}[0-9]{7}[A-Z]{1}$/.test(a) && (a = a.substr(2)), !/^[0-5|9]{1}[0-9]{7}[A-Z]{1}$/.test(a)) return ! 1;
            if ("12" === a.substr(0, 2)) return ! 1;
            for (var b = 0,
            c = {
                0 : 1,
                1 : 0,
                2 : 5,
                3 : 7,
                4 : 9,
                5 : 13,
                6 : 15,
                7 : 17,
                8 : 19,
                9 : 21
            },
            d = 0; 8 > d; d++) {
                var e = parseInt(a.charAt(d), 10);
                d % 2 === 0 && (e = c[e + ""]),
                b += e
            }
            return b = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" [b % 26],
            b + "" === a.substr(8, 1)
        },
        _cz: function(b) {
            if (/^CZ[0-9]{8,10}$/.test(b) && (b = b.substr(2)), !/^[0-9]{8,10}$/.test(b)) return ! 1;
            var c = 0,
            d = 0;
            if (8 === b.length) {
                if (b.charAt(0) + "" == "9") return ! 1;
                for (c = 0, d = 0; 7 > d; d++) c += parseInt(b.charAt(d), 10) * (8 - d);
                return c = 11 - c % 11,
                10 === c && (c = 0),
                11 === c && (c = 1),
                c + "" === b.substr(7, 1)
            }
            if (9 === b.length && b.charAt(0) + "" == "6") {
                for (c = 0, d = 0; 7 > d; d++) c += parseInt(b.charAt(d + 1), 10) * (8 - d);
                return c = 11 - c % 11,
                10 === c && (c = 0),
                11 === c && (c = 1),
                c = [8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 10][c - 1],
                c + "" === b.substr(8, 1)
            }
            if (9 === b.length || 10 === b.length) {
                var e = 1900 + parseInt(b.substr(0, 2), 10),
                f = parseInt(b.substr(2, 2), 10) % 50 % 20,
                g = parseInt(b.substr(4, 2), 10);
                if (9 === b.length) {
                    if (e >= 1980 && (e -= 100), e > 1953) return ! 1
                } else 1954 > e && (e += 100);
                if (!a.fn.bootstrapValidator.helpers.date(e, f, g)) return ! 1;
                if (10 === b.length) {
                    var h = parseInt(b.substr(0, 9), 10) % 11;
                    return 1985 > e && (h %= 10),
                    h + "" === b.substr(9, 1)
                }
                return ! 0
            }
            return ! 1
        },
        _de: function(b) {
            return /^DE[0-9]{9}$/.test(b) && (b = b.substr(2)),
            /^[0-9]{9}$/.test(b) ? a.fn.bootstrapValidator.helpers.mod11And10(b) : !1
        },
        _dk: function(a) {
            if (/^DK[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [2, 7, 6, 5, 4, 3, 2, 1], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b % 11 === 0
        },
        _ee: function(a) {
            if (/^EE[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [3, 7, 1, 3, 7, 1, 3, 7, 1], d = 0; 9 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b % 10 === 0
        },
        _es: function(a) {
            if (/^ES[0-9A-Z][0-9]{7}[0-9A-Z]$/.test(a) && (a = a.substr(2)), !/^[0-9A-Z][0-9]{7}[0-9A-Z]$/.test(a)) return ! 1;
            var b = function(a) {
                var b = parseInt(a.substr(0, 8), 10);
                return b = "TRWAGMYFPDXBNJZSQVHLCKE" [b % 23],
                b + "" === a.substr(8, 1)
            },
            c = function(a) {
                var b = ["XYZ".indexOf(a.charAt(0)), a.substr(1)].join("");
                return b = parseInt(b, 10),
                b = "TRWAGMYFPDXBNJZSQVHLCKE" [b % 23],
                b + "" === a.substr(8, 1)
            },
            d = function(a) {
                var b, c = a.charAt(0);
                if ( - 1 !== "KLM".indexOf(c)) return b = parseInt(a.substr(1, 8), 10),
                b = "TRWAGMYFPDXBNJZSQVHLCKE" [b % 23],
                b + "" === a.substr(8, 1);
                if ( - 1 !== "ABCDEFGHJNPQRSUVW".indexOf(c)) {
                    for (var d = 0,
                    e = [2, 1, 2, 1, 2, 1, 2], f = 0, g = 0; 7 > g; g++) f = parseInt(a.charAt(g + 1), 10) * e[g],
                    f > 9 && (f = Math.floor(f / 10) + f % 10),
                    d += f;
                    return d = 10 - d % 10,
                    d + "" === a.substr(8, 1) || "JABCDEFGHI" [d] === a.substr(8, 1)
                }
                return ! 1
            },
            e = a.charAt(0);
            return /^[0-9]$/.test(e) ? b(a) : /^[XYZ]$/.test(e) ? c(a) : d(a)
        },
        _fi: function(a) {
            if (/^FI[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [7, 9, 10, 5, 8, 4, 2, 1], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b % 11 === 0
        },
        _fr: function(b) {
            if (/^FR[0-9A-Z]{2}[0-9]{9}$/.test(b) && (b = b.substr(2)), !/^[0-9A-Z]{2}[0-9]{9}$/.test(b)) return ! 1;
            if (!a.fn.bootstrapValidator.helpers.luhn(b.substr(2))) return ! 1;
            if (/^[0-9]{2}$/.test(b.substr(0, 2))) return b.substr(0, 2) === parseInt(b.substr(2) + "12", 10) % 97 + "";
            var c, d = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
            return c = /^[0-9]{1}$/.test(b.charAt(0)) ? 24 * d.indexOf(b.charAt(0)) + d.indexOf(b.charAt(1)) - 10 : 34 * d.indexOf(b.charAt(0)) + d.indexOf(b.charAt(1)) - 100,
            (parseInt(b.substr(2), 10) + 1 + Math.floor(c / 11)) % 11 === c % 11
        },
        _gb: function(a) {
            if ((/^GB[0-9]{9}$/.test(a) || /^GB[0-9]{12}$/.test(a) || /^GBGD[0-9]{3}$/.test(a) || /^GBHA[0-9]{3}$/.test(a) || /^GB(GD|HA)8888[0-9]{5}$/.test(a)) && (a = a.substr(2)), !(/^[0-9]{9}$/.test(a) || /^[0-9]{12}$/.test(a) || /^GD[0-9]{3}$/.test(a) || /^HA[0-9]{3}$/.test(a) || /^(GD|HA)8888[0-9]{5}$/.test(a))) return ! 1;
            var b = a.length;
            if (5 === b) {
                var c = a.substr(0, 2),
                d = parseInt(a.substr(2), 10);
                return "GD" === c && 500 > d || "HA" === c && d >= 500
            }
            if (11 === b && ("GD8888" === a.substr(0, 6) || "HA8888" === a.substr(0, 6))) return "GD" === a.substr(0, 2) && parseInt(a.substr(6, 3), 10) >= 500 || "HA" === a.substr(0, 2) && parseInt(a.substr(6, 3), 10) < 500 ? !1 : parseInt(a.substr(6, 3), 10) % 97 === parseInt(a.substr(9, 2), 10);
            if (9 === b || 12 === b) {
                for (var e = 0,
                f = [8, 7, 6, 5, 4, 3, 2, 10, 1], g = 0; 9 > g; g++) e += parseInt(a.charAt(g), 10) * f[g];
                return e %= 97,
                parseInt(a.substr(0, 3), 10) >= 100 ? 0 === e || 42 === e || 55 === e: 0 === e
            }
            return ! 0
        },
        _gr: function(a) {
            if (/^(GR|EL)[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a)) return ! 1;
            8 === a.length && (a = "0" + a);
            for (var b = 0,
            c = [256, 128, 64, 32, 16, 8, 4, 2], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b = b % 11 % 10,
            b + "" === a.substr(8, 1)
        },
        _el: function(a) {
            return this._gr(a)
        },
        _hu: function(a) {
            if (/^HU[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [9, 7, 3, 1, 9, 7, 3, 1], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b % 10 === 0
        },
        _hr: function(b) {
            return /^HR[0-9]{11}$/.test(b) && (b = b.substr(2)),
            /^[0-9]{11}$/.test(b) ? a.fn.bootstrapValidator.helpers.mod11And10(b) : !1
        },
        _ie: function(a) {
            if (/^IE[0-9]{1}[0-9A-Z\*\+]{1}[0-9]{5}[A-Z]{1,2}$/.test(a) && (a = a.substr(2)), !/^[0-9]{1}[0-9A-Z\*\+]{1}[0-9]{5}[A-Z]{1,2}$/.test(a)) return ! 1;
            var b = function(a) {
                for (; a.length < 7;) a = "0" + a;
                for (var b = "WABCDEFGHIJKLMNOPQRSTUV",
                c = 0,
                d = 0; 7 > d; d++) c += parseInt(a.charAt(d), 10) * (8 - d);
                return c += 9 * b.indexOf(a.substr(7)),
                b[c % 23]
            };
            return /^[0-9]+$/.test(a.substr(0, 7)) ? a.charAt(7) === b(a.substr(0, 7) + a.substr(8) + "") : -1 !== "ABCDEFGHIJKLMNOPQRSTUVWXYZ+*".indexOf(a.charAt(1)) ? a.charAt(7) === b(a.substr(2, 5) + a.substr(0, 1) + "") : !0
        },
        _is: function(a) {
            return /^IS[0-9]{5,6}$/.test(a) && (a = a.substr(2)),
            /^[0-9]{5,6}$/.test(a)
        },
        _it: function(b) {
            if (/^IT[0-9]{11}$/.test(b) && (b = b.substr(2)), !/^[0-9]{11}$/.test(b)) return ! 1;
            if (0 === parseInt(b.substr(0, 7), 10)) return ! 1;
            var c = parseInt(b.substr(7, 3), 10);
            return 1 > c || c > 201 && 999 !== c && 888 !== c ? !1 : a.fn.bootstrapValidator.helpers.luhn(b)
        },
        _lt: function(a) {
            if (/^LT([0-9]{7}1[0-9]{1}|[0-9]{10}1[0-9]{1})$/.test(a) && (a = a.substr(2)), !/^([0-9]{7}1[0-9]{1}|[0-9]{10}1[0-9]{1})$/.test(a)) return ! 1;
            var b, c = a.length,
            d = 0;
            for (b = 0; c - 1 > b; b++) d += parseInt(a.charAt(b), 10) * (1 + b % 9);
            var e = d % 11;
            if (10 === e) for (d = 0, b = 0; c - 1 > b; b++) d += parseInt(a.charAt(b), 10) * (1 + (b + 2) % 9);
            return e = e % 11 % 10,
            e + "" === a.charAt(c - 1)
        },
        _lu: function(a) {
            return /^LU[0-9]{8}$/.test(a) && (a = a.substr(2)),
            /^[0-9]{8}$/.test(a) ? parseInt(a.substr(0, 6), 10) % 89 + "" === a.substr(6, 2) : !1
        },
        _lv: function(b) {
            if (/^LV[0-9]{11}$/.test(b) && (b = b.substr(2)), !/^[0-9]{11}$/.test(b)) return ! 1;
            var c, d = parseInt(b.charAt(0), 10),
            e = 0,
            f = [],
            g = b.length;
            if (d > 3) {
                for (e = 0, f = [9, 1, 4, 8, 3, 10, 2, 5, 7, 6, 1], c = 0; g > c; c++) e += parseInt(b.charAt(c), 10) * f[c];
                return e %= 11,
                3 === e
            }
            var h = parseInt(b.substr(0, 2), 10),
            i = parseInt(b.substr(2, 2), 10),
            j = parseInt(b.substr(4, 2), 10);
            if (j = j + 1800 + 100 * parseInt(b.charAt(6), 10), !a.fn.bootstrapValidator.helpers.date(j, i, h)) return ! 1;
            for (e = 0, f = [10, 5, 8, 4, 2, 1, 6, 3, 7, 9], c = 0; g - 1 > c; c++) e += parseInt(b.charAt(c), 10) * f[c];
            return e = (e + 1) % 11 % 10,
            e + "" === b.charAt(g - 1)
        },
        _mt: function(a) {
            if (/^MT[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [3, 4, 6, 7, 8, 9, 10, 1], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b % 37 === 0
        },
        _nl: function(a) {
            if (/^NL[0-9]{9}B[0-9]{2}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}B[0-9]{2}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [9, 8, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b %= 11,
            b > 9 && (b = 0),
            b + "" === a.substr(8, 1)
        },
        _no: function(a) {
            if (/^NO[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [3, 2, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b = 11 - b % 11,
            11 === b && (b = 0),
            b + "" === a.substr(8, 1)
        },
        _pl: function(a) {
            if (/^PL[0-9]{10}$/.test(a) && (a = a.substr(2)), !/^[0-9]{10}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [6, 5, 7, 2, 3, 4, 5, 6, 7, -1], d = 0; 10 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b % 11 === 0
        },
        _pt: function(a) {
            if (/^PT[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [9, 8, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b = 11 - b % 11,
            b > 9 && (b = 0),
            b + "" === a.substr(8, 1)
        },
        _ro: function(a) {
            if (/^RO[1-9][0-9]{1,9}$/.test(a) && (a = a.substr(2)), !/^[1-9][0-9]{1,9}$/.test(a)) return ! 1;
            for (var b = a.length,
            c = [7, 5, 3, 2, 1, 7, 5, 3, 2].slice(10 - b), d = 0, e = 0; b - 1 > e; e++) d += parseInt(a.charAt(e), 10) * c[e];
            return d = 10 * d % 11 % 10,
            d + "" === a.substr(b - 1, 1)
        },
        _ru: function(a) {
            if (/^RU([0-9]{10}|[0-9]{12})$/.test(a) && (a = a.substr(2)), !/^([0-9]{10}|[0-9]{12})$/.test(a)) return ! 1;
            var b = 0;
            if (10 === a.length) {
                var c = 0,
                d = [2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
                for (b = 0; 10 > b; b++) c += parseInt(a.charAt(b), 10) * d[b];
                return c %= 11,
                c > 9 && (c %= 10),
                c + "" === a.substr(9, 1)
            }
            if (12 === a.length) {
                var e = 0,
                f = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0],
                g = 0,
                h = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
                for (b = 0; 11 > b; b++) e += parseInt(a.charAt(b), 10) * f[b],
                g += parseInt(a.charAt(b), 10) * h[b];
                return e %= 11,
                e > 9 && (e %= 10),
                g %= 11,
                g > 9 && (g %= 10),
                e + "" === a.substr(10, 1) && g + "" === a.substr(11, 1)
            }
            return ! 1
        },
        _rs: function(a) {
            if (/^RS[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a)) return ! 1;
            for (var b = 10,
            c = 0,
            d = 0; 8 > d; d++) c = (parseInt(a.charAt(d), 10) + b) % 10,
            0 === c && (c = 10),
            b = 2 * c % 11;
            return (b + parseInt(a.substr(8, 1), 10)) % 10 === 1
        },
        _se: function(b) {
            return /^SE[0-9]{10}01$/.test(b) && (b = b.substr(2)),
            /^[0-9]{10}01$/.test(b) ? (b = b.substr(0, 10), a.fn.bootstrapValidator.helpers.luhn(b)) : !1
        },
        _si: function(a) {
            if (/^SI[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a)) return ! 1;
            for (var b = 0,
            c = [8, 7, 6, 5, 4, 3, 2], d = 0; 7 > d; d++) b += parseInt(a.charAt(d), 10) * c[d];
            return b = 11 - b % 11,
            10 === b && (b = 0),
            b + "" === a.substr(7, 1)
        },
        _sk: function(a) {
            return /^SK[1-9][0-9][(2-4)|(6-9)][0-9]{7}$/.test(a) && (a = a.substr(2)),
            /^[1-9][0-9][(2-4)|(6-9)][0-9]{7}$/.test(a) ? parseInt(a, 10) % 11 === 0 : !1
        },
        _ve: function(a) {
            if (/^VE[VEJPG][0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[VEJPG][0-9]{9}$/.test(a)) return ! 1;
            for (var b = {
                V: 4,
                E: 8,
                J: 12,
                P: 16,
                G: 20
            },
            c = b[a.charAt(0)], d = [3, 2, 7, 6, 5, 4, 3, 2], e = 0; 8 > e; e++) c += parseInt(a.charAt(e + 1), 10) * d[e];
            return c = 11 - c % 11,
            (11 === c || 10 === c) && (c = 0),
            c + "" === a.substr(9, 1)
        },
        _za: function(a) {
            return /^ZA4[0-9]{9}$/.test(a) && (a = a.substr(2)),
            /^4[0-9]{9}$/.test(a)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.vin = a.extend(a.fn.bootstrapValidator.i18n.vin || {},
    {
        "default": "Please enter a valid VIN number"
    }),
    a.fn.bootstrapValidator.validators.vin = {
        validate: function(a, b) {
            var c = b.val();
            if ("" === c) return ! 0;
            if (!/^[a-hj-npr-z0-9]{8}[0-9xX][a-hj-npr-z0-9]{8}$/i.test(c)) return ! 1;
            c = c.toUpperCase();
            for (var d = {
                A: 1,
                B: 2,
                C: 3,
                D: 4,
                E: 5,
                F: 6,
                G: 7,
                H: 8,
                J: 1,
                K: 2,
                L: 3,
                M: 4,
                N: 5,
                P: 7,
                R: 9,
                S: 2,
                T: 3,
                U: 4,
                V: 5,
                W: 6,
                X: 7,
                Y: 8,
                Z: 9,
                1 : 1,
                2 : 2,
                3 : 3,
                4 : 4,
                5 : 5,
                6 : 6,
                7 : 7,
                8 : 8,
                9 : 9,
                0 : 0
            },
            e = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2], f = 0, g = c.length, h = 0; g > h; h++) f += d[c.charAt(h) + ""] * e[h];
            var i = f % 11;
            return 10 === i && (i = "X"),
            i + "" === c.charAt(8)
        }
    }
} (window.jQuery),
function(a) {
    a.fn.bootstrapValidator.i18n.zipCode = a.extend(a.fn.bootstrapValidator.i18n.zipCode || {},
    {
        "default": "Please enter a valid postal code",
        countryNotSupported: "The country code %s is not supported",
        country: "Please enter a valid postal code in %s",
        countries: {
            BR: "Brazil",
            CA: "Canada",
            CZ: "Czech Republic",
            DK: "Denmark",
            GB: "United Kingdom",
            IT: "Italy",
            MA: "Morocco",
            NL: "Netherlands",
            RO: "Romania",
            RU: "Russia",
            SE: "Sweden",
            SG: "Singapore",
            SK: "Slovakia",
            US: "USA"
        }
    }),
    a.fn.bootstrapValidator.validators.zipCode = {
        html5Attributes: {
            message: "message",
            country: "country"
        },
        COUNTRY_CODES: ["BR", "CA", "CZ", "DK", "GB", "IT", "MA", "NL", "RO", "RU", "SE", "SG", "SK", "US"],
        validate: function(b, c, d) {
            var e = c.val();
            if ("" === e || !d.country) return ! 0;
            var f = d.country;
            if (("string" != typeof f || -1 === a.inArray(f, this.COUNTRY_CODES)) && (f = b.getDynamicOption(c, f)), !f || -1 === a.inArray(f.toUpperCase(), this.COUNTRY_CODES)) return {
                valid: !1,
                message: a.fn.bootstrapValidator.helpers.format(a.fn.bootstrapValidator.i18n.zipCode.countryNotSupported, f)
            };
            var g = !1;
            switch (f = f.toUpperCase()) {
            case "BR":
                g = /^(\d{2})([\.]?)(\d{3})([\-]?)(\d{3})$/.test(e);
                break;
            case "CA":
                g = /^(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|X|Y){1}[0-9]{1}(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|W|X|Y|Z){1}\s?[0-9]{1}(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|W|X|Y|Z){1}[0-9]{1}$/i.test(e);
                break;
            case "CZ":
                g = /^(\d{3})([ ]?)(\d{2})$/.test(e);
                break;
            case "DK":
                g = /^(DK(-|\s)?)?\d{4}$/i.test(e);
                break;
            case "GB":
                g = this._gb(e);
                break;
            case "IT":
                g = /^(I-|IT-)?\d{5}$/i.test(e);
                break;
            case "MA":
                g = /^[1-9][0-9]{4}$/i.test(e);
                break;
            case "NL":
                g = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(e);
                break;
            case "RO":
                g = /^(0[1-8]{1}|[1-9]{1}[0-5]{1})?[0-9]{4}$/i.test(e);
                break;
            case "RU":
                g = /^[0-9]{6}$/i.test(e);
                break;
            case "SE":
                g = /^(S-)?\d{3}\s?\d{2}$/i.test(e);
                break;
            case "SG":
                g = /^([0][1-9]|[1-6][0-9]|[7]([0-3]|[5-9])|[8][0-2])(\d{4})$/i.test(e);
                break;
            case "SK":
                g = /^(\d{3})([ ]?)(\d{2})$/.test(e);
                break;
            case "US":
            default:
                g = /^\d{4,5}([\-]?\d{4})?$/.test(e)
            }
            return {
                valid: g,
                message: a.fn.bootstrapValidator.helpers.format(d.message || a.fn.bootstrapValidator.i18n.zipCode.country, a.fn.bootstrapValidator.i18n.zipCode.countries[f])
            }
        },
        _gb: function(a) {
            for (var b = "[ABCDEFGHIJKLMNOPRSTUWYZ]",
            c = "[ABCDEFGHKLMNOPQRSTUVWXY]",
            d = "[ABCDEFGHJKPMNRSTUVWXY]",
            e = "[ABEHMNPRVWXY]",
            f = "[ABDEFGHJLNPQRSTUWXYZ]",
            g = [new RegExp("^(" + b + "{1}" + c + "?[0-9]{1,2})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(" + b + "{1}[0-9]{1}" + d + "{1})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(" + b + "{1}" + c + "{1}?[0-9]{1}" + e + "{1})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(BF1)(\\s*)([0-6]{1}[ABDEFGHJLNPQRST]{1}[ABDEFGHJLNPQRSTUWZYZ]{1})$", "i"), /^(GIR)(\s*)(0AA)$/i, /^(BFPO)(\s*)([0-9]{1,4})$/i, /^(BFPO)(\s*)(c\/o\s*[0-9]{1,3})$/i, /^([A-Z]{4})(\s*)(1ZZ)$/i, /^(AI-2640)$/i], h = 0; h < g.length; h++) if (g[h].test(a)) return ! 0;
            return ! 1
        }
    }
} (window.jQuery);