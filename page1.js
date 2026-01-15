const fs = require('fs');
const path = require('path');
const { COLORS, PAGE } = require('./constants');
const { createHelpers } = require('./helpers');

/**
 * Render Page 1 of the Career Recommendation Report
 */
function renderPage1(doc, data) {
    const helpers = createHelpers(doc);
    const { drawRoundedRect, drawBulletList, drawLabelBadge, drawText, drawGradientText } = helpers;
    
    let yPos = PAGE.margin;

    // ========== HEADER ==========
    
    // Logo: IDC ONE (using image)
    const logoImagePath = path.join(__dirname, 'images', 'idcOne.png');
    const logoHeight = 17;
    const centerX = PAGE.width / 2;
    
    if (fs.existsSync(logoImagePath)) {
        const logoWidth = 50;
        const logoX = centerX - (logoWidth / 2);
        doc.image(logoImagePath, logoX, yPos - 10, { width: logoWidth, height: logoHeight });
    } else {
        // Fallback to text if image not found
        doc.font('Helvetica-Bold').fontSize(14);
        const idcWidth = doc.widthOfString('IDC');
        doc.fillColor(COLORS.black).text('IDC', centerX - 35, yPos);
        drawRoundedRect(centerX - 35 + idcWidth + 5, yPos, 40, 18, 9, '#22C55E');
        doc.fillColor(COLORS.white).fontSize(12).text('ONE', centerX - 35 + idcWidth + 12, yPos + 3);
    }

    yPos += 28;

    // Main title with gradient effect
    const titleText = 'RECOMMENDATION REPORT';
    const titleFontSize = 22;
    doc.fontSize(titleFontSize).font('Helvetica-Bold');
    const titleWidth = doc.widthOfString(titleText);
    const titleX = (PAGE.width - titleWidth) / 2;
    
    drawGradientText(titleText, titleX, yPos, titleFontSize, '#A855F7', '#6C4CF1');

    yPos += 30;

    // Introduction paragraph
    const introText = `Hi ${data.name}! This is your personalised Career Recommendation Report, created just for you. Based on your interests, strengths, and aspirations, it highlights the most suitable subject combination, top career pathways you can explore and your career aspiration evaluation to help you move forward with confidence.`;
    
    doc.fillColor(COLORS.black)
        .fontSize(8)
        .font('Helvetica')
        .text(introText, PAGE.margin, yPos, { align: 'center', width: PAGE.usableWidth, lineGap: 1 });

    yPos += doc.heightOfString(introText, { width: PAGE.usableWidth }) + 15;

    // ========== COUNSELING SUMMARY SECTION ==========
    
    const summaryCardHeight = 130;
    const summaryCardY = yPos + 12;
    
    // Draw purple card
    drawRoundedRect(PAGE.margin, summaryCardY, PAGE.usableWidth, summaryCardHeight, 20, '#8B5CF6');
    drawRoundedRect(PAGE.margin + 2, summaryCardY + 2, PAGE.usableWidth - 4, summaryCardHeight - 4, 18, COLORS.purple);

    // Centered pill ABOVE card (overlapping)
    const pillText = 'Counseling Recommendation Summary';
    doc.font('Helvetica').fontSize(10);
    const pillTextWidth = doc.widthOfString(pillText);
    const pillWidth = pillTextWidth + 40;
    const pillX = (PAGE.width - pillWidth) / 2;
    const pillY = yPos;
    
    drawRoundedRect(pillX, pillY, pillWidth, 26, 13, COLORS.white, COLORS.black);
    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica').text(pillText, pillX + 20, pillY + 7);

    // Two columns inside purple card
    const leftColX = PAGE.margin + 25;
    const rightColX = PAGE.margin + PAGE.usableWidth / 2 + 20;
    let cardY = summaryCardY + 25;

    // LEFT COLUMN: Subject Combination
    doc.fillColor(COLORS.white).fontSize(11).font('Helvetica-Bold')
        .text('Recommended Subject Combination', leftColX, cardY);
    
    cardY += 18;
    doc.strokeColor(COLORS.white).lineWidth(0.5)
        .moveTo(leftColX, cardY).lineTo(leftColX + 210, cardY).stroke();
    
    cardY += 12;
    doc.fillColor(COLORS.white).fontSize(13).font('Helvetica-Bold')
        .text(data.recommendedSubjectCombination.code, leftColX, cardY);
    
    cardY += 20;
    doc.fillColor(COLORS.white).fontSize(9).font('Helvetica')
        .text(`• ${data.recommendedSubjectCombination.subjects.join(', ')}`, leftColX, cardY);

    // RIGHT COLUMN: Career Clusters
    cardY = summaryCardY + 25;
    
    doc.fillColor(COLORS.white).fontSize(11).font('Helvetica-Bold')
        .text('Recommended Career Cluster', rightColX, cardY);
    
    cardY += 18;
    doc.strokeColor(COLORS.white).lineWidth(0.5)
        .moveTo(rightColX, cardY).lineTo(rightColX + 220, cardY).stroke();
    
    cardY += 12;
    
    const primaryColX = rightColX;
    const backupColX = rightColX + 140;
    
    doc.fillColor(COLORS.white).fontSize(9).font('Helvetica-Bold')
        .text('Primary', primaryColX, cardY);
    doc.text('Backup', backupColX, cardY);
    
    cardY += 15;
    doc.fillColor(COLORS.white).fontSize(8).font('Helvetica');
    
    let primaryY = cardY;
    data.recommendedCareerClusters.primary.forEach(cluster => {
        doc.text(`• ${cluster}`, primaryColX, primaryY, { width: 130 });
        primaryY += 12;
    });
    
    let backupY = cardY;
    data.recommendedCareerClusters.backup.forEach(cluster => {
        doc.text(`• ${cluster}`, backupColX, backupY, { width: 110 });
        backupY += 12;
    });

    // Bottom section with dashboard link
    const bottomLineY = summaryCardY + summaryCardHeight - 25;
    
    const linkText = 'Explore all this on your dashboard';
    doc.font('Helvetica').fontSize(9);
    const linkWidth = doc.widthOfString(linkText);
    const linkX = (PAGE.width - linkWidth) / 2;
    const linkY = bottomLineY - 8;
    
    doc.fillColor(COLORS.white).fontSize(9).font('Helvetica')
        .text(linkText, linkX, linkY);
    
    const underlineY = linkY + 11;
    doc.strokeColor(COLORS.white).lineWidth(0.2)
        .moveTo(linkX, underlineY).lineTo(linkX + linkWidth, underlineY).stroke();
    
    doc.strokeColor(COLORS.white).lineWidth(0.2)
        .moveTo(leftColX, bottomLineY).lineTo(linkX - 15, bottomLineY).stroke();
    
    doc.moveTo(linkX + linkWidth + 15, bottomLineY).lineTo(PAGE.margin + PAGE.usableWidth - 25, bottomLineY).stroke();

    yPos = summaryCardY + summaryCardHeight + 15;

    // ========== MAIN TWO-COLUMN LAYOUT ==========
    const sidebarWidth = 160;
    const mainContentWidth = PAGE.usableWidth - sidebarWidth - 15;
    const sidebarX = PAGE.margin;
    const mainContentX = PAGE.margin + sidebarWidth + 15;
    const contentStartY = yPos;

    // ========== RIGHT MAIN CONTENT (DRAWN FIRST) ==========
    let mainY = contentStartY;
    
    // Helper function to check and handle page breaks for main content
    function checkMainContentPageBreak(currentY, spaceNeeded = 40) {
        const pageBottom = PAGE.height - PAGE.margin;
        
        if (currentY + spaceNeeded > pageBottom) {
            doc.addPage();
            return PAGE.margin;
        }
        
        return currentY;
    }

    const starImagePath = path.join(__dirname, 'images', 'star.png');
    const starSize = 18;
    const starY = mainY - 5;

    if (fs.existsSync(starImagePath)) {
        doc.image(starImagePath, mainContentX, starY, { width: starSize, height: starSize });
    }

    doc.fillColor(COLORS.black).fontSize(14).font('Helvetica-Bold')
        .text('Recommended Subject Combination', mainContentX + starSize + 5, mainY);

    mainY += 20;

    const subjectPillText = `Science with ${data.recommendedSubjectCombination.code} (${data.recommendedSubjectCombination.subjects.join(', ')})`;
    doc.font('Helvetica-Bold').fontSize(10);
    const subjPillWidth = doc.widthOfString(subjectPillText) + 24;
    
    mainY = checkMainContentPageBreak(mainY, 30);
    drawRoundedRect(mainContentX, mainY, subjPillWidth, 24, 12, COLORS.purple);
    doc.fillColor(COLORS.white).fontSize(10).text(subjectPillText, mainContentX + 12, mainY + 8);

    mainY += 60;

    // Calculate total height needed for the purple box
    const whyChooseBoxHeight = 165;
    const whyChooseBoxY = mainY;
    
    mainY = checkMainContentPageBreak(mainY, whyChooseBoxHeight + 20);

    // Draw light purple background box
    drawRoundedRect(mainContentX, mainY, mainContentWidth, whyChooseBoxHeight, 8, '#EDE9FE');

    // Content inside the box
    let boxContentY = mainY + 10;

    doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
        .text('Why choose this Subject Combination:', mainContentX + 10, boxContentY);
    boxContentY += 12;
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Alignment with Student Profile:', mainContentX + 10, boxContentY);
    boxContentY += 12;

    boxContentY = drawBulletList(data.whyChooseReasons, mainContentX + 10, boxContentY, mainContentWidth - 20, { fontSize: 7 });

    boxContentY += 5;

    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Cluster Set Access: PCM provides access to:', mainContentX + 10, boxContentY);
    boxContentY += 12;
    boxContentY = drawBulletList(data.clusterSetAccess, mainContentX + 10, boxContentY, mainContentWidth - 20, { fontSize: 7 });

    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica')
        .text('These sets match your highest fitment scores and maximize your career options in line with your profile.', mainContentX + 10, boxContentY, { width: mainContentWidth - 20 });

    mainY = mainY + whyChooseBoxHeight + 10;
    
    mainY = checkMainContentPageBreak(mainY, 60);

    doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
        .text('Ideal Subjects to Consider:', mainContentX, mainY);
    mainY += 12;

    const idealSubjects = [...data.recommendedSubjectCombination.subjects];
    if (data.optionalSubjects?.length > 0) {
        idealSubjects.push(`(Optional: ${data.optionalSubjects.join(', ')}, as per school availability and interest)`);
    }
    mainY = drawBulletList(idealSubjects, mainContentX, mainY, mainContentWidth, { fontSize: 7 });

    mainY += 8;

    doc.fillColor(COLORS.black).fontSize(10).font('Helvetica-Bold')
        .text('Subject Combination Aspiration Evaluation', mainContentX, mainY);
    mainY += 15;

    const aspirationCardHeight = 80;
    drawRoundedRect(mainContentX, mainY, mainContentWidth, aspirationCardHeight, 8, COLORS.white, COLORS.lightGray);

    let aspY = mainY + 10;
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Aspiration: PCM Alignment:', mainContentX + 10, aspY);
    aspY += 12;

    aspY = drawBulletList(data.aspirationAlignment, mainContentX + 10, aspY, mainContentWidth - 20, { fontSize: 7 });

    aspY += 5;
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Final Verdict: ', mainContentX + 10, aspY);
    aspY += 10;
    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica')
        .text(data.finalVerdict, mainContentX + 10, aspY, { width: mainContentWidth - 20 });

    // Track page count BEFORE drawing sidebar
    const pageCountBeforeSidebar = doc.bufferedPageRange().count;
    
    // Track sidebar overflow page
    let sidebarOverflowPage = null;
    let sidebarOverflowPageIndex = -1;

    // ========== LEFT SIDEBAR (DRAWN SECOND, with page break handling) ==========
    const sidebarContentWidth = sidebarWidth - 20;

    // Save current page before drawing sidebar
    const currentPageBeforeSidebar = doc.page;
    const currentPageIndexBeforeSidebar = doc.bufferedPageRange().start + doc.bufferedPageRange().count - 1;

    // Helper to draw sidebar background card
    function drawSidebarCard(startY, pageRef) {
        const pageBottom = PAGE.height - PAGE.margin;
        const cardHeight = pageBottom - startY;
        
        const savedPage = doc.page;
        doc.page = pageRef;
        drawRoundedRect(sidebarX, startY, sidebarWidth, cardHeight, 12, COLORS.white, COLORS.lightGray);
        doc.page = savedPage;
    }

    // Draw initial sidebar card on the first page
    drawSidebarCard(contentStartY, currentPageBeforeSidebar);

    // Start drawing sidebar content on first page
    doc.page = currentPageBeforeSidebar;
    let sidebarY = contentStartY + 12;

    // Track sidebar final Y position on overflow page
    let sidebarFinalYOnOverflowPage = 0;
    
    // Track the Y position when sidebar enters overflow page
    let sidebarOverflowStartY = 0;
    let hasDrawnOverflowCard = false;
    
    // Helper function to check and handle page breaks for sidebar content
    function checkSidebarPageBreak(currentY, spaceNeeded = 30) {
        const pageBottom = PAGE.height - PAGE.margin;
        
        if (currentY + spaceNeeded > pageBottom) {
            doc.addPage();
            
            // Track the overflow page
            sidebarOverflowPage = doc.page;
            sidebarOverflowPageIndex = doc.bufferedPageRange().start + doc.bufferedPageRange().count - 1;
            sidebarOverflowStartY = PAGE.margin;
            
            // DON'T draw the full sidebar card - just draw a subtle background
            // that will be behind the content. Content has its own backgrounds.
            
            return PAGE.margin + 12;
        }
        
        return currentY;
    }

    // Helper to draw icon with text
    function drawIconText(iconColor, label, value, x, y) {
        const estimatedHeight = 20;
        y = checkSidebarPageBreak(y, estimatedHeight);
        
        doc.save();
        doc.fillColor(iconColor);
        doc.circle(x + 4, y + 4, 4).fill();
        doc.restore();
        
        const availableWidth = sidebarContentWidth - 20;
        const fullText = `${label}- ${value}`;
        
        doc.fillColor(COLORS.black).fontSize(6.5).font('Helvetica')
            .text(fullText, x + 14, y, { width: availableWidth });
        
        const textHeight = doc.heightOfString(fullText, { width: availableWidth });
        return y + textHeight + 4;
    }

    // Sidebar bullet list with page breaks
    function drawSidebarBulletList(items, x, y, maxWidth, options = {}) {
        const { fontSize = 7, lineGap = 8, color = COLORS.black } = options;
        let currentY = y;
        
        doc.fillColor(color).fontSize(fontSize).font('Helvetica');
        
        items.forEach(item => {
            const estimatedHeight = 15;
            currentY = checkSidebarPageBreak(currentY, estimatedHeight);
            
            const textHeight = doc.heightOfString(`• ${item}`, { width: maxWidth - 10 });
            doc.text(`• ${item}`, x, currentY, { width: maxWidth - 10 });
            currentY += textHeight + 2;
        });
        
        return currentY;
    }

    // "You in a Glance" header
    const glanceText = 'You in a Glance';
    const glancePillWidth = sidebarContentWidth;
    const glancePillHeight = 22;

    drawRoundedRect(sidebarX + 10, sidebarY, glancePillWidth, glancePillHeight, 11, COLORS.white, COLORS.purple);

    const iconX = sidebarX + 24;
    const iconY = sidebarY + 11;
    doc.save();
    doc.fillColor(COLORS.purple);
    doc.circle(iconX, iconY - 2, 3).fill();
    doc.ellipse(iconX, iconY + 4, 4, 2.5).fill();
    doc.restore();

    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica')
        .text(glanceText, sidebarX + 36, sidebarY + 6);

    sidebarY += 30;

    // Student name with badge
    doc.font('Helvetica-Bold').fontSize(11);
    const nameWidth = doc.widthOfString(data.name);

    doc.font('Helvetica-Bold').fontSize(6);
    const badgeTextWidth = doc.widthOfString(data.board);
    const badgeWidth = badgeTextWidth + 12;

    doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
        .text(data.name, sidebarX + 12, sidebarY);

    const badgeX = sidebarX + 12 + nameWidth + 8;
    const badgeY = sidebarY + 1;
    drawRoundedRect(badgeX, badgeY, badgeWidth, 14, 7, COLORS.purple);
    doc.fillColor(COLORS.white).fontSize(6).font('Helvetica-Bold')
        .text(data.board, badgeX + 6, badgeY + 3);

    sidebarY += 20;

    // Info boxes
    const boxGap = 5;
    const boxHeight = 36;
    const classNum = parseInt(data.class);
    const showStream = (classNum >= 11 && classNum <= 12) && data.stream;

    let boxWidth, classBoxX, streamBoxX, schoolBoxX;

    if (showStream) {
        boxWidth = (sidebarContentWidth - (boxGap * 2)) / 3;
        classBoxX = sidebarX + 10;
        streamBoxX = classBoxX + boxWidth + boxGap;
        schoolBoxX = streamBoxX + boxWidth + boxGap;
    } else {
        boxWidth = (sidebarContentWidth - boxGap) / 2;
        classBoxX = sidebarX + 10;
        schoolBoxX = classBoxX + boxWidth + boxGap;
    }

    sidebarY = checkSidebarPageBreak(sidebarY, boxHeight + 10);

    drawRoundedRect(classBoxX, sidebarY, boxWidth, boxHeight, 6, COLORS.white, COLORS.lightGray);
    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica')
        .text('Class', classBoxX + 8, sidebarY + 6);
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text(data.class, classBoxX + 8, sidebarY + 20);

    if (showStream) {
        drawRoundedRect(streamBoxX, sidebarY, boxWidth, boxHeight, 6, COLORS.white, COLORS.lightGray);
        doc.fillColor(COLORS.black).fontSize(7).font('Helvetica')
            .text('Stream', streamBoxX + 8, sidebarY + 6);
        doc.fillColor(COLORS.black).fontSize(11).font('Helvetica-Bold')
            .text(data.stream, streamBoxX + 8, sidebarY + 20, { width: boxWidth - 16, ellipsis: true });
    }

    drawRoundedRect(schoolBoxX, sidebarY, boxWidth, boxHeight, 6, COLORS.white, COLORS.lightGray);
    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica')
        .text('School', schoolBoxX + 8, sidebarY + 6);
    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica-Bold')
        .text(data.school, schoolBoxX + 8, sidebarY + 20, { width: boxWidth - 16, ellipsis: true });

    sidebarY += boxHeight + 12;

    // Academics
    sidebarY = checkSidebarPageBreak(sidebarY, 50);
    doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
        .text('Academics', sidebarX + 12, sidebarY);
    sidebarY += 14;

    sidebarY = drawIconText('#F59E0B', 'Current Marks', data.academics.currentMarks, sidebarX + 12, sidebarY);
    sidebarY = drawIconText('#22C55E', 'Favourite Subjects', data.academics.favouriteSubjects.join(', '), sidebarX + 12, sidebarY);
    sidebarY = drawIconText('#EF4444', 'Dislike Subjects', data.academics.dislikeSubjects.join(', '), sidebarX + 12, sidebarY);
    sidebarY = drawIconText('#8B5CF6', 'Career Aspiration', data.academics.careerAspiration, sidebarX + 12, sidebarY);

    sidebarY += 10;

    // Hobbies
    sidebarY = checkSidebarPageBreak(sidebarY, 40);
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Hobbies', sidebarX + 12, sidebarY);
    sidebarY += 12;
    sidebarY = drawSidebarBulletList(data.hobbies, sidebarX + 14, sidebarY, sidebarContentWidth, { fontSize: 6.5 });

    sidebarY += 10;

    // Student API Details
    sidebarY = checkSidebarPageBreak(sidebarY, 60);
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Student API Details', sidebarX + 12, sidebarY);
    sidebarY += 12;

    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica-Bold')
        .text('Aptitude score:', sidebarX + 12, sidebarY);
    sidebarY += 12;

    sidebarY = checkSidebarPageBreak(sidebarY, 30);
    drawLabelBadge('Medium Scored Areas', sidebarX + 14, sidebarY, COLORS.lightGray, COLORS.black, sidebarContentWidth - 8);
    sidebarY += 16;
    sidebarY = drawSidebarBulletList(data.aptitudeScore.mediumScoredAreas, sidebarX + 14, sidebarY, sidebarContentWidth, { fontSize: 6 });

    sidebarY += 4;
    sidebarY = checkSidebarPageBreak(sidebarY, 30);
    drawLabelBadge('Low Scored Areas', sidebarX + 14, sidebarY, '#FEE2E2', '#991B1B', sidebarContentWidth - 8);
    sidebarY += 16;
    sidebarY = drawSidebarBulletList(data.aptitudeScore.lowScoredAreas, sidebarX + 14, sidebarY, sidebarContentWidth, { fontSize: 6 });

    sidebarY += 8;

    // Personality Area
    sidebarY = checkSidebarPageBreak(sidebarY, 60);
    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica-Bold')
        .text('Personality Area:', sidebarX + 12, sidebarY);
    sidebarY += 12;

    sidebarY = checkSidebarPageBreak(sidebarY, 30);
    drawLabelBadge('Medium Scored Areas', sidebarX + 14, sidebarY, COLORS.lightGray, COLORS.black, sidebarContentWidth - 8);
    sidebarY += 16;
    sidebarY = drawSidebarBulletList(data.personalityArea.mediumScoredAreas, sidebarX + 14, sidebarY, sidebarContentWidth, { fontSize: 6 });

    sidebarY += 4;
    sidebarY = checkSidebarPageBreak(sidebarY, 30);
    drawLabelBadge('Low Scored Areas', sidebarX + 14, sidebarY, '#FEE2E2', '#991B1B', sidebarContentWidth - 8);
    sidebarY += 16;
    sidebarY = drawSidebarBulletList(data.personalityArea.lowScoredAreas, sidebarX + 14, sidebarY, sidebarContentWidth, { fontSize: 6 });

    sidebarY += 10;

    // Top Interest Themes
    sidebarY = checkSidebarPageBreak(sidebarY, 40);
    doc.fillColor(COLORS.black).fontSize(7).font('Helvetica-Bold')
        .text('Top Interest Themes', sidebarX + 12, sidebarY);
    sidebarY += 12;

    let themeX = sidebarX + 14;
    const themeStartX = themeX;
    let themeLineY = sidebarY;

    data.topInterestThemes.forEach((theme, index) => {
        doc.font('Helvetica').fontSize(6);
        const themeText = theme;
        const textWidth = doc.widthOfString(themeText);
        const badgeWidth = textWidth + 18;
        
        if (themeX + badgeWidth > sidebarX + sidebarWidth - 10 && index > 0) {
            themeX = themeStartX;
            themeLineY += 20;
        }
        
        themeLineY = checkSidebarPageBreak(themeLineY, 20);
        
        drawRoundedRect(themeX, themeLineY, badgeWidth, 16, 8, '#FEF3C7');
        
        doc.save();
        doc.fillColor('#F59E0B');
        doc.circle(themeX + 8, themeLineY + 8, 4).fill();
        doc.restore();
        
        doc.fillColor(COLORS.black).fontSize(6).font('Helvetica')
            .text(themeText, themeX + 14, themeLineY + 4, { width: textWidth });
        themeX += badgeWidth + 6;
    });
    
    // Calculate final sidebar Y position (add some padding)
    const finalSidebarY = themeLineY + 30;

    // Track page count AFTER drawing sidebar
    const pageCountAfterSidebar = doc.bufferedPageRange().count;
    const sidebarCreatedNewPage = pageCountAfterSidebar > pageCountBeforeSidebar;
    
    // If sidebar overflowed, draw the sidebar card border with correct height
    // We draw ONLY the border (no fill) after content, so content remains visible
    if (sidebarCreatedNewPage && sidebarOverflowPage) {
        const savedPage = doc.page;
        
        // Switch to overflow page
        doc.page = sidebarOverflowPage;
        
        // Calculate sidebar card height on overflow page
        const sidebarCardHeight = finalSidebarY - PAGE.margin;
        
        // Draw only the border (stroke), no fill - content is already visible
        doc.save();
        doc.strokeColor(COLORS.lightGray).lineWidth(1);
        doc.roundedRect(sidebarX, PAGE.margin, sidebarWidth, sidebarCardHeight, 12).stroke();
        doc.restore();
        
        // Restore original page
        doc.page = savedPage;
    }

    // Return sidebar overflow information
    return {
        sidebarCreatedNewPage: sidebarCreatedNewPage,
        sidebarOverflowPage: sidebarOverflowPage,
        sidebarOverflowPageIndex: sidebarOverflowPageIndex,
        sidebarX: sidebarX,
        sidebarWidth: sidebarWidth,
        sidebarFinalY: finalSidebarY
    };
}

module.exports = { renderPage1 };