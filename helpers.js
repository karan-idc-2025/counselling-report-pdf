const { COLORS, PAGE } = require('./constants');

/**
 * Helper functions for PDF drawing operations
 */
function createHelpers(doc) {
    function drawRoundedRect(x, y, width, height, radius, fillColor, strokeColor = null) {
        doc.save();
        if (fillColor) {
            doc.roundedRect(x, y, width, height, radius).fillColor(fillColor).fill();
        }
        if (strokeColor) {
            doc.roundedRect(x, y, width, height, radius).strokeColor(strokeColor).lineWidth(0.5).stroke();
        }
        doc.restore();
    }

    function drawSectionTitle(text, x, y, options = {}) {
        const { fontSize = 10, emoji = null } = options;
        let xOffset = x;
        
        if (emoji) {
            doc.fontSize(fontSize).text(emoji, xOffset, y);
            xOffset += 15;
        }
        
        doc.fillColor(COLORS.black)
            .fontSize(fontSize)
            .font('Helvetica-Bold')
            .text(text, xOffset, y);
        
        return y + fontSize + 4;
    }

    function drawBulletList(items, x, y, maxWidth, options = {}) {
        const { fontSize = 7, lineGap = 8, color = COLORS.gray } = options;
        let currentY = y;
        
        doc.fillColor(color).fontSize(fontSize).font('Helvetica');
        
        items.forEach(item => {
            // PDFKit will automatically handle page breaks when content overflows
            const textHeight = doc.heightOfString(`• ${item}`, { width: maxWidth - 10 });
            doc.text(`• ${item}`, x, currentY, { width: maxWidth - 10 });
            currentY += textHeight + 2;
        });
        
        return currentY;
    }

    function drawLabelBadge(text, x, y, bgColor, textColor = COLORS.white, maxWidth = null) {
        const padding = 6;
        doc.font('Helvetica-Bold').fontSize(6);
        let textWidth = doc.widthOfString(text);
        
        // If maxWidth is specified and text is too wide, truncate
        if (maxWidth && textWidth + (padding * 2) > maxWidth) {
            textWidth = maxWidth - (padding * 2);
            // Truncate text with ellipsis
            let truncatedText = text;
            while (doc.widthOfString(truncatedText + '...') > textWidth && truncatedText.length > 0) {
                truncatedText = truncatedText.slice(0, -1);
            }
            text = truncatedText + (truncatedText.length < text.length ? '...' : '');
            textWidth = doc.widthOfString(text);
        }
        
        const badgeWidth = textWidth + (padding * 2);
        const badgeHeight = 14;
        
        drawRoundedRect(x, y, badgeWidth, badgeHeight, badgeHeight / 2, bgColor);
        doc.fillColor(textColor).text(text, x + padding, y + 3);
        
        return badgeWidth;
    }

    function drawText(text, x, y, width, options = {}) {
        const {
            fontSize = 10,
            color = COLORS.gray,
            font = 'Helvetica',
            align = 'left',
            lineGap = 2
        } = options;

        doc.fillColor(color)
            .fontSize(fontSize)
            .font(font)
            .text(text, x, y, { width, align, lineGap });
        
        const height = doc.heightOfString(text, { width, lineGap });
        return y + height;
    }

    function drawGradientText(text, x, y, fontSize, gradientStart, gradientEnd) {
        doc.fontSize(fontSize).font('Helvetica-Bold');
        
        const textWidth = doc.widthOfString(text);
        
        // Draw subtle shadow effect
        doc.fillColor('#5B21B6')
            .text(text, x + 0.5, y + 0.5);
        
        // Helper function to interpolate color
        function interpolateColor(color1, color2, factor) {
            const hex1 = color1.replace('#', '');
            const hex2 = color2.replace('#', '');
            const r1 = parseInt(hex1.substr(0, 2), 16);
            const g1 = parseInt(hex1.substr(2, 2), 16);
            const b1 = parseInt(hex1.substr(4, 2), 16);
            const r2 = parseInt(hex2.substr(0, 2), 16);
            const g2 = parseInt(hex2.substr(2, 2), 16);
            const b2 = parseInt(hex2.substr(4, 2), 16);
            
            const r = Math.round(r1 + (r2 - r1) * factor);
            const g = Math.round(g1 + (g2 - g1) * factor);
            const b = Math.round(b1 + (b2 - b1) * factor);
            
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
        
        // Draw text with smooth gradient
        const numSegments = 15;
        const segmentWidth = textWidth / numSegments;
        
        for (let i = 0; i < numSegments; i++) {
            const factor = i / (numSegments - 1);
            const color = interpolateColor(gradientStart, gradientEnd, factor);
            
            doc.save();
            const clipX = x + (segmentWidth * i);
            const overlap = i > 0 ? 1 : 0;
            doc.rect(clipX - overlap, y - 3, segmentWidth + (overlap * 2), fontSize + 6).clip();
            doc.fillColor(color).text(text, x, y);
            doc.restore();
        }
    }

    return {
        drawRoundedRect,
        drawSectionTitle,
        drawBulletList,
        drawLabelBadge,
        drawText,
        drawGradientText
    };
}

module.exports = { createHelpers };

