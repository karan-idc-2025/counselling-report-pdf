const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { PAGE } = require('./constants');
const { renderPage1 } = require('./page1');
const { renderPage2 } = require('./page2');
const { sampleData } = require('./sampleData');

/**
 * Generate Career Recommendation Report PDF
 * @param {Object} data - Student data object
 * @param {string} outputPath - Path to save PDF (default: 'recommendation-report.pdf')
 */
function generateCareerReportPDF(data, outputPath = `class-${sampleData.class}-recommendation-report.pdf`) {
    const doc = new PDFDocument({
        size: 'A4',
        margins: { top: PAGE.margin, bottom: PAGE.margin, left: PAGE.margin, right: PAGE.margin },
        autoFirstPage: true,
        bufferPages: true
    });

    doc.pipe(fs.createWriteStream(outputPath));

    // Add background image to all pages
    const bgImagePath = path.join(__dirname, 'images', 'bg.jpeg');
    
    // Helper function to draw background on current page
    function drawBackground() {
        if (fs.existsSync(bgImagePath)) {
            // Draw background at (0, 0) to cover entire page, ignoring margins
            doc.image(bgImagePath, 0, 0, { 
                width: PAGE.width, 
                height: PAGE.height
            });
        }
    }
    
    // Draw background on the first page (auto-created)
    drawBackground();
    
    // Listen for new pages and add background to each
    // This event fires when a new page is added, before any content is drawn
    doc.on('pageAdded', () => {
        drawBackground();
    });

    // Render Page 1 and get page info
    const page1Info = renderPage1(doc, data);
    
    console.log('Sidebar created new page:', page1Info.sidebarCreatedNewPage);
    
    // Render Page 2, passing page1Info for sidebar coordination
    renderPage2(doc, data, page1Info);

    // Finalize PDF
    doc.end();

    return new Promise((resolve, reject) => {
        doc.on('end', () => {
            console.log(`PDF generated successfully: ${outputPath}`);
            resolve(outputPath);
        });
        doc.on('error', reject);
    });
}

// ========== EXPORT AND RUN ==========
if (require.main === module) {
    generateCareerReportPDF(sampleData)
        .then(() => console.log('PDF generation completed!'))
        .catch(err => console.error('Error generating PDF:', err));
}

module.exports = { generateCareerReportPDF };