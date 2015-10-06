/**
 *
 *  答疑记录模板
 * 
 */

define(function (require, exports, module) {
    var $ = require('lib/compontent/jquery/jquery.min'),
        spadger = require('lib/js/modules/spadger')
    var tplFunc = function (data) {

        var tpl = '';
        
        $.each(data, function (i, v) {
            tpl += '<li class="fn-clear">'
            tpl += '    <div class="fn-left">'
            tpl += '        <a href="/web/replay/'+ v.answerID +'">'
            tpl += '            <img src="'+ v.question.imgUrl +'" alt="">'
            tpl += '        </a>'
            tpl += '    </div>'
            tpl += '    <div class="fn-right">'
            tpl += '        <h3>'
            tpl += '            <strong>'+ v.teacher +'讲给' + v.student + '的'+ v.question.subject +'课</strong>'
            tpl += '            <span>'+ spadger.timeStampToTime(v.created) +'</span>'
            tpl += '        </h3>'
            if (v.evaluate) {
                tpl += '        <p>'
                    for (var k = 1; k < 6; k++) {
                        if (k > v.evaluate.score) {
                            tpl += '                <i class="fa fa-star-o"></i>'
                        } else {
                            tpl += '                <i class="fa fa-star"></i>'
                        }
                    }
                tpl += '        </p>'
                tpl += '        <div class="usercenter-answer-eva">' + v.evaluate.comment + '</div>'
            }
            tpl += '    </div>'
            tpl += '</li>'
        })

        return tpl;

    }
        
    module.exports = tplFunc;

});