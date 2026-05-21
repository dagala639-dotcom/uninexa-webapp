export const elteQuestions = {
  general: [
    {
      id: "elte-study-level",
      question: "Level of study applying for",
      type: "select",
      required: true,
      options: [
        "Bachelor's degree",
        "Master's degree",
        "Doctoral degree"
      ]
    },

    {
      id: "elte-intake",
      question: "Preferred intake semester",
      type: "select",
      required: true,
      options: [
        "Autumn Semester",
        "Spring Semester"
      ]
    },

    {
      id: "elte-faculty",
      question: "Preferred faculty",
      type: "select",
      required: true,
      options: [
        "Faculty of Informatics",
        "Faculty of Science",
        "Faculty of Humanities",
        "Faculty of Education and Psychology",
        "Faculty of Social Sciences",
        "Faculty of Law"
      ]
    },

    {
      id: "elte-study-reason",
      question: "Why do you want to study at Eötvös Loránd University (ELTE)?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice ELTE program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "Psychology",
        "International Relations",
        "Political Science",
        "Economics",
        "Business Informatics",
        "English Studies",
        "Hungarian Studies",
        "Law",
        "Education",
        "Media and Communication",
        "Environmental Science",
        "Geography"
      ]
    },

    {
      id: "elte-second-choice",
      question: "Second choice ELTE program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Data Science",
        "Mathematics",
        "Psychology",
        "International Relations",
        "Economics"
      ]
    },

    {
      id: "elte-academic-results",
      question: "Final or predicted academic results",
      type: "textarea",
      required: true
    },

    {
      id: "elte-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "elte-research-projects",
      question: "Research projects or academic work completed",
      type: "textarea",
      required: false
    },

    {
      id: "elte-previous-university",
      question: "Have you attended another university before?",
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
      id: "elte-english-test",
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
      id: "elte-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "elte-hungarian-level",
      question: "Hungarian language proficiency",
      type: "select",
      required: false,
      options: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Native speaker",
        "No Hungarian"
      ]
    },

    {
      id: "elte-other-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    }
  ],

  activities: [
    {
      id: "elte-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "elte-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "elte-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "elte-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "elte-projects",
      question: "Research, coding, innovation, or academic projects",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "elte-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "elte-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "elte-sponsored",
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
      id: "elte-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "elte-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "elte-motivation-letter",
      question: "Upload motivation letter",
      type: "file",
      required: true
    },

    {
      id: "elte-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "elte-language-certificate",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "elte-reference-count",
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
      id: "elte-academic-reference",
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
      id: "elte-professional-reference",
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
      id: "elte-funding-source",
      question: "Primary source of funding",
      type: "select",
      required: true,
      options: [
        "Family support",
        "Stipendium Hungaricum",
        "Government scholarship",
        "University scholarship",
        "Personal savings",
        "Student loan"
      ]
    },

    {
      id: "elte-visa-funds",
      question: "Can you provide proof of funds for Hungarian visa processing?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Not sure"
      ]
    },

    {
      id: "elte-scholarship-interest",
      question: "Interested in ELTE or Stipendium Hungaricum scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};