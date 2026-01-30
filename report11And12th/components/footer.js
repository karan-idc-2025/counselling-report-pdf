const { COLORS, PAGE } = require('../../constants');

const PAGE2_COLORS = {
    primaryPurple: '#8B5CF6',
    white: '#FFFFFF'
};

/**
 * Render Footer Section - Best wishes and copyright
 */
function renderFooter(doc, helpers, yPos) {
    const { drawRoundedRect } = helpers;
    
    const footerHeight = 70;
    const copyrightHeight = 8;
    const footerSpacing = 8;
    
    // Calculate minimum space needed
    const minFooterSpace = footerHeight + footerSpacing + copyrightHeight;
    
    // Check if footer fits on current page
    const pageBottom = PAGE.height;
    const availableSpace = pageBottom - yPos;
    
    // Only create new page if footer truly won't fit
    if (availableSpace < minFooterSpace) {
        doc.addPage();
        yPos = PAGE.margin;
    }
    
    const footerY = yPos;

    // Footer background
    drawRoundedRect(PAGE.margin, footerY, PAGE.usableWidth, footerHeight, 15, PAGE2_COLORS.primaryPurple);

    // Best wishes text
    doc.fillColor(PAGE2_COLORS.white).fontSize(12).font('Helvetica-Bold');
    const wishesText = 'Best wishes for your journey ahead!';
    const wishesWidth = doc.widthOfString(wishesText);
    const wishesX = PAGE.margin + (PAGE.usableWidth - wishesWidth) / 2;
    doc.text(wishesText, wishesX, footerY + 15);

    // Subtext
    doc.fontSize(9).font('Helvetica');
    const subtextText = 'If you need further guidance, speak with your school counselor or connect with professionals in your chosen fields.';
    const subtextX = PAGE.margin + 20;
    doc.text(subtextText, subtextX, footerY + 35, { 
        width: PAGE.usableWidth - 40, 
        align: 'center',
        lineBreak: false
    });

    // Copyright
    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica');
    const copyrightText = 'Copyright © Medhavi Professional Services Pvt. Ltd. All Rights Reserved';
    const copyrightWidth = doc.widthOfString(copyrightText);
    const copyrightX = PAGE.margin + (PAGE.usableWidth - copyrightWidth) / 2;
    const copyrightY = footerY + footerHeight + 3;
    doc.text(copyrightText, copyrightX, copyrightY, { lineBreak: false });

    return copyrightY + copyrightHeight;
}

module.exports = { renderFooter };