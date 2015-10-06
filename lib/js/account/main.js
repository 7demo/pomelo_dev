/**
 *
 * 账户操作js
 * 
 */
define(function (require, exports, module) {

	var loginModule = require('/lib/js/modules/loginModule.js'),
		verifyModule = require('/lib/js/modules/verifyModule.js'),
		registerModule = require('/lib/js/modules/registerModule.js'),
		$ = require('lib/compontent/jquery/jquery.min');
	exports.init = function () {
		
		/**
		 * 教师登录 
		 */
		$('#tutorLogin').submit(function () {
			loginModule.login('tutorLogin', '/api/teacher/login');
			return false;
		});

		/**
		 * 教师忘记密码 的验证码
		 */
		$('#getpwdTutor .getVerify').click(function () {
			verifyModule.verify('getpwdTutor', '/web/');
			return false;
		});

		/**
		 * 教师忘记密码
		 */
		$('#getpwdTutor').submit(function () {
			registerModule.register('getpwdTutor', '/web/');
			return false;
		});


	};

});