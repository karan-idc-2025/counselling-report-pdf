const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

function renderHobbiesColumn(doc, data, gridCol2X, gridY) {
    let colY = gridY;
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Hobbies', gridCol2X, colY);
    colY += 13;
    
    (data.hobbies || []).forEach(hobby => {
        doc.fillColor('#666666').fontSize(5.5).font('Helvetica')
            .text(`• ${hobby}`, gridCol2X, colY, { width: 95 });
        colY += 9;
    });
}

module.exports = { renderHobbiesColumn };