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

		/**
		 * 模拟下拉框
		 */
		//下拉框显现
		$(document).on('mouseenter', '.select', function () {
			$(this).find('.select-ctn').show();
		});

		//下拉框隐藏
		$(document).on('mouseleave', '.select', function () {
			$(this).find('.select-ctn').hide();
		});

		//选择下拉框
		$(document).on('click', '.select .select_ctn li', function () {
			var _self = $(this),
				_parent = _self.parents('.select-ctn');
			setTimeout(function () {
				_parent.siblings('input[type=hidden]').val(_self.attr('data-value'));
				_parent.siblings('span').text(_self.text());
				_parent.parent('.select').mouseleave();
			}, 0);

		});

	};

});