const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

const { renderStudentHeader } = require('./studentHeader');
const { renderAcademicsColumn } = require('./academicsCol');
const { renderHobbiesColumn } = require('./hobbiesCol');
const { renderAptitudeColumn } = require('./aptitudeCol');
const { renderPersonalityColumn } = require('./personalityCol');
const { renderInterestThemesColumn } = require('./interestThemesCol');
function renderStudentGlanceCard(doc, helpers, data, yPos) {
    const { drawRoundedRect } = helpers;
    
    // Student info card - IMPROVED LAYOUT with reduced height
    const cardPadding = 25; // Reduced padding for better space usage
    const studentCardWidth = PAGE.usableWidth - 40;
    const studentCardX = PAGE.margin + 20;
    
    // Draw card background - reduced height
    const studentCardHeight = 190;
    drawRoundedRect(studentCardX, yPos, studentCardWidth, studentCardHeight, 15, COLORS.white, '#E5E7EB');

    let studentY = yPos + 20;
    const contentX = studentCardX + cardPadding;

    // Render student header
    studentY = renderStudentHeader(doc, data, contentX, studentY);

    // Define column positions (5 columns) - carefully calculated to fit within bounds
    const gridCol1X = contentX;
    const gridCol2X = contentX + 100;
    const gridCol3X = contentX + 200;
    const gridCol4X = contentX + 300;
    const gridCol5X = contentX + 400;

    const gridY = studentY;

    // Render all 5 columns
    renderAcademicsColumn(doc, data, gridCol1X, gridY);
    renderHobbiesColumn(doc, data, gridCol2X, gridY);
    renderAptitudeColumn(doc, data, gridCol3X, gridY);
    renderPersonalityColumn(doc, data, gridCol4X, gridY);
    renderInterestThemesColumn(doc, data, gridCol5X, gridY);

    return yPos + studentCardHeight;
}

module.exports = { renderStudentGlanceCard };