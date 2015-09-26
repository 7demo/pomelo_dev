/**
 *
 * 账户操作js
 * 
 */
define(function (require, exports, module) {

	var $ = require('lib/compontent/jquery/jquery.min');
	exports.init = function () {
		
		/**
		 * 教学资料提交 
		 */
		$('#teachInfo .submit').click(function () {
			
			if ($(this).hasClass('disaled')) return;

			var parent = $('#teachInfo'),
				self = $(this),
				subject = parent.find('input[name=subject]').val(),
				grade = parent.find('input[name=grade]').val(),
				errordiv = self.siblings('.errorMsg'),
				successdiv = self.siblings('.successMsg');

			$.ajax({
				type : 'POST',
				url : '/web/user/updateTutorTeachInfo',
				data : {
					subject : subject,
					grade : grade
				},
				beforeSend : function () {
					errordiv.text('');
					console.log(grade)
					console.log(subject)
					if (!grade) {
						errordiv.text('请选择辅导年级');
						return false;
					}
					if (!subject) {
						errordiv.text('请选择辅导科目');
						return false;
					}
					self.addClass('disaled');
				},
				success : function (data) {
					if (data.code == 200) {
						successdiv.text('操作成功，跳转中...');
						setTimeout(function () {
							window.location.reload();
						}, 1500);
					} else {
						errordiv.text(data.desc);
						self.removeClass('disaled');
					}
				},
				error : function () {
					errordiv.text('网络请求错误');
					self.removeClass('disaled');
				}
			})


			return false;
		});

	};

});