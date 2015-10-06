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

$.ajax({
	type : 'GET',
	url : config.API_URL + '/api/room/list',
	success : function (data) {
		if (data.code == 200) {
			$('#roomList').html(roomTpl(data.data));
		} else {

		}
	},
	error : function () {

	}
})
