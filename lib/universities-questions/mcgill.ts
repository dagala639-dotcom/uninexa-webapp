export const mcgillQuestions = {
  general: [
    {
      id: "mcgill-study-level",
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
      id: "mcgill-intake",
      question: "Preferred intake term",
      type: "select",
      required: true,
      options: [
        "Fall",
        "Winter",
        "Summer"
      ]
    },

    {
      id: "mcgill-faculty",
      question: "Preferred McGill faculty",
      type: "select",
      required: true,
      options: [
        "Faculty of Science",
        "Faculty of Engineering",
        "Faculty of Arts",
        "Desautels Faculty of Management",
        "Faculty of Medicine and Health Sciences",
        "Faculty of Education",
        "Faculty of Law",
        "School of Architecture",
        "School of Computer Science"
      ]
    },

    {
      id: "mcgill-study-reason",
      question: "Why do you want to study at McGill University?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice McGill program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Information Systems",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Biomedical Engineering",
        "Physics",
        "Mathematics",
        "Statistics",
        "Chemistry",
        "Biology",
        "Biochemistry",
        "Medicine",
        "Nursing",
        "Dentistry",
        "Pharmacy",
        "Public Health",
        "Economics",
        "Finance",
        "Accounting",
        "Commerce",
        "Management",
        "Psychology",
        "Political Science",
        "International Development",
        "Law",
        "Architecture",
        "Education",
        "Music"
      ]
    },

    {
      id: "mcgill-second-choice",
      question: "Second choice McGill program",
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
        "Mathematics"
      ]
    },

    {
      id: "mcgill-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "mcgill-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "mcgill-honors-awards",
      question: "Academic awards or honors received",
      type: "textarea",
      required: false
    },

    {
      id: "mcgill-previous-university",
      question: "Have you previously attended another university?",
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
      id: "mcgill-english-test",
      question: "English language qualification",
      type: "select",
      required: true,
      options: [
        "IELTS",
        "TOEFL",
        "Duolingo English Test",
        "Cambridge English",
        "Native English speaker",
        "Not taken yet"
      ]
    },

    {
      id: "mcgill-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "mcgill-french-proficiency",
      question: "French language proficiency",
      type: "select",
      required: false,
      options: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Native speaker",
        "No French"
      ]
    },

    {
      id: "mcgill-standardized-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    }
  ],

  activities: [
    {
      id: "mcgill-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "mcgill-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "mcgill-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "mcgill-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "mcgill-research-projects",
      question: "Research, coding, innovation, or academic projects",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "mcgill-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "mcgill-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "mcgill-sponsored",
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
      id: "mcgill-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "mcgill-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "mcgill-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: false
    },

    {
      id: "mcgill-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "mcgill-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "mcgill-reference-count",
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
      id: "mcgill-academic-reference",
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
      id: "mcgill-professional-reference",
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
      id: "mcgill-funding-source",
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
      id: "mcgill-health-insurance",
      question: "Do you understand McGill international student health insurance requirements?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "mcgill-scholarship-interest",
      question: "Interested in McGill scholarships or bursaries?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};