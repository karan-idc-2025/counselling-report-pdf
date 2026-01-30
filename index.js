const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { PAGE } = require('./constants');
const { renderPage1 } = require('./page1');
const { renderPage2 } = require('./page2');
// Page renderer for class 11/12 reports
const { renderPage: renderPage11and12 } = require('./report11And12th/page');
const { sampleData } = require('./sampleData');
const { sampleData12 } = require('./sampleData12');


/**
 * Generate Career Recommendation Report PDF
 * @param {Object} data - Student data object
 * @param {string} outputPath - Path to save PDF (default: 'recommendation-report.pdf')
 */

const standard = 11
function generateCareerReportPDF(data, outputPath = `class-${standard}-recommendation-report.pdf`) {
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

    // Choose page rendering based on student's class
    const classNum = parseInt(standard, 10);
    if (classNum === 11 || classNum === 12) {
        // Use the combined page layout for classes 11 & 12
        const pageInfo = renderPage11and12(doc, data);
        console.log('Rendered 11/12 report page. Sidebar created new page:', !!(pageInfo && pageInfo.sidebarCreatedNewPage));
    } else {
        // Default flow for other classes (existing 2-page layout)
        const page1Info = renderPage1(doc, data);
        console.log('Sidebar created new page:', page1Info.sidebarCreatedNewPage);
        // Render Page 2, passing page1Info for sidebar coordination
        renderPage2(doc, data, page1Info);
    }

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
    generateCareerReportPDF(standard == 11 ? sampleData12 : sampleData)
        .then(() => console.log('PDF generation completed!'))
        .catch(err => console.error('Error generating PDF:', err));
}

module.exports = { generateCareerReportPDF };