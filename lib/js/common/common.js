/**
 * 
 * 通用js
 * 
 */
define(function (require, exports, module) {

	var $ = require('lib/compontent/jquery/jquery.min');

	exports.init = function () {
		/**
		 * 密码框 明密文同步
		 */
		$('.mul-input input').keyup(function () {
			var self = $(this);
			self.siblings('input').val(self.val());
		});

		/**
		 * 密码框 明密文切换
		 */
		$('.mul-input .fa').click(function () {
			var parent = $(this).parent('.mul-input');
			parent.find('.fa, input').toggleClass('fn-hide')
			return false;
		});

		/**
		 * 多选框
		 */
		$(document).on('click', 'span.checked', function () {
			var self = $(this);
			self.toggleClass('active');
			setMulCheckVal(self);
			return false;
		});

		/**
		 * 设置多选框的值
		 * @param {jquery对象，span} [varname] [description]
		 */
		var setMulCheckVal = function (span) {
			var input = span.siblings('input'),
				spans = input.siblings('span.checked.active'),
				arr = [];
			$.each(spans, function (i, v) {
				arr.push($(v).attr('data-value'));
			})
			input.val(arr);
		};

	};

});