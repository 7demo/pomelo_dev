/**
 *
 *  注册模块
 * 
 */

define(function (require, exports, module) {
    
    var $ = require('lib/compontent/jquery/jquery.min'),
        spadger = require('lib/js/modules/spadger');
    var register = function (parentdiv, url) {

        var parent = $('#' + parentdiv),
            btn = parent.find('.submit'),
            btnTxt = btn.text(),
            
            phoneInput = parent.find('input[name=phone]'),
            phoneErrormsg = phoneInput.siblings('.errorMsg'),
            phone = phoneInput.val(),
            
            verifyInput = parent.find('input[name=verify]'),
            verifyErrormsg = verifyInput.siblings('.errorMsg'),
            verify = verifyInput.val(),

            passwordInput = parent.find('input[name=password]'),
            passwordErrormsg = passwordInput.siblings('.errorMsg'),
            password = passwordInput.val(),
            
            errorMsg = btn.siblings('.errorMsg'),
            successMsg = btn.siblings('.successMsg');

        if (btn.hasClass('disabled')) return ;  //若有disabled 则退出

        $.ajax({
            type : 'POST',
            url : url,
            data : {
                phone : phone,
                verify : verify,
                password : password
            },
            beforeSend : function () {

                errorMsg.text('');
                phoneErrormsg.text('');
                verifyErrormsg.text('');
                passwordErrormsg.text('');

                var phoneCheck = spadger.checkReg('phone', phone); //检测电话
                if (phoneCheck !== true) {
                    phoneErrormsg.text(phoneCheck);
                    return false;
                }

                var verifyCheck = spadger.checkReg('verify', verify); //检测电话
                if (verifyCheck !== true) {
                    verifyErrormsg.text(verifyCheck);
                    return false;
                }

                var passwordCheck = spadger.checkReg('password', password); //检测密码
                if (passwordCheck !== true) {
                    passwordErrormsg.text(passwordCheck);
                    return false;
                }

                btn.text('提交中').addClass('disabled');

            },
            success : function (data) {
                console.log(data, errorMsg.text());
                if (data.code == 200) {
                    btn.text('登录').removeClass('disabled');
                    successMsg.text('登录成功， 跳转中');
                    setTimeout(function () {
                        location.href = data.data.url;
                    }, 1500)

                } else {
                    errorMsg.text(data.desc);
                    btn.text('登录').removeClass('disabled');
                }
            },
            error : function () {
                btn.text('登录').removeClass('disabled');
                errorMsg.text('网络连接错误，请检查网络后再次尝试');
            }
        })

        return false;
    }

    exports.register = register;

});