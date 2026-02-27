// video.js - Video Module
function loadVideoContent() {
    const section = document.getElementById('video');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-video"></i>
                Video mikser
            </div>
            
            <input type="file" id="videoUpload" accept="video/*" multiple>
            
            <div class="btn-group">
                <button class="btn" id="mergeVideos"><i class="fas fa-cut"></i> Birlashtirish</button>
                <button class="btn" id="extractAudioBtn"><i class="fas fa-music"></i> Audio ajratish</button>
            </div>
            
            <video id="videoPreview" controls style="width: 100%; margin: 15px 0;"></video>
            
            <button class="btn btn-primary" id="downloadVideo"><i class="fas fa-download"></i> Yuklash</button>
        </div>
    `;
}