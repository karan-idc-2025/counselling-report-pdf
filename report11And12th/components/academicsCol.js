const { COLORS, PAGE } = require('../../constants');
const path = require('path');
const fs = require('fs');

function renderAcademicsColumn(doc, data, gridCol1X, gridY) {
    const EMOJI_FONT = path.join(__dirname, '../../fonts/NotoEmoji-Regular.ttf');

    let colY = gridY;
    doc.fillColor(COLORS.black).fontSize(8).font('Helvetica-Bold')
        .text('Academics', gridCol1X, colY);
    colY += 13;
    
    const academicsItems = [
        { emoji: 'chart.png', label: 'Current Marks:', value: data.academics?.currentMarks || 'N/A' },
        { emoji: 'fav.png', label: 'Favourite Subjects:', value: (data.academics?.favouriteSubjects || []).join(', ') || 'N/A' },
        { emoji: 'dislike.png', label: 'Dislike Subjects:', value: (data.academics?.dislikeSubjects || []).join(', ') || 'N/A' },
        { emoji: 'arrow.png', label: 'Career Aspiration:', value: data.academics?.careerAspiration || 'N/A' }
    ];
    
const emojiPath = path.join(__dirname, '../../images');

academicsItems.forEach(item => {
  doc.image(
    path.join(emojiPath, item.emoji),
    gridCol1X,
    colY - 1,
    { width: 7 }
  );

  doc
    .font('Helvetica')
    .fontSize(5.5)
    .fillColor('#666666')
    .text(item.label, gridCol1X + 10, colY, { width: 85 });

  colY += 8;

  doc
    .fillColor('#333333')
    .text(item.value, gridCol1X + 10, colY, { width: 85 });

  colY += 11;
});
}

module.exports = { renderAcademicsColumn };