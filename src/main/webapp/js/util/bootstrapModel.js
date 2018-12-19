var BootstrapModel = {
	
    /**
     * 数组:保存按钮函数
     * @param {Object} json
     */
    fun_array: '',
    /**
     * 1:dialog
     * @param {Object} json
     */
    create_bootstarp_dialog: function(json){
        BootstrapModel.create_bootstarp_confirm(json);
    },
    /**
     * 2:confirm
     * @param {Object} json
     */
    create_bootstarp_confirm: function(json){
        //点击空白处和小叉子的时候,bootstarp会自动将提示框隐藏,所以要删除
        var divlen = $('#myModal').length;
        if (divlen != 0) {
            $('#myModal').remove();
        }
        
        var title = !json.title ? '提示信息' : json.title;
        var content = !json.content ? '没有传入提示信息' : json.content;
        var width = !json.width ? '350' : Number(json.width);
        var div1 = $('<div>', {
            'class': 'modal fade',
            'id': 'myModal',
            'tabindex': '-1',
            'role': 'dialog',
            'aria-labelledby': 'myModalLabel',
            'aria-hidden': 'true',
            'style': 'overflow:auto;'
        });
        var div2 = $('<div>', {
            'class': 'modal-dialog',
            'role': 'document',
            'style': 'width: ' + width + 'px !important;overflow:auto;'
        });
        var div3 = $('<div>', {
            'class': 'modal-content'
        });
        var div4 = $('<div>', {
            'class': 'modal-header'
        });
        var but1 = $('<button>', {
            'type': 'button',
            'class': 'close',
            'data-dismiss': 'modal',
            'aria-label': 'Close'
        });
        var span1 = $('<span>', {
            'aria-hidden': 'true',
            'html': '&times;'
        });
        but1.append(span1);
        var h4_1 = $('<h4>', {
            'class': 'modal-title',
            'id': 'myModalLabel',
            'style': 'font-size:18px !important;font-family:微软雅黑;',
            'html': title
        });
        div4.append(but1).append(h4_1);
        var div5 = $('<div>', {
            'class': 'modal-body',
            'style': 'font-family:微软雅黑; max-height:350px;overflow:auto;width:' + (width - 4) + 'px',
            'html': content
        });
        var div6 = $('<div>', {
            'class': 'modal-footer'
        });
        //按钮组
        var button = json.button;
        
        //防止重复创建数组
        if (!BootstrapModel.fun_array) {
            BootstrapModel.fun_array = new Array();
        }
        //标记:为每个按钮添加标记,点击时根据标记调用数组中的函数
        var i = 0;
        for (var name in button) {
            BootstrapModel.fun_array.push(button[name]);
            var but = $('<button>', {
                'type': 'button',
                'class': i == 0 ? 'btn btn-success btn-sm' : 'btn btn-default btn-sm',
                'idx': i,
                'data-dismiss': 'modal',
                'style': 'font-family:微软雅黑;padding:5px 25px;',
                'html': name,
                'click': function(){
                    BootstrapModel.fun_array[Number($(this).attr('idx'))]();
                    //点击按钮后清空数据,防止重复添加数据,因为每次点击,都会向数组中添加函数
                    BootstrapModel.fun_array.length = 0;
                    // 判断bootstrap是否执行完毕,执行完毕后 删除创建的对象
                    setIn = window.setInterval(function(){
                        //当bootstrap执行完毕后会清空body中的class
                        var is = $('body').is('.modal-open');
                        if (!is) {
                            //删除创建的对象
                            $('#myModal').remove();
                            //清除定时函数
                            window.clearTimeout(setIn);
                        }
                    }, 1000);
                }
            });
            div6.append(but);
            i++;
        }
        div3.append(div4).append(div5).append(div6);
        div2.append(div3);
        div1.append(div2);
        $('body').append(div1);
        $('#myModal').modal('show');
    },
    /**
     * 3:alert:敬告框
     * @param {Object} json
     */
    create_bootstarp_alert: function(json, callback){
        //创建类型
        var type = !json.type ? 'success' : json.type;
        var content = !json.content ? '没有传入提示信息' : json.content;
        //消失所有时间
        var time = !json.time ? 2000 : Number(json.time);
		
        // 判断是否已经创建,防止点击过快
        var len = $('#bootstarp-alert').length;
        if (len > 0) {
            return;
        }
        // 设置提示框图标
        var alert_icon = '';
        var background = '';
        switch (type) {
            case 'success':// 成功
                alert_icon = '&radic;';
                background = '#5cb85c';
                break;
            case 'info':// 警告
                alert_icon = '<i class=\"fa fa-exclamation-circle\" style=\"width: 20px;color:#fff; \" /> '; 
                background = '#5bc0de';
                break;
            case 'warning':// 警告
                alert_icon = '<i class=\"fa fa-exclamation-circle\" style=\"width: 16px;color:#fff; \"   /> ';
                background = '#f0ad4e';
                break;
            case 'danger':// 错误
                alert_icon = '&times;';
                background = '#d9534f';
                break;
            default:
                break;
        }
        // 设置提示框默认宽度
        var alert_width = !json.width ? '250px' : Number(json.width) + 'px';
        var alert_class = 'alert-' + type;
        // 创建div
        var div1 = $('<div>', {
            'class': 'alert alert-dismissable',
            'id': 'bootstarp-alert'
        }).addClass(alert_class);
        var but1 = $('<button>', {
            'class': 'close',
            'data-dismiss': 'alert',
            'aria-hidden': 'true',
            'html': '&times;'
        });
        var b1 = $('<b>', {
            'html': alert_icon,
            'style': 'padding-right:30px;'
        });
        var span1 = $('<span>', {
            'style': 'font-size:14px !important;padding-right:30px;',
            'html': content
        });
        div1.append(but1).append(b1).append(span1);
        $('body').append(div1);
        div1.css({
            'min-width': alert_width,
            'width': '400px',
            'height': '50px',
            'position': 'fixed',
            'top': '508.5px',
            'padding-right': '50px',
            'border': '2px solid #fff',
            'z-index': '111111111111',
            'filter': 'alpha(opacity=0)',
            '-moz-opacity': '0.0',
            'color': '#ffffff',
            'background': background,
            'opacity': '0.0'
        })
        // 动态设置提示框在中间显示
        var bodyW = Number(document.body.clientWidth);
        var w = Number(div1.width());
        var left = (bodyW - w) / 2;
        div1.css({
            'left': (left-35) + 'px'
        });
        div1.animate({
            'opacity': 1,
            '-moz-opacity': 1,
            'opacity': 1
        }, 300, function(){
            window.setTimeout(function(){
                div1.animate({
                    'top': '0',
                    'opacity': 0,
                    '-moz-opacity': 0,
                    'opacity': 0
                }, 300, function(){
                    $('#bootstarp-alert').remove();
                    if (callback) {
                        callback();
                    }
                });
            }, time);
        });
    }
};