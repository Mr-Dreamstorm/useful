// pdf.js - PDF Module
function loadPDFContent() {
    const section = document.getElementById('pdf');
    
    section.innerHTML = `
        <div class="glass-card">
            <div class="card-title">
                <i class="fas fa-file-pdf"></i>
                PDF yaratish
            </div>
            
            <div class="grid-2">
                <div>
                    <h3>Matndan PDF</h3>
                    <textarea id="pdfText" rows="4" placeholder="Matn kiriting..."></textarea>
                    <button class="btn btn-primary" id="textToPdf"><i class="fas fa-file-pdf"></i> PDF yaratish</button>
                </div>
                
                <div>
                    <h3>Rasmdan PDF</h3>
                    <input type="file" id="pdfImage" accept="image/*">
                    <button class="btn btn-primary" id="imageToPdf"><i class="fas fa-image"></i> PDF yaratish</button>
                </div>
            </div>
            
            <div id="pdfPreview" class="preview-area"></div>
        </div>
    `;
}