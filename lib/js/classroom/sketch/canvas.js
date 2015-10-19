/**
 * 优思canvas画布对象
 * @param {[type]} doc   [canvas外部的dom对象]
 * @param {[type]} index [所在画布层数的索引, 用来表示当前YScanvas对象是第几个画布]
 */
var YSCanvas = function(doc,index){
    this.canvasWidth = doc.clientWidth;
    this.canvasHeight = doc.clientHeight;
    this.num = index;
    this.write = null; //context对象
    this.shape = null;
    this.down = null;
    this.downCanvas = null //canvas dom对象
    this.writeCanvas = null
    this.domid = 'page' //画布 id 与 class的 前缀
    this.canvaswrap = doc; //包围canvas的外围dom对象
    this.createCanvas();
    this.initCanvas();

}

/**
 *
 ** 创建canvas的dom 结构
 * 
 */
YSCanvas.prototype.createCanvas = function(){

    var canvasTpl = '<div id = "' + this.domid + this.num + '" index="' + this.num + '" style="width:100%;height: 100%" class="'+ this.domid +'bg">'
        canvasTpl +='        <canvas id="' + this.domid+ this.num + 'write" width=' + this.canvasWidth + ' height=' + this.canvasHeight + ' class="'+ this.domid +'write">'
        canvasTpl +='    </canvas>'
        canvasTpl +='    <canvas id="' + this.domid + this.num + 'down" width=' + this.canvasWidth + ' height=' + this.canvasHeight + ' class="'+ this.domid +'down" >'
        canvasTpl +='    </canvas>'
        canvasTpl +='    <canvas id="' + this.domid + this.num + 'shape" width=' + this.canvasWidth + ' height='+this.canvasHeight+' class="'+ this.domid +'write" style="z-index:6">'
        canvasTpl +='    </canvas>'
        canvasTpl +='</div>';
    $(this.canvaswrap).append(canvasTpl);
    
}


/**
 * 初始化canvas对象
 * @description [生成三个层，自由绘写层（write），存放层(down)，图形层(shape)]
 * @description 自由绘写层 与 存放层都是context对象，
 * @description 图形层为fabric对象
 * @description 三个层级关系 自上至下为 自由绘写层、存放层、图形层
 */
YSCanvas.prototype.initCanvas = function(){

    var self = this; //缓存 YSCanvas

    self.shape = new fabric.Canvas(self.domid + self.num + 'shape',{  //新建canvas画布 用来画形状、图片
        hoverCursor: 'pointer', //悬浮状态
        selection :false,   //不能选中
        isdrawingmode:false //关闭画笔模式
    });
    self.downCanvas = document.getElementById(self.domid + self.num + 'down');
    self.down = document.getElementById(self.domid + self.num + 'down').getContext('2d'); //新建最下层 用来存放自由绘
    self.writeCanvas = document.getElementById(self.domid + self.num + 'write');
    self.write = document.getElementById(self.domid + self.num + 'write').getContext('2d'); //新建写层，用来暂时存放自由绘

    //监听图形改变事件，发送图形该信息
    self.shape.on({
       'object:modified': function(e) {  
            var _obj = self.shape.getActiveObject(); //获得当前活动图形
            if(!_obj) return;
            pomelo.notify('connector.roomHandler.draw', 
                {
                    op:[
                        'mo', 
                        [     
                            Math.floor(_obj.get('left')),
                            Math.floor(_obj.get('top')),
                            Math.floor(_obj.get('currentWidth')),
                            Math.floor(_obj.get('currentHeight')),
                            Math.floor(_obj.get('radius'))||0,
                            Math.floor(_obj.get('angle')),
                            _obj.get('scaleX'),
                            _obj.get('scaleY'),
                            Math.floor(_obj.get('width')),
                            Math.floor(_obj.get('height'))
                        ], 
                        _obj.get('id')
                    ],
                    t:Date.now(),
                    roomID :user.roomID,
                    answerID:user.answerID
                }
            );
          
        } 
    })

}

/**
 * 设置当前面画布状态为激活
 */
YSCanvas.prototype.setActive = function(){
    var index = this.num, //当前活动画布所在索引
        canvas = $("#" + this.domid + this.num); //当前活动画布
    canvas.show().siblings('.' + this.domid + 'bg').hide();
}

/**
 * 获取当前活动页码的索引值
 */
YSCanvas.prototype.getIndex = function(){
    return this.num
}

/**
 * 写层的canvas context对象
 */
YSCanvas.prototype.getWrite = function(){
    return this.write
}

/**
 * 写层的canvas dom对象
 */
YSCanvas.prototype.getWriteCanvas = function(){
    return this.writeCanvas
}

/**
 * 存储层的canvas context对象
 */
YSCanvas.prototype.getDown = function(){
    return document.getElementById(this.domid + this.num + 'down').getContext('2d');
};

/**
 * 形状层的canvas context对象
 */
YSCanvas.prototype.getShape = function(){
    return this.shape
};




