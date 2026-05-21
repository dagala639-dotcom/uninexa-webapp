export const melbourneQuestions = {
  general: [
    {
      id: "melbourne-study-level",
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
      id: "melbourne-intake",
      question: "Preferred intake semester",
      type: "select",
      required: true,
      options: [
        "Semester 1",
        "Semester 2",
        "Summer intake"
      ]
    },

    {
      id: "melbourne-study-reason",
      question: "Why do you want to study at the University of Melbourne?",
      type: "textarea",
      required: true
    },

    {
      id: "melbourne-campus-preference",
      question: "Preferred campus or study location",
      type: "select",
      required: true,
      options: [
        "Parkville",
        "Southbank",
        "Burnley",
        "Creswick",
        "Dookie",
        "Shepparton"
      ]
    }
  ],

  academics: [
    {
      id: "melbourne-first-choice-course",
      question: "First choice Melbourne program",
      type: "select",
      required: true,
      options: [
        "Bachelor of Science",
        "Bachelor of Commerce",
        "Bachelor of Arts",
        "Bachelor of Biomedicine",
        "Bachelor of Design",
        "Bachelor of Agriculture",
        "Bachelor of Fine Arts",
        "Bachelor of Oral Health",
        "Computer Science",
        "Data Science",
        "Artificial Intelligence",
        "Software Engineering",
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Medicine",
        "Dentistry",
        "Law",
        "Architecture",
        "Economics",
        "Finance",
        "Psychology",
        "Nursing",
        "Public Health",
        "Business Analytics"
      ]
    },

    {
      id: "melbourne-second-choice-course",
      question: "Second choice Melbourne program",
      type: "select",
      required: false,
      options: [
        "None",
        "Bachelor of Science",
        "Bachelor of Commerce",
        "Bachelor of Arts",
        "Computer Science",
        "Artificial Intelligence",
        "Data Science",
        "Software Engineering",
        "Economics",
        "Finance"
      ]
    },

    {
      id: "melbourne-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "melbourne-predicted-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "melbourne-academic-achievements",
      question: "Academic achievements or awards",
      type: "textarea",
      required: false
    },

    {
      id: "melbourne-gap-study",
      question: "Any gap years or interruptions in study?",
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
      id: "melbourne-english-test",
      question: "English language qualification",
      type: "select",
      required: true,
      options: [
        "IELTS",
        "TOEFL",
        "Pearson PTE",
        "Cambridge English",
        "Duolingo English Test",
        "Not taken yet"
      ]
    },

    {
      id: "melbourne-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "melbourne-standardized-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "melbourne-foundation-program",
      question: "Did you complete a foundation or pathway program?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ],

  activities: [
    {
      id: "melbourne-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "melbourne-community-service",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "melbourne-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "melbourne-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    }
  ],

  family: [
    {
      id: "melbourne-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "melbourne-financial-support",
      question: "Will you require scholarships or financial support?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "melbourne-sponsored-student",
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
      id: "melbourne-transcript-upload",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "melbourne-passport-upload",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "melbourne-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: false
    },

    {
      id: "melbourne-cv-upload",
      question: "Upload CV or resume",
      type: "file",
      required: false
    }
  ],

  recommendations: [
    {
      id: "melbourne-reference-count",
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
      id: "melbourne-academic-reference",
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
      id: "melbourne-professional-reference",
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
      id: "melbourne-funding-source",
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
      id: "melbourne-oshc",
      question: "Do you understand Overseas Student Health Cover (OSHC) requirements?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "melbourne-scholarship-interest",
      question: "Interested in Melbourne scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};