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
		 * 获取个人资料
		 */
		if ($('#tutorInfo').length) {
			$.ajax({
				type : 'GET',
				url : config.API_URL + '/api/teacher/info',
				success : function (data) {
					console.log(data, typeof data);
					if (!!data && typeof data == 'string') {
						data = JSON.parse(data);
					}
					if (data.code == 200) {

					} else {

					}
				},
				error : function (error) {

				}
			})
		}

		/**
		 * 辅导年级根据值设置模板
		 * gradeData 所有的值
		 * gradeCheckData 选中的值
		 * 返回模板
		 */
		var getGradeTpl = function (gradeData, gradeCheckData) {

			var gradeTpl = '';//年级选择模板

			for (var i = 0; i < gradeData.length; i++) {
				var gradeflag = false; //用来标注是否被选中
				for (var k = 0; k < gradeCheckData.length; k++) {
					if (spadger.contains(gradeData[i].value, gradeCheckData[k]) != -1) {
						gradeflag = true;
						break;
					}
				}
				if (gradeflag) {
					gradeTpl += '<span data-value="'+ gradeData[i].value +'" class="checked active">'
					gradeTpl += '	<i class="fa fa-check-square-o"></i>'
					gradeTpl += '	<i class="fa fa-square-o"></i>'
					gradeTpl += gradeData[i].key
					gradeTpl += '</span>'
				} else {
					gradeTpl += '<span data-value="'+ gradeData[i].value +'" class="checked">'
					gradeTpl += '	<i class="fa fa-check-square-o"></i>'
					gradeTpl += '	<i class="fa fa-square-o"></i>'
					gradeTpl += gradeData[i].key
					gradeTpl += '</span>'
				}
			}

			return gradeTpl;

		}

		/**
		 * 辅导科目根据值设置模板
		 * courseData 所有的值
		 * courseCheckData 选中的值
		 * 返回模板
		 */
		var getCourseTpl = function (courseData, courseCheckData) {

			var courseTpl = '';

			$.each(courseData, function (i, sub) {
				if (spadger.contains(courseCheckData, sub.value) != -1) {
					courseTpl += '<span data-value="'+ courseData[i].value +'" class="checked active">'
					courseTpl += '	<i class="fa fa-check-square-o"></i>'
					courseTpl += '	<i class="fa fa-square-o"></i>'
					courseTpl += courseData[i].key
					courseTpl += '</span>'
				} else {
					courseTpl += '<span data-value="'+ courseData[i].value +'" class="checked">'
					courseTpl += '	<i class="fa fa-check-square-o"></i>'
					courseTpl += '	<i class="fa fa-square-o"></i>'
					courseTpl += courseData[i].key
					courseTpl += '</span>'
				}
			})

			return courseTpl;

		}

		/**
		 * 获取辅导年级与辅导科目
		 */
		if ($('#tutorGrade').length) {
			$.ajax({
				type : 'GET',
				url : config.API_URL + '/api/tutor/map',
				success : function (data) {
					if (!!data && typeof data == 'string') {
						data = JSON.parse(data);
					}
					if (data.code == 200) {

						//渲染科目与年级
						var gradeData = data.data.grade,
							courseData = data.data.course;

						//获得已选的科目与年纪
						$.ajax({
							type : 'GET',
							url : config.API_URL + '/api/tutor/info',
							success : function (data) {
								if (!!data && typeof data == 'string') {
									data = JSON.parse(data);
								}
								if (data.code == 200) {

									var gradeCheckData = data.data.grade,
										courseCheckData = data.data.course;

									$('#tutorGrade').append(getGradeTpl(gradeData, gradeCheckData));
									$('#tutorGrade input').val(gradeCheckData);

									$('#tutorCourse').append(getCourseTpl(courseData, courseCheckData));
									$('#tutorCourse input').val(courseCheckData);



								} else {

								}
							},
							error : function (error) {

							}
						})

					} else {

					}
				},
				error : function (error) {

				}
			})
		}
		

		/**
		 * 默认获取个人答疑记录
		 */
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

		/**
		 * 进行翻页
		 */
		$('#answerPage').on('click', 'a', function () {
			var start = $(this).attr('data-value');
			getAnswer({
					url : '/api/answer/getAnswers',
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

	};

});