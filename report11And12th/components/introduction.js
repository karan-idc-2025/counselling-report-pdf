const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

function renderIntroduction(doc, data, yPos) {
    const introText = `Hi ${data.name}! This is your personalised Career Recommendation Report, created just for you. Based on your interests, strengths, and aspirations, it highlights the recommended career clusters, top career pathways you and colleges, courses, exams related to help you move forward with confidence.`;
    
    doc.fillColor(COLORS.black)
        .fontSize(8)
        .font('Helvetica')
        .text(introText, PAGE.margin, yPos, { align: 'center', width: PAGE.usableWidth, lineGap: 1 });

    return yPos + doc.heightOfString(introText, { width: PAGE.usableWidth }) + 20;
}

module.exports = { renderIntroduction };