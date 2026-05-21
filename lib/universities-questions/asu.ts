export const asuQuestions = {
  general: [
    {
      id: "asu-study-level",
      question: "Level of study applying for",
      type: "select",
      required: true,
      options: [
        "Undergraduate",
        "Master's degree",
        "Doctoral degree"
      ]
    },

    {
      id: "asu-intake",
      question: "Preferred intake term",
      type: "select",
      required: true,
      options: [
        "Fall",
        "Spring",
        "Summer"
      ]
    },

    {
      id: "asu-campus",
      question: "Preferred ASU campus",
      type: "select",
      required: true,
      options: [
        "Tempe",
        "Downtown Phoenix",
        "Polytechnic",
        "West Valley",
        "Online"
      ]
    },

    {
      id: "asu-study-reason",
      question: "Why do you want to study at Arizona State University?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice ASU program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Cybersecurity",
        "Information Technology",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Biomedical Engineering",
        "Chemical Engineering",
        "Aerospace Engineering",
        "Business Administration",
        "Finance",
        "Accounting",
        "Marketing",
        "Economics",
        "Supply Chain Management",
        "Law",
        "Medicine",
        "Nursing",
        "Public Health",
        "Psychology",
        "Political Science",
        "International Relations",
        "Architecture",
        "Biological Sciences",
        "Biochemistry",
        "Physics",
        "Mathematics",
        "Statistics",
        "Journalism",
        "Film and Media Studies",
        "Graphic Design",
        "Education"
      ]
    },

    {
      id: "asu-second-choice",
      question: "Second choice ASU program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Engineering",
        "Business",
        "Economics",
        "Psychology",
        "Biological Sciences",
        "Architecture"
      ]
    },

    {
      id: "asu-academic-results",
      question: "Final or predicted academic results",
      type: "textarea",
      required: true
    },

    {
      id: "asu-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "asu-honors",
      question: "Academic awards, honors, or distinctions",
      type: "textarea",
      required: false
    },

    {
      id: "asu-transfer-student",
      question: "Have you attended another university or college before?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ],

  testing: [
    {
      id: "asu-english-test",
      question: "English language qualification",
      type: "select",
      required: true,
      options: [
        "IELTS",
        "TOEFL",
        "Duolingo English Test",
        "PTE Academic",
        "Cambridge English",
        "Not taken yet"
      ]
    },

    {
      id: "asu-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "asu-standardized-tests",
      question: "Standardized tests completed",
      type: "select",
      required: false,
      options: [
        "SAT",
        "ACT",
        "GRE",
        "GMAT",
        "MCAT",
        "None"
      ]
    },

    {
      id: "asu-test-scores",
      question: "Enter standardized test scores",
      type: "textarea",
      required: false
    }
  ],

  activities: [
    {
      id: "asu-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "asu-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "asu-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "asu-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "asu-projects",
      question: "Research, coding, innovation, startup, or academic projects",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "asu-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "asu-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "asu-sponsored",
      question: "Are you sponsored by a government or organization?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ],

  documents: [
    {
      id: "asu-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "asu-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "asu-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: false
    },

    {
      id: "asu-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "asu-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "asu-reference-count",
      question: "Number of recommendation letters available",
      type: "select",
      required: true,
      options: [
        "1",
        "2",
        "3+"
      ]
    },

    {
      id: "asu-academic-reference",
      question: "Academic recommendation submitted?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Pending"
      ]
    },

    {
      id: "asu-professional-reference",
      question: "Professional recommendation available?",
      type: "select",
      required: false,
      options: [
        "Yes",
        "No"
      ]
    }
  ],

  billing: [
    {
      id: "asu-funding-source",
      question: "Primary source of tuition funding",
      type: "select",
      required: true,
      options: [
        "Family support",
        "Government scholarship",
        "University scholarship",
        "Employer sponsorship",
        "Personal savings",
        "Student loan"
      ]
    },

    {
      id: "asu-proof-of-funds",
      question: "Can you provide proof of funds for visa processing?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Not sure"
      ]
    },

    {
      id: "asu-scholarship-interest",
      question: "Interested in ASU scholarships or merit awards?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};