const fs = require('fs');
const path = require('path');
const { COLORS, PAGE } = require('./constants');
const { createHelpers } = require('./helpers');

// Page 2 specific colors
const PAGE2_COLORS = {
    primaryPurple: '#8B5CF6',
    lightPurpleBackground: '#EDE9FE',
    lightGrayCard: '#F3F4F6',
    darkGrayText: '#4B5563',
    mediumGrayText: '#6B7280',
    cyanLink: '#06B6D4',
    white: '#FFFFFF'
};

/**
 * Render Page 2 of the Career Recommendation Report
 */
function renderPage2(doc, data) {
    const helpers = createHelpers(doc);
    const { drawRoundedRect, drawBulletList, drawLabelBadge, drawText } = helpers;

    // Start new page
    doc.addPage();

    let yPos = PAGE.margin;

    // ========== HEADER SECTION ==========
    // Draw target icon (circle with dot)
    doc.save();
    doc.strokeColor(PAGE2_COLORS.primaryPurple).lineWidth(2);
    doc.circle(PAGE.margin + 8, yPos + 8, 7).stroke();
    doc.fillColor(PAGE2_COLORS.primaryPurple);
    doc.circle(PAGE.margin + 8, yPos + 8, 3).fill();
    doc.restore();
    
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

    // ========== TWO CAREER CLUSTER CARDS (SIDE BY SIDE) ==========
    const cardGap = 15;
    const cardWidth = (PAGE.usableWidth - cardGap) / 2;
    const cardRadius = 12;

    // Helper function to draw a career cluster card
    function drawClusterCard(cluster, x, y, width) {
        const cardHeight = calculateCardHeight(cluster);
        
        // Card background
        drawRoundedRect(x, y, width, cardHeight, cardRadius, PAGE2_COLORS.lightGrayCard);

        let contentY = y + 12;
        const contentX = x + 12;
        const contentWidth = width - 24;

        // Icon + Title (using colored circle instead of emoji)
        doc.save();
        doc.fillColor(PAGE2_COLORS.primaryPurple);
        doc.circle(contentX + 6, contentY + 5, 6).fill();
        doc.restore();
        
        doc.fillColor(PAGE2_COLORS.darkGrayText).fontSize(12).font('Helvetica-Bold')
            .text(cluster.name, contentX + 18, contentY);

        contentY += 20;

        // Divider line
        doc.strokeColor('#E5E7EB').lineWidth(0.5)
            .moveTo(contentX, contentY).lineTo(x + width - 12, contentY).stroke();

        contentY += 8;

        // "Why this Cluster?" section
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Why this Cluster?', contentX, contentY);
        contentY += 12;

        // Bullet points for why
        doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
        cluster.whyReasons.forEach(reason => {
            const textHeight = doc.heightOfString(`• ${reason}`, { width: contentWidth - 10 });
            doc.text(`• ${reason}`, contentX, contentY, { width: contentWidth - 10 });
            contentY += textHeight + 2;
        });

        contentY += 5;

        // "Subject Combination Eligibility:" section
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Subject Combination Eligibility:', contentX, contentY);
        contentY += 12;

        doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
        cluster.subjectEligibility.forEach(subject => {
            doc.text(`• ${subject}`, contentX, contentY);
            contentY += 10;
        });

        contentY += 3;

        // "Top Careers:" section
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Top Careers:', contentX, contentY);
        contentY += 12;

        doc.fillColor(PAGE2_COLORS.cyanLink).fontSize(7).font('Helvetica');
        cluster.topCareers.forEach(career => {
            doc.text(`• ${career}`, contentX, contentY, { link: null, underline: true });
            contentY += 10;
        });

        return cardHeight;
    }

    // Helper to calculate card height
    function calculateCardHeight(cluster) {
        let height = 12; // Top padding
        height += 20; // Title
        height += 8; // Divider
        height += 12; // "Why this Cluster?" title
        
        doc.fontSize(7).font('Helvetica');
        cluster.whyReasons.forEach(reason => {
            height += doc.heightOfString(`• ${reason}`, { width: cardWidth - 34 }) + 2;
        });
        
        height += 5 + 12; // Gap + "Subject Combination Eligibility:" title
        height += cluster.subjectEligibility.length * 10;
        height += 3 + 12; // Gap + "Top Careers:" title
        height += cluster.topCareers.length * 10;
        height += 12; // Bottom padding
        
        return height;
    }

    // Draw primary cluster cards
    const primaryClusters = data.careerClusters.primary;
    let maxCardHeight = 0;

    if (primaryClusters.length >= 1) {
        const height1 = drawClusterCard(primaryClusters[0], PAGE.margin, yPos, cardWidth);
        maxCardHeight = Math.max(maxCardHeight, height1);
    }

    if (primaryClusters.length >= 2) {
        const height2 = drawClusterCard(primaryClusters[1], PAGE.margin + cardWidth + cardGap, yPos, cardWidth);
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

    // ========== BACKUP CAREER CLUSTER SECTION ==========
    const backupCluster = data.careerClusters.backup[0];
    
    if (backupCluster) {
        // Layout: Main card (60%), Info boxes (35%), with 5% gap
        const mainCardWidth = PAGE.usableWidth * 0.58;
        const infoBoxWidth = PAGE.usableWidth * 0.38;
        const layoutGap = PAGE.usableWidth * 0.04;

        // Main backup card
        const backupCardHeight = 130;
        drawRoundedRect(PAGE.margin, yPos, mainCardWidth, backupCardHeight, cardRadius, PAGE2_COLORS.lightGrayCard);

        let backupContentY = yPos + 12;
        const backupContentX = PAGE.margin + 12;
        const backupContentWidth = mainCardWidth - 24;

        // Icon + Title (using colored circle instead of emoji)
        doc.save();
        doc.fillColor(PAGE2_COLORS.primaryPurple);
        doc.circle(backupContentX + 6, backupContentY + 5, 6).fill();
        doc.restore();
        
        doc.fillColor(PAGE2_COLORS.darkGrayText).fontSize(12).font('Helvetica-Bold')
            .text(backupCluster.name, backupContentX + 18, backupContentY);

        backupContentY += 20;

        // Divider line
        doc.strokeColor('#E5E7EB').lineWidth(0.5)
            .moveTo(backupContentX, backupContentY).lineTo(PAGE.margin + mainCardWidth - 12, backupContentY).stroke();

        backupContentY += 8;

        // "Why this Cluster?" section
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Why this Cluster?', backupContentX, backupContentY);
        backupContentY += 12;

        doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
        backupCluster.whyReasons.forEach(reason => {
            const textHeight = doc.heightOfString(`• ${reason}`, { width: backupContentWidth - 10 });
            doc.text(`• ${reason}`, backupContentX, backupContentY, { width: backupContentWidth - 10 });
            backupContentY += textHeight + 2;
        });

        // Right side: Info boxes
        const infoBoxX = PAGE.margin + mainCardWidth + layoutGap;
        const infoBoxHeight = (backupCardHeight - 10) / 2;

        // Subject Combination Eligibility box
        drawRoundedRect(infoBoxX, yPos, infoBoxWidth, infoBoxHeight, 8, PAGE2_COLORS.lightGrayCard);
        
        let infoBoxY = yPos + 10;
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Subject Combination', infoBoxX + 10, infoBoxY);
        infoBoxY += 10;
        doc.text('Eligibility:', infoBoxX + 10, infoBoxY);
        infoBoxY += 14;

        doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
        backupCluster.subjectEligibility.forEach(subject => {
            doc.text(`• ${subject}`, infoBoxX + 10, infoBoxY);
            infoBoxY += 10;
        });

        // Top Careers box
        const topCareersBoxY = yPos + infoBoxHeight + 10;
        drawRoundedRect(infoBoxX, topCareersBoxY, infoBoxWidth, infoBoxHeight, 8, PAGE2_COLORS.lightGrayCard);
        
        let careersBoxY = topCareersBoxY + 10;
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Top Careers:', infoBoxX + 10, careersBoxY);
        careersBoxY += 14;

        doc.fillColor(PAGE2_COLORS.cyanLink).fontSize(7).font('Helvetica');
        backupCluster.topCareers.forEach(career => {
            doc.text(`• ${career}`, infoBoxX + 10, careersBoxY, { underline: true });
            careersBoxY += 10;
        });

        yPos += backupCardHeight + 15;
    }

    // ========== CAREER ASPIRATION EVALUATION SECTION ==========
    // Draw star icon
    doc.save();
    doc.fillColor('#F59E0B');
    const starCenterX = PAGE.margin + 8;
    const starCenterY = yPos + 7;
    // Simple star shape using a filled circle
    doc.circle(starCenterX, starCenterY, 6).fill();
    doc.restore();
    
    doc.fillColor(COLORS.black).fontSize(14).font('Helvetica-Bold')
        .text('Career Aspiration Evaluation', PAGE.margin + 22, yPos);

    yPos += 22;

    // Aspiration evaluation box
    const aspirationData = data.careerAspirationEvaluation;
    const aspirationBoxHeight = calculateAspirationBoxHeight(aspirationData);

    drawRoundedRect(PAGE.margin, yPos, PAGE.usableWidth, aspirationBoxHeight, 12, PAGE2_COLORS.lightPurpleBackground);

    let aspContentY = yPos + 12;
    const aspContentX = PAGE.margin + 15;
    const aspContentWidth = PAGE.usableWidth - 30;

    // Aspirational Career
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Aspirational Career: ', aspContentX, aspContentY, { continued: true });
    doc.fillColor(PAGE2_COLORS.mediumGrayText).font('Helvetica')
        .text(aspirationData.aspirationalCareer);
    aspContentY += 14;

    // Cluster Analysis
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Cluster Analysis: ', aspContentX, aspContentY, { continued: true });
    doc.fillColor(PAGE2_COLORS.mediumGrayText).font('Helvetica')
        .text(aspirationData.clusterAnalysis, { width: aspContentWidth - 90 });
    aspContentY += doc.heightOfString(aspirationData.clusterAnalysis, { width: aspContentWidth - 90 }) + 10;

    // Evaluation section
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Evaluation:', aspContentX, aspContentY);
    aspContentY += 12;

    doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
    aspirationData.evaluation.forEach(item => {
        const textHeight = doc.heightOfString(`• ${item}`, { width: aspContentWidth - 10 });
        doc.text(`• ${item}`, aspContentX, aspContentY, { width: aspContentWidth - 10 });
        aspContentY += textHeight + 2;
    });

    aspContentY += 6;

    // Verdict
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Verdict: ', aspContentX, aspContentY, { continued: true });
    doc.fillColor(PAGE2_COLORS.mediumGrayText).font('Helvetica')
        .text(aspirationData.verdict);
    aspContentY += 14;

    // Suggestions section
    if (aspirationData.suggestions && aspirationData.suggestions.length > 0) {
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Suggestions:', aspContentX, aspContentY);
        aspContentY += 12;

        doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
        aspirationData.suggestions.forEach(item => {
            const textHeight = doc.heightOfString(`• ${item}`, { width: aspContentWidth - 10 });
            doc.text(`• ${item}`, aspContentX, aspContentY, { width: aspContentWidth - 10 });
            aspContentY += textHeight + 2;
        });
    }


  
    yPos += aspirationBoxHeight + 40; // Increased from 20 to 40 for more spacing

    // ========== FOOTER SECTION ==========
    const footerHeight = 70;
    
    // Check if we need to add a new page for footer
    if (yPos + footerHeight + 40 > PAGE.height - PAGE.margin) {
        doc.addPage();
        yPos = PAGE.margin;
    }
    
    const footerY = yPos; // Use dynamic position instead of fixed bottom position

    // Purple footer box
    drawRoundedRect(PAGE.margin, footerY, PAGE.usableWidth, footerHeight, 15, PAGE2_COLORS.primaryPurple);

    // Best wishes text
    doc.fillColor(PAGE2_COLORS.white).fontSize(12).font('Helvetica-Bold');
    const wishesText = 'Best wishes for your journey ahead!';
    const wishesWidth = doc.widthOfString(wishesText);
    doc.text(wishesText, PAGE.margin + (PAGE.usableWidth - wishesWidth) / 2, footerY + 15);

    // Subtext
    doc.fontSize(9).font('Helvetica');
    const subtextText = 'If you need further guidance, speak with your school counselor or connect with professionals in your chosen fields.';
    doc.text(subtextText, PAGE.margin + 20, footerY + 35, { 
        width: PAGE.usableWidth - 40, 
        align: 'center' 
    });

    // Copyright
    doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
    const copyrightText = 'Copyright © Medhavi Professional Services Pvt. Ltd. All Rights Reserved';
    const copyrightWidth = doc.widthOfString(copyrightText);
    doc.text(copyrightText, PAGE.margin + (PAGE.usableWidth - copyrightWidth) / 2, footerY + footerHeight + 8);

    // Helper function to calculate aspiration box height
    function calculateAspirationBoxHeight(aspData) {
        let height = 24; // Top and bottom padding
        height += 14; // Aspirational Career line
        
        doc.fontSize(8).font('Helvetica');
        height += doc.heightOfString(aspData.clusterAnalysis, { width: PAGE.usableWidth - 120 }) + 10;
        
        height += 12; // Evaluation title
        doc.fontSize(7).font('Helvetica');
        aspData.evaluation.forEach(item => {
            height += doc.heightOfString(`• ${item}`, { width: PAGE.usableWidth - 40 }) + 2;
        });
        
        height += 6 + 14; // Gap + Verdict line
        
        if (aspData.suggestions && aspData.suggestions.length > 0) {
            height += 12; // Suggestions title
            aspData.suggestions.forEach(item => {
                height += doc.heightOfString(`• ${item}`, { width: PAGE.usableWidth - 40 }) + 2;
            });
        }
        
        height += 10; // Bottom padding
        
        return height;
    }
}

module.exports = { renderPage2 };

