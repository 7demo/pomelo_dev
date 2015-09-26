/**
 *
 *  获取验证码模块
 * 
 */

define(function (require, exports, module) {
    
    var $ = require('lib/compontent/jquery/jquery.min'),
        spadger = require('lib/js/modules/spadger');

    var verify = function (parentdiv, url) {
        var parent = $('#' + parentdiv),
            btn = parent.find('.getVerify'),
            btnTxt = btn.text(),
            phoneInput = parent.find('input[name=phone]'),
            phoneErrormsg = phoneInput.siblings('.errorMsg'),
            phone = phoneInput.val(),
            verifyInput = parent.find('input[name=verify]'),
            verifyErrormsg = verifyInput.siblings('.errorMsg');

        if (btn.hasClass('disabled')) return ;  //若有disabled 则退出

        $.ajax({
            type : 'POST',
            url : url,
            data : {
                phone : phone
            },
            beforeSend : function () {

                phoneErrormsg.text('');
                verifyErrormsg.text('');

                var phoneCheck = spadger.checkReg('phone', phone); //检测电话
                if (phoneCheck !== true) {
                    phoneErrormsg.text(phoneCheck);
                    return false;
                }

                btn.text('请求中').addClass('disabled');

            },
            success : function (data) {
                if (data.code == 200) {
                    

                } else {
                    verifyErrormsg.text(data.desc);
                    btn.text(btnTxt).removeClass('disabled');
                }
            },
            error : function () {
                btn.text(btnTxt).removeClass('disabled');
                verifyErrormsg.text('网络连接错误，请检查网络后再次尝试');
            }
        });
    }

    exports.verify = verify;

});