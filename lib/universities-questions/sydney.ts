export const sydneyQuestions = {
  general: [
    {
      id: "sydney-study-level",
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
      id: "sydney-intake",
      question: "Preferred intake semester",
      type: "select",
      required: true,
      options: [
        "Semester 1",
        "Semester 2",
        "Summer School"
      ]
    },

    {
      id: "sydney-reason",
      question: "Why do you want to study at the University of Sydney?",
      type: "textarea",
      required: true
    },

    {
      id: "sydney-campus",
      question: "Preferred campus",
      type: "select",
      required: true,
      options: [
        "Camperdown/Darlington",
        "Sydney Conservatorium of Music",
        "Camden",
        "Westmead",
        "Surry Hills"
      ]
    }
  ],

  academics: [
    {
      id: "program",
      question: "First choice University of Sydney course",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Advanced Computing",
        "Software Engineering",
        "Data Science",
        "Artificial Intelligence",
        "Cybersecurity",
        "Medicine",
        "Nursing",
        "Pharmacy",
        "Dentistry",
        "Law",
        "Commerce",
        "Economics",
        "Finance",
        "Architecture and Design",
        "Civil Engineering",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Mechatronic Engineering",
        "Biomedical Engineering",
        "Psychology",
        "Political Economy",
        "International Relations",
        "Media and Communications",
        "Education",
        "Public Health",
        "Business Analytics",
        "Agriculture",
        "Veterinary Biology",
        "Physics",
        "Mathematics",
        "Chemistry"
      ]
    },

    {
      id: "sydney-second-choice",
      question: "Second choice course",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Software Engineering",
        "Commerce",
        "Economics",
        "Data Science",
        "Law",
        "Medicine"
      ]
    },

    {
      id: "sydney-academic-results",
      question: "Predicted or achieved academic results",
      type: "textarea",
      required: true
    },

    {
      id: "sydney-prerequisite-subjects",
      question: "Relevant prerequisite subjects completed",
      type: "textarea",
      required: true
    },

    {
      id: "sydney-foundation",
      question: "Did you complete a foundation or pathway program?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "sydney-academic-awards",
      question: "Academic awards or distinctions",
      type: "textarea",
      required: false
    }
  ],

  testing: [
    {
      id: "sydney-english-test",
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
      id: "sydney-english-score",
      question: "English language score",
      type: "text",
      required: false
    },

    {
      id: "sydney-other-tests",
      question: "Other standardized tests completed",
      type: "textarea",
      required: false
    },

    {
      id: "sydney-program-test",
      question: "Does your program require additional testing/interview?",
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
      id: "sydney-leadership",
      question: "Leadership roles and responsibilities",
      type: "textarea",
      required: false
    },

    {
      id: "sydney-community-service",
      question: "Community service or volunteering",
      type: "textarea",
      required: false
    },

    {
      id: "sydney-work-experience",
      question: "Relevant internships or work experience",
      type: "textarea",
      required: false
    },

    {
      id: "sydney-extracurriculars",
      question: "Extracurricular activities and achievements",
      type: "textarea",
      required: true
    }
  ],

  family: [
    {
      id: "sydney-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "sydney-financial-support",
      question: "Will you require scholarships or financial aid?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "sydney-sponsored",
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
      id: "sydney-transcript",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "sydney-passport",
      question: "Upload passport copy",
      type: "file",
      required: true
    },

    {
      id: "sydney-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: false
    },

    {
      id: "sydney-cv",
      question: "Upload CV or resume",
      type: "file",
      required: false
    },

    {
      id: "sydney-english-proof",
      question: "Upload English language certificate",
      type: "file",
      required: true
    }
  ],

  recommendations: [
    {
      id: "sydney-reference-count",
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
      id: "sydney-academic-reference",
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
      id: "sydney-professional-reference",
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
      id: "sydney-funding-source",
      question: "Primary source of funding",
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
      id: "sydney-oshc-awareness",
      question: "Do you understand Overseas Student Health Cover (OSHC) requirements?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "sydney-scholarship-interest",
      question: "Interested in University of Sydney scholarships?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};