

function calculateColumnHeight(doc, clusterData, columnWidth) {
    let height = 0;
    
    // Column title - reduced spacing
    doc.fontSize(9).font('Helvetica-Bold');
    height += doc.heightOfString(clusterData.title, { width: columnWidth }) + 12;
    
    // Top Careers section - reduced spacing
    height += 11 + 6; // Header + reduced spacing
    doc.fontSize(6).font('Helvetica');
    clusterData.topCareers.forEach((career, index) => {
        const careerText = `${index + 1}. ${career}`;
        height += doc.heightOfString(careerText, { width: columnWidth }) + 1.5;
    });
    height += 6;
    
    // Courses section - reduced spacing
    height += 11 + 6;
    clusterData.courses.forEach(course => {
        height += doc.heightOfString(`• ${course}`, { width: columnWidth }) + 1.5;
    });
    height += 6;
    
    // Colleges section - reduced spacing
    height += 11 + 6;
    clusterData.colleges.forEach(college => {
        height += doc.heightOfString(`• ${college}`, { width: columnWidth }) + 2;
    });
    height += 6;
    
    // Entrance Exams section - reduced spacing
    height += 11 + 6;
    clusterData.exams.forEach(exam => {
        height += doc.heightOfString(`• ${exam}`, { width: columnWidth }) + 1.5;
    });
    
    return height;
}
module.exports = { calculateColumnHeight };