// text.js - Text Tools Module
function loadTextContent() {
    const section = document.getElementById('text');
    
    const fonts = [
        'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New',
        'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
        'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Console', 'Tahoma',
        'Century Gothic', 'Consolas', 'Candara', 'Futura', 'Rockwell'
    ];
    
    let fontOptions = '';
    fonts.forEach(font => {
        fontOptions += `<option value="${font}" style="font-family: ${font}">${font}</option>`;
    });
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-font"></i>
                Matn muharriri
            </div>
            
            <textarea id="textInput" placeholder="Matn kiriting..." rows="4"></textarea>
            
            <div class="grid-2">
                <div>
                    <label>Shrift:</label>
                    <select id="fontSelect">${fontOptions}</select>
                </div>
                <div>
                    <label>Shrift o'lchami:</label>
                    <input type="range" id="fontSize" min="12" max="72" value="16">
                    <span id="fontSizeValue">16px</span>
                </div>
            </div>
            
            <div class="preview-area" id="textPreview">
                <p>Matn oldindan ko'rish</p>
            </div>
            
            <div class="btn-group">
                <button class="btn" id="toUpperBtn"><i class="fas fa-arrow-up"></i> UPPER</button>
                <button class="btn" id="toLowerBtn"><i class="fas fa-arrow-down"></i> lower</button>
                <button class="btn" id="toTitleBtn"><i class="fas fa-heading"></i> Title</button>
                <button class="btn" id="reverseBtn"><i class="fas fa-exchange-alt"></i> Reverse</button>
            </div>
            
            <div class="btn-group">
                <button class="btn" id="removeSpacesBtn"><i class="fas fa-eraser"></i> Bo'shliq</button>
                <button class="btn" id="removeNumbersBtn"><i class="fas fa-ban"></i> Raqamlar</button>
                <button class="btn" id="removeSymbolsBtn"><i class="fas fa-code"></i> Belgilar</button>
                <button class="btn" id="removeDuplicatesBtn"><i class="fas fa-clone"></i> Takrorlar</button>
            </div>
            
            <div class="btn-group">
                <button class="btn btn-primary" id="copyTextBtn"><i class="far fa-copy"></i> Nusxalash</button>
                <button class="btn" id="downloadTextBtn"><i class="fas fa-download"></i> TXT yuklash</button>
                <button class="btn" id="statsBtn"><i class="fas fa-chart-bar"></i> Statistika</button>
            </div>
            
            <div class="result-box" id="statsResult"></div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('textInput').addEventListener('input', updatePreview);
    document.getElementById('fontSelect').addEventListener('change', updatePreview);
    document.getElementById('fontSize').addEventListener('input', function() {
        document.getElementById('fontSizeValue').textContent = this.value + 'px';
        updatePreview();
    });
    
    document.getElementById('toUpperBtn').addEventListener('click', () => transformText('upper'));
    document.getElementById('toLowerBtn').addEventListener('click', () => transformText('lower'));
    document.getElementById('toTitleBtn').addEventListener('click', () => transformText('title'));
    document.getElementById('reverseBtn').addEventListener('click', () => transformText('reverse'));
    document.getElementById('removeSpacesBtn').addEventListener('click', () => transformText('nospaces'));
    document.getElementById('removeNumbersBtn').addEventListener('click', () => transformText('nonumbers'));
    document.getElementById('removeSymbolsBtn').addEventListener('click', () => transformText('nosymbols'));
    document.getElementById('removeDuplicatesBtn').addEventListener('click', () => transformText('nodupes'));
    document.getElementById('copyTextBtn').addEventListener('click', copyText);
    document.getElementById('downloadTextBtn').addEventListener('click', downloadText);
    document.getElementById('statsBtn').addEventListener('click', showStats);
}

function updatePreview() {
    const text = document.getElementById('textInput').value || 'Matn oldindan ko\'rish';
    const font = document.getElementById('fontSelect').value;
    const size = document.getElementById('fontSize').value + 'px';
    
    const preview = document.getElementById('textPreview');
    preview.style.fontFamily = font;
    preview.style.fontSize = size;
    preview.textContent = text;
}

function transformText(type) {
    let text = document.getElementById('textInput').value;
    if (!text) return;
    
    switch(type) {
        case 'upper':
            text = text.toUpperCase();
            break;
        case 'lower':
            text = text.toLowerCase();
            break;
        case 'title':
            text = text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
            break;
        case 'reverse':
            text = text.split('').reverse().join('');
            break;
        case 'nospaces':
            text = text.replace(/\s+/g, '');
            break;
        case 'nonumbers':
            text = text.replace(/[0-9]/g, '');
            break;
        case 'nosymbols':
            text = text.replace(/[^\w\s]/g, '');
            break;
        case 'nodupes':
            text = [...new Set(text.split(''))].join('');
            break;
    }
    
    document.getElementById('textInput').value = text;
    updatePreview();
}

function copyText() {
    const text = document.getElementById('textInput').value;
    if (text) {
        copyToClipboard(text);
    }
}

function downloadText() {
    const text = document.getElementById('textInput').value;
    if (!text) return;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'matn.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function showStats() {
    const text = document.getElementById('textInput').value;
    if (!text) return;
    
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
    
    document.getElementById('statsResult').innerHTML = `
        <h3>Matn statistikasi:</h3>
        <p>📝 So'zlar: ${words}</p>
        <p>📊 Belgilar: ${chars}</p>
        <p>📏 Belgilar (bo'shliqsiz): ${charsNoSpaces}</p>
        <p>📄 Gaplar: ${sentences}</p>
        <p>📑 Paragraflar: ${paragraphs}</p>
    `;
}
