/**
 * 全局配置
 */

var config = {

	/**
	 * 链接设置
	 */
	PEMELO_HOST : '172.16.3.78', //pomelo长连接地址
	PEMELO_PORT : '3020', // pomelo 端口
	API_URL : 'http://172.16.3.78', //api请求地址
	API_PORT : '3001',  //api请求端口

	/**
	 * 画画设置
	 */
	PENCLE_WIDTH : 2, //画笔默认大小
	CANVAS_PAGE_TOTAL : 1, //画布总页码
	CANVAS_PAGE_INDEX : 0, //默认画布索引值

	/**
	 * 音频
	 */
	AUDIO_KEY : '82f3aebb326e4c388710e0145fb13a22' //音频的key

}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else if (typeof define === 'function') {
    define(config);
}