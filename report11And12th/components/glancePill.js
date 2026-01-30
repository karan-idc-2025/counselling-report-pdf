const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

function renderGlancePill(doc, helpers, yPos) {
    const { drawRoundedRect } = helpers;
    
    // Centered pill with person icon
    const glancePillText = 'You in a Glance';
    doc.font('Helvetica').fontSize(10);
    const glancePillTextWidth = doc.widthOfString(glancePillText);
    const glancePillWidth = glancePillTextWidth + 60;
    const glancePillHeight = 32;
    const glancePillX = (PAGE.width - glancePillWidth) / 2;
    const glancePillY = yPos;
    
    drawRoundedRect(glancePillX, glancePillY, glancePillWidth, glancePillHeight, 16, COLORS.white, '#D1D5DB');
    
    // Person icon
    const iconX = glancePillX + 18;
    const iconCenterY = glancePillY + 16;
    doc.save();
    doc.fillColor(COLORS.purple);
    doc.circle(iconX, iconCenterY - 4, 4).fill();
    doc.ellipse(iconX, iconCenterY + 4, 5, 3).fill();
    doc.restore();
    
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica')
        .text(glancePillText, iconX + 15, glancePillY + 10);

    return yPos + 42; // Reduced from 50 to save space
}

module.exports = { renderGlancePill };