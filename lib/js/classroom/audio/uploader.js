var uploadToken, addAudioSliceUrl, answerID;

this.onmessage = function(e){
	if (e.data.command == 'init') {
		answerID = e.data.answerID;
		uploadTokenUrl = e.data.uploadTokenUrl;
		addAudioSliceUrl = e.data.addAudioSliceUrl;

		if (!answerID || !uploadTokenUrl || !addAudioSliceUrl) {
			console.error('init uploader failed!');
		} else {
			getUploadToken();
		}
	} else if (e.data.command == 'upload') {
		var file = new File([e.data.blob], 'sound.ogg', { type: "audio/ogg" });
		qiniuUpload(file, uploadToken);
	}
}

function getUploadToken(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', uploadTokenUrl);
	xhr.onreadystatechange = function(response){
		if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
			var blkRet = JSON.parse(xhr.responseText);
			uploadToken = blkRet.uptoken;
		} else if (xhr.status != 200 && xhr.responseText) {
			console.error('get upload token failed!');
		}			
	}
	xhr.send(null);
}

function qiniuUpload(file, token){
	var xhr = new XMLHttpRequest();
	var batch = parseInt(Date.now());
	var key = batch + '.ogg';
	console.log(key);
	xhr.open('POST', 'http://up.qiniu.com', true);
	var formData = new FormData();
	formData.append('key', key);
	formData.append('token', token);
	formData.append('file', file);

	xhr.onreadystatechange = function(response) {
		if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
			addAudioSlice(key, batch);
		} else if (xhr.status != 200 && xhr.responseText) {
			console.error("Qiniu upload failed!");
		}
	}
	xhr.send(formData);	
}

function addAudioSlice(key, batch){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', addAudioSliceUrl, true);
	var postMessage = this.postMessage;

	xhr.onreadystatechange = function(response){
		if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
			console.log("Step 4: Add audio slice result:" + xhr.responseText);
			console.log("--------------------------------------------------");
			postMessage({ type: 'done' });
		} else if (xhr.status != 200 && xhr.responseText) {
			console.error('addAuidoSlice failed!');
		}
	}
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send('key=' + key + '&batch=' + batch + '&answerID=' + answerID);	
}