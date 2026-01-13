// Sample data for testing
const sampleData = {
  name: "Harkarman Singh",
  board: "CBSE",
  class: "10",
  school: "DPS Rk Puram",
  academics: {
    currentMarks: "76%",
    favouriteSubjects: ["English", "science", "Mathematics"],
    dislikeSubjects: ["Physical Education"],
    careerAspiration: "Corporate Lawyer",
  },
  hobbies: ["Listening music", "Gaming", "Playing Sports"],
  recommendedSubjectCombination: {
    code: "PCM",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  recommendedCareerClusters: {
    primary: ["Science & Mathematics", "Engineering & Technology"],
    backup: ["Architecture & Planning"],
  },
  aptitudeScore: {
    mediumScoredAreas: [
      "Verbal Aptitude",
      "Mechanical Aptitude",
      "Spatial Aptitude",
    ],
    lowScoredAreas: ["Numerical Aptitude", "Reasoning Aptitude"],
  },
  personalityArea: {
    mediumScoredAreas: [
      "attitudinal orientation (agreeableness)",
      "emotional orientation (neuroticism)",
      "interpersonal orientation (extraversion)",
    ],
    lowScoredAreas: [
      "learning orientation (openness to experience)",
      "conscientiousness orientation",
    ],
  },
  topInterestThemes: [
    "Enterprising",
    "Realistic",
    "Artistic",
    "Enterprising",
    "Realistic",
    "Artistic",
  ],
  whyChooseReasons: [
    "Strongest academic and psychometric fit: High aptitude in numerical, reasoning, and verbal; top interest in mathematics and analytical subjects.",
    "Personality traits (focused, practical, organized) are well-suited for PCM pathways.",
    "All top career fitment clusters (Science & Mathematics, Engineering & Technology, Architecture & Planning) are accessible ONLY via PCM.",
  ],
  clusterSetAccess: [
    "Science & Mathematics",
    "Engineering & Technology",
    "Architecture & Planning",
  ],
  optionalSubjects: ["Computer Science"],
  aspirationAlignment: [
    "PCM is the best match for your strengths and recommended clusters.",
    "PCM does not lead directly to law, but you can pursue law after your science/engineering degree.",
  ],
  finalVerdict:
    "Highly Suitable for your strengths and recommended career pathways; Partially Suitable for your career aspiration (Corporate Lawyer).",

  // ========== PAGE 2 DATA ==========
  careerClusters: {
    primary: [
      {
        name: "Science & Mathematics",
        emoji: "🧪",
        whyReasons: [
          "Strong match with student's numerical aptitude, reasoning, and mathematics preference.",
          "Personality is focused and organized, suitable for analytical/scientific careers.",
          "High fitment score (65).",
          "Opens a wide range of science/math careers.",
        ],
        subjectEligibility: ["PCM"],
        topCareers: ["Mathematician", "Physicist", "Chemist"],
      },
      {
        name: "Engineering & Technology",
        emoji: "👷",
        whyReasons: [
          "High numerical, reasoning, and mechanical aptitude.",
          "Strong interest in Realistic and Investigative domains.",
          "Enjoys mathematics and technical problem-solving.",
          "High fitment score (63).",
        ],
        subjectEligibility: ["PCM"],
        topCareers: ["Computer Engineer", "Mechanical Engineer", "Electronics Engineer"],
      },
    ],
    backup: [
      {
        name: "Architecture & Planning",
        emoji: "👷",
        whyReasons: [
          "Strong match with student's numerical aptitude, reasoning, and mathematics preference.",
          "Personality is focused and organized, suitable for analytical/scientific careers.",
          "High fitment score (65).",
          "Opens a wide range of science/math careers.",
        ],
        subjectEligibility: ["PCM"],
        topCareers: ["Mathematician", "Physicist", "Chemist"],
      },
    ],
  },

  careerAspirationEvaluation: {
    aspirationalCareer: "Corporate Lawyer",
    clusterAnalysis: "Corporate Lawyer is mapped to the Legal Services cluster (Arts without Maths, Generic Stream).",
    evaluation: [
      "Aptitude: Strong verbal, reasoning, and numerical skills (positive).",
      "Personality: Practical, focused, competitive (can help in law), but introverted (law often requires strong communication and people skills).",
      "Academic: High performance.",
      "Interest: Enterprising and Social are moderate (helpful for law), but strongest in Realistic/Investigative/Conventional (more science/tech inclined).",
      "Fitment Score for Legal Services: 56 (lower than science/engineering clusters, but above 50).",
    ],
    verdict: "Partially Suitable",
    suggestions: [
      "Your aspiration aligns with some of your strengths, but your strongest fit is with science/engineering clusters.",
      "If law remains a strong interest, keep it as a backup and consider dual options (science now, law later).",
      "If you are deeply interested in law, consider exploring Arts without Maths or Generic stream.",
      "You may take up legal studies after a science/engineering undergraduate degree via law entrance exams (e.g., after B.Tech/B.Sc.).",
    ],
  },
};

module.exports = { sampleData };
