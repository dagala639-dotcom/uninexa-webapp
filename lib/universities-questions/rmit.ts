export const rmitQuestions = {
  general: [
    {
      id: "rmit-study-level",
      question: "Level of study applying for",
      type: "select",
      required: true,
      options: [
        "Foundation studies",
        "Diploma",
        "Undergraduate",
        "Postgraduate coursework",
        "Postgraduate research"
      ]
    },

    {
      id: "rmit-intake",
      question: "Preferred intake period",
      type: "select",
      required: true,
      options: [
        "February",
        "July",
        "November"
      ]
    },

    {
      id: "rmit-campus",
      question: "Preferred RMIT campus",
      type: "select",
      required: true,
      options: [
        "Melbourne City",
        "Bundoora",
        "Brunswick",
        "Vietnam Campus"
      ]
    },

    {
      id: "rmit-study-reason",
      question: "Why do you want to study at RMIT University?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice RMIT program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Information Technology",
        "Cybersecurity",
        "Artificial Intelligence",
        "Data Science",
        "Business",
        "Commerce",
        "Accounting",
        "Finance",
        "Economics",
        "Marketing",
        "Architecture",
        "Interior Design",
        "Fashion Design",
        "Graphic Design",
        "Animation",
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Biomedical Engineering",
        "Aerospace Engineering",
        "Nursing",
        "Pharmacy",
        "Public Health",
        "Psychology",
        "Law",
        "Media and Communication",
        "Journalism",
        "Education",
        "Environmental Science",
        "Biotechnology",
        "Mathematics",
        "Physics"
      ]
    },

    {
      id: "rmit-second-choice",
      question: "Second choice RMIT program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Software Engineering",
        "Business",
        "Architecture",
        "Fashion Design",
        "Engineering"
      ]
    },

    {
      id: "rmit-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "rmit-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "rmit-pathway-study",
      question: "Did you complete a foundation or pathway program?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "rmit-portfolio-required",
      question: "Does your program require a portfolio or creative submission?",
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
      id: "rmit-english-test",
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
      id: "rmit-english-score",
      question: "English language score",
      type: "text",
      required: false
    },

    {
      id: "rmit-other-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "rmit-interview-test",
      question: "Does your course require interviews or additional testing?",
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
      id: "rmit-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "rmit-community-service",
      question: "Community service or volunteering",
      type: "textarea",
      required: false
    },

    {
      id: "rmit-work-experience",
      question: "Relevant work experience, internships, or projects",
      type: "textarea",
      required: false
    },

    {
      id: "rmit-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "rmit-creative-projects",
      question: "Creative, technical, or innovation projects completed",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "rmit-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "rmit-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "rmit-sponsored-student",
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
      id: "rmit-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "rmit-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "rmit-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: false
    },

    {
      id: "rmit-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "rmit-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    },

    {
      id: "rmit-portfolio",
      question: "Upload portfolio (if required)",
      type: "file",
      required: false
    }
  ],

  recommendations: [
    {
      id: "rmit-reference-count",
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
      id: "rmit-academic-reference",
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
      id: "rmit-professional-reference",
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
      id: "rmit-funding-source",
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
      id: "rmit-oshc-awareness",
      question: "Do you understand Overseas Student Health Cover (OSHC) requirements?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "rmit-scholarship-interest",
      question: "Interested in RMIT scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};