const fs = require('fs');
const path = require('path');
const { COLORS, PAGE } = require('../constants');

const { createHelpers } = require('../helpers');

const { renderHeader } = require('./components/header');

const { renderTitle } = require('./components/title');

const { renderIntroduction } = require('./components/introduction');

const { renderCounselingSummary } = require('./components/counselingSummary');

const { renderGlancePill } = require('./components/glancePill');

const { renderStudentGlanceCard } = require('./components/studentGlanceCard');
const { renderCareerClusterRecommendations } = require('./components/careerClusterRecommendation');
const { renderCareerAspirationEvaluation } = require('./components/careerAspirationEval');
const { renderCoursesAfterGrade12 } = require('./components/coursesAfterGrade12');
const {renderRealisticColleges} = require('./components/realisticCollege');
const {renderEntranceExams} = require('./components/entranceExams');

const { renderFooter } = require('./components/footer');
const { y } = require('pdfkit');



/**
 * ============================================================================
 * MAIN RENDER FUNCTION - Orchestrates all components
 * ============================================================================
 */
function renderPage(doc, data) {
    const helpers = createHelpers(doc);
    let yPos = PAGE.margin;

    // COMPONENT 1: Header (Logo)
    yPos = renderHeader(doc, helpers, yPos);

    // COMPONENT 2: Title
    yPos = renderTitle(doc, helpers, yPos);

    // COMPONENT 3: Introduction
    yPos = renderIntroduction(doc, data, yPos);

    // COMPONENT 4: Counseling Summary (Purple Card)
    yPos = renderCounselingSummary(doc, helpers, data, yPos);

    // PAGE BREAK CHECK: Before "You in a Glance" section
    const glanceSectionEstimatedHeight = 220; // Further reduced since purple card is smaller now
    const pageBottomLimit = PAGE.height - PAGE.margin;
    
    if (yPos + glanceSectionEstimatedHeight > pageBottomLimit) {
        doc.addPage();
        yPos = PAGE.margin;
    }

    // COMPONENT 5: You in a Glance - Pill Header
    yPos = renderGlancePill(doc, helpers, yPos);

    // COMPONENT 6: Student Glance Card (contains all sub-components)
    yPos = renderStudentGlanceCard(doc, helpers, data, yPos);

    // ========== ADDITIONAL SECTIONS (Auto page breaks handled internally) ==========
    
    // COMPONENT 7: Career Cluster Recommendations
    // (Includes header, primary pill, 2 primary cards, backup pill, backup card)
    yPos = renderCareerClusterRecommendations(doc, helpers, data, yPos);

    // COMPONENT 8: Career Aspiration Evaluation
    yPos = renderCareerAspirationEvaluation(doc, helpers, data, yPos);

    // COMPONENT 9: Courses After Grade 12
    yPos = renderCoursesAfterGrade12(doc, helpers, data, yPos);

    // COMPONENT 10: Realistic Colleges
    yPos = renderRealisticColleges(doc, helpers, data, yPos);

    // COMPONENT 11: Entrance Exams
    yPos = renderEntranceExams(doc, helpers, data, yPos);
    // COMPONENT 12: Footer
    yPos = renderFooter(doc, helpers, yPos);


    return {
        sidebarCreatedNewPage: false,
        sidebarOverflowPage: null,
        sidebarOverflowPageIndex: -1,
        sidebarX: 0,
        sidebarWidth: 0,
        sidebarFinalY: 0
    };
}

module.exports = { renderPage };