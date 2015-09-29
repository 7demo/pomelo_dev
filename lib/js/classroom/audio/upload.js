var Qiniu_UploadUrl = "http://up.qiniu.com";
var addAudioSliceUrl, uploadTokenUrl, uploadToken, answerID;

this.onmessage = function(e){
	if (e.data.command == 'init') {
		answerID = e.data.answerID
		uploadTokenUrl = e.data.uploadTokenUrl;
		addAudioSliceUrl = e.data.addAudioSliceUrl;
		getToken();
	} else if (e.data.command == 'upload') {
		var file = new File([e.data.blob], 'sound.ogg', {type: "audio/ogg"});
		Qiuniu_upload(file, uploadToken);
	}
}

function getToken(){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open('GET', uploadTokenUrl);
	console.log('2222', uploadTokenUrl);
	xmlHttp.onreadystatechange = function(response) {
		console.log(xmlHttp.responseText, '33333')
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200 && xmlHttp.responseText != "") {
			var blkRet = JSON.parse(xmlHttp.responseText);
			console.log('token', blkRet)
			uploadToken = blkRet.uptoken;
		} else if (xmlHttp.status != 200 && xmlHttp.responseText) {
		} else {}		
	}
	xmlHttp.send(null);
}

//TODO add key to protect
function Qiuniu_upload(f, token) {
	var xhr = new XMLHttpRequest();
	var batch = parseInt(Date.now());
	var key = batch + '.ogg';
	xhr.open('POST', Qiniu_UploadUrl, true);

	var formData, startDate;
	formData = new FormData();
	//if (key !== null && key !== undefined) formData.append('key', key);
	//设置上传后的文件名
	formData.append('key', key);
	formData.append('token', token);
	formData.append('file', f);

	xhr.upload.addEventListener("progress", function(event) {
		//TODO
	}, false);

	xhr.onreadystatechange = function(response) {
		if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
			var blkRet = JSON.parse(xhr.responseText);
			addAudioSlice(key, batch);
		} else if (xhr.status != 200 && xhr.responseText) {
			// TODO some error
		} else {
			// TODO some error
		}
	}

	xhr.send(formData);
}

function addAudioSlice(key, batch){
	var xhr = new XMLHttpRequest();
	xhr.open('POST', addAudioSliceUrl , true);
	var postMessage = this.postMessage;

	xhr.onreadystatechange = function(response) {
		if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
			//var blkRet = JSON.parse(xhr.responseText);
			console.log("Step 4: Add audio slice result:" + xhr.responseText);
			console.log("--------------------------------------------------");
			postMessage({ type: 'done' });
		} else if (xhr.status != 200 && xhr.responseText) {
			// TODO some error
		} else {
			// TODO some error
		}
	}
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send('key=' + key + '&batch=' + batch + '&answerID=' + answerID);		
}