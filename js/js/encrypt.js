// encrypt.js - Encryption Module
function loadEncryptContent() {
    const section = document.getElementById('encrypt');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-shield-alt"></i>
                Shifrlash vositalari
            </div>
            
            <div class="grid-2">
                <div>
                    <label>Shifrlash turi:</label>
                    <select id="encryptType">
                        <option value="caesar">Caesar</option>
                        <option value="base64">Base64</option>
                        <option value="morse">Morse kodi</option>
                        <option value="binary">Binary</option>
                        <option value="rot13">ROT13</option>
                        <option value="atbash">Atbash</option>
                        <option value="reverse">Reverse</option>
                        <option value="vigenere">Vigenere</option>
                    </select>
                </div>
                
                <div id="vigenereKeyField" style="display: none;">
                    <input type="text" id="vigenereKey" placeholder="Vigenere kaliti">
                </div>
            </div>
            
            <textarea id="encryptInput" placeholder="Matn kiriting..." rows="4"></textarea>
            
            <div class="btn-group">
                <button class="btn btn-primary" id="encryptBtn">
                    <i class="fas fa-lock"></i> Shifrlash
                </button>
                <button class="btn" id="decryptBtn">
                    <i class="fas fa-unlock"></i> Deshifrlash
                </button>
                <button class="btn" id="copyEncryptResult">
                    <i class="far fa-copy"></i> Nusxalash
                </button>
            </div>
            
            <div class="result-box" id="encryptResult"></div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('encryptType').addEventListener('change', toggleVigenereField);
    document.getElementById('encryptBtn').addEventListener('click', () => processEncrypt(true));
    document.getElementById('decryptBtn').addEventListener('click', () => processEncrypt(false));
    document.getElementById('copyEncryptResult').addEventListener('click', copyEncryptResult);
}

function toggleVigenereField() {
    const type = document.getElementById('encryptType').value;
    document.getElementById('vigenereKeyField').style.display = type === 'vigenere' ? 'block' : 'none';
}

function processEncrypt(encrypt) {
    const type = document.getElementById('encryptType').value;
    const input = document.getElementById('encryptInput').value;
    const key = document.getElementById('vigenereKey')?.value || '';
    
    if (!input) {
        showNotification('Matn kiriting!', 'error');
        return;
    }
    
    let result = '';
    
    switch(type) {
        case 'caesar':
            result = caesarCipher(input, encrypt ? 3 : -3);
            break;
        case 'base64':
            result = encrypt ? btoa(input) : atob(input);
            break;
        case 'morse':
            result = encrypt ? textToMorse(input) : morseToText(input);
            break;
        case 'binary':
            result = encrypt ? textToBinary(input) : binaryToText(input);
            break;
        case 'rot13':
            result = rot13(input);
            break;
        case 'atbash':
            result = atbash(input);
            break;
        case 'reverse':
            result = input.split('').reverse().join('');
            break;
        case 'vigenere':
            result = encrypt ? vigenereEncrypt(input, key) : vigenereDecrypt(input, key);
            break;
    }
    
    document.getElementById('encryptResult').textContent = result;
}

function caesarCipher(text, shift) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            return String.fromCharCode(((code - base + shift + 26) % 26) + base);
        }
        return char;
    }).join('');
}

function textToMorse(text) {
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.'
    };
    
    return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
}

function morseToText(morse) {
    const morseCode = {
        '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
        '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
        '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
        '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
        '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
        '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
        '---..': '8', '----.': '9'
    };
    
    return morse.split(' ').map(code => morseCode[code] || code).join('');
}

function textToBinary(text) {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function binaryToText(binary) {
    return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

function rot13(text) {
    return text.replace(/[a-zA-Z]/g, char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + 13) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + 13) % 26) + 97);
        }
        return char;
    });
}

function atbash(text) {
    return text.split('').map(char => {
        if (char.match(/[a-z]/)) {
            return String.fromCharCode(219 - char.charCodeAt(0));
        } else if (char.match(/[A-Z]/)) {
            return String.fromCharCode(155 - char.charCodeAt(0));
        }
        return char;
    }).join('');
}

function vigenereEncrypt(text, key) {
    if (!key) return text;
    
    let result = '';
    key = key.toUpperCase();
    
    for (let i = 0, j = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            const keyChar = key[j % key.length].charCodeAt(0) - 65;
            result += String.fromCharCode(((code - base + keyChar) % 26) + base);
            j++;
        } else {
            result += char;
        }
    }
    return result;
}

function vigenereDecrypt(text, key) {
    if (!key) return text;
    
    let result = '';
    key = key.toUpperCase();
    
    for (let i = 0, j = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const base = code >= 65 && code <= 90 ? 65 : 97;
            const keyChar = key[j % key.length].charCodeAt(0) - 65;
            result += String.fromCharCode(((code - base - keyChar + 26) % 26) + base);
            j++;
        } else {
            result += char;
        }
    }
    return result;
}

function copyEncryptResult() {
    const result = document.getElementById('encryptResult').textContent;
    if (result) {
        copyToClipboard(result);
    }
}
