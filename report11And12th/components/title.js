const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

function renderTitle(doc, helpers, yPos) {
    const { drawGradientText } = helpers;
    
    // Main title with gradient effect
    const titleText = 'RECOMMENDATION REPORT';
    const titleFontSize = 22;
    doc.fontSize(titleFontSize).font('Helvetica-Bold');
    const titleWidth = doc.widthOfString(titleText);
    const titleX = (PAGE.width - titleWidth) / 2;
    
    drawGradientText(titleText, titleX, yPos, titleFontSize, '#A855F7', '#6C4CF1');

    return yPos + 30;
}

module.exports = { renderTitle };