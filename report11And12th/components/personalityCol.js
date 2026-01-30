const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

function renderPersonalityColumn(doc, data, gridCol4X, gridY) {
    let colY = gridY;
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Personality Area:', gridCol4X, colY);
    colY += 13;
    
    doc.fillColor(COLORS.black).fontSize(6.5).font('Helvetica-Bold')
        .text('You seem to be:', gridCol4X, colY);
    colY += 10;
    
    (data.personalityArea?.youSeemToBe || []).forEach(trait => {
        doc.fillColor('#666666').fontSize(5.5).font('Helvetica')
            .text(`• ${trait}`, gridCol4X, colY, { width: 95 });
        colY += 9;
    });
}

module.exports = { renderPersonalityColumn };