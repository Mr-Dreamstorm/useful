// image.js - Image Module
function loadImageContent() {
    const section = document.getElementById('image');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-image"></i>
                Rasm muharriri
            </div>
            
            <input type="file" id="imageUpload" accept="image/*">
            
            <div class="grid-2">
                <input type="number" id="imageWidth" placeholder="Eni">
                <input type="number" id="imageHeight" placeholder="Balandligi">
            </div>
            
            <select id="imageFormat">
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WEBP</option>
            </select>
            
            <div class="btn-group">
                <button class="btn" id="resizeBtn"><i class="fas fa-expand"></i> O'lchamni o'zgartirish</button>
                <button class="btn" id="compressBtn"><i class="fas fa-compress"></i> Siqish</button>
            </div>
            
            <canvas id="imageCanvas" style="max-width: 100%; margin: 15px 0;"></canvas>
            
            <button class="btn btn-primary" id="downloadImage"><i class="fas fa-download"></i> Yuklash</button>
        </div>
    `;
}