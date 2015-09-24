/**
 *
 * 调试输出js
 * @param {string/object} [para] [调试输出信息]
 */

var log = function (ctn, title, img) {
	var imgphoto = __inline('/lib/images/photo_t.jpg');
	var tpl = chatMsg(ctn, title, img || imgphoto);
	$('#chat').append(tpl);
	$('#chat').animate({'scrollTop' : $('#chat dl').length * ($('#chat dl').height() + 20 )}, 300)
}