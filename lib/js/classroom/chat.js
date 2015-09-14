/**
 * 聊天（）
 * @param  {[string/object]} msg   [聊天内容，若为object时，则定为调试，采用console.log]
 * @param  {[string]} title [聊天名字]
 * @param  {[string]} photo [头像的url]
 * @return {[string]}       [聊天内容模板]
 */
var chatMsg = function (msg, title, photo) {
	console.log(title);
	var _title = title || config.SYSTEM_NAME,
		_photo = photo || config.SYSTEM_PHOTO,
		_msg = typeof msg == 'object'?'请在控制台查看此条输出' : msg,
		tpl = '';

	tpl += '<dl>'
	if (typeof msg == 'object') {
		tpl += '	<dt class="danger">'
	} else {
		tpl += '	<dt>'
	}
	tpl += '		<img src='+ _photo +' alt="">'
	tpl += 			_title
	tpl += '	</dt>'
	tpl += '	<dd>'+ _msg +'</dd>'
	tpl += '</dl>'

	if (typeof msg == 'Object') { //
		console.log(msg);
	}

	return tpl;
}
