const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

function renderInterestThemesColumn(doc, data, gridCol5X, gridY) {
    let colY = gridY;
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Top 3 Interest', gridCol5X, colY, { width: 95 });
    colY += 8;
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Themes', gridCol5X, colY, { width: 95 });
    colY += 13;
    
    const themeIcons = ['💼', '🎨', '🔍'];
    (data.topInterestThemes || []).forEach((theme, index) => {
        const icon = themeIcons[index] || '•';
        doc.fillColor('#666666').fontSize(5.5).font('Helvetica')
            .text(`${icon} ${theme}`, gridCol5X, colY, { width: 95 });
        colY += 9;
    });
}


module.exports = { renderInterestThemesColumn };