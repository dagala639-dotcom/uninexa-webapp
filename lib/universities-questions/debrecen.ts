export const debrecenQuestions = {
  general: [
    {
      id: "debrecen-study-level",
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
      id: "debrecen-intake",
      question: "Preferred intake semester",
      type: "select",
      required: true,
      options: [
        "September Intake",
        "February Intake"
      ]
    },

    {
      id: "debrecen-study-reason",
      question: "Why do you want to study at the University of Debrecen?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice University of Debrecen program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Business Administration",
        "Finance and Accounting",
        "International Business Economics",
        "Medicine",
        "Dentistry",
        "Pharmacy",
        "Public Health",
        "Nursing",
        "Psychology",
        "Biology",
        "Biochemistry",
        "Physics",
        "Mathematics",
        "Chemistry",
        "Environmental Science",
        "Agricultural Engineering",
        "Food Engineering",
        "English Studies",
        "International Relations"
      ]
    },

    {
      id: "debrecen-second-choice",
      question: "Second choice Debrecen program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Engineering",
        "Business",
        "Medicine",
        "Psychology",
        "Biology"
      ]
    },

    {
      id: "debrecen-academic-results",
      question: "Final or predicted academic results",
      type: "textarea",
      required: true
    },

    {
      id: "debrecen-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    }
  ],

  testing: [
    {
      id: "debrecen-english-test",
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
      id: "debrecen-english-score",
      question: "English language test score",
      type: "text",
      required: false
    }
  ],

  activities: [
    {
      id: "debrecen-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "debrecen-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "debrecen-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    }
  ],

  family: [
    {
      id: "debrecen-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "debrecen-sponsored",
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
      id: "debrecen-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "debrecen-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "debrecen-motivation-letter",
      question: "Upload motivation letter",
      type: "file",
      required: true
    },

    {
      id: "debrecen-language-certificate",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "debrecen-reference-count",
      question: "Number of recommendation letters available",
      type: "select",
      required: true,
      options: [
        "1",
        "2",
        "3+"
      ]
    }
  ],

  billing: [
    {
      id: "debrecen-funding-source",
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
      id: "debrecen-scholarship-interest",
      question: "Interested in University of Debrecen scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};