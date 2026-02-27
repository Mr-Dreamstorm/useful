// password.js - Password Generator Module
function loadPasswordContent() {
    const section = document.getElementById('password');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-lock"></i>
                Parol generator
            </div>
            
            <div class="grid-2">
                <div>
                    <label>Parol uzunligi (4-10):</label>
                    <input type="range" id="passLength" min="4" max="10" value="8">
                    <span id="passLengthValue">8</span>
                </div>
            </div>
            
            <div class="grid-4">
                <label class="checkbox-label">
                    <input type="checkbox" id="uppercase" checked> Katta harflar
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="lowercase" checked> Kichik harflar
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="numbers" checked> Raqamlar
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="symbols"> Belgilar
                </label>
            </div>
            
            <div class="btn-group">
                <button class="btn btn-primary" id="generatePassBtn">
                    <i class="fas fa-key"></i> Parol yaratish
                </button>
                <button class="btn" id="copyPassBtn">
                    <i class="far fa-copy"></i> Nusxalash
                </button>
            </div>
            
            <div class="result-box glow" id="passwordResult">
                <span id="generatedPassword"></span>
            </div>
            
            <div class="password-strength" id="passwordStrength">
                <div class="strength-bar"></div>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('passLength').addEventListener('input', function() {
        document.getElementById('passLengthValue').textContent = this.value;
    });
    
    document.getElementById('generatePassBtn').addEventListener('click', generatePassword);
    document.getElementById('copyPassBtn').addEventListener('click', copyPassword);
    
    // Initial generation
    generatePassword();
}

function generatePassword() {
    const length = parseInt(document.getElementById('passLength').value);
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    if (document.getElementById('uppercase').checked) chars += uppercase;
    if (document.getElementById('lowercase').checked) chars += lowercase;
    if (document.getElementById('numbers').checked) chars += numbers;
    if (document.getElementById('symbols').checked) chars += symbols;
    
    if (chars === '') {
        showNotification('Kamida bitta tur tanlang!', 'error');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    document.getElementById('generatedPassword').textContent = password;
    calculatePasswordStrength(password);
}

function copyPassword() {
    const password = document.getElementById('generatedPassword').textContent;
    if (password) {
        copyToClipboard(password);
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    else if (password.length >= 6) strength += 15;
    else strength += 5;
    
    // Character variety
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Update strength bar
    const strengthBar = document.getElementById('passwordStrength');
    strengthBar.innerHTML = `<div class="strength-bar" style="width: ${strength}%; background: ${strength > 75 ? '#00ff00' : strength > 50 ? '#ffff00' : '#ff0000'}"></div>`;
}