const fs = require('fs');
const path = require('path');
const { COLORS, PAGE } = require('../../constants');

const COURSE_COLORS = {
    primaryPurple: '#8B5CF6',
    lightBackground: '#F9FAFB',
    cyanLink: '#06B6D4',
    white: '#FFFFFF',
    textGray: '#6B7280',
    pillColors: {
        'Legal Services': { bg: '#ECFDF5', border: '#10B981', text: '#059669' },
        'Finance & Banking': { bg: '#DBEAFE', border: '#0EA5E9', text: '#0284C7' },
        'Hospitality, Tourism & Transport Services': { bg: '#FEF3C7', border: '#F59E0B', text: '#D97706' },
        'Engineering & Technology': { bg: '#ECFDF5', border: '#10B981', text: '#059669' },
        'Information Technology & Computer Science': { bg: '#DBEAFE', border: '#0EA5E9', text: '#0284C7' },
        'Science & Mathematics': { bg: '#FCE7F3', border: '#EC4899', text: '#DB2777' }
    }
};

/**
 * Render Courses After Grade 12 Section
 * Matches Figma design with single box containing all clusters in 2-column layout
 * IMPROVED: Better page break logic using actual calculated height
 */
function renderCoursesAfterGrade12(doc, helpers, data, yPos) {
    const { drawRoundedRect } = helpers;
    
    // Get courses data
    const coursesData = data.ai_recommendation_structured?.coursesAfter12 || [];
    
    // If no courses data, skip section
    if (coursesData.length === 0) {
        return yPos;
    }

    // ========== CALCULATE ACTUAL HEIGHT FIRST ==========
    const boxPadding = 12;
    const columnGap = 12;
    const columnWidth = (PAGE.usableWidth - (boxPadding * 2) - columnGap) / 2;

    // Calculate heights
    const clusterHeights = [];
    for (let i = 0; i < coursesData.length; i++) {
        const cluster = coursesData[i];
        const height = calculateClusterContentHeight(doc, cluster, columnWidth);
        clusterHeights.push(height);
    }

    // Calculate max height for each row
    let maxRowHeight = 0;
    for (let i = 0; i < coursesData.length; i += 2) {
        const leftHeight = clusterHeights[i];
        const rightHeight = clusterHeights[i + 1] || 0;
        const rowHeight = Math.max(leftHeight, rightHeight);
        maxRowHeight += rowHeight + 14;
    }

    const headerPillHeight = 28;
    const spaceAfterHeader = 12;
    const totalBoxHeight = maxRowHeight + (boxPadding * 2) - 14;
    const totalSectionHeight = headerPillHeight + spaceAfterHeader + totalBoxHeight + 15;

    // ========== SMART PAGE BREAK: Only if actual content won't fit ==========
    const remainingSpace = PAGE.height - PAGE.margin - yPos;
    const minimumSpaceNeeded = 150; // Minimum to start on current page
    
    if (remainingSpace < minimumSpaceNeeded || (totalSectionHeight > remainingSpace && remainingSpace < PAGE.height * 0.4)) {
        doc.addPage();
        yPos = PAGE.margin;
    }

    // ========== PURPLE HEADER PILL ==========
    drawRoundedRect(PAGE.margin, yPos, PAGE.usableWidth, headerPillHeight, 20, COURSE_COLORS.primaryPurple);
    
    doc.fillColor(COURSE_COLORS.white).fontSize(12).font('Helvetica-Bold');
    const headerText = 'Courses After Grade 12';
    const headerTextWidth = doc.widthOfString(headerText);
    const headerTextX = PAGE.margin + (PAGE.usableWidth - headerTextWidth) / 2;
    doc.text(headerText, headerTextX, yPos + 8);

    yPos += headerPillHeight + 12;

    // ========== SINGLE LIGHT GRAY BOX FOR ALL CONTENT ==========
    const boxStartY = yPos;
    const leftColumnX = PAGE.margin + boxPadding;
    const rightColumnX = leftColumnX + columnWidth + columnGap;

    // Draw the single light background box
    drawRoundedRect(PAGE.margin, boxStartY, PAGE.usableWidth, totalBoxHeight, 15, COURSE_COLORS.lightBackground);

    // ========== RENDER CLUSTERS IN 2-COLUMN LAYOUT INSIDE THE BOX ==========
    let contentY = boxStartY + boxPadding;

    for (let i = 0; i < coursesData.length; i += 2) {
        const leftCluster = coursesData[i];
        const rightCluster = coursesData[i + 1];

        const leftHeight = clusterHeights[i];
        const rightHeight = clusterHeights[i + 1] || 0;
        const maxHeight = Math.max(leftHeight, rightHeight);

        // Check if we need new page (during rendering)
        if (contentY + maxHeight + boxPadding > PAGE.height - PAGE.margin) {
            doc.addPage();
            yPos = PAGE.margin;
            contentY = yPos + boxPadding;
            // Draw continuation box
            const remainingHeight = maxHeight + (boxPadding * 2);
            drawRoundedRect(PAGE.margin, yPos, PAGE.usableWidth, remainingHeight, 15, COURSE_COLORS.lightBackground);
        }

        // Draw left cluster
        drawClusterContent(doc, leftCluster, leftColumnX, contentY, columnWidth);

        // Draw right cluster if exists
        if (rightCluster) {
            drawClusterContent(doc, rightCluster, rightColumnX, contentY, columnWidth);
        }

        contentY += maxHeight + 14;
    }

    // Return position after the box
    return boxStartY + totalBoxHeight + 15;
}

/**
 * Draw cluster content (pill + courses) without background box
 */
function drawClusterContent(doc, cluster, x, y, width) {
    let contentY = y;
    const contentX = x;

    // Get pill colors for this cluster
    const colors = COURSE_COLORS.pillColors[cluster.cluster] || {
        bg: '#ECFDF5',
        border: '#10B981',
        text: '#059669'
    };

    // ========== CLUSTER NAME PILL ==========
    doc.fontSize(9).font('Helvetica-Bold');
    
    // Calculate if text fits in pill, if not, truncate with ellipsis
    const maxPillWidth = width - 20;
    let clusterText = cluster.cluster;
    let textWidth = doc.widthOfString(clusterText);
    
    // If text is too long, truncate it
    if (textWidth + 30 > maxPillWidth) {
        while (textWidth + 30 > maxPillWidth && clusterText.length > 3) {
            clusterText = clusterText.substring(0, clusterText.length - 1);
            textWidth = doc.widthOfString(clusterText + '...');
        }
        clusterText = clusterText + '...';
        textWidth = doc.widthOfString(clusterText);
    }
    
    const pillWidth = Math.min(textWidth + 30, maxPillWidth);
    const pillHeight = 24;
    
    // Draw pill background
    doc.save();
    doc.roundedRect(contentX, contentY, pillWidth, pillHeight, 14)
       .fillAndStroke(colors.bg, colors.border);
    doc.restore();
    
    // Draw pill text
    doc.fillColor(colors.text).fontSize(9).font('Helvetica-Bold');
    const textX = contentX + (pillWidth - textWidth) / 2;
    doc.text(clusterText, textX, contentY + 6, {
        width: pillWidth - 20,
        lineBreak: false
    });

    contentY += pillHeight + 8;

    // ========== COURSES LIST ==========
    cluster.courses.forEach((course, index) => {
        // Course name with bullet (cyan, bold, underlined)
        doc.fillColor(COURSE_COLORS.cyanLink).fontSize(7).font('Helvetica-Bold');
        
        const bulletText = `• ${course.courseName}`;
        doc.text(bulletText, contentX, contentY, { 
            underline: true,
            link: null,
            width: width,
            lineBreak: true
        });
        
        const courseNameHeight = doc.heightOfString(bulletText, {
            width: width
        });
        contentY += courseNameHeight + 1;

        // Course details in parentheses (gray, regular)
        const details = [];
        if (course.duration) details.push(course.duration);
        if (course.difficulty) details.push(course.difficulty);
        
        if (details.length > 0) {
            const detailsText = `(${details.join(', ')})`;
            
            doc.fillColor(COURSE_COLORS.textGray).fontSize(6).font('Helvetica');
            doc.text(detailsText, contentX + 10, contentY, {
                width: width - 10
            });
            
            const detailsHeight = doc.heightOfString(detailsText, {
                width: width - 10
            });
            contentY += detailsHeight + 5;
        } else {
            contentY += 5;
        }
    });
}

/**
 * Calculate cluster content height (for layout planning)
 */
function calculateClusterContentHeight(doc, cluster, width) {
    let height = 0;
    
    // Pill height
    height += 24 + 8; // pill + gap
    
    // Courses
    cluster.courses.forEach((course) => {
        // Course name
        doc.fontSize(7).font('Helvetica-Bold');
        const bulletText = `• ${course.courseName}`;
        const courseNameHeight = doc.heightOfString(bulletText, { width: width });
        height += courseNameHeight + 1;
        
        // Details
        const details = [];
        if (course.duration) details.push(course.duration);
        if (course.difficulty) details.push(course.difficulty);
        
        if (details.length > 0) {
            const detailsText = `(${details.join(', ')})`;
            doc.fontSize(6).font('Helvetica');
            const detailsHeight = doc.heightOfString(detailsText, { width: width - 10 });
            height += detailsHeight + 5;
        } else {
            height += 5;
        }
    });
    
    return height;
}

module.exports = { renderCoursesAfterGrade12 };