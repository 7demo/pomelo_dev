"undefined" === typeof recorder && (recorder={});
(function(g){
	g.init = function(source, cfg, callback, uploadCompleteCb){
		g.context = source.context;
		g.synchronous = false;//同步音频第一步操作
		g.RECORD_WORKER_PATH = cfg.RECORD_WORKER_PATH;
		g.UPLOAD_WORKER_PATH = cfg.UPLOAD_WORKER_PATH;
		g.FFMPEG_WORKER_PATH = cfg.FFMPEG_WORKER_PATH;

		if(!g.context.createScriptProcessor){
			g.node = g.context.createJavaScriptNode(16384, 2, 2);
		} else {
			g.node = g.context.createScriptProcessor(16384, 2, 2);
		}

		//音频录制进程
		g.worker = new Worker(g.RECORD_WORKER_PATH);
		g.worker.postMessage({
			command: 'init',
			config: {
				sampleRate: g.context.sampleRate
			}
		});

		//音频上传进程
		g.uploadWorker = new Worker(g.UPLOAD_WORKER_PATH);
		g.uploadWorker.onmessage = function(event){

			/**
			 * 当结课后，监听视频完成
			 */
			uploadCompleteCb()

			var message = event.data;
			if (message.type == 'done') {
				document.addEventListener('uploadAudioDone', function (event) {
					console.log('upload worker done!');
				});
				var event = document.createEvent('HTMLEvents');
				event.initEvent("uploadAudioDone", true, true);
				event.eventType = 'message';	
				document.dispatchEvent(event);
			}
		}
		g.uploadWorker.postMessage({
			command: 'init',
			//TODO check answeringId here
			answerID: cfg.answerID,
			uploadTokenUrl: cfg.uploadTokenUrl,
			addAudioSliceUrl: cfg.addAudioSliceUrl
		})

		//音频压缩进程
		g.ffmpegWorker = createFFmpegWorker();
		g.ffmpegWorkerReady = false;
		g.ffmpegWorker.onmessage = function(event){
			var message = event.data;
			console.log(JSON.stringify(message))
			if (message.type == 'ready') {
				console.log('Load ffmpeg.js ready!');

				g.ffmpegWorkerReady = true;
				//进入页面后等待，在ffmpeg载入成功后开始答疑
				//callback();
			} else if (message.type == 'done') {
				//ffmpeg 处理成功！
				var result = message.data[0];
				var blob = new Blob([result.data], {
					type: 'audio/ogg'
				});
				console.log('Step 3: ffmpeg handle done!');
				
				//上传音频
				g.uploadWorker.postMessage({ command: 'upload', blob: blob })
			}			
		}

		//音频收到消息
		g.worker.onmessage = function(e){

			console.log("--------------------------------------------------");
			console.log('Step 1: get audio from device!');
			var blob = e.data;
			var fileReader = new FileReader();
			var abb;
			fileReader.onload = function() {
				abb = this.result;
				console.log('Step 2: read audio as file, start ffmepg handle, result = ' + abb);	
				g.ffmpegWorker.postMessage({
					type: 'command',
					arguments: [
                                '-i', 'audio.wav', 
                                '-c:a', 'vorbis', 
                                '-b:a', '16000', 
                                '-strict', 'experimental', 'output.mp4'
					],
					files: [
					    {
					        data: new Uint8Array(abb),
					        name: "audio.wav"
					    }
					]
				});
			}
			fileReader.readAsArrayBuffer(blob);
		}

		g.node.onaudioprocess = function(e){
			if(!g.recording) return;

			//未同步音频，进行音频同步
			if(!g.synchronous){
				callback();
				g.synchronous = true;
			}
			g.worker.postMessage({
				command: 'record',
				buffer: [
					e.inputBuffer.getChannelData(0),
					e.inputBuffer.getChannelData(1)
				]
			})
		}

		g.record = function(){
			g.recording = true;
		}

		g.stop = function(){
			g.recording = false;
		}

		g.setupDownload = function(blob, fileName){
			var hyperlink = document.createElement('a');
			hyperlink.href = URL.createObjectURL(blob);
			hyperlink.target = '_blank';
			hyperlink.download = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + blob.type.split('/')[1];

			var evt = new MouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true
			});

			hyperlink.dispatchEvent(evt);

			(window.URL || window.webkitURL).revokeObjectURL(hyperlink.href);			
		}

		source.connect(g.node);
		g.node.connect(g.context.destination);
	}

	g.record = function(){
		g.recording = true;
	}

	g.stop = function(){
		g.recording = false;
	}

	var createFFmpegWorker = function(){
		var workerPath = g.FFMPEG_WORKER_PATH;
		var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
			type: 'application/javascript'
		}));
		var worker = new Worker(blob);
		URL.revokeObjectURL(blob);
		return worker;	
	}
})(recorder);