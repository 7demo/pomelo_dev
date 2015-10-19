/**
 *
 * 教师课堂
 * @param Date 2015-08-18
 * @param Author SAMPAN 
 * 
 */

var cloneWindowFlag = false; //关闭窗口的标志


/**
 * 画板操作
 */

$('#pencil').on('click', function() { //画笔
	sketch.setToolkit('pencil');
	pomelo.notify('connector.roomHandler.draw',
		{
			op: ['co', 1],
			t: Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);
});
setTimeout(function (){
	$('#pencil').trigger('click');
}, 1000)

$('#eraser').on('click', function() { //橡皮擦
	sketch.setToolkit('eraser');
	pomelo.notify('connector.roomHandler.draw',
		{
			op: ['co', 3],
			t: Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);
})

$('#line').on('click', function() { //划线
	sketch.setToolkit('line');
	pomelo.notify('connector.roomHandler.draw',
		{
			op: ['co', 2],
			t: Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);
})

$('#move').on('click', function() { //移动
	sketch.setToolkit('move');
	pomelo.notify('connector.roomHandler.draw',
		{
			op: ['co', 4],
			t: Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);
})

/**
 * 画笔类型操作
 */
$('.tool-type li').click(function () {
	$(this).addClass('active').siblings('li').removeClass('active');
	switch ($(this).data().type) {
		case 'pencil':
			$('#canvas-wrap').awesomeCursor('pencil', { //画笔
				hotspot : [0, 15]
			});
			break;
		case 'line':
			$('#canvas-wrap').awesomeCursor('arrows-h', { //图形
				hotspot : [1, 7]
			}); 
			break;
		case 'earser':
			$('#canvas-wrap').awesomeCursor('eraser', { //橡皮擦
				hotspot : [7, 30]
			});
			break;
		case 'move':
			$('#canvas-wrap').awesomeCursor('eraser', { //移动
				hotspot : [1, 15]
			});
			break;
	}
	return false;
});

/**
 * 画笔颜色操作
 */
$('.tool-color').click(function () {
	$(this).addClass('active').siblings('.tool-color').removeClass('active');
	var colorType = $(this).data().value;
	sketch.setStokeColor(colorType);
	pomelo.notify('connector.roomHandler.draw',
		{
			op: ['sc', colorType],
			t: Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);
});


/**
 * 画笔大小设置
 */
$('.tool-size').click(function () {
	$('.tool-size').removeClass('active');
	$(this).addClass('active');
	var _type = $(this).data().type;
	if (_type == 'big') {
		config.PENCLE_WIDTH = 4;
		sketch.setLineWidth(config.PENCLE_WIDTH)
	} else if (_type == 'small') {
		config.PENCLE_WIDTH = 2;
		sketch.setLineWidth(config.PENCLE_WIDTH)
	}
	$('#pencil span').text(config.PENCLE_WIDTH + 'px');
	pomelo.notify('connector.roomHandler.draw',
		{
			op: ['lw', config.PENCLE_WIDTH],
			t: Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);
});

/**
 * 新建图层
 */
$('#addPage').click(function () {
	sketch.createCanvas();
	config.CANVAS_PAGE_TOTAL ++;
	config.CANVAS_PAGE_INDEX ++;
	$('#p-page-wrap li').removeClass('active');
	$('#p-page-wrap li').eq(0).after('<li class="border-box turn-page active" data-value="' + (config.CANVAS_PAGE_TOTAL) + '">' + (config.CANVAS_PAGE_TOTAL) + '</li>');
	$('#addPage span').text((config.CANVAS_PAGE_INDEX + 1) + '/' + config.CANVAS_PAGE_TOTAL);
	pomelo.notify('connector.roomHandler.draw',
		{
			op: ['cl',0],
			t: Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);

});

/**
 * 清全屏
 */
$('#clearcanavs').click(function () {
	sketch.clearCanvas();
	config.CANVAS_PAGE_TOTAL = 1;
	config.CANVAS_PAGE_INDEX = 0;
	$('#addPage span').text((config.CANVAS_PAGE_INDEX + 1) + '/' + config.CANVAS_PAGE_TOTAL);
	$('#addPage').siblings('li').eq($('#addPage').siblings('li').length - 1).trigger('click');
	var lis = $('#addPage').siblings('li');
	$.each(lis, function (i, v) {
		if (!$(v).hasClass('active')) {
			$(v).remove();
		}
	});
	pomelo.notify('connector.roomHandler.draw',
		{
			op: ['clr',0],
			t: Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);
});

/**
 * 翻页
 */
$(document).on('click', '.turn-page', function () {
	var value = parseInt($(this).data().value) - 1;
	config.CANVAS_PAGE_INDEX = value;
	sketch.switchCanvas(config.CANVAS_PAGE_INDEX);
	pomelo.notify('connector.roomHandler.draw',
		{
			op: ['sl',sketch.observeObj.currentIndex],
			t: Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);
	$('#addPage span').text((config.CANVAS_PAGE_INDEX + 1) + '/' + config.CANVAS_PAGE_TOTAL);
	$(this).addClass('active').siblings('li').removeClass('active');
});

/**
 * 图片拖动
 */
var dragEle = null;

$('#p-question').on('dragstart', 'img', function(e) {
	dragEle = e.target;
	sketch.observeObj.ctn = e.target.src
});

$('#p-question img').on('dragend', 'img', function(e) {
	dragEle = null;
	return false;
});


$("#canvas-wrap")[0].ondrop = function(e) {
	if (dragEle) {
		var img = new Image();
		img.src = sketch.observeObj.ctn;
		sketch.observeObj.tid = Date.now()
		img.onload = function() {
			var point = [e.offsetX, e.offsetY]
			sketch.setToolkit('image');
			sketch.observeObj.currentActiveToolkit.drawImage(img, point)
			var _img = sketch.observeObj.fctx.getActiveObject();
			$('#move').trigger('click');
			pomelo.notify('connector.roomHandler.draw',
				{
					op: ['im', [point[0], point[1], _img.get('currentWidth'), _img.get('currentHeight'), sketch.observeObj.ctn], sketch.observeObj.tid],
					t: sketch.observeObj.tid,
					roomID :user.roomID,
					answerID:user.answerID
				}
			)
		}
	}
	return false
}

$('#canvas-wrap')[0].ondragover = function(ev) {
	/*拖拽元素在目标元素头上移动的时候*/
	ev.preventDefault();
	return true;
};

$('#canvas-wrap')[0].ondragenter = function(ev) {
	/*拖拽元素进入目标元素头上的时候*/
	return true;
};

/**
 * 双方发起聊天
 */
$('#chatSubmit').click(function () {
	var value = $.trim($('input[name=chat]').val());
	if (!value) return;
	pomelo.request('connector.roomHandler.chat',
		{
			username: user.username, 
			role: user.role,
			roomID : user.roomID,
			msg : value,
			avatar : user.photo,
		}
	);

	$('input[name=chat]').val('');
	// log(value, user.username);
});
/**
 * enter键快捷键聊天
 */
$(document).keydown(function (e) {
	if (e.keyCode == 13) {
		$('#chatSubmit').trigger('click');
	}
});

/**
 * 双方监听聊天
 */
pomelo.on('room.chat_push', function (data) {
	console.log('chat', data);
	classroomModule.log(data.data.msg, data.data.username, data.data.avatar);	
})


/**
 * 监听浏览器关闭事件
 */

window.onbeforeunload = function () {
	if (!cloneWindowFlag) {
		return '请结束上课后再离开课堂';
	}
}


/**
 * 双方主动结束上课
 */
$('.end-course').click(function () {
	$('#p-end-course').removeClass('fn-hide');
	return false;
});

/**
 * 双方主动结束上课确定 发起请求
 */
$('#p-end-course .pop-btn-submit').click(function () {
	var self = $(this); 

	if (self.hasClass('disabled')) return;

	pomelo.request('connector.roomHandler.leave',
		{
			roomID: user.roomID,
			username:user.username,
			role :user.role
		},
		function (data) {
			self.addClass('disabled').text('退出中...')
			classroomModule.log('离开房间中...', '系统消息');
			cloneWindowFlag = true;
			endCourseFunc();
		}
	);

});

/**
 * 处理结束上课过程中保存录音失败
 */
var handlerEndError = function () {
	if (confirm('保存语音失败，你将要直接退出房间')) {
		location.href = '/web/room'
	}
}

/**
 * 已经结束上课情况下强制退出
 */
var clearClassromm = function () {
	cloneWindowFlag = true;
	if (user.role == 'teacher') { //如果是老师的话
		setTimeout(function () { //60s后也结束
			endCourseFunc();
		}, 60000)
	} else { //学生的话直接跳出
		setTimeout(function () { //30s后直接跳出
			location.href = '/web/answer';
		}, 30000);
	}
}

/**
 * 结束上课----只上传上课音频地址
 */
var endCourseFunc = function () {

	if (user.role == 'teacher') { //如果是老师 则保存录音
		var endAudioRecord = external.StopAndUploadAudio();
		var endTencentSdk = external.StopQAVSdk();
		var _role = $('#p-end-course').data().role;
		if (endAudioRecord) { // 返回的是七牛音频的地址
			endAndSavingAudio(endAudioRecord);
		} else {
			classroomModule.log('结束并保存录音sdk失败', '系统消息');
			handlerEndError();
		}
	} else { // 否则弹出评价框 进行评价
		var endAudioRecord = external.StopAndUploadAudio();
		if (!endAudioRecord) {
			classroomModule.log('结束sdk失败', '系统消息');
		}
		$('.pop').addClass('fn-hide');
		$('#p-evaluate').removeClass('fn-hide');
		
	}

}

/**
 * 结束并保存录音
 */
var endAndSavingAudio = function (audiourl) {
	$.ajax({
		type : 'POST',
		url : config.API_URL + '/api/answer/saving',
		data : {
			answerID : user.answerID
		},
		success : function (data) {
			if (data && typeof data == 'string') {
				data = JSON.parse(data);
			}
			classroomModule.log(JSON.stringify(data), '系统消息saving')
			if (data.code == 200) {

				classroomModule.log('结束并保存上传服务器音频成功', '系统消息')
				uploadAudioUrl(audiourl, function () {
					classroomModule.log('已经跳出房间中', '系统消息')
					setTimeout(function () {
						location.href = '/web/room'; 
					}, 1500);
				});
			} else {
				classroomModule.log(data.desc + 'saving', '系统消息')
				handlerEndError();
			}
		}, 
		error : function () {
			classroomModule.log('结束并保存上传服务器音频失败', '系统消息')
			handlerEndError();
		}
	})
}


/**
 * 上传音频url
 */
var uploadAudioUrl = function (audiourl, cb) {
	$.ajax({
		type : 'POST',
		url : config.API_URL + '/api/answer/success',
		data : {
			answerID : user.answerID,
			audio : audiourl
		},
		success : function (data) {
			if (data && typeof data == 'string') {
				data = JSON.parse(data);
			}
			if (data.code == 200) {
				classroomModule.log('上传音频url成功', '系统消息')
				cb && cb();
			} else {
				classroomModule.log(data.desc + '非200', '系统消息')
				handlerEndError();
			}
		}, 
		error : function () {
			classroomModule.log('上传音频url失败', '系统消息')
			handlerEndError();
		}
	})
}

/**
 * 双方监听对方已经加入房间
*/
pomelo.on('room.enter_push', function (data) {

	/**
	 * 如果存在断电重连 则清楚原倒计时
	 */
	if (!$('#p-waiting-course').hasClass('fn-hide')) {

		//重绘
		if ($('#clearcanavs').length) {
			$('#clearcanavs').trigger('click'); //老师
		} else {
			sketch.clearCanvas();
			sketch.switchCanvas(0);
		}

		$('#p-waiting-course .pop-content').html('<p>对方回来了，可以继续上课喽！</p>');
		$('#p-waiting-course').attr('data-time', 'end')
		setTimeout(function () {
			$('#p-waiting-course').addClass('fn-hide');
			$('#p-waiting-course .pop-content').html('<p>对方突然断线，等待重连中...</p><p class="countdown"><strong>05:00</strong> 后彻底断开才可离开房间</p>');
		},1500);
	}
	classroomModule.log('有人加入房间', '系统消息');
})

/**
 * 双方监听对方离开房间
 */
pomelo.on('room.leave_push', function (data) {
	console.log('room.leave_push: ', data);
	classroomModule.log('对方离开房间', '系统消息');
	$('.p-leave-course').removeClass('fn-hide');
	clearClassromm();
})

/**
 * 双方----对方离开后，自己也离开房间
 */
$('.p-leave-course .pop-btn-submit').click(function () {
	if ($(this).hasClass('disabled')) return;
	$(this).addClass('disabled').text('退出中...');
	pomelo.request('connector.roomHandler.leave',
		{
			roomID: user.roomID,
			username:user.username,
			role :user.role
		},
		function (data) {
			classroomModule.log('离开房间中...', '系统消息');
			cloneWindowFlag = true;
			endCourseFunc();
		}
	);

});

/**
 * 双方监听对方中断
 */
pomelo.on('room.close_push', function (data) {
	console.log('room.close_push', data);
	$('#p-waiting-course').removeClass('fn-hide');
	$('#p-waiting-course .pop-btn-submit').removeClass('disabled');
	var Alarm = ystool.alarm(),
		starttime = new Date().getTime(),
		endtime = starttime + 2*60*1000,
		countdown = new Alarm(starttime, endtime, function (sec, min) {  //倒计时中的函数

			$('#p-waiting-course .countdown strong').text(min + ':' + sec);
			if ($('#p-waiting-course').attr('data-time') == 'end') { //倒计时结束的话
				$('#p-waiting-course').attr('data-time', '');
				var self = this;
				clearTimeout(self.flag);
			}

		}, function () { //倒计时结束的函数
			
			if (!$('#p-waiting-course').hasClass('fn-hide')) { //若此时仍在倒计时
				$('#p-waiting-course .countdown').text('对方已断开，可以退出房间了');
				clearClassromm();
			}
			
		}, 300);
	
});

/**
 * 双方-对方断线后到时间去退出房间
 */
$('#p-waiting-course .pop-btn-submit').click(function () {

	pomelo.request('connector.roomHandler.leave',
		{
			roomID: user.roomID,
			username:user.username,
			role :user.role
		},
		function (data) {
			classroomModule.log('离开房间中...', '系统消息');
			cloneWindowFlag = true;
			endCourseFunc();
		}
	);

});

/**
 * 所有弹出框的取消按钮
 */
$('.pop-btn-cancel').click(function () {
	$(this).parents('.pop').addClass('fn-hide');
	return false;
});

/**
 * 监听pomelo关闭
 */
pomelo.on('close', function(data){
	console.log('pomelo断开链接', data);
	alert('房间已断开，请重新进行排队');
});

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