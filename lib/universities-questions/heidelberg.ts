export const heidelbergQuestions = {
  general: [
    {
      id: "heidelberg-study-level",
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
      id: "heidelberg-intake",
      question: "Preferred intake semester",
      type: "select",
      required: true,
      options: [
        "Winter Semester",
        "Summer Semester"
      ]
    },

    {
      id: "heidelberg-faculty",
      question: "Preferred faculty",
      type: "select",
      required: true,
      options: [
        "Faculty of Mathematics and Computer Science",
        "Faculty of Engineering",
        "Faculty of Medicine",
        "Faculty of Biosciences",
        "Faculty of Chemistry and Earth Sciences",
        "Faculty of Physics and Astronomy",
        "Faculty of Economics and Social Sciences",
        "Faculty of Law",
        "Faculty of Modern Languages",
        "Faculty of Philosophy"
      ]
    },

    {
      id: "heidelberg-study-reason",
      question: "Why do you want to study at Heidelberg University?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice Heidelberg program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Data and Computer Science",
        "Artificial Intelligence",
        "Software Systems Engineering",
        "Mathematics",
        "Physics",
        "Astronomy",
        "Chemistry",
        "Biochemistry",
        "Biology",
        "Biomedical Engineering",
        "Medicine",
        "Molecular Biotechnology",
        "Psychology",
        "Economics",
        "Political Science",
        "Sociology",
        "Law",
        "Philosophy",
        "German Studies",
        "English Studies",
        "International Health",
        "Public Health",
        "Environmental Physics",
        "Geosciences"
      ]
    },

    {
      id: "heidelberg-second-choice",
      question: "Second choice Heidelberg program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Artificial Intelligence",
        "Mathematics",
        "Physics",
        "Economics",
        "Medicine",
        "Psychology"
      ]
    },

    {
      id: "heidelberg-academic-results",
      question: "Final or predicted academic results",
      type: "textarea",
      required: true
    },

    {
      id: "heidelberg-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "heidelberg-research",
      question: "Research experience or academic projects",
      type: "textarea",
      required: false
    },

    {
      id: "heidelberg-previous-university",
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
      id: "heidelberg-english-test",
      question: "English language qualification",
      type: "select",
      required: false,
      options: [
        "IELTS",
        "TOEFL",
        "Cambridge English",
        "Duolingo English Test",
        "Native English speaker",
        "Not taken yet"
      ]
    },

    {
      id: "heidelberg-german-level",
      question: "German language proficiency level",
      type: "select",
      required: true,
      options: [
        "A1",
        "A2",
        "B1",
        "B2",
        "C1",
        "C2",
        "No German"
      ]
    },

    {
      id: "heidelberg-german-certificate",
      question: "German language certificate",
      type: "select",
      required: false,
      options: [
        "TestDaF",
        "DSH",
        "Goethe-Zertifikat",
        "telc Deutsch",
        "None"
      ]
    },

    {
      id: "heidelberg-other-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    }
  ],

  activities: [
    {
      id: "heidelberg-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "heidelberg-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "heidelberg-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "heidelberg-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "heidelberg-projects",
      question: "Research, coding, innovation, or academic projects",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "heidelberg-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "heidelberg-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "heidelberg-sponsored",
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
      id: "heidelberg-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "heidelberg-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "heidelberg-motivation-letter",
      question: "Upload motivation letter",
      type: "file",
      required: true
    },

    {
      id: "heidelberg-cv",
      question: "Upload CV or resume",
      type: "file",
      required: true
    },

    {
      id: "heidelberg-language-certificate",
      question: "Upload English/German language certificate",
      type: "file",
      required: false
    }
  ],

  recommendations: [
    {
      id: "heidelberg-reference-count",
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
      id: "heidelberg-academic-reference",
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
      id: "heidelberg-professional-reference",
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
      id: "heidelberg-funding-source",
      question: "Primary source of funding",
      type: "select",
      required: true,
      options: [
        "Family support",
        "DAAD scholarship",
        "Government scholarship",
        "University scholarship",
        "Personal savings",
        "Student loan"
      ]
    },

    {
      id: "heidelberg-blocked-account",
      question: "Will you use a German blocked account for visa purposes?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Not sure"
      ]
    },

    {
      id: "heidelberg-scholarship-interest",
      question: "Interested in Heidelberg scholarships or DAAD funding?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};