const fs = require('fs');
const path = require('path');
const { COLORS, PAGE } = require('../../constants');

const PAGE2_COLORS = {
    primaryPurple: '#8B5CF6',
    lightPurpleBackground: '#EDE9FE',
    lightGrayCard: '#F3F4F6',
    cyanLink: '#06B6D4',
    white: '#FFFFFF'
};

/**
 * Calculate card height based on content
 */
function calculateCardHeight(doc, cluster, width) {
    let height = 12; // Top padding
    
    // Calculate title height dynamically
    doc.fontSize(12).font('Helvetica-Bold');
    const titleHeight = doc.heightOfString(cluster.title, { width: width - 42 }); // 24 padding + 18 icon space
    height += Math.max(titleHeight, 14) + 6; // Title height with minimum
    
    height += 8; // Divider
    height += 12; // "Why this Cluster?" title
    
    doc.fontSize(7).font('Helvetica');
    cluster.whyCluster.forEach(reason => {
        height += doc.heightOfString(`• ${reason}`, { width: width - 34 }) + 2;
    });
    
    height += 5 + 12; // Gap + "Top Careers:" title
    height += cluster.topCareers.length * 10;
    height += 12; // Bottom padding
    
    return height;
}

/**
 * Draw a single career cluster card
 */
function drawClusterCard(doc, helpers, cluster, x, y, width) {
    const { drawRoundedRect } = helpers;
    const cardHeight = calculateCardHeight(doc, cluster, width);
    const cardRadius = 12;
    
    // Card background
    drawRoundedRect(x, y, width, cardHeight, cardRadius, PAGE2_COLORS.lightGrayCard);

    let contentY = y + 12;
    const cardContentX = x + 12;
    const cardContentWidth = width - 24;

    // Icon + Title (with dynamic height calculation)
    const businessIconPath = path.join(__dirname, '../../images', 'business.jpg');
    if (fs.existsSync(businessIconPath)) {
        doc.image(businessIconPath, cardContentX, contentY - 2, { width: 14, height: 14 });
    }
    
    doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold');
    const titleHeight = doc.heightOfString(cluster.title, { width: cardContentWidth - 18 });
    doc.text(cluster.title, cardContentX + 18, contentY, { width: cardContentWidth - 18 });

    contentY += Math.max(titleHeight, 14) + 6;

    // Divider line - now positioned dynamically after title
    doc.strokeColor('#E5E7EB').lineWidth(0.5)
        .moveTo(cardContentX, contentY).lineTo(x + width - 12, contentY).stroke();

    contentY += 8;

    // "Why this Cluster?" section
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Why this Cluster?', cardContentX, contentY);
    contentY += 12;

    // Bullet points for why
    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica');
    cluster.whyCluster.forEach(reason => {
        const textHeight = doc.heightOfString(`• ${reason}`, { width: cardContentWidth - 10 });
        doc.text(`• ${reason}`, cardContentX, contentY, { width: cardContentWidth - 10 });
        contentY += textHeight + 2;
    });

    contentY += 5;

    // "Top Careers:" section
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Top Careers:', cardContentX, contentY);
    contentY += 12;

    doc.fillColor(PAGE2_COLORS.cyanLink).fontSize(7).font('Helvetica');
    cluster.topCareers.forEach(career => {
        doc.text(`• ${career}`, cardContentX, contentY, { link: null, underline: true });
        contentY += 10;
    });

    return cardHeight;
}

/**
 * Render Career Cluster Recommendations Section
 * This includes header, primary clusters, and backup cluster
 */
function renderCareerClusterRecommendations(doc, helpers, data, yPos) {
    const { drawRoundedRect } = helpers;
    
    // Check if we need a new page
    const estimatedHeight = 500; // Rough estimate for this section
    if (yPos + estimatedHeight > PAGE.height - PAGE.margin) {
        doc.addPage();
        yPos = PAGE.margin;
    }

    // ========== HEADER ==========
    const targetIconPath = path.join(__dirname, '../../images', 'target.jpeg');
    if (fs.existsSync(targetIconPath)) {
        doc.image(targetIconPath, PAGE.margin, yPos - 2, { width: 18, height: 18 });
    }
    
    doc.fillColor(COLORS.black).fontSize(16).font('Helvetica-Bold')
        .text('Career Cluster Recommendations', PAGE.margin + 22, yPos);

    yPos += 30;

    // ========== PRIMARY CAREER RECOMMENDATION PILL ==========
    const pillHeight = 26;
    drawRoundedRect(PAGE.margin, yPos, PAGE.usableWidth, pillHeight, 15, PAGE2_COLORS.primaryPurple);
    
    doc.fillColor(PAGE2_COLORS.white).fontSize(11).font('Helvetica-Bold');
    const primaryText = 'Primary Career Recommendation';
    const primaryTextWidth = doc.widthOfString(primaryText);
    const primaryTextX = PAGE.margin + (PAGE.usableWidth - primaryTextWidth) / 2;
    doc.text(primaryText, primaryTextX, yPos + 7);

    yPos += pillHeight + 15;

    // ========== TWO PRIMARY CLUSTER CARDS (SIDE BY SIDE) ==========
    const cardGap = 15;
    const cardWidth = (PAGE.usableWidth - cardGap) / 2;
    
    const primaryClusters = data.ai_recommendation_structured.careerClusters.primary;
    let maxCardHeight = 0;

    if (primaryClusters.length >= 1) {
        const height1 = drawClusterCard(doc, helpers, primaryClusters[0], PAGE.margin, yPos, cardWidth);
        maxCardHeight = Math.max(maxCardHeight, height1);
    }

    if (primaryClusters.length >= 2) {
        const height2 = drawClusterCard(doc, helpers, primaryClusters[1], PAGE.margin + cardWidth + cardGap, yPos, cardWidth);
        maxCardHeight = Math.max(maxCardHeight, height2);
    }

    yPos += maxCardHeight + 15;

    // ========== BACKUP CAREER OPTION PILL ==========
    drawRoundedRect(PAGE.margin, yPos, PAGE.usableWidth, pillHeight, 15, PAGE2_COLORS.primaryPurple);
    
    doc.fillColor(PAGE2_COLORS.white).fontSize(11).font('Helvetica-Bold');
    const backupText = 'Backup Career Option';
    const backupTextWidth = doc.widthOfString(backupText);
    const backupTextX = PAGE.margin + (PAGE.usableWidth - backupTextWidth) / 2;
    doc.text(backupText, backupTextX, yPos + 7);

    yPos += pillHeight + 15;

    // ========== BACKUP CAREER CLUSTER CARD ==========
    const backupCluster = data.ai_recommendation_structured.careerClusters.backup[0];
    
    if (backupCluster) {
        const cardRadius = 12;
        const leftContentWidth = PAGE.usableWidth * 0.55;
        const rightContentWidth = PAGE.usableWidth * 0.40;

        // Calculate heights
        let leftHeight = 14;
        doc.fontSize(7).font('Helvetica');
        backupCluster.whyCluster.forEach(reason => {
            leftHeight += doc.heightOfString(`• ${reason}`, { width: leftContentWidth - 30 }) + 3;
        });

        let rightHeight = 11 + 14 + 12 + 10 + 14;
        rightHeight += backupCluster.topCareers.length * 11;

        // Calculate backup title height dynamically
        doc.fontSize(12).font('Helvetica-Bold');
        const backupTitleHeight = doc.heightOfString(backupCluster.title, { width: PAGE.usableWidth - 65 });
        const headerHeight = 15 + Math.max(backupTitleHeight, 14) + 6 + 12;
        
        const contentHeight = Math.max(leftHeight, rightHeight);
        const backupCardHeight = headerHeight + contentHeight + 15;

        // Draw card
        drawRoundedRect(PAGE.margin, yPos, PAGE.usableWidth, backupCardHeight, cardRadius, PAGE2_COLORS.lightGrayCard);

        let backupContentY = yPos + 15;
        const backupContentX = PAGE.margin + 15;

        // Icon + Title (with dynamic height)
        const backupIconPath = path.join(__dirname, '../../images', 'business.jpg');
        if (fs.existsSync(backupIconPath)) {
            doc.image(backupIconPath, backupContentX, backupContentY - 2, { width: 14, height: 14 });
        }
        
        doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold');
        const backupTitleTextHeight = doc.heightOfString(backupCluster.title, { width: PAGE.usableWidth - 65 });
        doc.text(backupCluster.title, backupContentX + 20, backupContentY, { width: PAGE.usableWidth - 65 });

        backupContentY += Math.max(backupTitleTextHeight, 14) + 6;

        // Divider - now positioned dynamically
        doc.strokeColor('#E5E7EB').lineWidth(0.5)
            .moveTo(backupContentX, backupContentY)
            .lineTo(PAGE.margin + PAGE.usableWidth - 15, backupContentY).stroke();

        backupContentY += 12;

        // LEFT: Why this Cluster?
        const leftX = backupContentX;
        let leftY = backupContentY;
        
        doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
            .text('Why this Cluster?', leftX, leftY);
        leftY += 14;

        doc.fillColor(COLORS.black).fontSize(7).font('Helvetica');
        backupCluster.whyCluster.forEach(reason => {
            const textHeight = doc.heightOfString(`• ${reason}`, { width: leftContentWidth - 30 });
            doc.text(`• ${reason}`, leftX, leftY, { width: leftContentWidth - 30 });
            leftY += textHeight + 3;
        });

        // RIGHT: Subject Eligibility + Top Careers
        const rightX = PAGE.margin + leftContentWidth + 10;
        let rightY = backupContentY;

        doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
            .text('Subject Combination', rightX, rightY);
        rightY += 11;
        doc.text('Eligibility:', rightX, rightY);
        rightY += 14;

        doc.fillColor(COLORS.black).fontSize(7).font('Helvetica');
        const stream = data.stream || 'PCM';
        doc.text(`• ${stream}`, rightX, rightY);
        rightY += 12 + 10;

        doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
            .text('Top Careers:', rightX, rightY);
        rightY += 14;

        doc.fillColor(PAGE2_COLORS.cyanLink).fontSize(7).font('Helvetica');
        backupCluster.topCareers.forEach(career => {
            doc.text(`• ${career}`, rightX, rightY, { underline: true });
            rightY += 11;
        });

        yPos += backupCardHeight + 15;
    }

    return yPos;
}

module.exports = { renderCareerClusterRecommendations };