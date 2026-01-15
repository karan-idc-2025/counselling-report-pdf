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
 * @param {Object} doc - PDFKit document
 * @param {Object} data - Page 2 data
 * @param {Object} page1Info - Information from page 1 about sidebar overflow
 */
function renderPage2(doc, data, page1Info = {}) {
    const helpers = createHelpers(doc);
    const { drawRoundedRect, drawBulletList, drawLabelBadge, drawText } = helpers;
    
    const hasSidebarOnPage2 = page1Info.sidebarCreatedNewPage || false;
    const sidebarFinalY = page1Info.sidebarFinalY || PAGE.margin;
    
    // If sidebar created a new page, switch to that page to draw content next to it
    if (hasSidebarOnPage2 && page1Info.sidebarOverflowPage) {
        // Switch to the sidebar overflow page
        doc.page = page1Info.sidebarOverflowPage;
    } else {
        // Add a new page for page 2 content
        doc.addPage();
    }
    
    // Calculate layout based on sidebar presence
    const sidebarWidth = page1Info.sidebarWidth || 160;
    const sidebarGap = 15;
    
    // Initial content margin (next to sidebar)
    let contentMarginLeft = hasSidebarOnPage2 ? (PAGE.margin + sidebarWidth + sidebarGap) : PAGE.margin;
    let contentWidth = hasSidebarOnPage2 ? (PAGE.usableWidth - sidebarWidth - sidebarGap) : PAGE.usableWidth;
    
    // Track when we pass the sidebar's end so we can use full width
    const sidebarEndsAtY = hasSidebarOnPage2 ? sidebarFinalY : 0;

    let yPos = PAGE.margin;
    
    // Helper to check if we're past the sidebar and should use full width
    function getContentLayout(currentY) {
        if (hasSidebarOnPage2 && currentY >= sidebarEndsAtY) {
            return {
                marginLeft: PAGE.margin,
                width: PAGE.usableWidth
            };
        }
        return {
            marginLeft: contentMarginLeft,
            width: contentWidth
        };
    }

    // ========== HEADER SECTION ==========
    // Get layout for current position
    let layout = getContentLayout(yPos);
    
    // Draw target icon (circle with dot)
    doc.save();
    doc.strokeColor(PAGE2_COLORS.primaryPurple).lineWidth(2);
    doc.circle(layout.marginLeft + 8, yPos + 8, 7).stroke();
    doc.fillColor(PAGE2_COLORS.primaryPurple);
    doc.circle(layout.marginLeft + 8, yPos + 8, 3).fill();
    doc.restore();
    
    doc.fillColor(COLORS.black).fontSize(16).font('Helvetica-Bold')
        .text('Career Cluster Recommendations', layout.marginLeft + 22, yPos);

    yPos += 30;
    layout = getContentLayout(yPos);

    // ========== PRIMARY CAREER RECOMMENDATION PILL ==========
    const pillHeight = 26;
    drawRoundedRect(layout.marginLeft, yPos, layout.width, pillHeight, 15, PAGE2_COLORS.primaryPurple);
    
    doc.fillColor(PAGE2_COLORS.white).fontSize(11).font('Helvetica-Bold');
    const primaryText = 'Primary Career Recommendation';
    const primaryTextWidth = doc.widthOfString(primaryText);
    const primaryTextX = layout.marginLeft + (layout.width - primaryTextWidth) / 2;
    doc.text(primaryText, primaryTextX, yPos + 7);

    yPos += pillHeight + 15;
    layout = getContentLayout(yPos);

    // ========== TWO CAREER CLUSTER CARDS (SIDE BY SIDE) ==========
    const cardGap = 15;
    const cardWidth = (layout.width - cardGap) / 2;
    const cardRadius = 12;

    // Helper function to draw a career cluster card
    function drawClusterCard(cluster, x, y, width) {
        const cardHeight = calculateCardHeight(cluster, width);
        
        // Card background
        drawRoundedRect(x, y, width, cardHeight, cardRadius, PAGE2_COLORS.lightGrayCard);

        let contentY = y + 12;
        const cardContentX = x + 12;
        const cardContentWidth = width - 24;

        // Icon + Title (using colored circle instead of emoji)
        doc.save();
        doc.fillColor(PAGE2_COLORS.primaryPurple);
        doc.circle(cardContentX + 6, contentY + 5, 6).fill();
        doc.restore();
        
        doc.fillColor(PAGE2_COLORS.darkGrayText).fontSize(12).font('Helvetica-Bold')
            .text(cluster.name, cardContentX + 18, contentY);

        contentY += 20;

        // Divider line
        doc.strokeColor('#E5E7EB').lineWidth(0.5)
            .moveTo(cardContentX, contentY).lineTo(x + width - 12, contentY).stroke();

        contentY += 8;

        // "Why this Cluster?" section
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Why this Cluster?', cardContentX, contentY);
        contentY += 12;

        // Bullet points for why
        doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
        cluster.whyReasons.forEach(reason => {
            const textHeight = doc.heightOfString(`• ${reason}`, { width: cardContentWidth - 10 });
            doc.text(`• ${reason}`, cardContentX, contentY, { width: cardContentWidth - 10 });
            contentY += textHeight + 2;
        });

        contentY += 5;

        // "Subject Combination Eligibility:" section
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Subject Combination Eligibility:', cardContentX, contentY);
        contentY += 12;

        doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
        cluster.subjectEligibility.forEach(subject => {
            doc.text(`• ${subject}`, cardContentX, contentY);
            contentY += 10;
        });

        contentY += 3;

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

    // Helper to calculate card height
    function calculateCardHeight(cluster, width) {
        let height = 12; // Top padding
        height += 20; // Title
        height += 8; // Divider
        height += 12; // "Why this Cluster?" title
        
        doc.fontSize(7).font('Helvetica');
        cluster.whyReasons.forEach(reason => {
            height += doc.heightOfString(`• ${reason}`, { width: width - 34 }) + 2;
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
        const height1 = drawClusterCard(primaryClusters[0], layout.marginLeft, yPos, cardWidth);
        maxCardHeight = Math.max(maxCardHeight, height1);
    }

    if (primaryClusters.length >= 2) {
        const height2 = drawClusterCard(primaryClusters[1], layout.marginLeft + cardWidth + cardGap, yPos, cardWidth);
        maxCardHeight = Math.max(maxCardHeight, height2);
    }

    yPos += maxCardHeight + 15;
    layout = getContentLayout(yPos);

    // ========== BACKUP CAREER OPTION PILL ==========
    drawRoundedRect(layout.marginLeft, yPos, layout.width, pillHeight, 15, PAGE2_COLORS.primaryPurple);
    
    doc.fillColor(PAGE2_COLORS.white).fontSize(11).font('Helvetica-Bold');
    const backupText = 'Backup Career Option';
    const backupTextWidth = doc.widthOfString(backupText);
    const backupTextX = layout.marginLeft + (layout.width - backupTextWidth) / 2;
    doc.text(backupText, backupTextX, yPos + 7);

    yPos += pillHeight + 15;
    layout = getContentLayout(yPos);

    // ========== BACKUP CAREER CLUSTER SECTION ==========
    const backupCluster = data.careerClusters.backup[0];
    
    if (backupCluster) {
        // Layout: Main card (60%), Info boxes (35%), with 5% gap
        const mainCardWidth = layout.width * 0.58;
        const infoBoxWidth = layout.width * 0.38;
        const layoutGap = layout.width * 0.04;

        // Main backup card
        const backupCardHeight = 130;
        drawRoundedRect(layout.marginLeft, yPos, mainCardWidth, backupCardHeight, cardRadius, PAGE2_COLORS.lightGrayCard);

        let backupContentY = yPos + 12;
        const backupContentX = layout.marginLeft + 12;
        const backupContentWidth = mainCardWidth - 24;

        // Icon + Title
        doc.save();
        doc.fillColor(PAGE2_COLORS.primaryPurple);
        doc.circle(backupContentX + 6, backupContentY + 5, 6).fill();
        doc.restore();
        
        doc.fillColor(PAGE2_COLORS.darkGrayText).fontSize(12).font('Helvetica-Bold')
            .text(backupCluster.name, backupContentX + 18, backupContentY);

        backupContentY += 20;

        // Divider line
        doc.strokeColor('#E5E7EB').lineWidth(0.5)
            .moveTo(backupContentX, backupContentY).lineTo(layout.marginLeft + mainCardWidth - 12, backupContentY).stroke();

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
        const infoBoxX = layout.marginLeft + mainCardWidth + layoutGap;
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
        layout = getContentLayout(yPos);
    }

    // ========== CAREER ASPIRATION EVALUATION SECTION ==========
    layout = getContentLayout(yPos);
    
    // Draw star icon
    doc.save()
    doc.image(path.join(__dirname, 'images', 'star.png'), layout.marginLeft + 5 , yPos-2, { width: 18, height: 18 });
    doc.restore();
    
    doc.fillColor(COLORS.black).fontSize(14).font('Helvetica-Bold')
        .text('Career Aspiration Evaluation', layout.marginLeft + 22, yPos);

    yPos += 22;
    layout = getContentLayout(yPos);

    // Aspiration evaluation box
    const aspirationData = data.careerAspirationEvaluation;
    const aspirationBoxHeight = calculateAspirationBoxHeight(aspirationData, layout.width);

    drawRoundedRect(layout.marginLeft, yPos, layout.width, aspirationBoxHeight, 12, PAGE2_COLORS.lightPurpleBackground);

    let aspContentY = yPos + 12;
    const aspContentX = layout.marginLeft + 15;
    const aspContentWidth = layout.width - 30;

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

    // Add minimal spacing before footer to maximize space
    yPos += aspirationBoxHeight + 15;

    // ========== FOOTER SECTION ==========
    const footerHeight = 70;
    const copyrightHeight = 8; // Height for copyright line
    const footerSpacing = 8; // Space between footer and copyright
    
    // Calculate minimum space needed for footer (just footer + copyright)
    const minFooterSpace = footerHeight + footerSpacing + copyrightHeight;
    
    // Check if footer fits on current page - use FULL page height
    const pageBottom = PAGE.height;
    const availableSpace = pageBottom - yPos;
    
    // Only create new page if footer truly won't fit
    if (availableSpace < minFooterSpace) {
        doc.addPage();
        yPos = PAGE.margin;
    }
    
    // Footer always uses full width (it's at the bottom, past any sidebar)
    const footerLayout = {
        marginLeft: PAGE.margin,
        width: PAGE.usableWidth
    };
    
    const footerY = yPos;

    // Footer uses full page width
    drawRoundedRect(footerLayout.marginLeft, footerY, footerLayout.width, footerHeight, 15, PAGE2_COLORS.primaryPurple);

    // Best wishes text
    doc.fillColor(PAGE2_COLORS.white).fontSize(12).font('Helvetica-Bold');
    const wishesText = 'Best wishes for your journey ahead!';
    const wishesWidth = doc.widthOfString(wishesText);
    const wishesX = footerLayout.marginLeft + (footerLayout.width - wishesWidth) / 2;
    doc.text(wishesText, wishesX, footerY + 15);

    // Subtext - use lineBreak: false to prevent auto page breaks
    doc.fontSize(9).font('Helvetica');
    const subtextText = 'If you need further guidance, speak with your school counselor or connect with professionals in your chosen fields.';
    const subtextX = footerLayout.marginLeft + 20;
    doc.text(subtextText, subtextX, footerY + 35, { 
        width: footerLayout.width - 40, 
        align: 'center',
        lineBreak: false
    });

    // Copyright - positioned just below footer with minimal spacing
    // IMPORTANT: Use lineBreak: false to prevent PDFKit from auto-adding pages
    doc.fillColor(PAGE2_COLORS.mediumGrayText).fontSize(7).font('Helvetica');
    const copyrightText = 'Copyright © Medhavi Professional Services Pvt. Ltd. All Rights Reserved';
    const copyrightWidth = doc.widthOfString(copyrightText);
    const copyrightX = footerLayout.marginLeft + (footerLayout.width - copyrightWidth) / 2;
    const copyrightY = footerY + footerHeight + 3; // Reduced spacing from 8 to 3
    doc.text(copyrightText, copyrightX, copyrightY, { lineBreak: false });

    // Helper function to calculate aspiration box height
    function calculateAspirationBoxHeight(aspData, availableWidth) {
        let height = 24; // Top and bottom padding
        height += 14; // Aspirational Career line
        
        doc.fontSize(8).font('Helvetica');
        height += doc.heightOfString(aspData.clusterAnalysis, { width: availableWidth - 120 }) + 10;
        
        height += 12; // Evaluation title
        doc.fontSize(7).font('Helvetica');
        aspData.evaluation.forEach(item => {
            height += doc.heightOfString(`• ${item}`, { width: availableWidth - 40 }) + 2;
        });
        
        height += 6 + 14; // Gap + Verdict line
        
        if (aspData.suggestions && aspData.suggestions.length > 0) {
            height += 12; // Suggestions title
            aspData.suggestions.forEach(item => {
                height += doc.heightOfString(`• ${item}`, { width: availableWidth - 40 }) + 2;
            });
        }
        
        height += 10; // Bottom padding
        
        return height;
    }
}

module.exports = { renderPage2 };