const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

// Helper function to render a career cluster column
function renderClusterColumn(doc, x, cardY, clusterData, columnWidth) {
    let localY = cardY;
    
    // Column title - reduced font size
    doc.fillColor(COLORS.white).fontSize(9).font('Helvetica-Bold');
    const titleHeight = doc.heightOfString(clusterData.title, { width: columnWidth });
    doc.text(clusterData.title, x, localY, { width: columnWidth, align: 'left' });
    localY += titleHeight + 12; // Reduced spacing from 16 to 12
    
    // Top Careers section - reduced font size
    doc.fillColor(COLORS.white).fontSize(7.5).font('Helvetica-Bold')
        .text('Top Careers', x, localY);
    localY += 11; // Reduced from 14
    
    doc.fillColor(COLORS.white).fontSize(6).font('Helvetica'); // Reduced from 7
    clusterData.topCareers.forEach((career, index) => {
        const careerText = `${index + 1}. ${career}`;
        const careerHeight = doc.heightOfString(careerText, { width: columnWidth });
        doc.text(careerText, x, localY, { width: columnWidth });
        localY += careerHeight + 1.5; // Reduced from 2
    });
    
    localY += 6; // Reduced from 8
    
    // Courses section - reduced font size
    doc.fillColor(COLORS.white).fontSize(7.5).font('Helvetica-Bold')
        .text('Courses', x, localY);
    localY += 11; // Reduced from 14
    
    doc.fillColor(COLORS.white).fontSize(6).font('Helvetica'); // Reduced from 7
    clusterData.courses.forEach(course => {
        const courseHeight = doc.heightOfString(`• ${course}`, { width: columnWidth });
        doc.text(`• ${course}`, x, localY, { width: columnWidth });
        localY += courseHeight + 1.5; // Reduced from 2
    });
    
    localY += 6; // Reduced from 8
    
    // Colleges section - reduced font size
    doc.fillColor(COLORS.white).fontSize(7.5).font('Helvetica-Bold')
        .text('College Options', x, localY);
    localY += 11; // Reduced from 14
    
    doc.fillColor(COLORS.white).fontSize(6).font('Helvetica'); // Reduced from 7
    clusterData.colleges.forEach(college => {
        const collegeHeight = doc.heightOfString(`• ${college}`, { width: columnWidth });
        doc.text(`• ${college}`, x, localY, { width: columnWidth });
        localY += collegeHeight + 2; // Reduced from 3
    });
    
    localY += 6; // Reduced from 8
    
    // Entrance Exams section - reduced font size
    doc.fillColor(COLORS.white).fontSize(7.5).font('Helvetica-Bold')
        .text('Entrance Exams', x, localY);
    localY += 11; // Reduced from 14
    
    doc.fillColor(COLORS.white).fontSize(6).font('Helvetica'); // Reduced from 7
    clusterData.exams.forEach(exam => {
        const examHeight = doc.heightOfString(`• ${exam}`, { width: columnWidth });
        doc.text(`• ${exam}`, x, localY, { width: columnWidth });
        localY += examHeight + 1.5; // Reduced from 2
    });
    
    return localY;
}

module.exports = { renderClusterColumn };