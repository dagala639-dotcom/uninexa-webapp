export const queenslandQuestions = {
  general: [
    {
      id: "uq-study-level",
      question: "Level of study applying for",
      type: "select",
      required: true,
      options: [
        "Undergraduate",
        "Postgraduate coursework",
        "Postgraduate research"
      ]
    },

    {
      id: "uq-intake",
      question: "Preferred intake semester",
      type: "select",
      required: true,
      options: [
        "Semester 1",
        "Semester 2",
        "Summer Semester"
      ]
    },

    {
      id: "uq-campus",
      question: "Preferred UQ campus",
      type: "select",
      required: true,
      options: [
        "St Lucia",
        "Gatton",
        "Herston"
      ]
    },

    {
      id: "uq-study-reason",
      question: "Why do you want to study at The University of Queensland?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice UQ program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Information Technology",
        "Data Science",
        "Artificial Intelligence",
        "Cybersecurity",
        "Business Management",
        "Commerce",
        "Accounting",
        "Economics",
        "Finance",
        "Medicine",
        "Nursing",
        "Pharmacy",
        "Public Health",
        "Law",
        "Architecture",
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Biomedical Engineering",
        "Psychology",
        "Education",
        "Journalism",
        "International Relations",
        "Biotechnology",
        "Environmental Science",
        "Agricultural Science",
        "Veterinary Science",
        "Mathematics",
        "Physics",
        "Chemistry"
      ]
    },

    {
      id: "uq-second-choice",
      question: "Second choice UQ program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Software Engineering",
        "Commerce",
        "Business Management",
        "Medicine",
        "Law",
        "Engineering"
      ]
    },

    {
      id: "uq-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "uq-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "uq-foundation-study",
      question: "Did you complete a foundation or pathway program?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "uq-academic-awards",
      question: "Academic awards or distinctions",
      type: "textarea",
      required: false
    }
  ],

  testing: [
    {
      id: "uq-english-test",
      question: "English language qualification",
      type: "select",
      required: true,
      options: [
        "IELTS",
        "TOEFL",
        "PTE Academic",
        "Cambridge English",
        "Duolingo English Test",
        "Not taken yet"
      ]
    },

    {
      id: "uq-english-score",
      question: "English language score",
      type: "text",
      required: false
    },

    {
      id: "uq-other-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "uq-interview-test",
      question: "Does your program require interviews or additional testing?",
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
      id: "uq-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "uq-community-service",
      question: "Community service or volunteering",
      type: "textarea",
      required: false
    },

    {
      id: "uq-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "uq-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    }
  ],

  family: [
    {
      id: "uq-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "uq-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "uq-sponsored-student",
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
      id: "uq-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "uq-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "uq-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: false
    },

    {
      id: "uq-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "uq-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "uq-reference-count",
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
      id: "uq-academic-reference",
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
      id: "uq-professional-reference",
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
      id: "uq-funding-source",
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
      id: "uq-oshc-awareness",
      question: "Do you understand Overseas Student Health Cover (OSHC) requirements?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "uq-scholarship-interest",
      question: "Interested in UQ scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};