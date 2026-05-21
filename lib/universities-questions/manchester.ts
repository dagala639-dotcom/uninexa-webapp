export const manchesterQuestions = {
  general: [
    {
      id: "manchester-study-level",
      question: "Level of study applying for",
      type: "select",
      required: true,
      options: [
        "Undergraduate",
        "Postgraduate taught",
        "Postgraduate research"
      ]
    },

    {
      id: "manchester-intake",
      question: "Preferred intake",
      type: "select",
      required: true,
      options: [
        "September",
        "January"
      ]
    },

    {
      id: "manchester-faculty",
      question: "Preferred faculty",
      type: "select",
      required: true,
      options: [
        "Faculty of Science and Engineering",
        "Faculty of Humanities",
        "Faculty of Biology, Medicine and Health"
      ]
    },

    {
      id: "manchester-study-reason",
      question: "Why do you want to study at The University of Manchester?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice Manchester program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Artificial Intelligence",
        "Data Science",
        "Cybersecurity",
        "Information Technology Management",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Biomedical Engineering",
        "Business Management",
        "Accounting",
        "Finance",
        "Economics",
        "International Business",
        "Law",
        "Medicine",
        "Dentistry",
        "Pharmacy",
        "Nursing",
        "Public Health",
        "Psychology",
        "Politics and International Relations",
        "Architecture",
        "Biochemistry",
        "Biology",
        "Physics",
        "Mathematics",
        "Statistics",
        "Environmental Science",
        "Education",
        "Fashion Business",
        "Media and Communications"
      ]
    },

    {
      id: "manchester-second-choice",
      question: "Second choice Manchester program",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Engineering",
        "Business",
        "Economics",
        "Law",
        "Medicine",
        "Psychology"
      ]
    },

    {
      id: "manchester-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "manchester-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "manchester-academic-achievements",
      question: "Academic awards or distinctions",
      type: "textarea",
      required: false
    },

    {
      id: "manchester-foundation-program",
      question: "Did you complete a foundation or pathway program?",
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
      id: "manchester-english-test",
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
      id: "manchester-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "manchester-admissions-test",
      question: "Admissions tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "manchester-interview",
      question: "Does your course require an interview or assessment?",
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
      id: "manchester-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "manchester-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "manchester-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "manchester-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "manchester-projects",
      question: "Research, innovation, coding, or academic projects",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "manchester-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "manchester-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "manchester-sponsored",
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
      id: "manchester-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "manchester-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "manchester-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: true
    },

    {
      id: "manchester-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "manchester-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "manchester-reference-count",
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
      id: "manchester-academic-reference",
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
      id: "manchester-professional-reference",
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
      id: "manchester-funding-source",
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
      id: "manchester-fee-awareness",
      question: "Do you understand Manchester tuition and living costs?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "manchester-scholarship-interest",
      question: "Interested in Manchester scholarships or bursaries?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};