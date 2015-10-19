/**
 * 
 * 播放答疑记录js
 * 
 * 
 */

(function (window, undefined) {

	/**
	 * replay 对象
	 * @type {Object}
	 */
	var replay = {
		
		ops : [], //获得操作存放的点儿
		offset : 0, //当前请求到数据的长度
		blockSize : 30000, //每次请求数据的长度
		audioURL : undefined, //存放音频url
		frameInterval : 20, //播放帧频
		baseTime : 0, //用于播放的时候 存放操作数据中第一条数据的时间戳
		frameHandle : null
		
	}

	/**
	 * 开始画布播放的操作
	 */
	replay.start = function () {
		
		console.log("Step 1: start get operations!");

		$.when(replay.getOpsData(), replay.getAudioData())
			.done(replay.playData)
			.fail(replay.handleGetDataError);

	}

	/**
	 * 从服务器获取操作数据 为 promise 对象
	 */
	replay.getOpsData = function () {

		return $.ajax({
			type : 'POST',
			url : config.API_URL + '/api/answer/getOps',
			data : {
				answerID : user.answerID,
				start : replay.offset,
				count : replay.blockSize
			},
			dataType : 'json'
		})
		.done (function (data) {

			if (data.code == 200) {
				//当前请求的长度值
				replay.offset += data.data.length; 
				//拼接操作数据
				replay.ops = replay.ops.concat(data.data);
				replay.baseTime = replay.ops[0].t;
			} else {
				alert(data.desc);
				replay.stop();
			}
			
		})

	}

	/**
	 * 从服务器获取音频数据 为 promise 对象
	 */
	replay.getAudioData = function () {

		return $.ajax({
			type : 'POST',
			url : config.API_URL + '/api/answer/getAnswer',
			data : {
				answerID : user.answerID
			},
			dataType : 'json',
		})
		.done(function (data) {

			if (data.code == 200) {
				$('#p-question ul').html('<li><img src="'+ data.data.question.imgUrl +'" height="100%"></li>');
				/**
				 * 问题尺寸初始化
				 */
				classroomModule.setQuestion();
				replay.audioURL = data.data.audio;
			} else {
				alert(data.desc)
				replay.stop();
			}

		})

	}

	/**
	 * 从服务器请求数据成功（音频，数据都成功） 播放音频
	 */
	replay.playData = function () {

		//音频播放成功的方法  
		//time 是 当前音频播放到第多少毫秒的时间
		audio.callback = function(time){
			var nowOps = replay.getCanOps(time)
			for (var i = 0; i < nowOps.length; i++) {
				var next = nowOps[i]
				next.op ? sketch && sketch.onCommand(next.op) : audio.actions.pause()
			};
			
		}
		//音频播放完毕的方法
		audio.fCallBack = function(){
			console.log("playfinish")
			if (replay.ops.length > 0) {
				replay.frameHandle = setInterval(replay.loadByData, replay.frameInterval);
			}
		}

		//有视频url的话 则播放音频  此处不需要调用播放数据的方法
		if(replay.audioURL){
			console.log("getaudiofailed")
			audio.playWithURL(replay.audioURL);
			// replay.frameHandle = setInterval(replay.loadByData, replay.frameInterval);
		} else { //没有音频的时候 只播放数据 但是没有暂停
			if (replay.ops.length > 0) {
				replay.frameHandle = setInterval(replay.loadByData, replay.frameInterval);
			}
		}
		$('.shadow, .loading').addClass('fn-hide');

	}

	/**
	 * 继续播放
	 */
	

	/**
	 * 从服务器请求数据失败（音频、数据有一个触发失败即请求失败）
	 */
	replay.handleGetDataError = function () {

		alert('请求数据失败， 请刷新重试');

	}

	/**
	 * 读取操作数据 进行绘制
	 */
	replay.loadByData = function(){
		
		if (replay.ops.length) {
			var newOp = replay.ops.shift()
			newOp.op && sketch && sketch.onCommand(newOp.op) 
		} else {
			clearInterval(replay.frameHandle);
			return;
		}
		
	}

	/**
	 * 停止绘制
	 */
	replay.stop = function(){

		clearInterval(replay.frameHandle);

	}

	/**
	 * //time 是 当前音频播放到第多少毫秒的时间
	 * 根据当前操作播放的时间 小于 音频的播放时间来控制操作播放速度
	 */
	replay.getCanOps = function(time){

		var lists = [];
		for (var i = 0; i < replay.ops.length; i++) {
			var newOp = replay.ops[i];
			var timesamp = newOp.t - replay.baseTime //当前帧的时间减去第一帧的时间 即是当前播放的时长
			if (timesamp < time) { //当前操作数据的播放时长小于音频播放时长的时候

				lists.push(replay.ops.shift())

			} else {
				break;
			}
		};
		return lists;

	}

	window.replay = replay;

})(window);