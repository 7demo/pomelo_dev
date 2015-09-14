$(document).ready(function() {	
	$('#endAnswering').on('click', function() {
		connect && connect.send({
			c: 'room.leave',
			data: { roomID: user.roomID,username:user.username,role :user.role }
		});
		location.href = '/answer/answers';
	});
	// socket.init(config.wsServerIP, config.wsServerPort, 'echo-protocol');
	sketch.init('canvas', "active");

	$('#pencil').on('click', function() {
		$(".canvasWrapper").css("cursor","").css("cursor","url(/img/sketch/line.cur) 0 16,default")
		sketch.setToolkit('pencil');
	});
	$('#eraser').on('click', function() {
		$(".canvasWrapper").css("cursor","").css("cursor","url(/img/sketch/eraser.cur) 0 16,default ")
		sketch.setToolkit('eraser');
	})
	$('#font').on('click', function() {
		$(".canvasWrapper").css("cursor","").css("cursor","url(/img/sketch/text.cur) 0 16,default")
		sketch.setToolkit('font');
	})
	$('#rectangle').on('click', function() {
		$(".canvasWrapper").css("cursor","").css("cursor","url(/img/sketch/shape.cur) 0 16,default")
		sketch.setToolkit('rectangle');
	})
	$('#circle').on('click', function() {
		$(".canvasWrapper").css("cursor","").css("cursor","url(/img/sketch/shape.cur) 0 16,default")
		sketch.setToolkit('circle');
	})
	$('#triangle').on('click', function() {
		$(".canvasWrapper").css("cursor","").css("cursor","url(/img/sketch/shape.cur) 0 16,default")
		sketch.setToolkit('triangle');
	})
	$('#line').on('click', function() {
		$(".canvasWrapper").css("cursor","").css("cursor","url(/img/sketch/shape.cur) 0 16,default")
		sketch.setToolkit('line');
	})
	$('#move').on('click', function() {
		$(".canvasWrapper").css("cursor","").css("cursor","url(/img/sketch/move.cur) 0 16,default")
		sketch.setToolkit('move');
	})
	$("#fillColor").on("change", function() {
		var color = $(this).find("option:selected").attr("type")
		sketch.setFillColor(color)
		connect && connect.send({
			c: 'room.draw',
			data: {
				op: ['fc', color],
				t: Date.now(),
				roomID :user.roomID,
				answerID:user.answerID
			}
		});
	})
	$("#strokeColor").on("change", function() {
		var color = $(this).find("option:selected").attr("type")
		sketch.setStokeColor(color)
		connect && connect.send({
			c: 'room.draw',
			data: {
				op: ['sc', color],
				t: Date.now(),
				roomID :user.roomID,
				answerID:user.answerID
			}
		});
	})
	$("#lineWidth").on("change", function() {
		var width = $(this).find("option:selected").attr("type")
		sketch.setLineWidth(width)
		connect && connect.send({
			c: 'room.draw',
			data: {
				op: ['lw', sketch.diameter],
				t: Date.now(),
				roomID :user.roomID,
				answerID:user.answerID
			}
		});
	})
	$("#page").on("change", function() {
		console.log("switch")
		var obj = $(this).find("option:selected")
		var index = $("#page option").index(obj)
		console.log(index)
		sketch.switchCanvas(index)
		connect  && connect.send({c:'room.draw', data:{roomID :user.roomID,answerID:user.answerID,op:['sl', sketch.currentIndex],t:Date.now()}});
	})

	$("#createCanvas").click(function(e) {
		sketch.createCanvas()
		var newIndex = sketch.currentIndex + 1
		$('#page').append("<option type=" + newIndex + ">" + newIndex + "</option>");
		console.log("last", $('#page option').last())
		$('#page option').last().attr("selected", true);
		connect  && connect.send({c:'room.draw', data:{roomID :user.roomID,answerID:user.answerID,op:['cl',0],t:Date.now()}});
	})

	var dragEle = null;

	$('#question').on('dragstart', 'img', function(e) {
		dragEle = e.target;
		sketch.ctn = e.target.src
	});

	$('#question img').on('dragend', 'img', function(e) {
		dragEle = null;
		return false;
	});


	$("#canvas")[0].ondrop = function(e) {
		if (dragEle) {
			var img = new Image();
			img.src = sketch.ctn;
			sketch.tid = Date.now()
			img.onload = function() {
				var point = [e.offsetX, e.offsetY]
				sketch.setToolkit('image');
				sketch.Toolkit.drawImage(img, point)
				var _img = sketch.fctx.getActiveObject();
				var info = {
					c: 'room.draw',
					data: {
						op: ['im', [point[0], point[1], _img.get('currentWidth'), _img.get('currentHeight'), sketch.ctn], sketch.tid],
						t: sketch.tid,
						roomID :user.roomID,
						answerID:user.answerID
					}
				}
				console.log(info)
				connect && connect.send(info)
			}
		}
		return false
	}

	$('#canvas')[0].ondragover = function(ev) {
		/*拖拽元素在目标元素头上移动的时候*/
		ev.preventDefault();
		return true;
	};

	$('#canvas')[0].ondragenter = function(ev) {
		/*拖拽元素进入目标元素头上的时候*/
		return true;
	};
})