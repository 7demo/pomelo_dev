"undefined"===typeof replay&&(replay={});
(function(r){
	r.ops = [];
	r.frameInterval = 20;
	r.offset = 0;
	r.blockSize = 30000;
	r.audioURL = ""
	r.baseTime = 0
	r.frameHandle = null

	r.start = function(){
		r.getStart();
	}

	r.stop = function(){
		clearInterval(r.frameHandle);
	}

	r.getStart = function(data, callback){
		console.log("Step 1: start get operations!");
		$.ajax({
			type : 'POST',
			url : config.API_URL + '/api/answer/getOps',
			success : function(data) {
				console.log('操作的数据', data)
				if (data.code != 200 ) {
					r.stop();
				} else {
					r.offset += data.data.length;
					r.ops.length == 0 ? r.ops = data.data : r.ops.concat(data.data);
					if (r.ops.length > 0 ) {
						var newOp = r.ops[0]
						r.baseTime = newOp.t
						console.log("r.baseTime",r.baseTime)
					}
					r.getOps()
				}
			},
			error : function(){
				r.stop();
			},
			data : {
				answerID : user.answerID,
				start : r.offset,
				count : r.blockSize || 30000
			},
			dataType : 'json'
		})
	}

	r.getOps = function(){
		console.log("Step 2: start get answer audio!");
		
		$.ajax({
			type : 'POST',
			url : config.API_URL + '/api/answer/getAnswer',
			success : function(data) {
				$('.shadow, .loading').addClass('fn-hide');
				console.log("getAnswering:",JSON.stringify(data))
				if (data.code != 200) {
					r.stop();
				} else {
					console.log(data.data.answer.question.imgUrl);
					$('#p-question ul').html('<li><img src="'+ data.data.answer.question.imgUrl +'" height="100%"></li>');
					/**
					 * 问题尺寸初始化
					 */
					setQuestion.init();

					r.audioURL = data.data.answer.audio;
					audio.callback = function(time){
						var nowOps = r.getCanOps(time)
						for (var i = 0; i < nowOps.length; i++) {
							var next = nowOps[i]
							// console.log(JSON.stringify(next.op))

							next.op ? sketch && sketch.onCommand(next.op) : audio.actions.pause()
						};
						
					}
					audio.fCallBack = function(){
						console.log("playfinish")
						if (r.ops.length > 0) {
							r.frameHandle = setInterval(r.loadByData, 30);
						}
					}
					if(r.audioURL == undefined){
						console.log("getaudiofailed")
						r.frameHandle = setInterval(r.loadByData, 30);
					}
					audio.playWithURL(r.audioURL)
					
				}
			},
			error : function(){
				r.stop();
			},
			data : {
				answerID : user.answerID
			},
			dataType : 'json'
		})
	}

	r.loadByData = function(){
		
		if (r.ops.length > 0) {
			var newOp = r.ops.shift()
			console.log(JSON.stringify(newOp))
			newOp.op && sketch && sketch.onCommand(newOp.op) 
		}else{

			r.frameHandle && clearInterval(r.frameHandle);
			return;
		}
		
	}

	r.getCanOps = function(time){
		var lists = []
		if (r.ops.length > 0) {
			for (var i = 0; i < r.ops.length; i++) {
				var newOp = r.ops[i]
				var timesamp = newOp.t - r.baseTime
				if (timesamp < time) {
					lists.push(r.ops.shift())
				}else{
					break;
				}
			};
		}
		return lists
	}

	r.getOp = function(){
		return r.ops.length ? r.ops.shift() : null;
	}
})(replay);