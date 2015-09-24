/**
 *
 * 账户操作js
 * 
 */
define(function (require, exports, module) {

	var loginModule = require('/lib/js/modules/loginModule.js')
	var $ = require('lib/compontent/jquery/jquery.min');
	exports.init = function () {
		
		/**
		 * 教师登录 
		 */
		$('#tutorLogin').submit(function () {
			loginModule.login('tutorLogin', '/web/account/tutorLogin');
			return false;
		});

	};

});