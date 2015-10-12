/**
 *
 * 因与 pomepo 冲突
 * 非模块化开发
 * 房间列表
 * 
 */

/**
 * 房间列表模板
 */
var roomTpl = function (data) {
	
	var tpl = '';
	$.each(data, function (i, v) {
		tpl += '<li class="fn-left">'
		tpl += '	<div class="answer-room-list-question fn-clear">'
		tpl += '		<div>'
		if (v.teacher == uid) {
			tpl += '			<a href="/web/classroom/tutor/'+ v.roomID +'">'
			tpl += '				<img src="/public/images/pic3.jpg" alt="">'
			tpl += '				<div class="control">'
			tpl += '					<i class="fa fa-play-circle-o fa-spin"></i>'
			tpl += '					<p>重新加入</p>'
			tpl += '				</div>'
			tpl += '			</a>'
		} else {
			tpl += '			<a href="#">'
			tpl += '				<img src="/public/images/pic3.jpg" alt="">'
			tpl += '			</a>'
		}
		tpl += '		</div> '
		tpl += '	</div>'
		tpl += '	<div class="answer-room-list-question-desc fn-clear">'
		tpl += '		<span>一年级</span>'
		tpl += '		<span>物理</span>'
		tpl += '		<p class="fn-right">张老师</p>'
		tpl += '	</div>'
		tpl += '</li>'
	})

	return tpl;

}

if ($('#queue-tutor').length) {
	$.ajax({
		type : 'GET',
		url : config.API_URL + '/api/room/list',
		success : function (data) {
			if (!!data && typeof data == 'string') {
				data = JSON.parse(data);
			}
			if (data.code == 200) {
				if (data.data.length) {
					$('#roomList').html(roomTpl(data.data));
				} else {
					$('#roomList').html('教师还在路上，去<a href="/web/answer">答疑列表</a>看看吧');
				}
			} else {

			}
		},
		error : function () {

		}
	})
}

if ($('#queue-student').length) {
	$.ajax({
		type : 'GET',
		url : config.API_URL + '/api/answer/map',
		success : function (data) {
			if (!!data && typeof data == 'string') {
				data = JSON.parse(data);
			}
			if (data.code == 200) {
				
				var gradeData = data.data.grade,
					courseData = data.data.course,
					gradeTpl = '',
					courseTpl = '';

				$.each(gradeData, function (i, v) {
					gradeTpl += '<li data-value="' + v.value + '">' + v.key + '</li>';
				})	

				$.each(courseData, function (i, v) {
					courseTpl += '<li data-value="' + v.value + '">' + v.key + '</li>';
				})	

				$('input[name=grade]').siblings('ul').html(gradeTpl);
				$('input[name=course]').siblings('ul').html(courseTpl);

			} else {
				alert(data.desc);
			}
		},
		error : function () {

		}
	})
}
