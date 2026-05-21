export const albertaQuestions = {
  general: [
    {
      id: "alberta-study-level",
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
      id: "alberta-intake",
      question: "Preferred intake term",
      type: "select",
      required: true,
      options: [
        "Fall",
        "Winter",
        "Spring",
        "Summer"
      ]
    },

    {
      id: "alberta-campus",
      question: "Preferred campus",
      type: "select",
      required: true,
      options: [
        "North Campus",
        "Campus Saint-Jean",
        "Augustana Campus"
      ]
    },

    {
      id: "alberta-study-reason",
      question: "Why do you want to study at the University of Alberta?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice University of Alberta program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Cybersecurity",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Biomedical Engineering",
        "Business",
        "Commerce",
        "Accounting",
        "Finance",
        "Economics",
        "Medicine",
        "Nursing",
        "Pharmacy",
        "Dentistry",
        "Public Health",
        "Law",
        "Psychology",
        "Political Science",
        "International Relations",
        "Biology",
        "Biochemistry",
        "Physics",
        "Mathematics",
        "Statistics",
        "Agriculture",
        "Environmental Science",
        "Education",
        "Architecture"
      ]
    },

    {
      id: "alberta-second-choice",
      question: "Second choice program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Engineering",
        "Business",
        "Economics",
        "Medicine",
        "Law",
        "Psychology"
      ]
    },

    {
      id: "alberta-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "alberta-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "alberta-academic-awards",
      question: "Academic awards or distinctions",
      type: "textarea",
      required: false
    },

    {
      id: "alberta-transfer-student",
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
      id: "alberta-english-test",
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
      id: "alberta-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "alberta-other-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "alberta-program-testing",
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
      id: "alberta-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "alberta-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "alberta-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "alberta-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "alberta-projects",
      question: "Research, coding, innovation, or academic projects",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "alberta-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "alberta-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "alberta-sponsored",
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
      id: "alberta-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "alberta-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "alberta-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: false
    },

    {
      id: "alberta-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "alberta-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "alberta-reference-count",
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
      id: "alberta-academic-reference",
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
      id: "alberta-professional-reference",
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
      id: "alberta-funding-source",
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
      id: "alberta-health-insurance",
      question: "Do you understand Alberta international student health insurance requirements?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "alberta-scholarship-interest",
      question: "Interested in University of Alberta scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};