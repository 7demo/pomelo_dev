/**
 * 
 * ***** sketch 
 * @ 改为sketch一个对象，进行拆分、代码语义化和结构优化,抽离了pomelo
 * @ 绘画方法只做了自由绘、橡皮、直线，图片、变换其他方法没有优化
 * @ 下一步可以优化的点，能兼容模块化开发
 * @ 标注★的为可以优化的点
 * @ 改于 2015-10-15  BY SAMPAN
 * ***** sketch 
 * 
 */
var sketch = sketch || {version : '0.0.1'};

/**
 * 静态配置，只读
 */
sketch.STATIC_CONFIG = (function () {

	var config = {
		STOKE_COLOR : {  //线的颜色
			redColor:"#C40000",
		    blackColor:"#333",
		    greenColor:"#078F25",
		    blueColor:"rgba(0, 0, 255, 1)",
		    clearColor:"rgba(255, 255, 255, 0)"
		},
		FILL_COLOR : { //填充颜色
			redColor:"rgba(255, 0, 0, 1)",
		    blackColor:"rgba(0, 0, 0, 1)",
		    greenColor:"rgba(0, 255, 0, 1)",
		    blueColor:"rgba(0, 0, 255, 1)",
		    clearColor:"rgba(255, 255, 255, 0)"
		},
		STOKE_WIDTH : { //画笔粗细-----------只用到了默认值 
			level1 : 2,
		    level2 : 3,
		    level3 : 5
		}
	}
	return config;

})();

/**
 * 整个绘制过程，操作属性、读取属性
 */
sketch.observeObj = {

	currentActiveToolkit : {}, //当前激活绘画方法
	mouseMoveTrace : [], //鼠标移动点追踪
	ctn : '', //画布内容点与图片url暂时存放
	mode  : 'passive', //当前画布状态 passive为不可画
	canvasArray : [], //每张画布所在数组
	currentIndex : 0, //当前画布索引值
	tid : 0,  //tick
	canvas : undefined, //当前画布的write的canvas dom元素
	ctx : undefined, //当前画布的write的canvas context对象
	fctx : undefined, //fabric对象
	strokeStyle : '#000', //当前画笔颜色, 填充颜色默认为空
	fillStyle : null, //填充颜色
	diameter : undefined, //线的宽度
	mouse : undefined, //鼠标元素
	frameInterval : 20 //20毫秒一帧

}

/**
 * 注册的画画方法集合
 */
sketch.toolkits = {

},

/**
 * 发送pomelo方法
 */
sketch.pomelo = function (data) {
	pomelo.notify('connector.roomHandler.draw', 
		{
			op:data,
			t:Date.now(),
			roomID :user.roomID,
			answerID:user.answerID
		}
	);
}

/**
 * sketch初始化
 * id : 画布外层div的id
 * mode : 画布是否可画，active 可画 否则不可画
 * mousediv : 模拟鼠标的dom元素
 */
sketch.init = function (id, mode, mousediv) {

	var _obj = sketch.observeObj; //缓存sketch observeObj ，方便调用
	_obj.dom = document.getElementById(id); //存放外层div
	if (mousediv) {
		_obj.mouse = document.getElementById(mousediv); 
	}
	_obj.mode = mode || _obj.mode; //当前画布状态 是否为可画
	sketch.createCanvas(); //创建画布
	sketch.setActiveCtx(); //设置索引值

	sketch.setToolkit('pencil');
	_obj.diameter = sketch.STATIC_CONFIG.STOKE_WIDTH.level1;

};

/**
 * 创建画布
 */
sketch.createCanvas = function () {

	var _obj = sketch.observeObj; 
	_obj.canvasArray.push(new YSCanvas(_obj.dom,_obj.canvasArray.length + 1));
	_obj.currentIndex = _obj.canvasArray.length - 1;
	_obj.canvasArray[_obj.currentIndex].setActive(); //切换当前画布为激活状态下
	
	sketch.setActiveCtx();

};

/**
 * 清除画布
 */
sketch.clearCanvas = function () {

	var _obj = sketch.observeObj; 
	_obj.canvasArray.splice(1, _obj.canvasArray.length - 1);
	_obj.currentIndex = _obj.canvasArray.length - 1 
	_obj.canvasArray[_obj.currentIndex].setActive();

	sketch.setActiveCtx(); //设置当前画布对象

	/**
	 * 此处删除已画图形 只能根据图形所在数组长度 操作
	 * 不能采用for循环的方法， 因为随着数组的删除所指向的图形 对象已删除
	 * 
	 */
	var _objects = _obj.fctx._objects;
	while (_objects.length) {
		_objects[0].remove();
	}
	_obj.canvasArray[_obj.currentIndex].getDown().clearRect(0,0,_obj.dom.clientWidth,_obj.dom.clientHeight);
	$(_obj.dom).children('div').eq(0).siblings('div').remove();

};

/**
 * 切换画布
 */
sketch.switchCanvas = function(index){

	var _obj = sketch.observeObj; 
	_obj.currentIndex = index || 0;
	_obj.canvasArray[_obj.currentIndex].setActive();

	sketch.setActiveCtx();
	
};

/**
 * 设置当前的画布的canvas canvas对象与frabic对象
 */
sketch.setActiveCtx = function () {

	var _obj = sketch.observeObj; 
	_obj.canvas =   _obj.canvasArray[_obj.currentIndex].getWriteCanvas();
	_obj.ctx = _obj.canvasArray[_obj.currentIndex].getWrite();
	_obj.fctx = _obj.canvasArray[_obj.currentIndex].getShape();

}

/**
 * 设置线条颜色
 */
sketch.setStokeColor = function(color){

	var _obj = sketch.observeObj; 
    switch(color){
        case "red":
            _obj.strokeStyle = sketch.STATIC_CONFIG.STOKE_COLOR.redColor
            break;
        case "black":
            _obj.strokeStyle = sketch.STATIC_CONFIG.STOKE_COLOR.blackColor
            break;
        case "green":
            _obj.strokeStyle = sketch.STATIC_CONFIG.STOKE_COLOR.greenColor
            break;
        case "blue":
            _obj.strokeStyle = sketch.STATIC_CONFIG.STOKE_COLOR.blueColor
            break;
        case "clear":
            _obj.strokeStyle = sketch.STATIC_CONFIG.STOKE_COLOR.clearColor
            break;
        default : 
        	_obj.strokeStyle = color;
    }

};

/**
 * 设置填充颜色
 */

sketch.setFillColor = function(color){

	var _obj = sketch.observeObj; 
    switch(color){
        case "red":
            _obj.fillStyle = sketch.STATIC_CONFIG.FILL_COLOR.redColor;
            break;
        case "black":
            _obj.fillStyle = sketch.STATIC_CONFIG.FILL_COLOR.blackColor
            break;
        case "green":
            _obj.fillStyle = sketch.STATIC_CONFIG.FILL_COLOR.greenColor
            break;
        case "blue":
            _obj.fillStyle = sketch.STATIC_CONFIG.FILL_COLOR.blueColor
            break;
        case "clear":
            _obj.fillStyle = sketch.STATIC_CONFIG.FILL_COLOR.clearColor
            break;
    }

};

/**
 * 设置线的宽度
 */
sketch.setLineWidth = function(width){
	
	sketch.observeObj.diameter = width;

};


/**
 * 注册画画函数的方法
 */
sketch.registerToolkit = function (t, f) {

	sketch.toolkits[t] = f;

};

/**
 * 切换当前画画函数为t
 * 特别注意的是 由于是每次调用带有参数命令 以调用不同方法 
 * 因此需要根据 isEnabled 属性来判断是否调用disable来进行把上层画布画到下层
 */
sketch.setToolkit = function(t) {
	
	var _obj = sketch.observeObj; 

	_obj.currentActiveToolkit && _obj.currentActiveToolkit.isEnabled && _obj.currentActiveToolkit.disable();
	delete _obj.currentActiveToolkit;

	//新初始化当前方法
	_obj.currentActiveToolkit = new sketch.toolkits[t]();
	_obj.currentActiveToolkit.enable();

};

/**
 * sketch定时方法 采取中央计时器，保证画画时候只有一个计时器工作
 */
sketch.startCycleFunc = function (cb) {
	if (!cb) return;
	return setInterval(cb, sketch.observeObj.frameInterval);
}

/**
 * sketch取消方法
 */
sketch.cancelCycleFunc = function () {
	if (!sketch.startCycleFunc) return;
	return clearInterval(sketch.startCycleFunc);
}

/**
 * 移动鼠标
 * 鼠标移动不应该作为注册事件
 * 但是为了原来逻辑的完整性 需要保留 sketch.setToolkit('mousemove');
 */
sketch.moveMouse = function (point) {
	if (sketch.observeObj.mouse) {
		sketch.observeObj.mouse.style.left = point[0] + 'px';
		sketch.observeObj.mouse.style.top = point[1] + 'px';
	}
}

/**
 * 学生端接受数值进行绘画操作
 */
sketch.onCommand = function(data) {

	var _obj = sketch.observeObj; 
	data = sketch.parseCommand(data);

	if (!_obj.currentActiveToolkit) return;

	switch (data.type) {
		case 'mm': 
			_obj.currentActiveToolkit.id != 'mousemove' && sketch.setToolkit('mousemove');
			data.path && sketch.moveMouse(data.path);
			break;
		case 'pm':
			_obj.currentActiveToolkit.id != 'pencil' && sketch.setToolkit('pencil');
			data.path && _obj.currentActiveToolkit.render(data.path);
			data.path && sketch.moveMouse(data.path);
			break;
		case 'em':
			_obj.currentActiveToolkit.id != 'eraser' && sketch.setToolkit('eraser');
			data.path && _obj.currentActiveToolkit.render(data.path);
			data.path && sketch.moveMouse(data.path);
			break;
		case 'rm':
			_obj.tid = data.tid
			_obj.currentActiveToolkit.id != 'rectangle' && sketch.setToolkit('rectangle');
			data.path && _obj.currentActiveToolkit.render(data.path);
			data.path && sketch.moveMouse(data.path);
			break;
		case 'cm':
			_obj.tid = data.tid
			_obj.currentActiveToolkit.id != 'circle' && sketch.setToolkit('circle');
			data.path && _obj.currentActiveToolkit.render(data.path);
			data.path && sketch.moveMouse(data.path);
			break;
		case 'tm':
			_obj.tid = data.tid
			_obj.currentActiveToolkit.id != 'triangle' && sketch.setToolkit('triangle');
			data.path && _obj.currentActiveToolkit.render(data.path);
			data.path && sketch.moveMouse(data.path);
			break;
		case 'mo':
			_obj.currentActiveToolkit.id != 'modifyObject' && sketch.setToolkit('modifyObject');
			data.path && data.tid && _obj.currentActiveToolkit.update(data.path,data.tid);
			break;
		case 'lm':
			_obj.tid = data.tid;
			_obj.currentActiveToolkit.id != 'line' && sketch.setToolkit('line');
			data.path && _obj.currentActiveToolkit.render(data.path);
			data.path && sketch.moveMouse(data.path);
			break;
		case 'fc':
			data.path  && sketch.setFillColor(data.path)
			break;
		case 'sc':
			data.path  && sketch.setStokeColor(data.path)
			break;
		case 'fm':
			if (data.path){
				var point = [data.path[0],data.path[1]];
				_obj.currentActiveToolkit.id != 'font' && sketch.setToolkit('font');
				_obj.tid = data.tid
				_obj.ctn = data.path[4]
				
				data.path && _obj.currentActiveToolkit.render(point)
				data.path && sketch.moveMouse(data.path);
			}
			break;
		case 'im':
			if (data.path){
				var point = [data.path[0],data.path[1]]
				_obj.tid = data.tid
				_obj.ctn = data.path[4]

				var img = new Image()
				img.src = _obj.ctn
				img.onload = function(){
					sketch.setToolkit('image');
	        		_obj.currentActiveToolkit.drawImage(img,point)
	        		data.path && sketch.moveMouse(data.path);
				}
				
			}
			break;
		case 'lw':
			sketch.observeObj.diameter = data.path
			break;
		case 'lw':
			sketch.observeObj.diameter = data.path
			break;
		case 'cl':
			sketch.createCanvas()
			break;
		case 'sl':
			sketch.switchCanvas(data.path)
			break;
		case 'clr':
			sketch.clearCanvas();
			sketch.switchCanvas(_obj.currentIndex)
			break;

	}
};

/**
 * 解析绘画参数
 */
sketch.parseCommand = function(c) {

	return {
		type : c[0] || 'unknow',
		path : c[1],
		tid : c[2] || !1
	}

};

/**
 * 注册鼠标移动---------------有问题
 */
(function (sketch) {

	sketch.registerToolkit("mousemove", function(){
		var mouse = this;
		mouse.isEnabled = false;
		mouse.path = [];
		mouse.id = 'mousemove';

		mouse.enable = function(){
			mouse.isEnabled = true
		}

		mouse.disable = function(){
			mouse.isEnabled = false
		}

		mouse.render = function (point) {
			if (sketch.observeObj.mouse) {
				console.log(sketch.observeObj.mouse.style.left)
				sketch.observeObj.mouse.style.left = point[0] + 'px';
				sketch.observeObj.mouse.style.top = point[1] + 'px';
			}
		}
		
	})

})(sketch || {});

/**
 * 注册自由绘
 */
(function (sketch) {
	//此层级this指 window
	sketch.registerToolkit("pencil", function(){
		
		var _obj = sketch.observeObj,
			pencil = this; //this 指 注册方法这个对象
		pencil.isEnabled = false; //用于判断是否学生端是否进行把上册画布画到下层
		pencil.isDrawingMode = false;  //用于判断进行画画还是鼠标移动
		pencil.path = []; //鼠标追踪的点
		pencil.id = 'pencil';
		pencil.keyPath = []; //关键帧 即发送的帧点

		//开始自由绘的监听
		pencil.enable = function(){  //表示开始调用自由绘的方法

			if (_obj.mode == 'active') {

				//监听canvas外围div鼠标down
				_obj.dom.onmousedown = function(e){
					
					pencil.isDrawingMode = true; 
					pencil.path = [];
					pencil.keyPath = [];

				}

				//监听canvas外围div鼠标up
				_obj.dom.onmouseup = function(e) {
					
					_obj.canvasArray[_obj.currentIndex].getDown().drawImage(_obj.canvas, 0, 0); //把上层画笔画到下层
					
					pencil.keyPath = [];
					pencil.path = [];
					_obj.ctx.clearRect(0,0,_obj.dom.clientWidth,_obj.dom.clientHeight);
					pencil.isDrawingMode = false;

				}

				//监听canvas外围div鼠标move
				_obj.dom.onmousemove =  function(e) {

					if (pencil.isDrawingMode) { //画画，监听点
						pencil.path.push([e.offsetX, e.offsetY]);
					} else { //鼠标移动
						_obj.mouseMoveTrace.push([e.offsetX, e.offsetY]);
					}

				}

				//开始循环调用帧
				sketch.startCycleFunc(pencil.onFrame); 

			};

			//开启学生端上图层绘制到下图层功能 ★★★★★★★★ 可以优化（从true状态下随时下绘改成鼠标抬起下绘，并且可以避免教师端鼠标绘出情况下双方绘图不一样）
			pencil.isEnabled = true;

		}

		//关闭自由绘的监听
		pencil.disable = function(){

			pencil.isEnabled = false;

			_obj.canvasArray[_obj.currentIndex].getDown().drawImage(_obj.canvas, 0, 0);
			_obj.ctx.clearRect(0,0,_obj.dom.clientWidth,_obj.dom.clientHeight)
			pencil.keyPath = [];

			if (_obj.mode == 'active') { 
				_obj.dom.onmousemove = null;
				_obj.dom.onmouseup = null;
				_obj.dom.onmousedown = null;
				sketch.cancelCycleFunc();
			}

		}
		
		//渲染自由绘
		pencil.render = function(point){
			pencil.keyPath.push(point);
			_obj.ctx.save();
			_obj.ctx.lineCap = "round";
			_obj.ctx.lineJoin = "round";
			_obj.ctx.lineWidth = _obj.diameter;
			_obj.ctx.strokeStyle = _obj.strokeStyle;

			//点过少的情况下，采用圆点代替 但是要注意圆点的颜色
			if (pencil.keyPath.length < 3) {
				//缓存原图形填充颜色,然后设置线的颜色作为填充色
				var _fillColorCache = _obj.ctx.fillStyle;
				_obj.ctx.fillStyle = _obj.ctx.strokeStyle;
				pencil.keyPath.length == 1 && _obj.ctx.moveTo(pencil.keyPath[0][0], pencil.keyPath[0][1]);
				var p = pencil.keyPath[0];
				_obj.ctx.beginPath();
				_obj.ctx.arc(p[0], p[1], _obj.diameter/2, 0, Math.PI * 2, !0);
				_obj.ctx.fill();
				_obj.ctx.closePath();
				//设置原填充色
				_obj.ctx.fillStyle = _fillColorCache;

			} else {

				_obj.ctx.clearRect(0, 0, _obj.dom.clientWidth,_obj.dom.clientHeight);
				_obj.ctx.beginPath();
				_obj.ctx.moveTo(pencil.keyPath[0][0], pencil.keyPath[0][1]);
				for (var i = 1; i < pencil.keyPath.length - 2; i++) {
			        var c = (pencil.keyPath[i][0] + pencil.keyPath[i + 1][0]) / 2;
			        var d = (pencil.keyPath[i][1] + pencil.keyPath[i + 1][1]) / 2;
			        _obj.ctx.quadraticCurveTo(pencil.keyPath[i][0], pencil.keyPath[i][1], c, d);				
				}
				_obj.ctx.quadraticCurveTo(
					pencil.keyPath[i][0],
					pencil.keyPath[i][1],
					pencil.keyPath[i + 1][0],
					pencil.keyPath[i + 1][1]
				);
		 		_obj.ctx.stroke();

			}
	 		_obj.ctx.restore();

		}

		pencil.onFrame = function(){ 

			//主要是依据pencil.path的情况进行判断是否属于pencil
			if (pencil.path.length > 0) {

				var point = pencil.path[pencil.path.length-1];
				sketch.pomelo(['pm', point]);
				pencil.render(point);
				pencil.path = [];

			}else{ //鼠标移动

				_obj.mouseMoveTrace.length && sketch.pomelo(['mm', _obj.mouseMoveTrace[0]]);
				_obj.mouseMoveTrace = [];

			}

		}

	})

})(sketch || {});

/**
 * 注册橡皮擦
 * 注释参考 自由绘 pencil
 */
(function (sketch) {
	sketch.registerToolkit("eraser", function(){

		var _obj = sketch.observeObj, 
			eraser = this; //缓存eraser对象
		eraser.keyPath = [];
		eraser.isEnabled = false;
		eraser.isDrawingMode = false;
		eraser.path = [];
		eraser.id = 'eraser';

		eraser.enable = function(){
			
			if (_obj.mode == "active") {

				eraser.keyPath = [];
				eraser.isEnabled = true;

				_obj.dom.onmousedown = function(e){
					eraser.isDrawingMode = true;
				}
				_obj.dom.onmouseup = function(e) {
					eraser.isDrawingMode = false;
				}
				_obj.dom.onmousemove =  function(e) {

					if (eraser.isDrawingMode) {
						eraser.path.push([e.offsetX, e.offsetY]);
					} else {
						_obj.mouseMoveTrace.push([e.offsetX, e.offsetY]);
					}

				}

				//开始循环调用帧
				sketch.startCycleFunc(eraser.onFrame); 

			}

		}

		eraser.disable = function(){

			eraser.isEnabled = false;
			eraser.keyPath = [];

			if (_obj.mode == 'active') {
				_obj.dom.onmousemove = null;
				_obj.dom.onmouseup = null;
				_obj.dom.onmousedown = null;
			}
			
			sketch.cancelCycleFunc();

		}

		eraser.render = function(path){

			eraser.keyPath.push(path);
			_obj.canvasArray[_obj.currentIndex].getDown().save();
			_obj.canvasArray[_obj.currentIndex].getDown().lineCap = "round";
			_obj.canvasArray[_obj.currentIndex].getDown().lineJoin = "round";
			_obj.canvasArray[_obj.currentIndex].getDown().lineWidth = _obj.diameter * 3 ;
			_obj.canvasArray[_obj.currentIndex].getDown().fillStyle = 'black';
			_obj.canvasArray[_obj.currentIndex].getDown().beginPath();

			for(var i=0;i<eraser.keyPath.length;i++){
				if (i==0) 
					_obj.canvasArray[_obj.currentIndex].getDown().moveTo(eraser.keyPath[0][0], eraser.keyPath[0][1]);
				else 
					_obj.canvasArray[_obj.currentIndex].getDown().lineTo(eraser.keyPath[i][0], eraser.keyPath[i][1]);
			}
			_obj.canvasArray[_obj.currentIndex].getDown().globalCompositeOperation="destination-out";
			_obj.canvasArray[_obj.currentIndex].getDown().stroke();
			_obj.canvasArray[_obj.currentIndex].getDown().globalCompositeOperation="source-over";
			_obj.canvasArray[_obj.currentIndex].getDown().restore();

		}

		eraser.onFrame = function(){

			if (eraser.path.length > 0) {
				eraser.render(eraser.path[0]);
				// 暂时调试
				eraser.path.length && sketch.pomelo(['em', eraser.path[0]]);
				eraser.path = [];
			}

			_obj.mouseMoveTrace.length && sketch.pomelo(['mm', _obj.mouseMoveTrace[0]]);
			_obj.mouseMoveTrace = [];

		}	

	})

})(sketch || {});

/**
 * 注册画直线方法
 */
(function (sketch) {
	sketch.registerToolkit("line", function(){

		var _obj = sketch.observeObj,
			line = this;
		line.isEnabled = false;
		line.isDrawingMode = false;
		line.path = [];
		line.keyPath = []
		line.id = 'line';
		line.enable = function(){

			if (_obj.mode == 'active') {

				line.isEnabled = true;
				_obj.dom.onmousedown = function(e){
					line.isDrawingMode = true;
					_obj.tid = Date.now()
					line.path = []
					line.path.push([e.offsetX, e.offsetY]);
				}
				_obj.dom.onmouseup = function(e) {
					line.isDrawingMode = false;
					line.path = []
				}
				_obj.dom.onmousemove =  function(e) {
					if (line.isDrawingMode) {
						line.path.push([e.offsetX, e.offsetY]);
					} else {
						_obj.mouseMoveTrace.push([e.offsetX, e.offsetY]);
					}
				}

				//开始循环调用帧
				sketch.startCycleFunc(line.onFrame); 

			}

		}

		line.createLine = function(path){

			var points = [path[0],path[1],path[0],path[1]]
			var _line = new fabric.Line(points,{
	            id: _obj.tid,
	            fill:_obj.fillStyle,
	            stroke:_obj.strokeStyle,
	            strokeWidth:_obj.diameter,
	            scaleX:1,
	            scaleY:1
	        });
	        _line.set('width',0).set('height',0);
	        _obj.fctx.add(_line);
	        _obj.fctx.setActiveObject(_line);

		}

		line.disable = function(){

			line.isEnabled = false;
			line.path = [];
			line.keyPath = [];
			_obj.fctx.discardActiveObject();
			_obj.dom.onmousemove = null;
			_obj.dom.onmouseup = null;
			_obj.dom.onmousedown = null;

			sketch.cancelCycleFunc();
		}

		line.render = function(path){
			var _rect = _obj.fctx.getActiveObject();
			if(_rect){
				if(_rect.get("id")==_obj.tid){
					line.keyPath.push(path)
					var _endPoint = line.keyPath[line.keyPath.length-1],
		            _line = _obj.fctx.getActiveObject();
		            _line.set('x2',_endPoint[0]).set('y2',_endPoint[1]).set('originX','center').set('originY','center');
		            _line.setCoords();
		            _obj.fctx.renderAll();
				}else{
					line.keyPath = [path]
					this.createLine(path)
				}
			}else{
				line.keyPath = [path]
				this.createLine(path)
			}
		}

		line.onFrame = function(){
			if (line.path.length > 0) {
				var path =  line.path[line.path.length-1]
				
				line.render(path)
				line.path.length && sketch.pomelo(['lm', path, _obj.tid]);
			}
			// 暂时调试
			_obj.mouseMoveTrace.length && sketch.pomelo(['mm', _obj.mouseMoveTrace[0]]);
			_obj.mouseMoveTrace = [];
		}		
	})
})(sketch || {});

/**
 * 注册移动方法
 */
(function (sketch) {
	sketch.registerToolkit("move", function(){

		var _obj = sketch.observeObj,
			move = this;

		move.isEnabled = false;
		move.isDrawingMode = false;
		move.path = [];
		move.id = 'move';
		move.enable = function(){

			move.isEnabled = true;
			$('canvas', $(_obj.dom)).siblings('div').css('z-index',50);
	        _obj.canvasArray[_obj.currentIndex].getShape().selection=true;
	        var objs = _obj.canvasArray[_obj.currentIndex].getShape();
	        var _objs = objs.toObject();
	        var objects = _objs.objects;
	        for(var i=0;i<objects.length;i++){
	            (objs.item(i)).set('selectable',true)
	        }
	        _obj.dom.onmousedown = function(e){
				move.isDrawingMode = true;
				_obj.tid = Date.now()
				move.path = []
				move.path.push([e.offsetX, e.offsetY]);
			}
			_obj.dom.onmouseup = function(e) {
				move.isDrawingMode = false;
				move.path = []
			}
			_obj.dom.onmousemove =  function(e) {
				_obj.mouseMoveTrace.push([e.offsetX, e.offsetY]);
			}
			//开始循环调用帧
			sketch.startCycleFunc(move.onFrame); 
		}

		move.disable = function(){

			move.isEnabled = false
			$('canvas', $(_obj.dom)).siblings('div').css('z-index',6)
	        _obj.canvasArray[_obj.currentIndex].getShape().selection=false;
	        var objs = _obj.canvasArray[_obj.currentIndex].getShape();
	        var _objs = objs.toObject();
	        var objects = _objs.objects;
	        for(var i=0;i<objects.length;i++){
	            (objs.item(i)).set('selectable',false)
	        }
         	_obj.dom.onmousemove = null;
         	_obj.dom.onmouseup = null;
         	_obj.dom.onmousedown = null;
	        sketch.cancelCycleFunc();
	       
		}

		
		move.onFrame = function(){
			_obj.mouseMoveTrace.length && sketch.pomelo(['mm', _obj.mouseMoveTrace[0]]);
			_obj.mouseMoveTrace = [];
		}	

	})
})(sketch || {});

/**
 * 注册修改图形方法
 */
(function (sketch) {
	sketch.registerToolkit("modifyObject", function(){

		var _obj = sketch.observeObj,
			modify = this;
		modify.id = "modifyObject"
		modify.isEnabled = false
		this.update = function(path,id){
			var _objs = _obj.fctx._objects;
		    var _aimObj = null;
		    for (var j = 0; j < _objs.length; j++) {
		    	if(_obj.fctx.item(j).id == id){
		            _aimObj = _obj.fctx.item(j);
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
		            _obj.fctx.renderAll();
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
})(sketch || {});

/**
 * 注册画图方法
 */
(function (sketch) {
	sketch.registerToolkit("image", function(){

		var _obj = sketch.observeObj,
			image = this;
		image.id = "image"
		image.isEnabled = false
		image.drawImage = function(img,point){
			
			var _objs = _obj.fctx._objects;
		    var _aimObj = null;
		    var _img = new fabric.Image(img,{
		          id:_obj.tid,
		          radius:0,
		          left:point[0],
		          top:point[1],
		          scaleX:1,
		          scaleY:1,
		          originX :'center',
		          originY :'center',
		          selectable:false
		    });
	     	var width = _img.get('width')
		    var height = _img.get("height")
		    var maxWidth = _obj.canvasArray[_obj.currentIndex].canvasWidth * 0.8
		    var newWidth = Math.min(width,maxWidth)
		    _img.set('width',newWidth)
		    if (width > maxWidth) {
		      	var scale = maxWidth / width
		      	var newHeigth = height * scale
		      	_img.set('height',newHeigth)
		    }
	      
	      	_obj.fctx.add(_img);
	      	_obj.fctx.setActiveObject(_img);
		}
		image.enable = function(){
			image.isEnabled = true
		}
		image.disable = function(){
			image.isEnabled = false
		}
	})
})(sketch || {});
	
/**
 *
 * 注册矩形方法
 * 
 */
(function (sketch) {
	sketch.registerToolkit("rectangle", function(){

		var _obj = sketch.observeObj; 
		var rectangle = this;
		rectangle.isEnabled = false;
		rectangle.path = [];
		rectangle.keyPath = []
		rectangle.id = 'rectangle';
		this.enable = function(){
			if (!this.isEnabled && _obj.mode && _obj.mode == 'active') {
				this.dom = _obj.dom
				
				this.dom.onmousedown = function(e){
					this.isDrawingMode = true;
					_obj.tid = Date.now()
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
						_obj.mouseMoveTrace.push([e.offsetX, e.offsetY]);
					}
				}
				this.frameHandle = setInterval(this.onFrame, _obj.frameInterval||20);
			}
			this.isEnabled = true;
		}

		this.createRectangle = function(path){
			var rect = new fabric.Rect({
	            id:_obj.tid,
	            width:0,
	            height:0,
	            left:path[0],
	            top:path[1],
	            angle:0,
	            fill:_obj.fillStyle,
	            stroke:_obj.strokeStyle,
	            strokeWidth:_obj.diameter,
	            scaleX:1,
	            scaleY:1,
	            selectable:true
	        });
	        _obj.fctx.add(rect);
	        _obj.fctx.setActiveObject(rect);
		}

		this.disable = function(){
			this.isEnabled = false;
			this.path = []
			this.keyPath = []

			this.dom.onmousemove = null,this.dom.onmouseup = null,this.dom.onmousedown = null;
			this.frameHandle && clearInterval(this.frameHandle);
		}

		this.render = function(path){
			
			var _rect = _obj.fctx.getActiveObject();
			if(_rect){
				if(_rect.get("id")==_obj.tid){
					rectangle.keyPath.push(path)
					var _endPoint = rectangle.keyPath[rectangle.keyPath.length-1],
		            _startPoint = rectangle.keyPath[0],
		            _width = _endPoint[0] - _startPoint[0],
		            _height = _endPoint[1] - _startPoint[1]
		            _rect = _obj.fctx.getActiveObject();
		            _rect.set('width',_width).set('height',_height).set('originX','center').set('originY','center');
		            _rect.setCoords();
		            _obj.fctx.renderAll();
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
				rectangle.path.length && sketch.pomelo(['rm', path, _obj.tid]);
			}
			_obj.mouseMoveTrace.length && sketch.pomelo(['mm', _obj.mouseMoveTrace[0]]);
			_obj.mouseMoveTrace = [];
		}		
	})
})(sketch || {});

/**
 * 注册圆形方法
 */
(function (sketch) {
	sketch.registerToolkit("circle", function(){

		var _obj = sketch.observeObj; 
		var circle = this;
		circle.isEnabled = false;
		circle.path = [];
		circle.keyPath = []
		circle.id = 'circle';
		this.enable = function(){
			if (!this.isEnabled && _obj.mode && _obj.mode == 'active') {
				this.dom = _obj.dom
				this.isEnabled = true;
				this.dom.onmousedown = function(e){
					this.isDrawingMode = true;
					_obj.tid = Date.now()
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
						_obj.mouseMoveTrace.push([e.offsetX, e.offsetY]);
					}
				}
				this.frameHandle = setInterval(this.onFrame, _obj.frameInterval||20);
			}
		}

		this.createCircle = function(path){
			
			var _circle = new fabric.Circle({
	            id:_obj.tid,
	            width:0,
	            height:0,
	            radius:0,
	            left:path[0],
	            top:path[1],
	            angle:0,
	            fill:_obj.fillStyle,
	            stroke:_obj.strokeStyle,
	            strokeWidth:_obj.diameter,
	            scaleX:1,
	            scaleY:1,
	            originX:"center",
	            originY:"center"
	        });
	        _obj.fctx.add(_circle);
	        _obj.fctx.setActiveObject(_circle);
			
		}

		this.disable = function(){
			this.isEnabled = false;
			this.path = []
			this.keyPath = []
			this.dom.onmousemove = null,this.dom.onmouseup = null,this.dom.onmousedown = null;
			this.frameHandle && clearInterval(this.frameHandle);
		}

		this.render = function(path){
			var _rect = _obj.fctx.getActiveObject();
			if(_rect){
				if(_rect.get("id")==_obj.tid){
					circle.keyPath.push(path)
					var _endPoint = circle.keyPath[circle.keyPath.length-1],
		            _startPoint = circle.keyPath[0],
		            _width = _endPoint[0] - _startPoint[0],
		            _height = _endPoint[1] - _startPoint[1],
		            _radius = Math.pow((_width*_width+_height*_height),0.5);
		            _circle = _obj.fctx.getActiveObject();
		            _circle.set('radius',_radius);
		            _circle.setCoords();
		            _obj.fctx.renderAll();
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
				circle.path.length && sketch.pomelo(['cm', path, _obj.tid]);
			}
			_obj.mouseMoveTrace.length && sketch.pomelo(['mm', _obj.mouseMoveTrace[0]]);
			_obj.mouseMoveTrace = [];
		}		
	})
})(sketch || {});

/**
 * 注册三角形方法
 */
(function (sketch) {
	sketch.registerToolkit("triangle", function(){

		var _obj = sketch.observeObj; 
		var triangle = this;
		triangle.isEnabled = false;
		triangle.path = [];
		triangle.keyPath = []
		triangle.id = 'triangle';
		this.enable = function(){
			if (!this.isEnabled && _obj.mode && _obj.mode == 'active') {
				this.dom = _obj.dom
				this.isEnabled = true;
				this.dom.onmousedown = function(e){
					this.isDrawingMode = true;
					_obj.tid = Date.now()
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
						_obj.mouseMoveTrace.push([e.offsetX, e.offsetY]);
					}
				}
				this.frameHandle = setInterval(this.onFrame, _obj.frameInterval||20);
			}
		}

		this.createTriangle = function(path){
			
			var _triangle = new fabric.Triangle({
	            id:_obj.tid,
	            radius:0,
	            left:path[0],
	            top:path[1],
	            fill:_obj.fillStyle ,
	            stroke:_obj.strokeStyle,
	            strokeWidth:_obj.diameter,
	            width:0,
    			height:0,
	            scaleX:1,
	            scaleY:1,
	            originX :'center',
    			originY :'center'
	        });
	        _triangle.set('width',0).set('height',0);
	        _obj.fctx.add(_triangle);
	        _obj.fctx.setActiveObject(_triangle);
			
		}

		this.disable = function(){
			this.isEnabled = false;
			this.path = []
			this.keyPath = []
			this.dom.onmousemove = null,this.dom.onmouseup = null,this.dom.onmousedown = null;
			this.frameHandle && clearInterval(this.frameHandle);
		}

		this.render = function(path){
			var _rect = _obj.fctx.getActiveObject();
			if(_rect){
				if(_rect.get("id")==_obj.tid){
					triangle.keyPath.push(path)
					var _endPoint = triangle.keyPath[triangle.keyPath.length-1],
		            _startPoint = triangle.keyPath[0],
		            _width = _endPoint[0] - _startPoint[0],
		            _height = _endPoint[1] - _startPoint[1],
		            _triangle = _obj.fctx.getActiveObject();
		            _triangle.set('width',_width).set('height',_height).set('originX','center').set('originY','center');
		            _triangle.setCoords();
		            _obj.fctx.renderAll();
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
				triangle.path.length && sketch.pomelo(['tm', path, _obj.tid]);
			}
			_obj.mouseMoveTrace.length && sketch.pomelo(['mm', _obj.mouseMoveTrace[0]]);
			_obj.mouseMoveTrace = [];
		}		
	})
})(sketch || {});



/**
 * 注册写字方法
 */
(function (sketch) {
	sketch.registerToolkit("font", function(){

		var _obj = sketch.observeObj; 
		var font = this;
		this.dom = _obj.dom
		font.isEnabled = true;
		font.KeyPath = [0,0];
		font.id = 'font';
		
		this.enable = function(){
			font.isEnabled = true;
			
			$("#createText").click(function(){
				if( $("#fillTxt").val()) {
					_obj.tid = Date.now()
					_obj.ctn = $("#fillTxt").val()
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
			mouseMoveTrace.push([e.offsetX,e.offsetY])
		}

		this.send = function(){
			var _text = _obj.fctx.getActiveObject();
			var info = {
	            c:'room.draw', 
	            data:{
	            	op:['fm', 
	            				[
	            					_text.get('left'),
	            					_text.get('top'),
	            					_text.get('currentWidth'),
	            					_text.get('currentHeight'),
	            					_obj.ctn
	            				],
	            	_obj.tid,

	            	], t:Date.now(),
	            	roomID :user.roomID,
	            	answerID:user.answerID
	            }
            }
            sketch.pomelo(['fm', 
    				[
    					_text.get('left'),
    					_text.get('top'),
    					_text.get('currentWidth'),
    					_text.get('currentHeight'),
    					_obj.ctn
    				],
        		_obj.tid
        	]);
		}

		this.render = function(fpoint){
			var _text = new fabric.Text(_obj.ctn,{
		        id:_obj.tid,
		        radius:0,
		        left:fpoint[0],
		        top:fpoint[1],
		        fill:_obj.fillStyle,
		        stroke:_obj.strokeStyle,
		        strokeWidth:_obj.diameter,
		        scaleX:1,
		        scaleY:1,
		        originX :'center',
		        originY :'center',
		        centeredRotation:true,
		        centeredScaling:true
		    });
		    _obj.fctx.add(_text)
		    _obj.fctx.setActiveObject(_text);
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
})(sketch || {});


	