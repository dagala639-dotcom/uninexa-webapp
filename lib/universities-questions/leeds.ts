export const leedsQuestions = {
  general: [
    {
      id: "leeds-study-level",
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
      id: "leeds-intake",
      question: "Preferred intake",
      type: "select",
      required: true,
      options: [
        "September",
        "January"
      ]
    },

    {
      id: "leeds-faculty",
      question: "Preferred faculty",
      type: "select",
      required: true,
      options: [
        "Faculty of Engineering and Physical Sciences",
        "Faculty of Biological Sciences",
        "Faculty of Medicine and Health",
        "Faculty of Business",
        "Faculty of Arts, Humanities and Cultures",
        "Faculty of Social Sciences"
      ]
    },

    {
      id: "leeds-study-reason",
      question: "Why do you want to study at the University of Leeds?",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice Leeds program",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Artificial Intelligence",
        "Data Science",
        "Cybersecurity",
        "Software Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Civil Engineering",
        "Chemical Engineering",
        "Aerospace Engineering",
        "Biomedical Engineering",
        "Business Management",
        "Accounting and Finance",
        "Economics",
        "International Business",
        "Marketing",
        "Law",
        "Medicine",
        "Nursing",
        "Pharmacy",
        "Psychology",
        "Politics",
        "International Relations",
        "Architecture",
        "Biology",
        "Biochemistry",
        "Physics",
        "Mathematics",
        "Statistics",
        "Environmental Science",
        "Education",
        "Media and Communication",
        "Fashion Design",
        "Music"
      ]
    },

    {
      id: "leeds-second-choice",
      question: "Second choice Leeds program",
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
      id: "leeds-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "leeds-prerequisites",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "leeds-academic-achievements",
      question: "Academic awards or distinctions",
      type: "textarea",
      required: false
    },

    {
      id: "leeds-foundation-program",
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
      id: "leeds-english-test",
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
      id: "leeds-english-score",
      question: "English language test score",
      type: "text",
      required: false
    },

    {
      id: "leeds-admissions-test",
      question: "Admissions tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "leeds-interview",
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
      id: "leeds-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "leeds-volunteering",
      question: "Community service or volunteering experience",
      type: "textarea",
      required: false
    },

    {
      id: "leeds-work-experience",
      question: "Relevant work experience or internships",
      type: "textarea",
      required: false
    },

    {
      id: "leeds-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    },

    {
      id: "leeds-projects",
      question: "Research, coding, innovation, or academic projects",
      type: "textarea",
      required: false
    }
  ],

  family: [
    {
      id: "leeds-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "leeds-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "leeds-sponsored",
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
      id: "leeds-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "leeds-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "leeds-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: true
    },

    {
      id: "leeds-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "leeds-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "leeds-reference-count",
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
      id: "leeds-academic-reference",
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
      id: "leeds-professional-reference",
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
      id: "leeds-funding-source",
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
      id: "leeds-fee-awareness",
      question: "Do you understand Leeds tuition and living costs?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "leeds-scholarship-interest",
      question: "Interested in Leeds scholarships or bursaries?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};