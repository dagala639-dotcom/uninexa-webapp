export const cambridgeQuestions = {
  general: [
    {
      id: "cambridge-college-choice",
      question: "Preferred Cambridge college",
      type: "select",
      required: true,
      options: [
        "Christ's College",
        "Clare College",
        "Corpus Christi College",
        "Downing College",
        "Emmanuel College",
        "Fitzwilliam College",
        "Girton College",
        "Gonville & Caius College",
        "Homerton College",
        "Hughes Hall",
        "Jesus College",
        "King's College",
        "Lucy Cavendish College",
        "Magdalene College",
        "Murray Edwards College",
        "Newnham College",
        "Pembroke College",
        "Peterhouse",
        "Queens' College",
        "Robinson College",
        "Selwyn College",
        "Sidney Sussex College",
        "St Catharine's College",
        "St Edmund's College",
        "St John's College",
        "Trinity College",
        "Trinity Hall",
        "Wolfson College",
        "Open Application"
      ]
    },

    {
      id: "cambridge-course-level",
      question: "Course level applying for",
      type: "select",
      required: true,
      options: [
        "Undergraduate",
        "Postgraduate taught",
        "Postgraduate research"
      ]
    },

    {
      id: "cambridge-course-interest",
      question: "Why are you interested in studying this subject at Cambridge?",
      type: "textarea",
      required: true
    },

    {
      id: "cambridge-academic-interests",
      question: "Academic interests related to your chosen subject",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "cambridge-first-choice-course",
      question: "First choice Cambridge course",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Engineering",
        "Mathematics",
        "Natural Sciences",
        "Medicine",
        "Law",
        "Economics",
        "Land Economy",
        "Psychological and Behavioural Sciences",
        "Human, Social and Political Sciences",
        "History",
        "English",
        "Architecture",
        "Chemical Engineering and Biotechnology",
        "Education",
        "Philosophy",
        "Veterinary Medicine",
        "Physics",
        "Chemistry",
        "Linguistics",
        "Music"
      ]
    },

    {
      id: "cambridge-second-choice-course",
      question: "Second choice course (if applicable)",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Engineering",
        "Mathematics",
        "Natural Sciences",
        "Economics",
        "Law"
      ]
    },

    {
      id: "cambridge-achieved-grades",
      question: "Achieved or predicted final grades",
      type: "textarea",
      required: true
    },

    {
      id: "cambridge-relevant-subjects",
      question: "Relevant academic subjects studied",
      type: "textarea",
      required: true
    },

    {
      id: "cambridge-independent-study",
      question: "Independent study or research related to your subject",
      type: "textarea",
      required: false
    },

    {
      id: "cambridge-written-work",
      question: "Does your course require written work submission?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Not sure"
      ]
    }
  ],

  testing: [
    {
      id: "cambridge-admissions-test",
      question: "Admissions assessment for your course",
      type: "select",
      required: true,
      options: [
        "None",
        "TMUA",
        "ESAT",
        "UCAT",
        "LNAT",
        "Engineering and Science Admissions Test",
        "Mathematics Admissions Test",
        "Modern Languages Assessment",
        "Not sure"
      ]
    },

    {
      id: "cambridge-english-qualification",
      question: "English language qualification",
      type: "select",
      required: true,
      options: [
        "IELTS",
        "TOEFL",
        "Cambridge English",
        "Duolingo English Test",
        "Native English speaker",
        "Not taken yet"
      ]
    },

    {
      id: "cambridge-english-score",
      question: "English test score",
      type: "text",
      required: false
    },

    {
      id: "cambridge-interview-preparation",
      question: "Have you prepared for Cambridge interviews?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Currently preparing"
      ]
    }
  ],

  activities: [
    {
      id: "cambridge-olympiads",
      question: "Academic olympiads or competitions",
      type: "textarea",
      required: false
    },

    {
      id: "cambridge-leadership",
      question: "Leadership positions and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "cambridge-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "cambridge-subject-activities",
      question: "Extracurricular activities related to your subject",
      type: "textarea",
      required: true
    }
  ],

  family: [
    {
      id: "cambridge-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "cambridge-financial-support",
      question: "Will you require financial support or scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "cambridge-parent-education",
      question: "Highest education level of parent/guardian",
      type: "select",
      required: false,
      options: [
        "Primary",
        "Secondary",
        "Diploma",
        "Bachelor's degree",
        "Master's degree",
        "Doctorate"
      ]
    }
  ],

  documents: [
    {
      id: "cambridge-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: true
    },

    {
      id: "cambridge-written-work-upload",
      question: "Upload written work (if required)",
      type: "file",
      required: false
    },

    {
      id: "cambridge-transcript-upload",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "cambridge-cv-upload",
      question: "Upload CV or resume",
      type: "file",
      required: false
    }
  ],

  recommendations: [
    {
      id: "cambridge-reference-count",
      question: "Number of academic references available",
      type: "select",
      required: true,
      options: [
        "1",
        "2",
        "3+"
      ]
    },

    {
      id: "cambridge-reference-submitted",
      question: "Teacher/counselor recommendation submitted?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Pending"
      ]
    },

    {
      id: "cambridge-reference-strength",
      question: "How well do your referees know your academic ability?",
      type: "select",
      required: true,
      options: [
        "Extremely well",
        "Moderately well",
        "Slightly"
      ]
    }
  ],

  billing: [
    {
      id: "cambridge-funding-source",
      question: "Primary source of funding",
      type: "select",
      required: true,
      options: [
        "Family support",
        "Government scholarship",
        "University scholarship",
        "External sponsorship",
        "Personal savings",
        "Student loan"
      ]
    },

    {
      id: "cambridge-fees-awareness",
      question: "Do you understand Cambridge tuition and college fees?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "cambridge-scholarship-interest",
      question: "Interested in Cambridge scholarships or bursaries?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};