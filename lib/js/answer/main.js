/**
 *
 * 教师个人中心js
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
		 * 默认获取所有答疑记录
		 */
		getAnswer({
				url : '/api/answer/getAllAnswers',
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

		/**
		 * 进行翻页
		 */
		$('#answerPage').on('click', 'a', function () {
			var start = $(this).attr('data-value');
			getAnswer({
					url : '/api/answer/getAllAnswers',
					start : start,
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


	};

});