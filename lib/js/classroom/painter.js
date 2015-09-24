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
$('.tool-type li').eq(0).trigger('click');

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
 * 画笔实线虚线切换
 */
// $('.tool-pencil-line').click(function () {
// 	$(this).addClass('active').siblings('.tool-pencil-line').removeClass('active');
// 	var lineType = $(this).data().value;
// 	// sketch.setStokeColor(colorType);
// 	// connect && connect.send({
// 	// 	c: 'room.draw',
// 	// 	data: {
// 	// 		op: ['sc', lineType],
// 	// 		t: Date.now(),
// 	// 		roomID :user.roomID,
// 	// 		answerID:user.answerID
// 	// 	}
// 	// });
// });

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
			op: ['lw', sketch.diameter],
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
			op: ['sl',sketch.currentIndex],
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
	sketch.ctn = e.target.src
});

$('#p-question img').on('dragend', 'img', function(e) {
	dragEle = null;
	return false;
});


$("#canvas-wrap")[0].ondrop = function(e) {
	if (dragEle) {
		var img = new Image();
		img.src = sketch.ctn;
		sketch.tid = Date.now()
		img.onload = function() {
			var point = [e.offsetX, e.offsetY]
			sketch.setToolkit('image');
			sketch.Toolkit.drawImage(img, point)
			var _img = sketch.fctx.getActiveObject();
			$('#move').trigger('click');
			pomelo.notify('connector.roomHandler.draw',
				{
					op: ['im', [point[0], point[1], _img.get('currentWidth'), _img.get('currentHeight'), sketch.ctn], sketch.tid],
					t: sketch.tid,
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
			photo : user.photo,
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
	log(data.data.msg, data.data.username, data.data.photo);	
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

	cloneWindowFlag = true;
	pomelo.request('connector.roomHandler.leave',
		{
			roomID: user.roomID,
			username:user.username,
			role :user.role
		},
		function (data) {
			console.log('离开房间');
		}
	);
	var _role = $('#p-end-course').data().role;
	if (_role == 'tutor') { //教师的话直接跳转页面
		$('#p-end-course').attr('data-close', 'false');
		self.text('跳转中').addClass('disabled');
		var t = setInterval(function () {
			if ($('#p-end-course').attr('data-close') == 'true') {
				location.href = '/web/room'; 
				clearInterval(t);
				console.log('教师压缩视频完成，退出房间啊'); 
			}
		}, 1000);
	} else if (_role == 'student') { //学生的话跳出评价框
		$('#p-evaluate').removeClass('fn-hide');
		$('#p-end-course').addClass('fn-hide');
	}
});



/**
 * 双方监听对方已经加入房间
*/
pomelo.on('room.enter_push', function (data) {
	console.log('room.enter_push: ', data);
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
	log('有人加入房间', '系统消息');
})

/**
 * 双方监听对方离开房间
 */
pomelo.on('room.leave_push', function (data) {
	console.log('room.leave_push: ', data);
	log('对方离开房间', '系统消息');
	$('.p-leave-course').removeClass('fn-hide');
})

/**
 * 双方----对方离开后，自己也离开房间
 */
$('.p-leave-course .pop-btn-submit').click(function () {

	pomelo.request('connector.roomHandler.leave',
		{
			roomID: user.roomID,
			username:user.username,
			role :user.role
		},
		function (data) {
			console.log(data);
		}
	);

	cloneWindowFlag = true;
	var role = $('.p-leave-course').data().role;
	if (role == 'teacher') { //我是教师
		location.href = '/web/room';
	} else if (role == 'student') {
		$('.p-leave-course').addClass('fn-hide');
		$('#p-evaluate').removeClass('fn-hide');
	}

});

/**
 * 双方监听对方中断
 */
pomelo.on('room.close_push', function (data) {
	console.log('room.close_push', data);
	$('#p-waiting-course').removeClass('fn-hide');
	var Alarm = ystool.alarm(),
		starttime = new Date().getTime(),
		endtime = starttime + 5*60*1000,
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
				cloneWindowFlag = true;
				$('#p-waiting-course .pop-btn-submit').removeClass('disabled');
			}
			
		}, 300);
	
});

/**
 * 双方-对方断线后到时间去退出房间
 */
$('#p-waiting-course .pop-btn-submit').click(function () {

	if ($(this).hasClass('disabled')) return;
	location.href = '/web/room';

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
	alert('房间已断开，请重新进行排队链接');
});