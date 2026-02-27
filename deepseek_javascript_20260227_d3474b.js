// app.js - Core Application Logic
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ===== SECTION CONFIGURATION =====
    const sections = [
        { id: 'islamic', name: '🕌 Islom', icon: 'fa-mosque' },
        { id: 'password', name: '🔐 Parol', icon: 'fa-lock' },
        { id: 'text', name: '🔤 Matn', icon: 'fa-font' },
        { id: 'qr', name: '📱 QR', icon: 'fa-qrcode' },
        { id: 'barcode', name: '📊 Barcode', icon: 'fa-barcode' },
        { id: 'encrypt', name: '🔐 Shifrlash', icon: 'fa-shield-alt' },
        { id: 'random', name: '🎲 Tasodifiy', icon: 'fa-dice' },
        { id: 'wheel', name: '🎡 G\'ildirak', icon: 'fa-circle' },
        { id: 'image', name: '🖼 Rasm', icon: 'fa-image' },
        { id: 'audio', name: '🎵 Audio', icon: 'fa-music' },
        { id: 'video', name: '🎬 Video', icon: 'fa-video' },
        { id: 'pdf', name: '📄 PDF', icon: 'fa-file-pdf' },
        { id: 'games', name: '🎮 O\'yinlar', icon: 'fa-gamepad' }
    ];
    
    // ===== CREATE NAVIGATION =====
    const nav = document.getElementById('mainNav');
    const sectionsContainer = document.getElementById('sectionsContainer');
    
    // Create navigation buttons
    sections.forEach(section => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.dataset.section = section.id;
        btn.innerHTML = `<i class="fas ${section.icon}"></i> ${section.name}`;
        btn.addEventListener('click', () => showSection(section.id));
        nav.appendChild(btn);
    });
    
    // Create section containers
    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.id = section.id;
        sectionDiv.className = 'section';
        sectionsContainer.appendChild(sectionDiv);
    });
    
    // ===== SHOW SECTION FUNCTION =====
    window.showSection = function(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`.nav-btn[data-section="${sectionId}"]`).classList.add('active');
        
        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        
        // Load section content if not loaded
        if (!document.getElementById(sectionId).hasChildNodes()) {
            loadSectionContent(sectionId);
        }
    };
    
    // ===== LOAD SECTION CONTENT =====
    function loadSectionContent(sectionId) {
        const contentLoaders = {
            islamic: loadIslamicContent,
            password: loadPasswordContent,
            text: loadTextContent,
            qr: loadQRContent,
            barcode: loadBarcodeContent,
            encrypt: loadEncryptContent,
            random: loadRandomContent,
            wheel: loadWheelContent,
            image: loadImageContent,
            audio: loadAudioContent,
            video: loadVideoContent,
            pdf: loadPDFContent,
            games: loadGamesContent
        };
        
        if (contentLoaders[sectionId]) {
            contentLoaders[sectionId]();
        }
    }
    
    // ===== INITIAL SECTION =====
    showSection('islamic');
    
    // ===== UTILITY FUNCTIONS =====
    window.copyToClipboard = async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            showNotification('Nusxalandi!', 'success');
        } catch (err) {
            showNotification('Nusxalashda xatolik', 'error');
        }
    };
    
    window.showNotification = function(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(212, 175, 55, 0.9)' : 'rgba(255, 0, 0, 0.9)'};
            color: #000;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };
    
    // Load initial content
    loadIslamicContent();
});