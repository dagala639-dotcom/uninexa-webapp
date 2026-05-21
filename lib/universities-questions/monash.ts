export const monashQuestions = {
  general: [
    {
      id: "monash-study-level",
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
      id: "monash-intake",
      question: "Preferred intake period",
      type: "select",
      required: true,
      options: [
        "Semester 1",
        "Semester 2",
        "Summer intake"
      ]
    },

    {
      id: "monash-campus",
      question: "Preferred Monash campus",
      type: "select",
      required: true,
      options: [
        "Clayton",
        "Caulfield",
        "Peninsula",
        "Parkville",
        "Malaysia Campus",
        "Indonesia Campus"
      ]
    },

    {
      id: "monash-study-reason",
      question: "Why do you want to study at Monash University?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice Monash program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Cybersecurity",
        "Information Technology",
        "Business",
        "Commerce",
        "Accounting",
        "Finance",
        "Economics",
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
        "Media Communication",
        "International Relations",
        "Biotechnology",
        "Environmental Science",
        "Mathematics",
        "Physics",
        "Chemistry"
      ]
    },

    {
      id: "monash-second-choice",
      question: "Second choice Monash program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Software Engineering",
        "Business",
        "Commerce",
        "Medicine",
        "Law",
        "Engineering"
      ]
    },

    {
      id: "monash-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "monash-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "monash-foundation-study",
      question: "Did you complete a foundation/pathway program?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "monash-academic-achievements",
      question: "Academic achievements or awards",
      type: "textarea",
      required: false
    }
  ],

  testing: [
    {
      id: "monash-english-test",
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
      id: "monash-english-score",
      question: "English language score",
      type: "text",
      required: false
    },

    {
      id: "monash-other-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "monash-interview-test",
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
      id: "monash-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "monash-community-service",
      question: "Community service or volunteering",
      type: "textarea",
      required: false
    },

    {
      id: "monash-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "monash-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    }
  ],

  family: [
    {
      id: "monash-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "monash-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "monash-sponsored-student",
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
      id: "monash-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "monash-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "monash-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: false
    },

    {
      id: "monash-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "monash-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "monash-reference-count",
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
      id: "monash-academic-reference",
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
      id: "monash-professional-reference",
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
      id: "monash-funding-source",
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
      id: "monash-oshc-awareness",
      question: "Do you understand Overseas Student Health Cover (OSHC) requirements?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "monash-scholarship-interest",
      question: "Interested in Monash scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};