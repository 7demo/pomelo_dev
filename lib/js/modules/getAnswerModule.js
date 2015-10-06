/**
 *
 *  获得答疑记录模块
 *  config : {
 *      url : 请求url
 *      start ： 起始
 *      count ： 数目
 *  }
 * 
 */

define(function (require, exports, module) {
    var $ = require('lib/compontent/jquery/jquery.min'),
        answerLi = require('lib/js/modules/answerListModule'),
        config = require('lib/js/config'),
        spadger = require('lib/js/modules/spadger');

    var getAnswer = function (conf, cb) {
        $.ajax({
            type : 'POST',
            url : config.API_URL + conf.url,
            data : {
                start : conf.start,
                count : conf.count
            },
            success : function (data) {
                if (data.code == 200) {
                    cb(data.data);
                } else {

                }
            },
            error : function () {

            }
        })
    }
        
    module.exports = getAnswer;

});