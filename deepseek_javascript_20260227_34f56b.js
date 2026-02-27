// random.js - Random Number Module
function loadRandomContent() {
    const section = document.getElementById('random');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-dice"></i>
                Tasodifiy son generator
            </div>
            
            <div class="grid-2">
                <div>
                    <label>Minimal qiymat:</label>
                    <input type="number" id="minValue" value="-1000" step="any">
                </div>
                <div>
                    <label>Maksimal qiymat:</label>
                    <input type="number" id="maxValue" value="1000" step="any">
                </div>
            </div>
            
            <div class="btn-group">
                <button class="btn btn-primary" id="generateRandomBtn">
                    <i class="fas fa-dice"></i> Tasodifiy son
                </button>
                <button class="btn" id="copyRandomBtn">
                    <i class="far fa-copy"></i> Nusxalash
                </button>
                <button class="btn" id="generateMultipleBtn">
                    <i class="fas fa-layer-group"></i> Bir nechta
                </button>
            </div>
            
            <div class="result-box glow" id="randomResult">
                <span id="randomNumber">0</span>
            </div>
            
            <div id="multipleResults" class="grid-4"></div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('generateRandomBtn').addEventListener('click', generateRandom);
    document.getElementById('copyRandomBtn').addEventListener('click', copyRandom);
    document.getElementById('generateMultipleBtn').addEventListener('click', generateMultiple);
}

function generateRandom() {
    const min = parseFloat(document.getElementById('minValue').value);
    const max = parseFloat(document.getElementById('maxValue').value);
    
    if (isNaN(min) || isNaN(max)) {
        showNotification('Qiymatlarni to\'g\'ri kiriting!', 'error');
        return;
    }
    
    const random = Math.random() * (max - min) + min;
    document.getElementById('randomNumber').textContent = random;
}

function copyRandom() {
    const number = document.getElementById('randomNumber').textContent;
    copyToClipboard(number);
}

function generateMultiple() {
    const min = parseFloat(document.getElementById('minValue').value);
    const max = parseFloat(document.getElementById('maxValue').value);
    const count = 10;
    
    const container = document.getElementById('multipleResults');
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const random = Math.random() * (max - min) + min;
        const div = document.createElement('div');
        div.className = 'result-box';
        div.textContent = random.toFixed(4);
        container.appendChild(div);
    }
}