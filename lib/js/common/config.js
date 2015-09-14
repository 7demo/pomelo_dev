/**
 * 配置
 */

"undefined" === typeof config && (config = {});
(function(c){
	
	/**
	 * 熊大
	 */
	c.wsServerIP = '172.16.3.78';
	c.ANSWER_WS_PORT = 10001;
	c.ANSWER_ST_PORT = 10002;
	c.ROOM_WS_PORT = 10003;
	c.ROOM_ST_PORT = 10004;
	c.wsServerProtocol = 'echo-protocol';
	// c.URL = 'http://meepo.cn';
	c.URL = 'http://172.16.3.78';
	c.uploadTokenUrl = c.URL + "/api/answer/uploadToken";
	c.addAudioSliceUrl = c.URL + "/api/answer/addAudioSlice";
	c.RECORD_WORKER_PATH = c.URL + "/js/audio/worker.js";
	c.UPLOAD_WORKER_PATH = c.URL + "/js/audio/upload.js";
	c.FFMPEG_WORKER_PATH = c.URL + "/js/audio/ffmpeg_asm.js";
	c.ANSWER_CATEGORY_URL = c.URL + "/api/answer/getCategoryInfo";

	/**
	 * SAMPNA 
	 * 08-18
	 */
	c.SYSTEM_NAME = '系统消息'; //µ÷ÊÔÐÅÏ¢Ãû³Æ
	c.SYSTEM_PHOTO = '/images/sys.jpg'; //µ÷ÊÔÐÅÏ¢Ãû³Æ
	c.PENCLE_width = 2; //»­±Ê´óÐ¡
	c.CANVAS_PAGE_TOTAL = 1; //
	c.CANVAS_PAGE_INDEX = 0; //»­±Ê´óÐ¡
	

})(config);
