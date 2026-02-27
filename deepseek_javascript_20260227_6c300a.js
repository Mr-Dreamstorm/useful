// wheel.js - Spinning Wheel Module
function loadWheelContent() {
    const section = document.getElementById('wheel');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-circle"></i>
                G'ildirak
            </div>
            
            <div class="grid-2">
                <div>
                    <label>Elementlar (vergul bilan ajrating):</label>
                    <textarea id="wheelItems" rows="4" placeholder="Masalan: olma,anor,uzum,behi,gilos">olma,anor,uzum,behi,gilos</textarea>
                    
                    <div class="btn-group">
                        <button class="btn btn-primary" id="spinWheelBtn">
                            <i class="fas fa-sync-alt"></i> Aylantirish
                        </button>
                        <button class="btn" id="resetWheelBtn">
                            <i class="fas fa-undo"></i> Qayta boshlash
                        </button>
                    </div>
                </div>
                
                <div class="preview-area">
                    <canvas id="wheelCanvas" width="300" height="300"></canvas>
                </div>
            </div>
            
            <div class="result-box glow" id="winnerResult">
                <span>G'olib: </span>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('spinWheelBtn').addEventListener('click', spinWheel);
    document.getElementById('resetWheelBtn').addEventListener('click', resetWheel);
    
    // Initial draw
    drawWheel();
}

let isSpinning = false;
let currentRotation = 0;

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const items = document.getElementById('wheelItems').value.split(',').map(item => item.trim());
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 140;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const colors = ['#d4af37', '#0a0f1c', '#b8860b', '#1a1f2e', '#9b7e1e', '#2c2f3a'];
    
    const angleStep = (Math.PI * 2) / items.length;
    
    for (let i = 0; i < items.length; i++) {
        const startAngle = i * angleStep + currentRotation;
        const endAngle = (i + 1) * angleStep + currentRotation;
        
        // Draw segment
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + angleStep / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.fillText(items[i].substring(0, 10), radius - 20, 5);
        ctx.restore();
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    const spins = Math.random() * 10 + 15; // 15-25 spins
    const targetRotation = currentRotation + (Math.PI * 2 * spins);
    
    animateSpin(targetRotation);
}

function animateSpin(targetRotation) {
    const duration = 3000; // 3 seconds
    const startTime = performance.now();
    const startRotation = currentRotation;
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth stop
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            determineWinner();
        }
    }
    
    requestAnimationFrame(animate);
}

function determineWinner() {
    const items = document.getElementById('wheelItems').value.split(',').map(item => item.trim());
    const anglePerItem = (Math.PI * 2) / items.length;
    
    // Normalize rotation to 0-2PI
    const normalizedRotation = currentRotation % (Math.PI * 2);
    
    // Find which segment is at the top (pointing up)
    let winnerIndex = Math.floor((normalizedRotation + anglePerItem / 2) / anglePerItem) % items.length;
    
    document.getElementById('winnerResult').innerHTML = `
        <h3>🏆 G'olib: ${items[winnerIndex]}</h3>
    `;
}

function resetWheel() {
    currentRotation = 0;
    drawWheel();
    document.getElementById('winnerResult').innerHTML = '<span>G\'olib: </span>';
}