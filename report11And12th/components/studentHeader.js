const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');


function renderStudentHeader(doc, data, contentX, studentY) {
    // Student name directly (no profile image)
    doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
        .text(data.name, contentX, studentY + 5);
    
    // Student details (class, stream, board) on second line
    const detailsY = studentY + 22;
    const detailsText = `12th Class | ${data.stream || 'PCM'} | ${data.board || 'CBSE'} | CCC Training Practice School`;
    doc.fillColor(COLORS.gray).fontSize(7).font('Helvetica')
        .text(detailsText, contentX, detailsY);

    return studentY + 50;
}

module.exports = { renderStudentHeader };