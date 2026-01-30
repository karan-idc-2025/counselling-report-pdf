const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

function renderAptitudeColumn(doc, data, gridCol3X, gridY) {
    let colY = gridY;
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Aptitude score:', gridCol3X, colY);
    colY += 13;
    
    doc.fillColor(COLORS.black).fontSize(6.5).font('Helvetica-Bold')
        .text('Medium Scored Areas', gridCol3X, colY);
    colY += 10;
    
    (data.aptitudeScore?.mediumScoredAreas || []).forEach(area => {
        doc.fillColor('#666666').fontSize(5.5).font('Helvetica')
            .text(`• ${area}`, gridCol3X, colY, { width: 95 });
        colY += 9;
    });
    
    colY += 4;
    doc.fillColor(COLORS.black).fontSize(6.5).font('Helvetica-Bold')
        .text('Low Scored Areas', gridCol3X, colY);
    colY += 10;
    
    (data.aptitudeScore?.lowScoredAreas || []).forEach(area => {
        doc.fillColor('#666666').fontSize(5.5).font('Helvetica')
            .text(`• ${area}`, gridCol3X, colY, { width: 95 });
        colY += 9;
    });
}

module.exports = { renderAptitudeColumn };