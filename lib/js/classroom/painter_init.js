/**
 * 画板初始化
 */

var initPainter = (function () {

	/**
	 * 设定画板大小
	 * @param {number} [width] [设定画板的宽度]
	 * @param {number} [height] [设定画板的高度]
	 */
	var setCanvasSize = function (width, height) {
		var canvasWrap = $('#canvas-wrap'), //画板外围div
			canvas = $('#canvas'), //画板
			padding = 0; //padding 单
		
		canvasWrap.css({'width' : width + padding * 2, 'height' : height + padding * 2});
		console.log(canvas, width, height);
		canvas.attr('width', width);
		canvas.attr('height', height);

	};

	return {
		setCanvasSize : setCanvasSize
	}
	
})();