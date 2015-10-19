/**
 *
 * 学生个人中心js
 * 
 */
define(function (require, exports, module) {

	var $ = require('lib/compontent/jquery/jquery.min'),
		answerLi = require('lib/js/modules/answerListModule'),
		getAnswer = require('lib/js/modules/getAnswerModule'),
		spadger = require('lib/js/modules/spadger'),
		config = require('lib/js/config');
	exports.init = function () {
		

		/**
		 * 默认获取个人答疑记录
		 */
		if ($('#answerList').length) {
			getAnswer({
					url : '/api/answer/getAnswers',
					start : 0,
					count : 10
				}, function (data) {
					$('#answerList').html(answerLi(data.answers));
					$('#answerPage').html(spadger.createPage(
						{
							active : 1,  
							total : Math.ceil(data.total / 10),
							url : '', 
							pageTpl : '<a href="" data-value="#"></a>',
							activeTpl : '<span class="active"></span>',
							totalTpl : '<span></span>' 
						}
					))
				}
			);
		}
		

		/**
		 * 进行翻页
		 */
		$('#answerPage').on('click', 'a', function () {
			var start = $(this).attr('data-value');
			getAnswer({
					url : '/api/answer/getAnswers',
					start : (start - 1) * 10,
					count : 10
				}, function (data) {
					$('#answerList').html(answerLi(data.answers));
					$('#answerPage').html(spadger.createPage(
						{
							active : start,  
							total : Math.ceil(data.total / 10),
							url : '', 
							pageTpl : '<a href="" data-value="#"></a>',
							activeTpl : '<span class="active"></span>',
							totalTpl : '<span></span>' 
						}
					))
				}
			);
			return false;
		});
		
		/**
		 * 教学资料提交 
		 */
		$('#tutorInfo .submit').click(function () {
			
			if ($(this).hasClass('disaled')) return;

			var parent = $('#tutorInfo'),
				self = $(this),
				subject = parent.find('input[name=subject]').val(),
				grade = parent.find('input[name=grade]').val(),
				errordiv = self.siblings('.errorMsg'),
				successdiv = self.siblings('.successMsg');

			$.ajax({
				type : 'POST',
				url : config.API_URL + '/api/tutor/update',
				data : {
					course : subject,
					grade : grade
				},
				beforeSend : function () {
					errordiv.text('');
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

		/**
		 * 获取会员卡到期时间
		 */
		if ($('#exchangeCode').length) {
			$.ajax({
				type : 'GET',
				url : config.API_URL + '/api/card/getExpire',
				success : function (data) {
					console.log(data);
					if (data.code == 200) {
						var tpl = '';
						if (data.data.primaryAnswerExpire && data.data.primaryAnswerExpire != '0') {
							tpl += '小学卡到期时间：' + spadger.timeStampToTime(data.data.primaryAnswerExpire) + ' ; '
						}
						if (data.data.juniorAnswerExpire && data.data.juniorAnswerExpire != '0') {
							tpl += '初中卡到期时间：' + spadger.timeStampToTime(data.data.juniorAnswerExpire) + ' ; '
						}
						if (data.data.seniorAnswerExpire && data.data.seniorAnswerExpire != '0') {
							tpl += '高中卡到期时间：' + spadger.timeStampToTime(data.data.seniorAnswerExpire) + ' ; '
						}
						$('#exchangeCode').html(tpl);
					} else {
						alert(data.desc);
					}
					
				},
				error : function () {

				}

			})
		}

		/**
		 * 兑换会员卡
		 */
		$('#exchangeCodeSubmit').click(function () {

			var self = $(this),
				btnTxt = self.text(),
				val = $.trim($('input[name=exchangeCode]').val()),
				errordiv = self.siblings('.errorMsg'),
				successdiv = self.siblings('.successMsg');

			$.ajax({
				type : 'POST',
				url : config.API_URL + '/api/card/use',
				data :　{
					cardNumber : val
				},
				beforeSend : function () {
					errordiv.text('');
					if (!val) {
						errordiv.text('请填写兑换卡号')
						return false;
					}
					self.addClass('disaled').text('提交中');
				},
				success : function (data) {
					if (data.code == 200) {
						successdiv.text('兑换成功，跳转中...');
						setTimeout(function () {
							window.location.reload();
						}, 1000);
					} else {
						errordiv.text(data.desc);
						self.removeClass('disaled').text(btnTxt);
					}
				}, 
				error : function () {
					errordiv.text('网络有问题，请检查后重试');
					self.removeClass('disaled').text(btnTxt);
				}

			})

		});





	};

});