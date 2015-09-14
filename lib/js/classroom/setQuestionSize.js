/**
 *
 * 设置问题幻灯的大小
 * 
 */
var setQuestion = (function () {

	return {
		init : function () {
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

		}
	}

})();