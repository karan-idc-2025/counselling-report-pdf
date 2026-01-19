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

        // Icon + Title (using business.jpg image)
        const businessIconPath = path.join(__dirname, 'images', 'business.jpg');
        if (fs.existsSync(businessIconPath)) {
            doc.image(businessIconPath, cardContentX, contentY - 2, { width: 14, height: 14 });
        }
        
        doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
            .text(cluster.title, cardContentX + 18, contentY);

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

    // Helper to calculate card height
    function calculateCardHeight(cluster, width) {
        let height = 12; // Top padding
        height += 20; // Title
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

    // Draw primary cluster cards
    const primaryClusters = data.ai_recommendation_structured.careerClusters.primary;
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
    const backupCluster = data.ai_recommendation_structured.careerClusters.backup[0];
    const streamRecommendation = data.ai_recommendation_structured.streamRecommendation;
    
    if (backupCluster) {
        // Calculate content widths inside ONE card
        const leftContentWidth = layout.width * 0.55;  // Why this Cluster section
        const rightContentWidth = layout.width * 0.40; // Eligibility + Top Careers

        // Calculate LEFT side height
        let leftHeight = 14; // "Why this Cluster?" title
        doc.fontSize(7).font('Helvetica');
        backupCluster.whyCluster.forEach(reason => {
            leftHeight += doc.heightOfString(`• ${reason}`, { width: leftContentWidth - 30 }) + 3;
        });

        // Calculate RIGHT side height
        let rightHeight = 11 + 14; // "Subject Combination" + "Eligibility:" titles
        rightHeight += 12; // Stream name
        rightHeight += 10; // Gap
        rightHeight += 14; // "Top Careers:" title
        rightHeight += backupCluster.topCareers.length * 11; // Career items

        // Card height = header + divider + max(left, right) + padding
        const headerHeight = 15 + 25 + 12; // top padding + title + divider spacing
        const contentHeight = Math.max(leftHeight, rightHeight);
        const backupCardHeight = headerHeight + contentHeight + 15; // + bottom padding

        // ONE single card for entire backup section
        drawRoundedRect(layout.marginLeft, yPos, layout.width, backupCardHeight, cardRadius, PAGE2_COLORS.lightGrayCard);

        let backupContentY = yPos + 15;
        const backupContentX = layout.marginLeft + 15;

        // Icon + Title (spans full width, using business.jpg image)
        const backupIconPath = path.join(__dirname, 'images', 'business.jpg');
        if (fs.existsSync(backupIconPath)) {
            doc.image(backupIconPath, backupContentX, backupContentY - 2, { width: 14, height: 14 });
        }
        
        doc.fillColor(COLORS.black).fontSize(12).font('Helvetica-Bold')
            .text(backupCluster.title, backupContentX + 20, backupContentY);

        backupContentY += 25;

        // Divider line (spans full width)
        doc.strokeColor('#E5E7EB').lineWidth(0.5)
            .moveTo(backupContentX, backupContentY).lineTo(layout.marginLeft + layout.width - 15, backupContentY).stroke();

        backupContentY += 12;

        // LEFT SIDE: "Why this Cluster?" section
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

        // RIGHT SIDE: Subject Eligibility + Top Careers (inside same card, just different X position)
        const rightX = layout.marginLeft + leftContentWidth + 10;
        let rightY = backupContentY;

        // Subject Combination Eligibility
        doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
            .text('Subject Combination', rightX, rightY);
        rightY += 11;
        doc.text('Eligibility:', rightX, rightY);
        rightY += 14;

        doc.fillColor(COLORS.black).fontSize(7).font('Helvetica');
        if (streamRecommendation && streamRecommendation.name) {
            doc.text(`• ${streamRecommendation.name}`, rightX, rightY);
            rightY += 12;
        }

        rightY += 10;

        // Top Careers
        doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
            .text('Top Careers:', rightX, rightY);
        rightY += 14;

        doc.fillColor(PAGE2_COLORS.cyanLink).fontSize(7).font('Helvetica');
        backupCluster.topCareers.forEach(career => {
            doc.text(`• ${career}`, rightX, rightY, { underline: true });
            rightY += 11;
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

    // Get aspiration data from new structure
    const careerAspirations = data.ai_recommendation_structured.careerAspirationEvaluation;
    const streamAspiration = data.ai_recommendation_structured.streamAspirationEvaluation;
    
    // Calculate box height based on content
    let aspirationBoxHeight = 24; // Top and bottom padding
    
    // Career aspirations
    careerAspirations.forEach(() => {
        aspirationBoxHeight += 50; // Each career aspiration row
    });
    
    // Stream aspiration
    aspirationBoxHeight += 60; // Stream aspiration section

    drawRoundedRect(layout.marginLeft, yPos, layout.width, aspirationBoxHeight, 12, PAGE2_COLORS.lightPurpleBackground);

    let aspContentY = yPos + 12;
    const aspContentX = layout.marginLeft + 15;
    const aspContentWidth = layout.width - 30;

    // Career Aspiration(s)
    careerAspirations.forEach((asp) => {
        doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
            .text('Career Aspiration: ', aspContentX, aspContentY, { continued: true });
        doc.fillColor(COLORS.black).font('Helvetica')
            .text(asp.aspiration);
        aspContentY += 14;

        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Cluster Status: ', aspContentX, aspContentY, { continued: true });
        doc.fillColor(COLORS.black).font('Helvetica')
            .text(asp.status, { width: aspContentWidth - 90 });
        aspContentY += 14;

        // Verdict with color coding
        doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
            .text('Verdict: ', aspContentX, aspContentY, { continued: true });
        const verdictColor = asp.verdict === 'Not Suitable' ? '#EF4444' : (asp.verdict === 'Partially Suitable' ? '#F59E0B' : '#22C55E');
        doc.fillColor(verdictColor).font('Helvetica-Bold')
            .text(asp.verdict);
        aspContentY += 18;
    });

    // Divider
    doc.strokeColor('#D1D5DB').lineWidth(0.5)
        .moveTo(aspContentX, aspContentY).lineTo(aspContentX + aspContentWidth - 10, aspContentY).stroke();
    aspContentY += 10;

    // Stream Aspiration Evaluation
    doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
        .text('Stream Aspiration: ', aspContentX, aspContentY, { continued: true });
    doc.fillColor(COLORS.black).font('Helvetica')
        .text(streamAspiration.aspiration);
    aspContentY += 14;

    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Evaluation: ', aspContentX, aspContentY, { continued: true });
    doc.fillColor(COLORS.black).font('Helvetica')
        .text(streamAspiration.evaluation, { width: aspContentWidth - 60 });
    aspContentY += doc.heightOfString(streamAspiration.evaluation, { width: aspContentWidth - 60 }) + 6;

    // Stream Verdict
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Verdict: ', aspContentX, aspContentY, { continued: true });
    const streamVerdictColor = streamAspiration.verdict === 'Not Suitable' ? '#EF4444' : (streamAspiration.verdict === 'Partially Suitable' ? '#F59E0B' : '#22C55E');
    doc.fillColor(streamVerdictColor).font('Helvetica-Bold')
        .text(streamAspiration.verdict);

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
    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica');
    const copyrightText = 'Copyright © Medhavi Professional Services Pvt. Ltd. All Rights Reserved';
    const copyrightWidth = doc.widthOfString(copyrightText);
    const copyrightX = footerLayout.marginLeft + (footerLayout.width - copyrightWidth) / 2;
    const copyrightY = footerY + footerHeight + 3;
    doc.text(copyrightText, copyrightX, copyrightY, { lineBreak: false });

}

module.exports = { renderPage2 };