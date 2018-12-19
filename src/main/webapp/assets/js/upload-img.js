/**
 * Created by wangfeilong on 2015/3/30.
 */
var uploadParams = {};
var example_dropzone;
var uploadUrl = '/tiku_ops/batchfileupload/';
$(function () {
    uploadParams.target = 0;
    uploadParams.batchId = new Date().getTime();
    $(".select-app label").click(function () {
    	if($(this).find('input:radio').prop('disabled')){
    		 $.dialog.tips(" 程序猿GG正在攻关中，敬请期待！",1,false);
    	} else {
    		if($(this).find('input:radio').prop('checked')){
                uploadParams.target = $(this).find("input:radio").val();
                console.log(uploadParams.target)
            }
    	}
    });



    var i = 1;

    var $example_dropzone_filetable = $("#dropzone-filetable");
    example_dropzone = new Dropzone("#advancedDropzone", {
        url: uploadUrl + 'fileUploadApi?target=' + uploadParams.target + '&batchId=' + uploadParams.batchId,
        acceptedFiles: '.jpg,.jpeg,.png',
        maxFiles: 500,
        maxFilesize: 3,
        // Events
        addedfile: function (file) {
            example_dropzone.options.url = uploadUrl + 'fileUploadApi?target=' + uploadParams.target + '&batchId=' + uploadParams.batchId;
            if (i == 1) {
                $example_dropzone_filetable.find('tbody').html('');
            }

            var size = parseInt(file.size / 1024, 10);
            size = size < 1024 ? (size + " KB") : (parseInt(size / 1024, 10) + " MB");

            var $el = $('<tr>\
                                <td class="text-center">' + (i++) + '</td>\
                                <td>' + file.name + '</td>\
                                <td><div class="progress progress-striped"><div class="progress-bar progress-bar-warning"></div></div></td>\
                                <td>' + size + '</td>\
                                <td>上传中...</td>\
                            </tr>');

            $example_dropzone_filetable.find('tbody').append($el);
            file.fileEntryTd = $el;
            file.progressBar = $el.find('.progress-bar');
        },

        uploadprogress: function (file, progress, bytesSent) {
            file.progressBar.width(progress + '%');
        },

        success: function (file) {
            file.fileEntryTd.find('td:last').html('<span class="text-success">上传成功</span>');
            file.progressBar.removeClass('progress-bar-warning').addClass('progress-bar-success');
        },

        error: function (file, message) {
        	console.log(message);
            file.fileEntryTd.find('td:last').html('<span class="text-danger">上传失败</span>');
            file.progressBar.removeClass('progress-bar-warning').addClass('progress-bar-red');
        },
        complete:function(){
            $("#batchResultBtn").removeClass("noupload");
        }
    });


    $("#advancedDropzone").css({
        minHeight: 200
    });


    $("#batchResultBtn").click(function(){
        if($(this).hasClass("noupload")){
            $.dialog.tips("请上传完之后再操作！",1,false);
            return;
        }
        $.dialog.tips("正在识别中，请稍候...",false,true);
        $(this).children("span").text("正在识别...").addClass("noupload");
        $(this).addClass("");
        $(this).children('i').removeClass('fa-check').addClass('fa-spinner');
            getBatchResult(uploadParams.batchId, {
            	displayMode: window.displayModeVal
            });
    });

});
