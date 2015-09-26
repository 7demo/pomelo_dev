"undefined" === typeof recorder && (recorder={});
(function(g){
	var createFFmpegWorker = function(){
		// var ffjs = __uri('/lib/js/classroom/audio/ffmpeg_asm.js');

		var ffjs = 'http://172.16.3.78:4001/js/classroom/audio/ffmpeg_asm.js';

		var blob = URL.createObjectURL(new Blob(['importScripts("' + ffjs + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
			type: 'application/javascript'
		}));
		var worker = new Worker(blob);
		URL.revokeObjectURL(blob);
		return worker;
	}

	g.init = function(context, stream, config, synchronousCb, uploadCompleteCb){
		if (!context.createScriptProcessor) {
			g.node = context.createJavaScriptNode(16384, 2, 2);
		} else {
			g.node = context.createScriptProcessor(16384, 2, 2);
		}
		g.capturer = new Worker(__uri('/lib/js/classroom/audio/capturer.js'));
		g.uploader = new Worker(__uri('/lib/js/classroom/audio/uploader.js'));
		g.compressor = createFFmpegWorker();
		console.log('start loading ffmpeg_asm.js...........');

		g.node.onaudioprocess = function(e){
			if (!g.recording) return;

			if (!g.synchronous && synchronousCb) {
				synchronousCb();
				g.synchronous = true;
			}

			g.capturer.postMessage({
				command: 'record',
				buffer: [
					e.inputBuffer.getChannelData(0),
					e.inputBuffer.getChannelData(1)				
				]
			})
		}

		//初始化音频流捕捉
		//---------------------------------------------------------------------
		g.capturer.postMessage({
			command: 'init',
			config: {
				sampleRate: context.sampleRate
			}
		})

		g.capturer.onmessage = function(e){
			console.log("--------------------------------------------------");
			console.log('Step 1: capture audio stream from device!');

			var blob = e.data, abb;
			var fileReader = new FileReader();
			fileReader.onload = function(){
				abb = this.result;
				console.log('Step 2: read audio as file, start ffmepg handle, result = ' + abb);
				g.compressor.postMessage({
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
				})
			}
			fileReader.readAsArrayBuffer(blob); 
		}
		//---------------------------------------------------------------------

		//初始化上传进程
		g.uploader.onmessage = function(event){
			var message = event.data;
			if (message.type == 'done') {
				uploadCompleteCb && uploadCompleteCb();
			}
		}

		g.uploader.postMessage({
			command: 'init',
			answerID: config.answerID,
			uploadTokenUrl: config.uploadTokenUrl,
			addAudioSliceUrl: config.addAudioSliceUrl
		})			


		//初始化压缩进程
		g.compressorReady = false;
		g.compressor.onmessage = function(event){
			var message = event.data;

			if (message.type == 'ready') {
				console.log('Load ffmpeg.js ready!');
				g.compressorReady = true;
			} else if (message.type == 'done') {
				var result = message.data[0];
				var blob = new Blob([result.data], { type: 'audio/ogg' });
				console.log('Step 3: ffmpeg handle done!');
				g.uploader.postMessage({ command: 'upload', blob: blob });
			}
		}


		//连接麦克风流！
		var input = context.createMediaStreamSource(stream)
		input.connect(g.node);
		g.node.connect(context.destination);
	}

	g.start = function(){
		g.recording = true;
	}

	g.stop = function(){
		g.recording = false;
	}	
})(recorder);