const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

function renderHeader(doc, helpers, yPos) {
    const { drawRoundedRect, drawGradientText } = helpers;
    const centerX = PAGE.width / 2;
    
    // Logo: IDC ONE (using image) - preserve aspect ratio
    const logoImagePath = path.join(__dirname, '../../images', 'idcOne.png');
    
    if (fs.existsSync(logoImagePath)) {
        const logoHeight = 16;
        const estimatedLogoWidth = 55;
        const logoX = centerX - (estimatedLogoWidth / 2);
        doc.image(logoImagePath, logoX, yPos - 5, { height: logoHeight });
    } else {
        // Fallback to text if image not found
        doc.font('Helvetica-Bold').fontSize(14);
        const idcWidth = doc.widthOfString('IDC');
        doc.fillColor(COLORS.black).text('IDC', centerX - 35, yPos);
        drawRoundedRect(centerX - 35 + idcWidth + 5, yPos, 40, 18, 9, '#22C55E');
        doc.fillColor(COLORS.white).fontSize(12).text('ONE', centerX - 35 + idcWidth + 12, yPos + 3);
    }

    return yPos + 30;
}

module.exports = { renderHeader };