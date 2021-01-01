(function() {
const selectFormatBtn = document.getElementById('selectFormatBtn')!,
            submitBtn = document.getElementById('submitBtn')!,
         formatSelect = document.getElementById('formatSelect')! as HTMLSelectElement,
            linkInput = document.getElementById('linkInput')! as HTMLInputElement;
         


submitBtn.addEventListener('click', e => {
    const downloadBtn = document.getElementById('downloadBtn');

    if (downloadBtn) downloadBtn.remove();
    if (formatSelect.length !== 0) clearFormatSelect();

    if (isQueryValid(linkInput.value)) {
        renderVideoFormats(linkInput.value);
        submitBtn.setAttribute('disabled', 'true');
    } else {
        alert('No YouTube video ID found in query. Please, try again.');
        linkInput.value = '';
    }
});  

selectFormatBtn.addEventListener('click', e => {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) downloadBtn.remove();
        
    const itag = formatSelect.value;
    const videoLink = linkInput.value;

    if (videoLink && itag) renderDownloadLink(videoLink, itag);
    })
})();

function getVideoFormats(videoLink: string): Promise<Array<any>> {
    return fetch('/api/info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            "videoID": videoLink
        })
    })
    .then(response => response.json())
    .catch(err => console.log(err))
}

function renderVideoFormats(videoLink: string): void {
    const videoAudioOptgroup = document.getElementById('videoAudioOptgroup')! as HTMLOptGroupElement,
               videoOptgroup = document.getElementById('videoOptgroup')     ! as HTMLOptGroupElement,
               audioOptgroup = document.getElementById('audioOptgroup')     ! as HTMLOptGroupElement,
                   linkInput = document.getElementById('linkInput')         ! as HTMLInputElement,
                   submitBtn = document.getElementById('submitBtn')         ! as HTMLButtonElement;

    getVideoFormats(videoLink)
        .then(formats => {
            clearFormatSelect();
            formats.forEach((format) => {
                const {itag, container, codecs, mimeType, fps, qualityLabel, hasVideo, hasAudio = 'audio'} = format;
                
                const videoInfoText = (fps && qualityLabel) 
                                    ? `${qualityLabel}, ${fps}fps; ${container}; codecs: "${codecs}"` 
                                    : mimeType;

                const option = document.createElement('option');

                option.appendChild(document.createTextNode(videoInfoText));

                if (hasVideo && hasAudio) videoAudioOptgroup.appendChild(option);
                else if (hasVideo) videoOptgroup.appendChild(option);
                else if (hasAudio) audioOptgroup.appendChild(option);

                option.value = itag;
                submitBtn.disabled = false;
            });
        })
        .catch( error => {
            alert('Could not get video info');
            linkInput.value = '';
            submitBtn.disabled = false;
        })
};

function renderDownloadLink(videoLink:string, itag: string): void {
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
    .then(result => {
        if (result.status === 200) {
            console.log('Generating blob...')
            const blob = result.blob();
            
            blob.then(r => {
                console.log(`File ready. Total size~ ${Math.ceil(r.size/10e5)} Mb.`)
            });
            
            console.time('Blob prepared in');
            
            return blob;
        }
        else throw new Error('Error while preparing blob...');
    })
    .then(blob => {
        const downloadDiv = document.getElementById('downloadDiv')! as HTMLDivElement,
                      url = window.URL.createObjectURL(blob),
                        a = document.createElement('a'); 
        
        a.id        = 'downloadBtn';
        a.href      = url;
        a.download  = 'your_video.flv';
        a.innerText = 'Download!';
        downloadDiv.appendChild(a);
        
        console.timeEnd('Blob prepared in');
    })
    .catch(err => console.log(err))
};

function clearFormatSelect(): void {
    const videoAudioOptgroup = document.createElement('optgroup'),
                formatSelect = document.getElementById('formatSelect')!,
               videoOptgroup = document.createElement('optgroup'),
               audioOptgroup = document.createElement('optgroup');

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

function isQueryValid(query: string) {
    return /.*[a-zA-Z0-9_-]{11}.*/.test(query);
}
