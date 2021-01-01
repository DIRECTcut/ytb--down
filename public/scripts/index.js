(function () {
    var selectFormatBtn = document.getElementById('selectFormatBtn'), submitBtn = document.getElementById('submitBtn'), formatSelect = document.getElementById('formatSelect'), linkInput = document.getElementById('linkInput');
    submitBtn.addEventListener('click', function (e) {
        var downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn)
            downloadBtn.remove();
        if (formatSelect.length !== 0)
            clearFormatSelect();
        if (isQueryValid(linkInput.value)) {
            renderVideoFormats(linkInput.value);
            submitBtn.setAttribute('disabled', 'true');
        }
        else {
            alert('No YouTube video ID found in query. Please, try again.');
            linkInput.value = '';
        }
    });
    selectFormatBtn.addEventListener('click', function (e) {
        var downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn)
            downloadBtn.remove();
        var itag = formatSelect.value;
        var videoLink = linkInput.value;
        if (videoLink && itag)
            renderDownloadLink(videoLink, itag);
    });
})();
function getVideoFormats(videoLink) {
    return fetch('/api/info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            "videoID": videoLink
        })
    })
        .then(function (response) { return response.json(); })["catch"](function (err) { return console.log(err); });
}
function renderVideoFormats(videoLink) {
    var videoAudioOptgroup = document.getElementById('videoAudioOptgroup'), videoOptgroup = document.getElementById('videoOptgroup'), audioOptgroup = document.getElementById('audioOptgroup'), linkInput = document.getElementById('linkInput'), submitBtn = document.getElementById('submitBtn');
    getVideoFormats(videoLink)
        .then(function (formats) {
        clearFormatSelect();
        formats.forEach(function (format) {
            var itag = format.itag, container = format.container, codecs = format.codecs, mimeType = format.mimeType, fps = format.fps, qualityLabel = format.qualityLabel, hasVideo = format.hasVideo, _a = format.hasAudio, hasAudio = _a === void 0 ? 'audio' : _a;
            var videoInfoText = (fps && qualityLabel)
                ? qualityLabel + ", " + fps + "fps; " + container + "; codecs: \"" + codecs + "\""
                : mimeType;
            var option = document.createElement('option');
            option.appendChild(document.createTextNode(videoInfoText));
            if (hasVideo && hasAudio)
                videoAudioOptgroup.appendChild(option);
            else if (hasVideo)
                videoOptgroup.appendChild(option);
            else if (hasAudio)
                audioOptgroup.appendChild(option);
            option.value = itag;
            submitBtn.disabled = false;
        });
    })["catch"](function (error) {
        alert('Could not get video info');
        linkInput.value = '';
        submitBtn.disabled = false;
    });
}
;
function renderDownloadLink(videoLink, itag) {
    fetch('/api/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            "videoID": videoLink,
            "quality": itag
        })
    })
        .then(function (result) {
        if (result.status === 200) {
            console.log('Generating blob...');
            var blob = result.blob();
            blob.then(function (r) {
                console.log("File ready. Total size~ " + Math.ceil(r.size / 10e5) + " Mb.");
            });
            console.time('Blob prepared in');
            return blob;
        }
        else
            throw new Error('Error while preparing blob...');
    })
        .then(function (blob) {
        var downloadDiv = document.getElementById('downloadDiv'), url = window.URL.createObjectURL(blob), a = document.createElement('a');
        a.id = 'downloadBtn';
        a.href = url;
        a.download = 'your_video.flv';
        a.innerText = 'Download!';
        downloadDiv.appendChild(a);
        console.timeEnd('Blob prepared in');
    })["catch"](function (err) { return console.log(err); });
}
;
function clearFormatSelect() {
    var videoAudioOptgroup = document.createElement('optgroup'), formatSelect = document.getElementById('formatSelect'), videoOptgroup = document.createElement('optgroup'), audioOptgroup = document.createElement('optgroup');
    formatSelect.innerHTML = '';
    videoAudioOptgroup.setAttribute('label', 'Audio & Video');
    videoAudioOptgroup.setAttribute('id', 'videoAudioOptgroup');
    videoOptgroup.setAttribute('label', 'Video only');
    videoOptgroup.setAttribute('id', 'videoOptgroup');
    audioOptgroup.setAttribute('label', 'Audio only');
    audioOptgroup.setAttribute('id', 'audioOptgroup');
    formatSelect.appendChild(videoAudioOptgroup);
    formatSelect.appendChild(videoOptgroup);
    formatSelect.appendChild(audioOptgroup);
}
function isQueryValid(query) {
    return /.*[a-zA-Z0-9_-]{11}.*/.test(query);
}
