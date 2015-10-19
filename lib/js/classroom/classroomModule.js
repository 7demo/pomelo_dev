/**
 * 
 * 画板功能性方法
 * 
 */

(function (window, undefined) {

	var classroomModule  = {
		/**
		 * 聊天（）
		 * @param  {[string/object]} msg   [聊天内容，若为object时，则定为调试，采用console.log]
		 * @param  {[string]} title [聊天名字]
		 * @param  {[string]} photo [头像的url]
		 * @return {[string]}       [聊天内容模板]
		 */
		chatMsg : function (msg, title, photo) {
			var _title = title || '系统消息',
				_photo = photo,
				_msg = typeof msg == 'object'?'请在控制台查看此条输出' : msg,
				tpl = '';

			tpl += '<dl>'
			if (typeof msg == 'object') {
				tpl += '	<dt class="danger">'
			} else {
				tpl += '	<dt>'
			}
			tpl += '		<img src='+ _photo +' alt="">'
			tpl += 			_title
			tpl += '	</dt>'
			tpl += '	<dd>'+ _msg +'</dd>'
			tpl += '</dl>'

			if (typeof msg == 'Object') { //
				console.log(msg);
			}

			return tpl;
		},
		
		/**
		 *
		 * 调试输出js
		 * @param {string/object} [para] [调试输出信息]
		 */
		log : function (ctn, title, img) {
			var imgphoto = __inline('/lib/images/photo_t.jpg');
			var tpl = classroomModule.chatMsg(ctn, title, img || imgphoto);
			$('#chat').append(tpl);
			$('#chat').animate({'scrollTop' : $('#chat dl').length * ($('#chat dl').height() + 20 )}, 300)
		},

		/**
		 * 获得画板最大的大小
		*/
		getCanvasMaxSize : function (width, height) {
			var maindiv = $('.p-main'),
				rightside = $('.p-status-wrap'),
				mainWidth = maindiv.width(),
				sideWidth = rightside.width(),
				width = mainWidth - sideWidth,
				height = maindiv.height();

			return {
				width : width,
				height : height
			}
		},

		/**
		 * 画板初始化
		*/
		initPainter : function (width, height) {
			var canvasWrap = $('#canvas-wrap'), //画板外围div
				canvas = $('#canvas'), //画板
				padding = 0; //padding 单
			
			canvasWrap.css({'width' : width + padding * 2, 'height' : height + padding * 2});
			console.log(canvas, width, height);
			canvas.attr('width', width);
			canvas.attr('height', height);
		},

		/**
		 * 设置问题幻灯片
		 */
		setQuestion : function () {
			var parent = $('#p-question'),
				ul = parent.find('ul'),
				li = parent.find('li'),
				img = parent.find('img'),
				fa = parent.find('.fa'),
				width = parent.width(),
				height = parent.height();
			li.css('width', width);
			ul.css({'width' : width * li.length});
			fa.css('top', height / 2 - 10);
			ul.css('opacity', '1');

			if (li.length > 1) {
				fa.show();
			} else {
				fa.hide();
			}

			$('#question-left').click(function () {
				var _li = parent.find('li');
				ul.stop(true, true).animate({'margin-left' : -1 * width}, 300, function () {
					ul.css({'margin-left' : 0});
					ul.append(_li.eq(0));
				})
			});

			$('#question-right').click(function () {
				var _li = parent.find('li');
				ul.prepend(_li.eq(_li.length - 1));
				ul.css({'margin-left' : -1 * width});
				ul.stop(true, true).animate({'margin-left' : 0}, 300)
			});
		},

		/**
		 * 检测环境时候错误，初始化状态
		 */
		initErrorFunc : function () {
			cloneWindowFlag = true;
			$('.loading').html('<a href="/web/room">重启匹配</a>');
			// $('.shadow, .loading').removeClass('fn-hide');
		},

		/**
		 * 教师进入检测初始化环境
		 */
		tencentsdkRecordTutorCheck : function (data) {
			var tencentSdkCheck = external.StartQAVSdk(user.uid, "1234", user.roomID),
				recordCheck = external.StartRecordAudio();
			if (tencentSdkCheck && recordCheck) {
				classroomModule.log('sdk和录音初始化成功', '系统消息');
				/**
				 * 问题尺寸初始化
				 */
				$('#p-question ul').html('<li><img src="' + data.data.question.imgUrl +'"></img></li>');
				classroomModule.setQuestion();
				$('.shadow, .loading').addClass('fn-hide');
			} else {
				initErrorFunc();
				alert('加载sdk失败');
			}
		},

		/**
		 * 学生进入检测初始化环境
		 */
		tencentsdkRecordStudentCheck : function (data) {
			var tencentSdkCheck = external.StartQAVSdk(user.uid, "1234", user.roomID);
			if (tencentSdkCheck) {
				classroomModule.log('sdk初始化成功', '系统消息');
				/**
				 * 问题尺寸初始化
				 */
				$('#p-question ul').html('<li><img src="' + data.data.question.imgUrl +'"></img></li>');
				classroomModule.setQuestion()
				$('.shadow, .loading').addClass('fn-hide');
			} else {
				initErrorFunc();
				alert('加载sdk失败');
			}
		}

	};

	window.classroomModule =  classroomModule;

})(window);

