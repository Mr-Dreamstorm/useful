// islamic.js - Prayer Times Module
function loadIslamicContent() {
    const section = document.getElementById('islamic');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-mosque"></i>
                Namoz vaqtlari
            </div>
            
            <div class="grid-2">
                <div>
                    <label>Shahar:</label>
                    <input type="text" id="cityInput" value="Tashkent" placeholder="Shahar nomi">
                </div>
                <div>
                    <label>Mamlakat:</label>
                    <select id="countrySelect">
                        <option value="Uzbekistan">O'zbekiston</option>
                        <option value="Turkey">Turkiya</option>
                        <option value="Russia">Rossiya</option>
                        <option value="USA">AQSh</option>
                    </select>
                </div>
            </div>
            
            <div class="btn-group">
                <button class="btn btn-primary" id="fetchPrayerBtn">
                    <i class="fas fa-search"></i> Vaqtlarni olish
                </button>
                <button class="btn" id="useLocationBtn">
                    <i class="fas fa-location-dot"></i> Mening joylashuvim
                </button>
            </div>
            
            <div class="grid-3">
                <div class="result-box" id="prayerTimes">
                    <i class="fas fa-clock"></i> Vaqtlar yuklanmoqda...
                </div>
                <div class="result-box" id="hijriDate">
                    <i class="fas fa-calendar-alt"></i> Hijriy sana...
                </div>
                <div class="result-box" id="gregorianDate">
                    <i class="fas fa-calendar"></i> Milodiy sana...
                </div>
            </div>
            
            <div class="result-box glow" id="ramadanCountdown">
                <i class="fas fa-moon"></i> Ramazonga...
            </div>
        </div>
    `;
    
    // Attach event listeners
    document.getElementById('fetchPrayerBtn').addEventListener('click', fetchPrayerTimes);
    document.getElementById('useLocationBtn').addEventListener('click', getLocationAndFetch);
    
    // Initial fetch
    fetchPrayerTimes();
}

async function fetchPrayerTimes() {
    const city = document.getElementById('cityInput').value;
    const country = document.getElementById('countrySelect').value;
    
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`);
        const data = await response.json();
        
        if (data.code === 200) {
            displayPrayerTimes(data.data);
        } else {
            showNotification('Ma\'lumot olishda xatolik', 'error');
        }
    } catch (error) {
        showNotification('Serverga ulanishda xatolik', 'error');
    }
}

function displayPrayerTimes(data) {
    const timings = data.timings;
    const date = data.date;
    
    // Prayer times
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let prayerHtml = '<h3>Namoz vaqtlari:</h3>';
    prayers.forEach(prayer => {
        prayerHtml += `<p><strong>${prayer}:</strong> ${timings[prayer]}</p>`;
    });
    document.getElementById('prayerTimes').innerHTML = prayerHtml;
    
    // Hijri date
    document.getElementById('hijriDate').innerHTML = `
        <h3>Hijriy sana:</h3>
        <p>${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year}</p>
    `;
    
    // Gregorian date
    document.getElementById('gregorianDate').innerHTML = `
        <h3>Milodiy sana:</h3>
        <p>${date.gregorian.date}</p>
    `;
    
    // Ramadan countdown
    calculateRamadanCountdown();
}

function calculateRamadanCountdown() {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    // Ramadan dates (approximate)
    const ramadanStart = new Date(currentYear, 2, 1); // March 1
    const ramadanEnd = new Date(currentYear, 2, 30); // March 30
    
    if (today < ramadanStart) {
        const diff = Math.ceil((ramadanStart - today) / (1000 * 60 * 60 * 24));
        document.getElementById('ramadanCountdown').innerHTML = `
            <h3>🌙 Ramazonga ${diff} kun qoldi</h3>
        `;
    } else if (today >= ramadanStart && today <= ramadanEnd) {
        document.getElementById('ramadanCountdown').innerHTML = `
            <h3>🌟 Ramazon muborak! 🌟</h3>
        `;
    } else {
        const nextRamadan = new Date(currentYear + 1, 2, 1);
        const diff = Math.ceil((nextRamadan - today) / (1000 * 60 * 60 * 24));
        document.getElementById('ramadanCountdown').innerHTML = `
            <h3>🌙 Kelasi Ramazonga ${diff} kun qoldi</h3>
        `;
    }
}

function getLocationAndFetch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            try {
                const response = await fetch(`https://api.aladhan.com/v1/timingsByLatLng?lat=${position.coords.latitude}&lng=${position.coords.longitude}&method=2`);
                const data = await response.json();
                if (data.code === 200) {
                    displayPrayerTimes(data.data);
                }
            } catch (error) {
                showNotification('Joylashuv bo\'yicha vaqtlarni olishda xatolik', 'error');
            }
        });
    } else {
        showNotification('Brauzer joylashuvni qo\'llab-quvvatlamaydi', 'error');
    }
}