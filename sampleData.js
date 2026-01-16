// Sample data for testing
const sampleData = {
  name: "Harkarman Singh",
  board: "CBSE",
  class: "10",
  school: "Vijay Sr. Sec. Public School",
  academics: {
    currentMarks: "76%",
    favouriteSubjects: ["English", "Hindi"],
    dislikeSubjects: ["Mathematics"],
    careerAspiration: "Marine Engineer",
  },
  hobbies: ["Listening music"],
  aptitudeScore: {
    mediumScoredAreas: [
      "Verbal Aptitude",
    ],
    lowScoredAreas: ["Numerical Aptitude", "Mechanical Aptitude"],
  },
  personalityArea: {
    youSeemToBe: [
      "Practical",
      "Focused, Organized",
      "Ambiverted",
      "Co-Operative",
      "Self-Aware"
    ]
  },
  topInterestThemes: [
    "Enterprising",
    "Realistic",
    "Artistic",
  ],
  recommendedCareerClusters: {
    primary: ["Legal Services", "Performing Arts"],
    backup: ["Hospitality, Tourism & Transport Services"],
  },

  // ========== AI RECOMMENDATION STRUCTURED DATA ==========
  ai_recommendation_structured: {
    careerClusters: {
      primary: [
        {
          title: "Legal Services",
          whyCluster: [
            "Strong fit with your language skills and preference for Hindi.",
            "Avoids Mathematics, aligning with your subject dislikes and low numerical aptitude.",
            "Offers intellectually engaging, respected careers suitable for practical, calm, and introverted personalities.",
            "Wide range of accessible pathways for Arts without Maths students."
          ],
          topCareers: [
            "Lawyers",
            "Judges",
            "Public Prosecutors"
          ]
        },
        {
          title: "Performing Arts",
          whyCluster: [
            "Matches your hobby (listening to music) and supports creative self-expression.",
            "No mathematics required; accessible for your profile and personality.",
            "Suits quiet, practical, and introverted students."
          ],
          topCareers: [
            "Musicians",
            "Theatre Artists",
            "Actors"
          ]
        }
      ],
      backup: [
        {
          title: "Hospitality, Tourism & Transport Services",
          whyCluster: [
            "Practical, people-oriented roles that do not require strong math or science background.",
            "Suitable for high academic achievers who prefer real-world, service-oriented careers.",
            "Wide variety of career pathways for Arts without Maths students."
          ],
          topCareers: [
            "Hotel Management Professionals",
            "Travel & Tourism Professionals",
            "Chefs"
          ]
        }
      ]
    },
    streamRecommendation: {
      name: "Arts without Maths",
      why: [
        "Maximizes access to all approved clusters (Legal Services, Performing Arts, Hospitality, Tourism & Transport).",
        "Avoids mathematics, respecting your strong subject dislike and low aptitude in numerical/mechanical domains.",
        "Aligns with your academic strengths, personality, and interests."
      ],
      coreSubjects: [
        "English",
        "Hindi (or other language)",
        "History",
        "Political Science"
      ],
      optionalSubjects: [
        "Sociology",
        "Psychology",
        "Fine Arts",
        "Legal Studies",
        "Performing Arts",
        "Home Science",
        "Media Studies",
        "Geography"
      ]
    },
    coursesAfter12: [
      {
        cluster: "Legal Services",
        courses: [
          {
            name: "BA LLB (5-year Integrated Law)",
            duration: "5 years",
            entranceDifficulty: "Moderate"
          },
          {
            name: "B.A. in Legal Studies",
            duration: "3 years",
            entranceDifficulty: "Easy-Moderate"
          },
          {
            name: "B.A. (Hons) Political Science/Sociology + LLB (3-year after graduation)",
            duration: "3+3 years",
            entranceDifficulty: "Moderate"
          }
        ]
      },
      {
        cluster: "Performing Arts",
        courses: [
          {
            name: "Bachelor of Performing Arts (BPA)",
            duration: "3 years",
            entranceDifficulty: "Easy-Moderate (audition-based)"
          },
          {
            name: "Bachelor of Music (B.Mus) / Bachelor of Fine Arts (BFA)",
            duration: "3 years",
            entranceDifficulty: "Easy-Moderate"
          },
          {
            name: "Diploma in Theatre Arts/Acting",
            duration: "1-2 years",
            entranceDifficulty: "Easy-Moderate"
          }
        ]
      },
      {
        cluster: "Hospitality, Tourism & Transport Services",
        courses: [
          {
            name: "B.Sc. in Hospitality & Hotel Administration",
            duration: "3 years",
            entranceDifficulty: "Moderate"
          },
          {
            name: "B.A. in Tourism Studies",
            duration: "3 years",
            entranceDifficulty: "Easy"
          },
          {
            name: "Diploma in Culinary Arts / Food Production",
            duration: "1-2 years",
            entranceDifficulty: "Easy"
          }
        ]
      }
    ],
    collegeOptions: [
      {
        cluster: "Legal Services",
        colleges: [
          { name: "Indore Institute of Law, Indore" },
          { name: "IMS Law College, Noida" },
          { name: "Bharati Vidyapeeth New Law College, Pune" }
        ]
      },
      {
        cluster: "Performing Arts",
        colleges: [
          { name: "Rabindra Bharati University, Kolkata" },
          { name: "Bharatiya Vidya Bhavan, Delhi/Mumbai" },
          { name: "Delhi College of Arts & Commerce (Delhi University)" }
        ]
      },
      {
        cluster: "Hospitality, Tourism & Transport Services",
        colleges: [
          { name: "Institute of Hotel Management (IHM), Bhopal" },
          { name: "Christ University, Bangalore" },
          { name: "Amity School of Hospitality, Noida" }
        ]
      }
    ],
    entranceExams: [
      {
        cluster: "Legal Services",
        exams: [
          "CLAT (Common Law Admission Test)",
          "LSAT India",
          "State-level Law Entrance Exams (e.g., MH CET Law, MP Law CET)"
        ]
      },
      {
        cluster: "Performing Arts",
        exams: [
          "College-specific auditions/interviews",
          "CUET (for some central universities)",
          "State-level Performing Arts Entrance/Audition"
        ]
      },
      {
        cluster: "Hospitality, Tourism & Transport Services",
        exams: [
          "NCHM JEE (for IHMs)",
          "College/university-specific entrance or interview",
          "State-level Hotel Management Entrance Exams"
        ]
      }
    ],
    careerAspirationEvaluation: [
      {
        aspiration: "Marine Engineer",
        status: "Engineering & Technology (NOT in your top 10 clusters)",
        verdict: "Not Suitable"
      }
    ],
    streamAspirationEvaluation: {
      aspiration: "PCM",
      evaluation: "Strong academic record, but PCM is not recommended due to low aptitude and strong dislike of mathematics. Would expose you to challenging subjects that do not match your interests or strengths.",
      verdict: "Not Suitable"
    },
    actionPlan: [
      {
        title: "Syllabus/Curriculum Review",
        items: [
          "Download and review the Arts without Maths syllabus for your board.",
          "Focus on subjects that interest you, especially Hindi and humanities."
        ]
      },
      {
        title: "Cluster Research (iDreamCareer Tools)",
        items: [
          "Use iDreamCareer Career Library (https://idreamcareer.com/careers/) to research Legal Services, Performing Arts, and Hospitality clusters."
        ]
      },
      {
        title: "Job Shadowing / Mentorship",
        items: [
          "Connect with professionals in law, performing arts, or hospitality.",
          "Observe their work or conduct informational interviews."
        ]
      },
      {
        title: "Likes vs Dislikes Reflection",
        items: [
          "Make a list of what you like/dislike about each cluster after research and shadowing.",
          "Reflect on whether you can see yourself in these careers."
        ]
      },
      {
        title: "Real-World Tools / Platforms",
        items: [
          "Legal: MyLaw (https://mylaw.net/), Online Moot Courts (https://www.lawctopus.com/academike/online-moot-courts-india/)",
          "Performing Arts: Coursera Performing Arts Courses (https://www.coursera.org/browse/arts-and-humanities/music-and-art), YouTube Masterclasses (https://www.youtube.com/results?search_query=acting+masterclass)",
          "Hospitality: NCHMCT e-Learning (https://nchm.nic.in/), YouTube: Hotel Management Career (https://www.youtube.com/results?search_query=hotel+management+career)"
        ]
      },
      {
        title: "Exploration Tasks",
        items: [
          "Legal: Attend a local court session, participate in debates/mock trials.",
          "Performing Arts: Join school/community music/drama groups, talent shows.",
          "Hospitality: Volunteer at events, take online cooking/event management courses."
        ]
      },
      {
        title: "Contextual Queries & Support",
        items: [
          "Mental Health: Talk to a counselor if stressed.",
          "Financial: Research scholarships, affordable colleges.",
          "Part-Time Work: Explore internships/part-time roles in hospitality, theatre, or legal aid (if age-appropriate).",
          "Learning Challenges: Seek support if needed."
        ]
      },
      {
        title: "Reflection & Review",
        items: [
          "Keep a journal or voice notes about your experiences and interests.",
          "Review with a counselor or mentor every few months."
        ]
      }
    ],
    counselorTip: "Explore, reflect, and stay open to new experiences. If your interests or aptitudes change, you can revisit your options with your counselor.",
    qualityChecklist: [
      "Best-fit stream and career clusters are clearly stated.",
      "Recommendations respect academic record, aptitude, and interests.",
      "Eligibility and realistic entry pathways are listed for every career.",
      "All action steps are practical and time-bound.",
      "Cluster reasoning aligns with user's academic and personality profile.",
      "Careful evaluation of aspiration versus suitability is provided.",
      "Action plan includes exploration, reflection, and revisiting options.",
      "Report encourages contacting counselor for further discussion."
    ]
  },

  // ========== PAGE 1 DATA (for stream recommendation card) ==========
  recommendedSubjectCombination: {
    code: "Arts without Maths",
    subjects: ["English", "Hindi (or other language)", "History", "Political Science"],
  },
  optionalSubjects: ["Sociology", "Psychology", "Fine Arts", "Legal Studies", "Performing Arts", "Home Science", "Media Studies", "Geography"],
  whyChooseReasons: [
    "Maximizes access to all approved clusters (Legal Services, Performing Arts, Hospitality, Tourism & Transport).",
    "Avoids mathematics, respecting your strong subject dislike and low aptitude in numerical/mechanical domains.",
    "Aligns with your academic strengths, personality, and interests."
  ],
  clusterSetAccess: [
    "Legal Services",
    "Performing Arts", 
    "Hospitality, Tourism & Transport Services"
  ],
  aspirationAlignment: [
    "Arts without Maths is the best match for your strengths and recommended clusters.",
    "Your aspiration (Marine Engineer) requires PCM which is not recommended for your profile."
  ],
  finalVerdict: "Highly Suitable for your strengths and recommended career pathways; Not Suitable for your career aspiration (Marine Engineer).",
};

module.exports = { sampleData };
