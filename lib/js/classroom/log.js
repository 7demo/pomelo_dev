/**
 *
 * 调试输出js
 * @param {string/object} [para] [调试输出信息]
 */

var log = function (ctn, title, img) {
	var tpl = chatMsg(ctn, title, img);
	$('#chat').append(tpl);
	$('#chat').animate({'scrollTop' : $('#chat dl').length * ($('#chat dl').height() + 20 )}, 300)
}