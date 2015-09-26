var recLength = 0,
  recBuffersL = [],
  recBuffersR = [],
  sampleRate;

this.onmessage = function(e){
	if (e.data.command == 'init') {
		init(e.data.config);
	}else if (e.data.command == 'record') {
		record(e.data.buffer);
	}
}

function init(config){
	sampleRate = config.sampleRate;
}

function record(inputBuffer){
	recBuffersL.push(inputBuffer[0]);
	recBuffersR.push(inputBuffer[1]);
	recLength += inputBuffer[0].length;

	if (recBuffersL.length > 20) {
		exportWAV('audio/wav');
		recBuffersL = [], recBuffersR = [], recLength = 0;
	}
}

function exportWAV(type){
	var bufferL = mergeBuffers(recBuffersL, recLength);
	var bufferR = mergeBuffers(recBuffersR, recLength);
	var interleaved = interleave(bufferL, bufferR);
	var dataview = encodeWAV(interleaved);
	var audioBlob = new Blob([dataview], { type: type });

	this.postMessage(audioBlob);
}

function exportMonoWAV(type){
	var bufferL = mergeBuffers(recBuffersL, recLength);
	var dataview = encodeWAV(bufferL, true);
	var audioBlob = new Blob([dataview], { type: type });

	this.postMessage(audioBlob);
}
//---------------------------------------------------------------------------
function mergeBuffers(recBuffers, recLength){
	var result = new Float32Array(recLength);
	var offset = 0;
	for (var i = 0; i < recBuffers.length; i++){
		result.set(recBuffers[i], offset);
		offset += recBuffers[i].length;
	}
	return result;
}

function interleave(inputL, inputR){
	var length = inputL.length + inputR.length;
	var result = new Float32Array(length);

	var index = 0,inputIndex = 0;

	while (index < length){
		result[index++] = inputL[inputIndex];
		result[index++] = inputR[inputIndex];
		inputIndex++;
	}
	return result;
}

function floatTo16BitPCM(output, offset, input){
	for (var i = 0; i < input.length; i++, offset+=2) {
		var s = Math.max(-1, Math.min(1, input[i]));
		output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
	}
}

function writeString(view, offset, string){
	for (var i = 0; i < string.length; i++) {
		view.setUint8(offset + i, string.charCodeAt(i));
	}
}

function encodeWAV(samples, mono){
	var buffer = new ArrayBuffer(44 + samples.length * 2);
	var view = new DataView(buffer);

	/* RIFF identifier */
	writeString(view, 0, 'RIFF');
	/* file length */
	view.setUint32(4, 32 + samples.length * 2, true);
	/* RIFF type */
	writeString(view, 8, 'WAVE');
	/* format chunk identifier */
	writeString(view, 12, 'fmt ');
	/* format chunk length */
	view.setUint32(16, 16, true);
	/* sample format (raw) */
	view.setUint16(20, 1, true);
	/* channel count */
	view.setUint16(22, mono?1:2, true);
	/* sample rate */
	view.setUint32(24, sampleRate, true);
	/* byte rate (sample rate * block align) */
	view.setUint32(28, sampleRate * 4, true);
	/* block align (channel count * bytes per sample) */
	view.setUint16(32, 4, true);
	/* bits per sample */
	view.setUint16(34, 16, true);
	/* data chunk identifier */
	writeString(view, 36, 'data');
	/* data chunk length */
	view.setUint32(40, samples.length * 2, true);

	floatTo16BitPCM(view, 44, samples);

	return view;
}