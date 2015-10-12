/**
 * 
 * 评价方面的js
 * 
 */

/**
 * 鼠标移动到star
 */
$('#p-evaluate-star i.fa').mouseenter(function () {
	var index = $('#p-evaluate-star i.fa').index($(this)),
		fas = $('#p-evaluate-star i.fa');
	$.each(fas, function (i, v) {
		if (index + 1 <= i) {
			$(v).removeClass('fa-star').addClass('fa-star-o');
		} else {
			$(v).removeClass('fa-star-o').addClass('fa-star');
		}
	})
});

/**
 * 鼠标移出star
 */
$('#p-evaluate-star i.fa').mouseleave(function () {
	var index = $('input[name=evaluate]').val(),
		fas = $('#p-evaluate-star i.fa');
	$.each(fas, function (i, v) {
		if (index <= i) {
			$(v).removeClass('fa-star').addClass('fa-star-o');
		} else {
			$(v).removeClass('fa-star-o').addClass('fa-star');
		}
	})
});

/**
 * 鼠标点击star
 */
$('#p-evaluate-star i.fa').click(function () {
	var index = $('#p-evaluate-star i.fa').index($(this));
	$('input[name=evaluate]').val(index + 1);
});

/**
 * 评价提交
 */
$('#p-evaluate  .submit').click(function () {
	var self = $(this),
		parent = $('#p-evaluate'),
		errorMsg = parent.find('.errorMsg'),
		successMsg = parent.find('.successMsg'),
		star = parent.find('input[name=evaluate]').val(),
		ctn = $.trim(parent.find('textarea[name=evaluate-ctn]').val());
	if (self.hasClass('disabled')) return;
	$.ajax({
		type : 'POST',
		url : '/api/answer/evaluate',
		data : {
			answerID : user.answerID,
			score : star,
			comment : ctn
		},
		beforeSend : function () {
			
			errorMsg.text('');
			successMsg.text('');

			if (star == '0') {
				errorMsg.text('请选择评价星级');
				return false;
			}

			if (!ctn) {
				errorMsg.text('请填写评价内容');
				return false;
			}

			self.addClass('disabled');

		},
		success : function (data) {
			if (data.code == '200') {
				successMsg.text('评价成功，跳转中...');
				setTimeout(function () {
					location.href = '/web/answer'; 
				}, 1500);
			} else {
				self.removeClass('disabled');
			}
		},
		error : function () {
			self.removeClass('disabled');
		}

	})

});

/**
 * 跳过评价
 */
$('#p-evaluate .cancel').click(function () {
	location.href = '/web/answer';
});