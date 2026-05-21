export const victoriaQuestions = {
  general: [
    {
      id: "victoria-study-level",
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
      id: "victoria-intake",
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
      id: "victoria-campus",
      question: "Preferred campus",
      type: "select",
      required: true,
      options: [
        "Victoria Main Campus",
        "Downtown Campus"
      ]
    },

    {
      id: "victoria-study-reason",
      question: "Why do you want to study at the University of Victoria?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice University of Victoria program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Cybersecurity",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Biomedical Engineering",
        "Business",
        "Commerce",
        "Accounting",
        "Finance",
        "Economics",
        "Psychology",
        "Political Science",
        "International Relations",
        "Law",
        "Education",
        "Biology",
        "Biochemistry",
        "Physics",
        "Mathematics",
        "Statistics",
        "Environmental Science",
        "Marine Biology",
        "Public Health",
        "Nursing",
        "Visual Arts",
        "Music"
      ]
    },

    {
      id: "victoria-second-choice",
      question: "Second choice program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Engineering",
        "Business",
        "Economics",
        "Psychology",
        "Environmental Science"
      ]
    },

    {
      id: "victoria-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "victoria-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "victoria-academic-awards",
      question: "Academic awards or distinctions",
      type: "textarea",
      required: false
    },

    {
      id: "victoria-transfer-student",
      question: "Have you attended another college or university before?",
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
      id: "victoria-english-test",
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
      id: "victoria-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "victoria-other-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "victoria-program-testing",
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
      id: "victoria-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "victoria-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "victoria-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "victoria-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "victoria-projects",
      question: "Research, innovation, coding, or academic projects",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "victoria-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "victoria-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "victoria-sponsored",
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
      id: "victoria-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "victoria-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "victoria-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: false
    },

    {
      id: "victoria-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "victoria-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "victoria-reference-count",
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
      id: "victoria-academic-reference",
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
      id: "victoria-professional-reference",
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
      id: "victoria-funding-source",
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
      id: "victoria-health-insurance",
      question: "Do you understand international student health insurance requirements?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "victoria-scholarship-interest",
      question: "Interested in University of Victoria scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};