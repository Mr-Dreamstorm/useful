// qr.js - QR Code Module
function loadQRContent() {
    const section = document.getElementById('qr');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-qrcode"></i>
                QR Studio
            </div>
            
            <div class="grid-2">
                <div>
                    <label>QR turi:</label>
                    <select id="qrType">
                        <option value="text">Matn</option>
                        <option value="url">URL</option>
                        <option value="wifi">WiFi</option>
                    </select>
                </div>
                
                <div id="wifiFields" style="display: none;">
                    <input type="text" id="wifiSSID" placeholder="WiFi nomi (SSID)">
                    <input type="password" id="wifiPassword" placeholder="Parol">
                    <select id="wifiEncryption">
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Parolsiz</option>
                    </select>
                </div>
                
                <div id="textFields">
                    <textarea id="qrText" placeholder="Matn yoki URL kiriting..." rows="3"></textarea>
                </div>
            </div>
            
            <div class="btn-group">
                <button class="btn btn-primary" id="generateQRBtn">
                    <i class="fas fa-qrcode"></i> QR yaratish
                </button>
                <button class="btn" id="downloadQRBtn">
                    <i class="fas fa-download"></i> PNG yuklash
                </button>
                <button class="btn" id="scanQRBtn">
                    <i class="fas fa-camera"></i> Kamerani skanerlash
                </button>
            </div>
            
            <div class="preview-area" id="qrPreview">
                <canvas id="qrCanvas"></canvas>
            </div>
            
            <div class="result-box" id="scanResult"></div>
            
            <!-- Camera Scanner Modal (hidden by default) -->
            <div id="scannerModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000;">
                <video id="scannerVideo" style="width: 100%; max-width: 500px; margin: 50px auto; display: block;"></video>
                <button class="btn" id="closeScanner">Yopish</button>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('qrType').addEventListener('change', toggleQRFields);
    document.getElementById('generateQRBtn').addEventListener('click', generateQR);
    document.getElementById('downloadQRBtn').addEventListener('click', downloadQR);
    document.getElementById('scanQRBtn').addEventListener('click', startQRScan);
    document.getElementById('closeScanner')?.addEventListener('click', closeScanner);
}

function toggleQRFields() {
    const type = document.getElementById('qrType').value;
    const wifiFields = document.getElementById('wifiFields');
    const textFields = document.getElementById('textFields');
    
    if (type === 'wifi') {
        wifiFields.style.display = 'block';
        textFields.style.display = 'none';
    } else {
        wifiFields.style.display = 'none';
        textFields.style.display = 'block';
    }
}

function generateQR() {
    const type = document.getElementById('qrType').value;
    let data = '';
    
    if (type === 'wifi') {
        const ssid = document.getElementById('wifiSSID').value;
        const password = document.getElementById('wifiPassword').value;
        const encryption = document.getElementById('wifiEncryption').value;
        data = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
    } else {
        data = document.getElementById('qrText').value;
    }
    
    if (!data) {
        showNotification('Ma\'lumot kiriting!', 'error');
        return;
    }
    
    const canvas = document.getElementById('qrCanvas');
    QRCode.toCanvas(canvas, data, {
        width: 300,
        margin: 2,
        color: {
            dark: '#d4af37',
            light: '#0a0f1c'
        }
    }, function(error) {
        if (error) {
            showNotification('QR yaratishda xatolik', 'error');
        }
    });
}

function downloadQR() {
    const canvas = document.getElementById('qrCanvas');
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
}

async function startQRScan() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const video = document.getElementById('scannerVideo');
        video.srcObject = stream;
        video.play();
        document.getElementById('scannerModal').style.display = 'block';
        
        // Start scanning
        scanQRCode(video);
    } catch (error) {
        showNotification('Kamerani ishga tushirishda xatolik', 'error');
    }
}

function scanQRCode(video) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const scanInterval = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);
            
            if (code) {
                clearInterval(scanInterval);
                video.srcObject.getTracks().forEach(track => track.stop());
                document.getElementById('scannerModal').style.display = 'none';
                document.getElementById('scanResult').innerHTML = `
                    <h3>Topildi:</h3>
                    <p>${code.data}</p>
                `;
            }
        }
    }, 500);
}

function closeScanner() {
    const video = document.getElementById('scannerVideo');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    document.getElementById('scannerModal').style.display = 'none';
}
