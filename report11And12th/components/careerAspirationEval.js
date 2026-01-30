const fs = require('fs');
const path = require('path');
const { COLORS, PAGE } = require('../../constants');

const PAGE2_COLORS = {
    lightPurpleBackground: '#EDE9FE'
};

/**
 * Render Career Aspiration Evaluation Section
 * Hides individual fields if data is missing
 */
function renderCareerAspirationEvaluation(doc, helpers, data, yPos) {
    const { drawRoundedRect } = helpers;
    
    // Get aspiration data
    const careerAspirations = data.ai_recommendation_structured?.careerAspirationEvaluation || [];
    const streamAspiration = data.ai_recommendation_structured?.streamAspirationEvaluation;
    
    // Check if we have ANY data at all
    const hasAnyData = careerAspirations.length > 0 || streamAspiration;
    
    // If no data at all, skip entire section
    if (!hasAnyData) {
        return yPos;
    }
    
    // Check if we need a new page
    const estimatedHeight = 200;
    if (yPos + estimatedHeight > PAGE.height - PAGE.margin) {
        doc.addPage();
        yPos = PAGE.margin;
    }

    // ========== HEADER ==========
    const starIconPath = path.join(__dirname, '../../images', 'star.png');
    if (fs.existsSync(starIconPath)) {
        doc.save();
        doc.image(starIconPath, PAGE.margin + 5, yPos - 2, { width: 18, height: 18 });
        doc.restore();
    }
    
    doc.fillColor(COLORS.black).fontSize(14).font('Helvetica-Bold')
        .text('Career Aspiration Evaluation', PAGE.margin + 22, yPos);

    yPos += 22;

    // ========== CALCULATE DYNAMIC BOX HEIGHT ==========
    let aspirationBoxHeight = 24; // Base padding
    const aspContentWidth = PAGE.usableWidth - 30;
    
    // Calculate height for career aspirations
    careerAspirations.forEach((asp) => {
        let itemHeight = 0;
        
        // Career Aspiration field - show even if "Not decided"
        if (asp.aspiration) {
            itemHeight += 14;
        }
        
        // Cluster Status field (only if available)
        if (asp.status && asp.status !== 'Not available') {
            itemHeight += 14;
        }
        
        // Evaluation field (check both evaluation and status fields)
        const evaluationText = asp.evaluation || asp.status;
        if (evaluationText && evaluationText !== 'Not available') {
            doc.fontSize(8).font('Helvetica');
            const evalHeight = doc.heightOfString(evaluationText, { width: aspContentWidth - 60 });
            itemHeight += evalHeight + 20; // label + text + spacing
        }
        
        // Verdict field (only if available)
        if (asp.verdict) {
            doc.fontSize(8).font('Helvetica');
            const verdictHeight = doc.heightOfString(asp.verdict, { width: aspContentWidth - 60 });
            itemHeight += verdictHeight + 20;
        }
        
        aspirationBoxHeight += itemHeight;
    });
    
    // Add divider space if we have both sections
    const needsDivider = careerAspirations.length > 0 && streamAspiration;
    if (needsDivider) {
        aspirationBoxHeight += 10;
    }
    
    // Calculate height for stream aspiration
    if (streamAspiration) {
        let streamHeight = 0;
        
        // Stream Aspiration field
        if (streamAspiration.aspiration && streamAspiration.aspiration !== 'Not specified') {
            streamHeight += 14;
        }
        
        // Evaluation field
        if (streamAspiration.evaluation && streamAspiration.evaluation !== 'No evaluation available') {
            doc.fontSize(8).font('Helvetica');
            const evalHeight = doc.heightOfString(streamAspiration.evaluation, { width: aspContentWidth - 60 });
            streamHeight += evalHeight + 20; // label + text + spacing
        }
        
        // Verdict field
        if (streamAspiration.verdict && streamAspiration.verdict !== 'N/A') {
            streamHeight += 14;
        }
        
        aspirationBoxHeight += streamHeight;
    }

    // Draw the box
    drawRoundedRect(PAGE.margin, yPos, PAGE.usableWidth, aspirationBoxHeight, 12, PAGE2_COLORS.lightPurpleBackground);

    let aspContentY = yPos + 12;
    const aspContentX = PAGE.margin + 15;

    // ========== CAREER ASPIRATIONS ==========
    careerAspirations.forEach((asp) => {
        // Career Aspiration field - show even if "Not decided"
        if (asp.aspiration) {
            doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
                .text('Career Aspiration: ', aspContentX, aspContentY, { continued: true });
            doc.fillColor(COLORS.black).font('Helvetica')
                .text(asp.aspiration);
            aspContentY += 14;
        }

        // Cluster Status field - only show if available and different from evaluation
        if (asp.status && asp.status !== 'Not available' && !asp.evaluation) {
            doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
                .text('Cluster Status: ', aspContentX, aspContentY, { continued: true });
            doc.fillColor(COLORS.black).font('Helvetica')
                .text(asp.status, { width: aspContentWidth - 90 });
            aspContentY += 14;
        }

        // Evaluation field - check both evaluation and status
        const evaluationText = asp.evaluation || (asp.status && asp.status !== 'Not available' ? null : null);
        if (asp.evaluation) {
            doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
                .text('Evaluation: ', aspContentX, aspContentY, { continued: true });
            doc.fillColor(COLORS.black).font('Helvetica')
                .text(asp.evaluation, { width: aspContentWidth - 60 });
            aspContentY += doc.heightOfString(asp.evaluation, { width: aspContentWidth - 60 }) + 6;
        }

        // Verdict field - only show if available
        if (asp.verdict) {
            doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
                .text('Verdict: ', aspContentX, aspContentY, { continued: true });
            const verdictColor = asp.verdict.includes('Not Suitable') ? '#EF4444' : 
                               (asp.verdict.includes('Partially Suitable') ? '#F59E0B' : '#22C55E');
            doc.fillColor(verdictColor).font('Helvetica-Bold')
                .text(asp.verdict, { width: aspContentWidth - 60 });
            aspContentY += doc.heightOfString(asp.verdict, { width: aspContentWidth - 60 }) + 6;
        }
    });

    // ========== DIVIDER (only if both sections have content) ==========
    if (needsDivider) {
        doc.strokeColor('#D1D5DB').lineWidth(0.5)
            .moveTo(aspContentX, aspContentY)
            .lineTo(aspContentX + aspContentWidth - 10, aspContentY).stroke();
        aspContentY += 10;
    }

    // ========== STREAM ASPIRATION ==========
    if (streamAspiration) {
        // Stream Aspiration field - only show if available
        if (streamAspiration.aspiration && streamAspiration.aspiration !== 'Not specified') {
            doc.fillColor(COLORS.black).fontSize(9).font('Helvetica-Bold')
                .text('Stream Aspiration: ', aspContentX, aspContentY, { continued: true });
            doc.fillColor(COLORS.black).font('Helvetica')
                .text(streamAspiration.aspiration);
            aspContentY += 14;
        }

        // Evaluation field - only show if available
        if (streamAspiration.evaluation && streamAspiration.evaluation !== 'No evaluation available') {
            doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
                .text('Evaluation: ', aspContentX, aspContentY, { continued: true });
            doc.fillColor(COLORS.black).font('Helvetica')
                .text(streamAspiration.evaluation, { width: aspContentWidth - 60 });
            aspContentY += doc.heightOfString(streamAspiration.evaluation, { width: aspContentWidth - 60 }) + 6;
        }

        // Verdict field - only show if available
        if (streamAspiration.verdict && streamAspiration.verdict !== 'N/A') {
            doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
                .text('Verdict: ', aspContentX, aspContentY, { continued: true });
            const streamVerdictColor = streamAspiration.verdict === 'Not Suitable' ? '#EF4444' : 
                                      (streamAspiration.verdict === 'Partially Suitable' ? '#F59E0B' : '#22C55E');
            doc.fillColor(streamVerdictColor).font('Helvetica-Bold')
                .text(streamAspiration.verdict);
        }
    }

    yPos += aspirationBoxHeight + 15;

    return yPos;
}

module.exports = { renderCareerAspirationEvaluation };