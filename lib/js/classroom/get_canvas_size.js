/**
 * 获得画板最大的大小
 */

var getCanvasMaxSize = (function () {

	var get = function (width, height) {
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

	};

	return {
		getSize : get
	}
	
})();