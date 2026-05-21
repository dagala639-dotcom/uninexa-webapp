export const queensBelfastQuestions = {
  general: [
    {
      id: "qub-study-level",
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
      id: "qub-intake",
      question: "Preferred intake",
      type: "select",
      required: true,
      options: [
        "September",
        "January"
      ]
    },

    {
      id: "qub-faculty",
      question: "Preferred faculty",
      type: "select",
      required: true,
      options: [
        "Faculty of Engineering and Physical Sciences",
        "Faculty of Medicine, Health and Life Sciences",
        "Faculty of Arts, Humanities and Social Sciences"
      ]
    },

    {
      id: "qub-study-reason",
      question: "Why do you want to study at Queen's University Belfast?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice Queen's Belfast program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Software Engineering",
        "Artificial Intelligence",
        "Cybersecurity",
        "Data Analytics",
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
        "Nursing",
        "Pharmacy",
        "Psychology",
        "Politics and International Studies",
        "Architecture",
        "Biology",
        "Biochemistry",
        "Physics",
        "Mathematics",
        "Environmental Science",
        "Education",
        "Film Studies",
        "Media and Broadcast Production"
      ]
    },

    {
      id: "qub-second-choice",
      question: "Second choice Queen's Belfast program",
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
      id: "qub-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "qub-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "qub-academic-achievements",
      question: "Academic awards or distinctions",
      type: "textarea",
      required: false
    },

    {
      id: "qub-foundation-program",
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
      id: "qub-english-test",
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
      id: "qub-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "qub-admissions-test",
      question: "Admissions tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "qub-interview",
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
      id: "qub-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "qub-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "qub-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "qub-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "qub-projects",
      question: "Research, innovation, coding, or academic projects",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "qub-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "qub-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "qub-sponsored",
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
      id: "qub-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "qub-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "qub-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: true
    },

    {
      id: "qub-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "qub-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "qub-reference-count",
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
      id: "qub-academic-reference",
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
      id: "qub-professional-reference",
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
      id: "qub-funding-source",
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
      id: "qub-fee-awareness",
      question: "Do you understand Queen's Belfast tuition and living costs?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "qub-scholarship-interest",
      question: "Interested in Queen's Belfast scholarships or bursaries?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};