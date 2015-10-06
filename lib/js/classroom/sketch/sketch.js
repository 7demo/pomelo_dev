"undefined"===typeof sketch && (sketch={});
(function(g){
	g.toolkit = {};
	g.trace = [];
	g.mode = 'passive';
	g.init = function(id, mode) {
		g.dom = document.getElementById(id);
		
		g.ctn = ""
		g.mode = mode ? mode : 'passive';
		g.canvasArray = [] 
		g.canvasArray.push(new YSCanvas(g.dom,g.canvasArray.length + 1))
		g.currentIndex = 0
		g.canvas =  g.canvasArray ? g.canvasArray[g.currentIndex].getWriteCanvas() : null;
		g.ctx = g.canvasArray ? g.canvasArray[g.currentIndex].getWrite() : null;
		g.fctx = g.canvasArray ? g.canvasArray[g.currentIndex].getShape() : null;
		g.tid = 0
		g.strokeStyle = '#000';
		
		g.frameInterval = 20;
		g.setToolkit('pencil');
		g.DrawStokeWidth = {
		    level1 : 2,
		    level2 : 3,
		    level3 : 5
		}
		g.DrawStokeColor = {
		    redColor:"#C40000",
		    blackColor:"#333",
		    greenColor:"#078F25",
		    blueColor:"rgba(0, 0, 255, 1)",
		    clearColor:"rgba(255, 255, 255, 0)"

		    // redColor:"rgba(255, 0, 0, 1)",
		    // blackColor:"rgba(0, 0, 0, 1)",
		    // greenColor:"rgba(0, 255, 0, 1)",
		    // blueColor:"rgba(0, 0, 255, 1)",
		    // clearColor:"rgba(255, 255, 255, 0)"
		}
		g.DrawFillColor = {
		    redColor:"rgba(255, 0, 0, 1)",
		    blackColor:"rgba(0, 0, 0, 1)",
		    greenColor:"rgba(0, 255, 0, 1)",
		    blueColor:"rgba(0, 0, 255, 1)",
		    clearColor:"rgba(255, 255, 255, 0)"
		}
		g.diameter = g.DrawStokeWidth.level1;
	}

	g.createCanvas = function(){
		g.canvasArray.push(new YSCanvas(g.dom,g.canvasArray.length + 1))
		g.currentIndex = g.canvasArray.length - 1 
		g.canvasArray[g.currentIndex].setActive()
		console.log("g.currentIndex",g.currentIndex)
		g.canvas =  g.canvasArray ? g.canvasArray[g.currentIndex].getWriteCanvas() : null;
		g.ctx = g.canvasArray ? g.canvasArray[g.currentIndex].getWrite() : null;
		g.fctx = g.canvasArray ? g.canvasArray[g.currentIndex].getShape() : null;
		
	}

	g.clearCanvas = function () {

		g.canvasArray.splice(1, g.canvasArray.length - 1);
		g.currentIndex = g.canvasArray.length - 1 
		g.canvasArray[g.currentIndex].setActive()
		console.log("g.currentIndex",g.currentIndex)
		g.canvas =  g.canvasArray ? g.canvasArray[g.currentIndex].getWriteCanvas() : null;
		g.ctx = g.canvasArray ? g.canvasArray[g.currentIndex].getDown() : null;
		g.fctx = g.canvasArray ? g.canvasArray[g.currentIndex].getShape() : null;
		var _objects = g.fctx._objects;
		$.each(_objects, function (i, v) {
			v.remove();
		});
		
		g.ctx.clearRect(0,0,1330,728);
		$('#page1').siblings('div.pagebg').remove();
	}

	g.switchCanvas = function(index){
		g.currentIndex = index;
		console.log(g.canvasArray, g.currentIndex);
		g.canvasArray[g.currentIndex].setActive()
		g.canvas =  g.canvasArray ? g.canvasArray[g.currentIndex].getWriteCanvas() : null;
		g.ctx = g.canvasArray ? g.canvasArray[g.currentIndex].getWrite() : null;
		g.fctx = g.canvasArray ? g.canvasArray[g.currentIndex].getShape() : null;
		
	}

	//线条颜色
	g.setStokeColor = function(color){
	    switch(color){
	        case "red":
	            g.strokeStyle = g.DrawStokeColor.redColor
	            break;
	        case "black":
	            g.strokeStyle = g.DrawStokeColor.blackColor
	            break;
	        case "green":
	            g.strokeStyle = g.DrawStokeColor.greenColor
	            break;
	        case "blue":
	            g.strokeStyle = g.DrawStokeColor.blueColor
	            break;
	        case "clear":
	            g.strokeStyle = g.DrawStokeColor.clearColor
	            break;
	        default : 
	        	g.strokeStyle = color;
	    }
	}

	g.setFillColor = function(color){
	    switch(color){
	        case "red":
	            g.fillStyle = g.DrawFillColor.redColor;
	            break;
	        case "black":
	            g.fillStyle = g.DrawFillColor.blackColor
	            break;
	        case "green":
	            g.fillStyle = g.DrawFillColor.greenColor
	            break;
	        case "blue":
	            g.fillStyle = g.DrawFillColor.blueColor
	            break;
	        case "clear":
	            g.fillStyle = g.DrawFillColor.clearColor
	            break;
	    }
	}

	g.setLineWidth = function(width){
		g.diameter = width;
		// switch(width){
		// 	case "1":
		// 		g.diameter = g.DrawStokeWidth.level1
		// 		console.log("console.log(gDrawStokeColor.diameter)",g.diameter)
		// 		break;
		// 	case "2":
		// 		g.diameter = g.DrawStokeWidth.level2
		// 		console.log("console.log(g.diameter)",g.diameter)
		// 		break;
		// 	case "3":
		// 		g.diameter = g.DrawStokeWidth.level3
		// 		console.log("console.log(g.diameter)",g.diameter)
		// 		break;
		// 	default :
		// 	 	g.diameter = width;
		// }
	}

	g.registerToolkit = function (t, f) {
		g.toolkit[t] = f;
	}

	g.setToolkit = function(t) {
		
		g.Toolkit && g.Toolkit.isEnabled && g.Toolkit.disable();
		delete g.Toolkit;
		g.Toolkit = new g.toolkit[t]();
		g.Toolkit.enable();
	}

	g.onCommand = function(c) {
		c= parseCommand(c);
		
		if (c.type == 'mm') {
			//移动鼠标
			g.Toolkit && g.Toolkit.id != 'mousemove' && g.setToolkit('mousemove');
		} else if(c.type == 'pm') {
			g.Toolkit && g.Toolkit.id != 'pencil' && g.setToolkit('pencil');
			c.path && g.Toolkit.render(c.path);
		} else if(c.type == 'em') {
			
			g.Toolkit && g.Toolkit.id != 'eraser' && g.setToolkit('eraser');

			c.path && g.Toolkit.render(c.path);
		}else if(c.type == 'rm') {
			g.tid = c.tid
			g.Toolkit && g.Toolkit.id != 'rectangle' && g.setToolkit('rectangle');
			c.path && g.Toolkit.render(c.path);
		}else if(c.type == 'cm') {
			g.tid = c.tid
			g.Toolkit && g.Toolkit.id != 'circle' && g.setToolkit('circle');
			c.path && g.Toolkit.render(c.path);
		}else if(c.type == 'tm') {
			g.tid = c.tid
			g.Toolkit && g.Toolkit.id != 'triangle' && g.setToolkit('triangle');
			c.path && g.Toolkit.render(c.path);
		}else if(c.type == 'mo') {
			g.Toolkit && g.Toolkit.id != 'modifyObject' && g.setToolkit('modifyObject');
			c.path && c.tid && g.Toolkit.update(c.path,c.tid)
		}else if(c.type == 'lm') {
			g.tid = c.tid
			g.Toolkit && g.Toolkit.id != 'line' && g.setToolkit('line');
			c.path && g.Toolkit.render(c.path);
		}else if(c.type == 'fc') {
			
			c.path  && g.setFillColor(c.path)
		}else if(c.type == "sc") {
			
			c.path && g.setStokeColor(c.path)
		}else if(c.type == "fm") {
			
			// [_text.get('left'),_text.get('top'),_text.get('currentWidth'),_text.get('currentHeight')],g.tid,g.ctn]
			if (c.path){
				var point = [c.path[0],c.path[1]]
				console.log("c.path",c.path)
				g.Toolkit && g.Toolkit.id != 'font' && g.setToolkit('font');
				g.tid = c.tid
				g.ctn = c.path[4]
				
				c.path && g.Toolkit.render(point)
			}
		}else if (c.type == "im"){
			console.log(JSON.stringify(c))
			if (c.path){
				var point = [c.path[0],c.path[1]]
				g.tid = c.tid
				g.ctn = c.path[4]

				var img = new Image()
				img.src = g.ctn
				img.onload = function(){
					sketch.setToolkit('image');
            		sketch.Toolkit.drawImage(img,point)
				}
				
			}
		}else if (c.type == "lw"){
			console.log(JSON.stringify(c))
			
			g.diameter = c.path
		}else if (c.type == "cl"){
			console.log("cwpath:",c)
			g.createCanvas()
			
		}else if (c.type == "sl"){ //切换画布
			console.log("swpath:",c)
			var newIndex = c.path
			console.log("newIndex",newIndex)
			g.switchCanvas(newIndex)
		} else if (c.type == 'clr') { //清全屏
			console.log("swpath:",c, '清全屏')
			sketch.clearCanvas();
			g.switchCanvas(g.currentIndex)
		}
	}
	var parseCommand = function(c) {
		
		if (c[0]=="sl"){
			console.log("aabbbbbaaaa",c,c[1])
		}
		return {
			type : c[0] || 'unknow',
			path : c[1],
			tid : c[2] || !1
		}
	}

})(sketch);

(function(g){
	g.registerToolkit("pencil", function(){
		var pencil = this;
		this.isEnabled = false;
		pencil.path = [];
		pencil.id = 'pencil';
	
		pencil.keyPath = []

		this.enable = function(){
			if (!pencil.isEnabled) {
				// g.ctx = g.ctx, this.canvas = g.canvas, this.isEnabled = true;
				if (g.mode && g.mode == 'active') {
					this.dom = g.dom
					this.dom.onmousedown = function(e){
						pencil.isDrawingMode = true;
						// g.canvasArray[g.currentIndex].getDown().drawImage(g.canvas, 0, 0);
						pencil.path = [];
						pencil.keyPath = [];
						// 
					}
					this.dom.onmouseup = function(e) {
						g.canvasArray[g.currentIndex].getDown().drawImage(g.canvas, 0, 0);
						pencil.keyPath = [];
						pencil.path = [];
						g.ctx.clearRect(0,0,1330,728)
						pencil.isDrawingMode = false;
					}
					this.dom.onmousemove =  function(e) {
						if (pencil.isDrawingMode) {
							pencil.path.push([e.offsetX, e.offsetY]);
						}
						else {
							g.trace.push([e.offsetX, e.offsetY]);
						}
					}
					pencil.frameHandle = requestAnimationFrame(pencil.onFrame);
				}
				pencil.isEnabled = true
			}
		}
		this.disable = function(){
			this.isEnabled = false;
			g.canvasArray[g.currentIndex].getDown().drawImage(g.canvas, 0, 0);
			g.ctx.clearRect(0,0,1330,728)
			pencil.keyPath = [];
			var self = this;
			if (g.mode && g.mode == 'active' && self.dom) { 

				this.dom.onmousemove = null,this.dom.onmouseup = null,this.dom.onmousedown = null;
				this.frameHandle && window.cancelAnimationFrame(this.frameHandle);
			}
		}
		
		this.render = function(point){
			
			pencil.keyPath.push(point);
			g.ctx.save();
			g.ctx.lineCap = "round";
			g.ctx.lineJoin = "round";
			g.ctx.lineWidth = g.diameter;
			g.ctx.strokeStyle = g.strokeStyle;
			if (pencil.keyPath.length < 3) {
				//缓存原图形填充颜色,然后设置线的颜色作为填充色
				var _fillColorCache = g.ctx.fillStyle;
				g.ctx.fillStyle = g.ctx.strokeStyle;

				pencil.keyPath.length == 1 && g.ctx.moveTo(pencil.keyPath[0][0], pencil.keyPath[0][1]);
				var p = pencil.keyPath[0];
				g.ctx.beginPath();
				g.ctx.arc(p[0], p[1], g.diameter/2, 0, Math.PI * 2, !0);
				g.ctx.fill();
				g.ctx.closePath();
				//设置原填充色
				g.ctx.fillStyle = _fillColorCache;
			} else {
				g.ctx.clearRect(0, 0, 1330,728);
				g.ctx.beginPath();
				g.ctx.moveTo(pencil.keyPath[0][0], pencil.keyPath[0][1]);
				for (var i = 1; i < pencil.keyPath.length - 2; i++) {
			        var c = (pencil.keyPath[i][0] + pencil.keyPath[i + 1][0]) / 2;
			        var d = (pencil.keyPath[i][1] + pencil.keyPath[i + 1][1]) / 2;
			        g.ctx.quadraticCurveTo(pencil.keyPath[i][0], pencil.keyPath[i][1], c, d);				
				}
				g.ctx.quadraticCurveTo(
					pencil.keyPath[i][0],
					pencil.keyPath[i][1],
					pencil.keyPath[i + 1][0],
					pencil.keyPath[i + 1][1]
				);
		 		g.ctx.stroke();
			}
	 		g.ctx.restore();
		}

		this.onFrame = function(){
			if (this.isDrawingMode || pencil.path.length > 0) {
				var point = pencil.path[pencil.path.length-1]
				pencil.path = []
				// 暂时调试
				pomelo.notify('connector.roomHandler.draw', 
					{
						op:['pm', point],
						t:Date.now(),
						roomID :user.roomID,
						answerID:user.answerID
					}
				);
				pencil.render(point);	
			}else{
				// 暂时调试

				g.trace.length && pomelo.notify('connector.roomHandler.draw', 
					{
						roomID :user.roomID,
						answerID:user.answerID,
						op: ['mm', g.trace[0]], 
						t: Date.now()
					}
				);
				g.trace = [];
			}
			pencil.frameHandle = requestAnimationFrame(pencil.onFrame);
		}
	})
})(sketch);

(function(g){
	g.registerToolkit("eraser", function(){
		var eraser = this;
		eraser.keyPath = []
		eraser.isEnabled = false;
		eraser.path = [];
		eraser.id = 'eraser';
		this.enable = function(){
			if (!this.isEnabled) {
				if (g.mode && g.mode == "active") {
					this.dom = g.dom
					eraser.keyPath = []
					this.isEnabled = true;
					this.dom.onmousedown = function(e){
						this.isDrawingMode = true;
					}
					this.dom.onmouseup = function(e) {
						this.isDrawingMode = false;
					}
					this.dom.onmousemove =  function(e) {
						if (this.isDrawingMode) {
							eraser.path.push([e.offsetX, e.offsetY]);
						} else {
							g.trace.push([e.offsetX, e.offsetY]);
						}
					}
					this.frameHandle = setInterval(this.onFrame, g.frameInterval||20);
				}
			}
		}

		this.disable = function(){
			this.isEnabled = false;
			eraser.keyPath = []
			this.dom.onmousemove = null,this.dom.onmouseup = null,this.dom.onmousedown = null;
			this.frameHandle && clearInterval(this.frameHandle);
		}

		this.render = function(path){
			console.log(g.currentIndex)
			eraser.keyPath.push(path);
			g.canvasArray[g.currentIndex].getDown().save();
			g.canvasArray[g.currentIndex].getDown().lineCap = "round";
			g.canvasArray[g.currentIndex].getDown().lineJoin = "round";
			g.canvasArray[g.currentIndex].getDown().lineWidth = g.diameter * 3 ;
			g.canvasArray[g.currentIndex].getDown().fillStyle = 'black';
			g.canvasArray[g.currentIndex].getDown().beginPath();
			for(var i=0;i<eraser.keyPath.length;i++){
				if (i==0) 
					g.canvasArray[g.currentIndex].getDown().moveTo(eraser.keyPath[0][0], eraser.keyPath[0][1]);
				else 
					g.canvasArray[g.currentIndex].getDown().lineTo(eraser.keyPath[i][0], eraser.keyPath[i][1]);
			}
			g.canvasArray[g.currentIndex].getDown().globalCompositeOperation="destination-out";
			g.canvasArray[g.currentIndex].getDown().stroke();
			g.canvasArray[g.currentIndex].getDown().globalCompositeOperation="source-over";
			g.canvasArray[g.currentIndex].getDown().restore();
		}

		this.onFrame = function(){
			if (this.isDrawingMode || eraser.path.length > 0) {
				eraser.render(eraser.path[0]);
				// 暂时调试
				eraser.path.length && pomelo.notify('connector.roomHandler.draw', 
					{
						roomID :user.roomID,
						answerID:user.answerID,
						op: ['em', eraser.path[0]], 
						t: Date.now()
					}
				);
				eraser.path = [];
			}
			// 暂时调试
			g.trace.length && pomelo.notify('connector.roomHandler.draw', 
					{
						roomID :user.roomID,
						answerID:user.answerID,
						op: ['mm', g.trace[0]], 
						t: Date.now()
					}
				);
			g.trace = [];
		}		
	})
})(sketch);


(function(g){
	g.registerToolkit("rectangle", function(){
		var rectangle = this;
		rectangle.isEnabled = false;
		rectangle.path = [];
		rectangle.keyPath = []
		rectangle.id = 'rectangle';
		this.enable = function(){
			if (!this.isEnabled && g.mode && g.mode == 'active') {
				this.dom = g.dom
				
				this.dom.onmousedown = function(e){
					this.isDrawingMode = true;
					g.tid = Date.now()
					rectangle.path = []
					rectangle.path.push([e.offsetX, e.offsetY]);
				}
				this.dom.onmouseup = function(e) {
					this.isDrawingMode = false;
					rectangle.path = []
				}
				this.dom.onmousemove =  function(e) {
					if (this.isDrawingMode) {
						rectangle.path.push([e.offsetX, e.offsetY]);
					} else {
						g.trace.push([e.offsetX, e.offsetY]);
					}
				}
				this.frameHandle = setInterval(this.onFrame, g.frameInterval||20);
			}
			this.isEnabled = true;
		}

		this.createRectangle = function(path){
			var rect = new fabric.Rect({
	            id:g.tid,
	            width:0,
	            height:0,
	            left:path[0],
	            top:path[1],
	            angle:0,
	            fill:g.fillStyle,
	            stroke:g.strokeStyle,
	            strokeWidth:g.diameter,
	            scaleX:1,
	            scaleY:1,
	            selectable:true
	        });
	        g.fctx.add(rect);
	        g.fctx.setActiveObject(rect);
		}

		this.disable = function(){
			this.isEnabled = false;
			this.path = []
			this.keyPath = []

			this.dom.onmousemove = null,this.dom.onmouseup = null,this.dom.onmousedown = null;
			this.frameHandle && clearInterval(this.frameHandle);
		}

		this.render = function(path){
			
			var _rect = g.fctx.getActiveObject();
			if(_rect){
				if(_rect.get("id")==g.tid){
					rectangle.keyPath.push(path)
					console.log(path)
					var _endPoint = rectangle.keyPath[rectangle.keyPath.length-1],
		            _startPoint = rectangle.keyPath[0],
		            _width = _endPoint[0] - _startPoint[0],
		            _height = _endPoint[1] - _startPoint[1]
		            _rect = g.fctx.getActiveObject();
		            _rect.set('width',_width).set('height',_height).set('originX','center').set('originY','center');
		            _rect.setCoords();
		            g.fctx.renderAll();
				}else{
					rectangle.keyPath = [path]
					this.createRectangle(path)
				}
			}else{
				rectangle.keyPath = [path]
				this.createRectangle(path)
			}
			
		}

		this.onFrame = function(){
			if (this.isDrawingMode || rectangle.path.length > 0) {
				var path = rectangle.path[rectangle.path.length-1]
				rectangle.render(path)
				console.log(JSON.stringify({c:'room.draw', data:{op:['rm', path, g.tid],t:Date.now()}}))
				rectangle.path.length && pomelo.notify('connector.roomHandler.draw', 
					{
						roomID :user.roomID,
						answerID:user.answerID,
						op:['rm', path, g.tid],
						t:Date.now()
					}
				);
			}
			g.trace.length && pomelo.notify('connector.roomHandler.draw', 
				{
					roomID :user.roomID,
					answerID:user.answerID,
					op:['mm', g.trace[0]],
					t:Date.now()
				}
			);
			g.trace = [];
		}		
	})
})(sketch);

(function(g){
	g.registerToolkit("circle", function(){
		var circle = this;
		circle.isEnabled = false;
		circle.path = [];
		circle.keyPath = []
		circle.id = 'circle';
		this.enable = function(){
			if (!this.isEnabled && g.mode && g.mode == 'active') {
				this.dom = g.dom
				this.isEnabled = true;
				this.dom.onmousedown = function(e){
					this.isDrawingMode = true;
					g.tid = Date.now()
					circle.path = []
					circle.path.push([e.offsetX, e.offsetY]);
				}
				this.dom.onmouseup = function(e) {
					this.isDrawingMode = false;
					circle.path = []
				}
				this.dom.onmousemove =  function(e) {
					if (this.isDrawingMode) {
						circle.path.push([e.offsetX, e.offsetY]);
					} else {
						g.trace.push([e.offsetX, e.offsetY]);
					}
				}
				this.frameHandle = setInterval(this.onFrame, g.frameInterval||20);
			}
		}

		this.createCircle = function(path){
			
			var _circle = new fabric.Circle({
	            id:g.tid,
	            width:0,
	            height:0,
	            radius:0,
	            left:path[0],
	            top:path[1],
	            angle:0,
	            fill:g.fillStyle,
	            stroke:g.strokeStyle,
	            strokeWidth:g.diameter,
	            scaleX:1,
	            scaleY:1,
	            originX:"center",
	            originY:"center"
	        });
	        g.fctx.add(_circle);
	        g.fctx.setActiveObject(_circle);
			
		}

		this.disable = function(){
			this.isEnabled = false;
			this.path = []
			this.keyPath = []
			this.dom.onmousemove = null,this.dom.onmouseup = null,this.dom.onmousedown = null;
			this.frameHandle && clearInterval(this.frameHandle);
		}

		this.render = function(path){
			var _rect = g.fctx.getActiveObject();
			if(_rect){
				if(_rect.get("id")==g.tid){
					circle.keyPath.push(path)
					var _endPoint = circle.keyPath[circle.keyPath.length-1],
		            _startPoint = circle.keyPath[0],
		            _width = _endPoint[0] - _startPoint[0],
		            _height = _endPoint[1] - _startPoint[1],
		            _radius = Math.pow((_width*_width+_height*_height),0.5);
		            _circle = g.fctx.getActiveObject();
		            _circle.set('radius',_radius);
		            _circle.setCoords();
		            g.fctx.renderAll();
				}else{
					circle.keyPath = [path]
					this.createCircle(path)
				}
			}else{
				circle.keyPath = [path]
				this.createCircle(path)
			}
		}

		this.onFrame = function(){
			if (this.isDrawingMode || circle.path.length > 0) {
				var path = circle.path[circle.path.length-1]
				circle.render(path)
				circle.path.length && pomelo.notify('connector.roomHandler.draw', 
					{
						roomID :user.roomID,
						answerID:user.answerID,
						op:['cm', path, g.tid],
						t:Date.now()
					}
				);
			}
			g.trace.length && pomelo.notify('connector.roomHandler.draw', 
				{
					roomID :user.roomID,
					answerID:user.answerID,
					op:['mm', g.trace[0]],
					t:Date.now()
				}
			);
			g.trace = [];
		}		
	})
})(sketch);

(function(g){
	g.registerToolkit("triangle", function(){
		var triangle = this;
		triangle.isEnabled = false;
		triangle.path = [];
		triangle.keyPath = []
		triangle.id = 'triangle';
		this.enable = function(){
			if (!this.isEnabled && g.mode && g.mode == 'active') {
				this.dom = g.dom
				this.isEnabled = true;
				this.dom.onmousedown = function(e){
					this.isDrawingMode = true;
					g.tid = Date.now()
					triangle.path = []
					triangle.path.push([e.offsetX, e.offsetY]);
				}
				this.dom.onmouseup = function(e) {
					this.isDrawingMode = false;
					triangle.path = []
				}
				this.dom.onmousemove =  function(e) {
					if (this.isDrawingMode) {
						triangle.path.push([e.offsetX, e.offsetY]);
					} else {
						g.trace.push([e.offsetX, e.offsetY]);
					}
				}
				this.frameHandle = setInterval(this.onFrame, g.frameInterval||20);
			}
		}

		this.createTriangle = function(path){
			
			var _triangle = new fabric.Triangle({
	            id:g.tid,
	            radius:0,
	            left:path[0],
	            top:path[1],
	            fill:g.fillStyle ,
	            stroke:g.strokeStyle,
	            strokeWidth:g.diameter,
	            width:0,
    			height:0,
	            scaleX:1,
	            scaleY:1,
	            originX :'center',
    			originY :'center'
	        });
	        _triangle.set('width',0).set('height',0);
	        g.fctx.add(_triangle);
	        g.fctx.setActiveObject(_triangle);
			
		}

		this.disable = function(){
			this.isEnabled = false;
			this.path = []
			this.keyPath = []
			this.dom.onmousemove = null,this.dom.onmouseup = null,this.dom.onmousedown = null;
			this.frameHandle && clearInterval(this.frameHandle);
		}

		this.render = function(path){
			var _rect = g.fctx.getActiveObject();
			if(_rect){
				if(_rect.get("id")==g.tid){
					triangle.keyPath.push(path)
					var _endPoint = triangle.keyPath[triangle.keyPath.length-1],
		            _startPoint = triangle.keyPath[0],
		            _width = _endPoint[0] - _startPoint[0],
		            _height = _endPoint[1] - _startPoint[1],
		            _triangle = g.fctx.getActiveObject();
		            _triangle.set('width',_width).set('height',_height).set('originX','center').set('originY','center');
		            _triangle.setCoords();
		            g.fctx.renderAll();
				}else{
					triangle.keyPath = [path]
					this.createTriangle(path)
				}
			}else{
				triangle.keyPath = [path]
				this.createTriangle(path)
			}
		}

		this.onFrame = function(){
			if (this.isDrawingMode || triangle.path.length > 0) {
				var path = triangle.path[triangle.path.length-1]
				triangle.render(path)
				triangle.path.length && pomelo.notify('connector.roomHandler.draw', 
					{
						roomID :user.roomID,
						answerID:user.answerID,
						op:['tm', path, g.tid],
						t:Date.now()
					}
				);
			}
			g.trace.length && pomelo.notify('connector.roomHandler.draw', 
				{
					roomID :user.roomID,
					answerID:user.answerID,
					op:['mm', g.trace[0]],
					t:Date.now()
				}
			);
			g.trace = [];
		}		
	})
})(sketch);

(function(g){
	g.registerToolkit("line", function(){
		var line = this;
		line.isEnabled = false;
		line.path = [];
		line.keyPath = []
		line.id = 'line';
		this.enable = function(){
			if (!this.isEnabled && g.mode && g.mode == 'active') {
				this.dom = g.dom
				this.isEnabled = true;
				this.dom.onmousedown = function(e){
					this.isDrawingMode = true;
					g.tid = Date.now()
					line.path = []
					line.path.push([e.offsetX, e.offsetY]);
				}
				this.dom.onmouseup = function(e) {
					this.isDrawingMode = false;
					line.path = []
				}
				this.dom.onmousemove =  function(e) {
					if (this.isDrawingMode) {
						line.path.push([e.offsetX, e.offsetY]);
					} else {
						g.trace.push([e.offsetX, e.offsetY]);
					}
				}
				this.frameHandle = setInterval(this.onFrame, g.frameInterval||20);
			}
		}

		this.createLine = function(path){
			var points = [path[0],path[1],path[0],path[1]]
			var _line = new fabric.Line(points,{
	            id: g.tid,
	            fill:g.fillStyle,
	            stroke:g.strokeStyle,
	            strokeWidth:g.diameter,
	            scaleX:1,
	            scaleY:1
	        });
	        _line.set('width',0).set('height',0);
	        g.fctx.add(_line);
	        g.fctx.setActiveObject(_line);
		}

		this.disable = function(){
			this.isEnabled = false;
			this.path = [];
			this.keyPath = [];
			g.fctx.discardActiveObject();
			this.dom.onmousemove = null,this.dom.onmouseup = null,this.dom.onmousedown = null;
			this.frameHandle && clearInterval(this.frameHandle);
		}

		this.render = function(path){
			var _rect = g.fctx.getActiveObject();
			if(_rect){
				if(_rect.get("id")==g.tid){
					line.keyPath.push(path)
					var _endPoint = line.keyPath[line.keyPath.length-1],
		            _line = g.fctx.getActiveObject();
		            _line.set('x2',_endPoint[0]).set('y2',_endPoint[1]).set('originX','center').set('originY','center');
		            _line.setCoords();
		            g.fctx.renderAll();
				}else{
					line.keyPath = [path]
					this.createLine(path)
				}
			}else{
				line.keyPath = [path]
				this.createLine(path)
			}
		}

		this.onFrame = function(){
			if (this.isDrawingMode || line.path.length > 0) {
				var path =  line.path[line.path.length-1]
				
				line.render(path)
				line.path.length && pomelo.notify('connector.roomHandler.draw', 
					{
						roomID :user.roomID,
						answerID:user.answerID,
						op:['lm', path, g.tid],
						t:Date.now()
					}
				);
			}
			// 暂时调试
			g.trace.length && pomelo.notify('connector.roomHandler.draw', 
				{
					roomID :user.roomID,
					answerID:user.answerID,
					op:['mm', g.trace[0]],
					t:Date.now()
				}
			);
			g.trace = [];
		}		
	})
})(sketch);


(function(g){
	g.registerToolkit("move", function(){
		var move = this;
		move.dom = g.dom
		move.isEnabled = false;
		move.path = [];
		move.id = 'move';
		move.enable = function(){
			move.isEnabled = true
			$('.canvas-container').css('z-index',50)
	        g.canvasArray[g.currentIndex].getShape().selection=true;
	        var objs = g.canvasArray[g.currentIndex].getShape();
	        var _objs = objs.toObject();
	        var objects = _objs.objects;
	        for(var i=0;i<objects.length;i++){
	            (objs.item(i)).set('selectable',true)
	        }
	        move.dom.onmousedown = function(e){
				move.isDrawingMode = true;
				g.tid = Date.now()
				move.path = []
				move.path.push([e.offsetX, e.offsetY]);
			}
			move.dom.onmouseup = function(e) {
				move.isDrawingMode = false;
				move.path = []
			}
			move.dom.onmousemove =  function(e) {
				g.trace.push([e.offsetX, e.offsetY]);
			}
			move.frameHandle = setInterval(move.onFrame, g.frameInterval||20);
		}

		move.disable = function(){
			move.isEnabled = false
			$('.canvas-container').css('z-index',6)
	        g.canvasArray[g.currentIndex].getShape().selection=false;
	        var objs = g.canvasArray[g.currentIndex].getShape();
	        var _objs = objs.toObject();
	        var objects = _objs.objects;
	        for(var i=0;i<objects.length;i++){
	            (objs.item(i)).set('selectable',false)
	        }
	        move.frameHandle && clearInterval(move.frameHandle);
	        move.dom.onmousemove = null;
		}

		
		move.onFrame = function(){
			g.trace.length && pomelo.notify('connector.roomHandler.draw', 
				{
					roomID :user.roomID,
					answerID:user.answerID,
					op:['mm', g.trace[0]],
					t:Date.now()
				}
			);
			g.trace = [];
		}	
	})
})(sketch);


(function(g){
	g.registerToolkit("font", function(){
		var font = this;
		this.dom = g.dom
		font.isEnabled = true;
		font.KeyPath = [0,0];
		font.id = 'font';
		
		this.enable = function(){
			font.isEnabled = true;
			
			$("#createText").click(function(){
				if( $("#fillTxt").val()) {
					g.tid = Date.now()
					g.ctn = $("#fillTxt").val()
					font.render(font.KeyPath)
					font.hidden()
					font.send()
				}
				
			})
			$("#cancelText").click(function(){
				font.hidden()
			})
		}
		this.dom.onmousedown = function(e){
			
			if (!$('#fillTxtdiv').is(":visible")){
				font.KeyPath[0] = e.offsetX
				font.KeyPath[1] = e.offsetY
				console.log("font.KeyPathL",font.KeyPath)
				font.show()
			}
		}
		this.show = function(){
		
			$('#fillTxtdiv').css({
	 			'left':font.KeyPath[0],
	            'top':font.KeyPath[1],
	            'width':200,
	            'height':100
	        }).show();
        	$('#fillTxt').show().focus();
		}
		this.hidden = function(){
			$('#fillTxt').val('');
			$('#fillTxtdiv').hide()
		}
		this.dom.onmousemove = function(e){
			g.trace.push([e.offsetX,e.offsetY])
		}

		this.send = function(){
			var _text = g.fctx.getActiveObject();
			var info = {
	            c:'room.draw', 
	            data:{
	            	op:['fm', 
	            				[
	            					_text.get('left'),
	            					_text.get('top'),
	            					_text.get('currentWidth'),
	            					_text.get('currentHeight'),
	            					g.ctn
	            				],
	            	g.tid,

	            	], t:Date.now(),
	            	roomID :user.roomID,
	            	answerID:user.answerID
	            }
            }
            console.log(JSON.stringify(info))
		    pomelo.notify('connector.roomHandler.draw', 
				{
					op:['fm', 
	        				[
	        					_text.get('left'),
	        					_text.get('top'),
	        					_text.get('currentWidth'),
	        					_text.get('currentHeight'),
	        					g.ctn
	        				],
	            		g.tid
	            	], t:Date.now(),
	            	roomID :user.roomID,
	            	answerID:user.answerID
				}
			);
		}

		this.render = function(fpoint){
			console.log("fpoint:",fpoint)
			var _text = new fabric.Text(g.ctn,{
		        id:g.tid,
		        radius:0,
		        left:fpoint[0],
		        top:fpoint[1],
		        fill:g.fillStyle,
		        stroke:g.strokeStyle,
		        strokeWidth:g.diameter,
		        scaleX:1,
		        scaleY:1,
		        originX :'center',
		        originY :'center',
		        centeredRotation:true,
		        centeredScaling:true
		    });
		    g.fctx.add(_text)
		    g.fctx.setActiveObject(_text);
		}

		this.disable = function(){
			font.hidden()
			$("#createText").unbind();
			$("#cancelText").unbind();
			font.KeyPath = [0,0]
			font.isEnabled = false;
			this.dom.onmousemove = null,this.dom.onmousedown = null;
		}

	})
})(sketch);

(function(g){
	g.registerToolkit("mousemove", function(){
		var mouse = this;
		mouse.dom = g.dom
		mouse.isEnabled = false;
		mouse.path = [];
		mouse.id = 'mousemove';

		mouse.enable = function(){
			mouse.isEnabled = true
		}
		mouse.disable = function(){
			mouse.isEnabled = false
		}
	})
})(sketch);


(function(g){
	g.registerToolkit("modifyObject", function(){
		var modify = this;
		modify.id = "modifyObject"
		modify.isEnabled = false
		this.update = function(path,id){
			console.log(path,id)
			var _objs = g.fctx._objects;
		    var _aimObj = null;
		    for (var j = 0; j < _objs.length; j++) {
		    	if(g.fctx.item(j).id == id){
		            _aimObj = g.fctx.item(j);
		            _aimObj.set('currentHeight',path[3]);
		            _aimObj.set('currentWidth',path[2]);
		            _aimObj.set('left',path[0]);
		            _aimObj.set('top',path[1]);
		            _aimObj.set('angle',path[5]);
		            _aimObj.set('radius',path[4]);
		            _aimObj.set('scaleX',path[6]);
		            _aimObj.set('scaleY',path[7]);
		            _aimObj.set('width',path[8]);
		            _aimObj.set('height',path[9]);
		            _aimObj.setCoords();
		            g.fctx.renderAll();
		        }
		    }
		}
		modify.enable = function(){
			modify.isEnabled = true
		}
		modify.disable = function(){
			modify.isEnabled = false
		}
	})
})(sketch);


(function(g){
	g.registerToolkit("image", function(){
		var img = this;
		img.id = "image"
		img.isEnabled = false
		img.drawImage = function(img,point){
			
			var _objs = g.fctx._objects;
		    var _aimObj = null;
		    var _img = new fabric.Image(img,{
		          id:g.tid,
		          radius:0,
		          left:point[0],
		          top:point[1],
		          scaleX:1,
		          scaleY:1,
		          originX :'center',
		          originY :'center',
		          selectable:false
		    });
	      // _img.set('width',300).set('height',200);
	      	console.log("width:",_img.get('width'))
	     	var width = _img.get('width')
		    var height = _img.get("height")
		    var maxWidth = g.canvasArray[g.currentIndex].canvasWidth * 0.8
		    var newWidth = Math.min(width,maxWidth)
		    _img.set('width',newWidth)
		    if (width > maxWidth) {
		      	var scale = maxWidth / width
		      	var newHeigth = height * scale
		      	_img.set('height',newHeigth)
		    }
	      
	      	console.log("height:",_img.get('height'))
	      	g.fctx.add(_img);
	      	g.fctx.setActiveObject(_img);
		}
		img.enable = function(){
			img.isEnabled = true
		}
		img.disable = function(){
			img.isEnabled = false
		}
	})
})(sketch);
