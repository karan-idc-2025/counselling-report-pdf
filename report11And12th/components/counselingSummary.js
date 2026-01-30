const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');
const { renderClusterColumn } = require('../utils/clusterCol');
const { extractClusterData } = require('../utils/clusterData');
const { calculateColumnHeight } = require('../utils/calculateColHigh');

function renderCounselingSummary(doc, helpers, data, yPos) {
    const { drawRoundedRect } = helpers;
    
    // Calculate pill dimensions first
    const pillText = 'Counseling Recommendation Summary';
    doc.font('Helvetica-Bold').fontSize(10);
    const pillTextWidth = doc.widthOfString(pillText);
    const pillWidth = pillTextWidth + 50;
    const pillHeight = 28;
    const pillX = (PAGE.width - pillWidth) / 2;
    const pillY = yPos;
    
    // Purple card starts with overlap - pill floats ABOVE
    const cardOverlap = 14;
    const summaryCardY = pillY + pillHeight - cardOverlap;
    
    // Card dimensions
    const cardWidth = PAGE.usableWidth;
    const cardX = PAGE.margin;
    
    // Three columns inside purple card
    const columnPadding = 20;
    const columnGap = 15;
    const availableWidth = cardWidth - (columnPadding * 2) - (columnGap * 2);
    const columnWidth = availableWidth / 3;
    
    const col1X = cardX + columnPadding;
    const col2X = col1X + columnWidth + columnGap;
    const col3X = col2X + columnWidth + columnGap;
    
    // Card content starts with reduced top padding to save space
    let cardY = summaryCardY + 28;

    // Extract cluster data
    const clusterData = extractClusterData(data);

    // Calculate maximum column height
    let maxColumnHeight = 0;
    clusterData.forEach(cluster => {
        const height = calculateColumnHeight(doc, cluster, columnWidth);
        if (height > maxColumnHeight) {
            maxColumnHeight = height;
        }
    });
    
    // OPTIMIZED: Calculate card height with minimal spacing to save PDF pages
    // Top padding (28) + content + space before link (12) + link height (20) + bottom padding (10)
    const summaryCardHeight = 28 + maxColumnHeight + 12 + 20 + 10;
    
    // Draw purple card FIRST (so pill appears on top)
    drawRoundedRect(cardX, summaryCardY, cardWidth, summaryCardHeight, 25, '#8B5CF6');

    // Render up to 3 columns and track their ending positions
    const columnEndYs = [];
    if (clusterData[0]) {
        const endY = renderClusterColumn(doc, col1X, cardY, clusterData[0], columnWidth);
        columnEndYs.push(endY);
    }
    if (clusterData[1]) {
        const endY = renderClusterColumn(doc, col2X, cardY, clusterData[1], columnWidth);
        columnEndYs.push(endY);
    }
    if (clusterData[2]) {
        const endY = renderClusterColumn(doc, col3X, cardY, clusterData[2], columnWidth);
        columnEndYs.push(endY);
    }
    
    // Use the maximum column end Y position for the bottom section
    const maxColumnEndY = Math.max(...columnEndYs);

    // OPTIMIZED: Minimal spacing before link to save space
    const bottomSectionY = maxColumnEndY + 12;
    
    const linkText = 'Explore all this on your dashboard';
    doc.font('Helvetica').fontSize(9);
    const linkWidth = doc.widthOfString(linkText);
    const linkX = (PAGE.width - linkWidth) / 2;
    const linkY = bottomSectionY;
    
    doc.fillColor(COLORS.white).fontSize(9).font('Helvetica')
        .text(linkText, linkX, linkY);
    
    // Underline for the link
    const underlineY = linkY + 12;
    doc.strokeColor('#FFFFFF').lineWidth(0.8).opacity(0.7)
        .moveTo(linkX, underlineY).lineTo(linkX + linkWidth, underlineY).stroke();
    doc.opacity(1);
    
    // Gradient fading lines on both sides
    const leftLineStart = cardX + columnPadding;
    const leftLineEnd = linkX - 20;
    const lineSegments = 12;
    const leftSegmentWidth = (leftLineEnd - leftLineStart) / lineSegments;
    
    for (let i = 0; i < lineSegments; i++) {
        const opacity = 0.1 + (0.6 * (i + 1) / lineSegments);
        doc.strokeColor('#FFFFFF').lineWidth(1).opacity(opacity)
            .moveTo(leftLineStart + (i * leftSegmentWidth), bottomSectionY + 5)
            .lineTo(leftLineStart + ((i + 1) * leftSegmentWidth), bottomSectionY + 5)
            .stroke();
    }
    doc.opacity(1);
    
    const rightLineStart = linkX + linkWidth + 20;
    const rightLineEnd = cardX + cardWidth - columnPadding;
    const rightSegmentWidth = (rightLineEnd - rightLineStart) / lineSegments;
    
    for (let i = 0; i < lineSegments; i++) {
        const opacity = 0.7 - (0.6 * i / lineSegments);
        doc.strokeColor('#FFFFFF').lineWidth(1).opacity(opacity)
            .moveTo(rightLineStart + (i * rightSegmentWidth), bottomSectionY + 5)
            .lineTo(rightLineStart + ((i + 1) * rightSegmentWidth), bottomSectionY + 5)
            .stroke();
    }
    doc.opacity(1);

    // Draw pill AFTER the purple card so it appears on top (floating)
    drawRoundedRect(pillX, pillY, pillWidth, pillHeight, 14, COLORS.white, COLORS.purple);
    doc.fillColor(COLORS.purple).fontSize(10).font('Helvetica-Bold').text(pillText, pillX + 25, pillY + 8);

    // Return new yPos after the purple card
    return summaryCardY + summaryCardHeight + 20;
}

module.exports = { renderCounselingSummary };