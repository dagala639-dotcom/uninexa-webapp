export const ubcQuestions = {
  general: [
    {
      id: "ubc-study-level",
      question: "Level of study applying for",
      type: "select",
      required: true,
      options: [
        "Undergraduate",
        "Graduate coursework",
        "Graduate research"
      ]
    },

    {
      id: "ubc-campus",
      question: "Preferred UBC campus",
      type: "select",
      required: true,
      options: [
        "Vancouver",
        "Okanagan"
      ]
    },

    {
      id: "ubc-intake",
      question: "Preferred intake session",
      type: "select",
      required: true,
      options: [
        "Winter Session",
        "Summer Session"
      ]
    },

    {
      id: "ubc-study-reason",
      question: "Why do you want to study at the University of British Columbia?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice UBC program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Data Science",
        "Software Engineering",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Biomedical Engineering",
        "Chemical Engineering",
        "Business and Commerce",
        "Economics",
        "Finance",
        "Accounting",
        "Psychology",
        "Political Science",
        "International Relations",
        "Law",
        "Medicine",
        "Nursing",
        "Pharmacy",
        "Public Health",
        "Biology",
        "Biochemistry",
        "Physics",
        "Mathematics",
        "Statistics",
        "Architecture",
        "Forestry",
        "Environmental Science",
        "Education",
        "Media Studies",
        "Journalism",
        "Music"
      ]
    },

    {
      id: "ubc-second-choice",
      question: "Second choice UBC program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Engineering",
        "Commerce",
        "Economics",
        "Medicine",
        "Law",
        "Psychology"
      ]
    },

    {
      id: "ubc-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "ubc-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "ubc-academic-achievements",
      question: "Academic awards, distinctions, or honors",
      type: "textarea",
      required: false
    },

    {
      id: "ubc-previous-study",
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
      id: "ubc-english-test",
      question: "English language qualification",
      type: "select",
      required: true,
      options: [
        "IELTS",
        "TOEFL",
        "Duolingo English Test",
        "Cambridge English",
        "PTE Academic",
        "Not taken yet"
      ]
    },

    {
      id: "ubc-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "ubc-other-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "ubc-program-testing",
      question: "Does your chosen program require interviews or additional testing?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Not sure"
      ]
    }
  ],

  activities: [
    {
      id: "ubc-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "ubc-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "ubc-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "ubc-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "ubc-projects",
      question: "Research, coding, innovation, or academic projects completed",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "ubc-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "ubc-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "ubc-sponsored-student",
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
      id: "ubc-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "ubc-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "ubc-personal-profile",
      question: "Upload personal profile/personal statement",
      type: "file",
      required: true
    },

    {
      id: "ubc-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "ubc-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "ubc-reference-count",
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
      id: "ubc-academic-reference",
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
      id: "ubc-professional-reference",
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
      id: "ubc-funding-source",
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
      id: "ubc-health-insurance",
      question: "Do you understand UBC international student health insurance requirements?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "ubc-scholarship-interest",
      question: "Interested in UBC scholarships or bursaries?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};