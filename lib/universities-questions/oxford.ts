export const oxfordQuestions = {
  general: [
    {
      id: "oxford-college-choice",
      question: "Preferred Oxford college",
      type: "select",
      required: true,
      options: [
        "Balliol College",
        "Brasenose College",
        "Christ Church",
        "Corpus Christi College",
        "Exeter College",
        "Hertford College",
        "Jesus College",
        "Keble College",
        "Lady Margaret Hall",
        "Lincoln College",
        "Magdalen College",
        "Merton College",
        "New College",
        "Oriel College",
        "Pembroke College",
        "Queen's College",
        "Somerville College",
        "St Anne's College",
        "St Catherine's College",
        "St Edmund Hall",
        "St Hilda's College",
        "St Hugh's College",
        "St John's College",
        "Trinity College",
        "University College",
        "Wadham College",
        "Worcester College",
        "Open Application"
      ]
    },

    {
      id: "oxford-course-type",
      question: "Course level applying for",
      type: "select",
      required: true,
      options: [
        "Undergraduate",
        "Graduate taught",
        "Graduate research"
      ]
    },

    {
      id: "oxford-why-course",
      question: "Why are you interested in this course at Oxford?",
      type: "textarea",
      required: true
    },

    {
      id: "oxford-supercurriculars",
      question: "Books, lectures, research, or academic activities related to your subject",
      type: "textarea",
      required: true
    }
  ],

  academics: [
    {
      id: "oxford-first-choice-course",
      question: "First choice Oxford course",
      type: "select",
      required: true,
      options: [
        "Computer Science",
        "Computer Science and Philosophy",
        "Mathematics",
        "Mathematics and Computer Science",
        "Engineering Science",
        "Medicine",
        "Law",
        "Economics and Management",
        "PPE",
        "History",
        "History and Politics",
        "Physics",
        "Chemistry",
        "Biochemistry",
        "Biomedical Sciences",
        "Experimental Psychology",
        "English Language and Literature",
        "Philosophy and Theology",
        "Modern Languages",
        "Geography",
        "Architecture",
        "Fine Art",
        "Music",
        "Earth Sciences",
        "Materials Science"
      ]
    },

    {
      id: "oxford-second-choice-course",
      question: "Second choice course (if applicable)",
      type: "select",
      required: false,
      options: [
        "None",
        "Computer Science",
        "Mathematics",
        "Engineering Science",
        "Law",
        "Economics and Management",
        "PPE",
        "Physics",
        "Chemistry",
        "Biomedical Sciences"
      ]
    },

    {
      id: "oxford-predicted-grades",
      question: "Predicted or achieved final grades",
      type: "textarea",
      required: true
    },

    {
      id: "oxford-subject-strength",
      question: "Strongest academic subjects",
      type: "textarea",
      required: true
    },

    {
      id: "oxford-research-experience",
      question: "Research projects or independent academic work",
      type: "textarea",
      required: false
    },

    {
      id: "oxford-written-work",
      question: "Will your course require written work submission?",
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
      id: "oxford-admissions-test",
      question: "Admissions test required for your course",
      type: "select",
      required: true,
      options: [
        "None",
        "LNAT",
        "UCAT",
        "MAT",
        "TMUA",
        "ESAT",
        "TARA",
        "PAT",
        "CAT",
        "MLAT",
        "History Aptitude Test",
        "Not sure"
      ]
    },

    {
      id: "oxford-english-test",
      question: "English language qualification",
      type: "select",
      required: true,
      options: [
        "IELTS",
        "TOEFL",
        "Cambridge C1 Advanced",
        "Duolingo English Test",
        "Native English speaker",
        "Not taken yet"
      ]
    },

    {
      id: "oxford-english-score",
      question: "English test score",
      type: "text",
      required: false
    },

    {
      id: "oxford-interview-preparation",
      question: "Have you prepared for Oxford interviews?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Currently preparing"
      ]
    }
  ],

  activities: [
    {
      id: "oxford-academic-competitions",
      question: "Academic competitions or olympiads",
      type: "textarea",
      required: false
    },

    {
      id: "oxford-leadership",
      question: "Leadership positions held",
      type: "textarea",
      required: false
    },

    {
      id: "oxford-community",
      question: "Community service or volunteering",
      type: "textarea",
      required: false
    },

    {
      id: "oxford-subject-activities",
      question: "Subject-related extracurricular activities",
      type: "textarea",
      required: true
    }
  ],

  family: [
    {
      id: "oxford-first-generation",
      question: "Are you a first-generation university student?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "oxford-financial-support",
      question: "Will you require financial aid or scholarship support?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "oxford-guardian-education",
      question: "Highest parent/guardian education level",
      type: "select",
      required: false,
      options: [
        "Primary",
        "Secondary",
        "Diploma",
        "Bachelor's degree",
        "Master's degree",
        "Doctorate"
      ]
    }
  ],

  documents: [
    {
      id: "oxford-personal-statement",
      question: "Upload personal statement",
      type: "file",
      required: true
    },

    {
      id: "oxford-written-work-upload",
      question: "Upload written work (if required)",
      type: "file",
      required: false
    },

    {
      id: "oxford-transcript-upload",
      question: "Upload academic transcript",
      type: "file",
      required: true
    },

    {
      id: "oxford-cv-upload",
      question: "Upload CV or resume",
      type: "file",
      required: false
    }
  ],

  recommendations: [
    {
      id: "oxford-reference-count",
      question: "Number of academic references available",
      type: "select",
      required: true,
      options: [
        "1",
        "2",
        "3+"
      ]
    },

    {
      id: "oxford-teacher-reference",
      question: "Teacher or counselor reference submitted?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No",
        "Pending"
      ]
    },

    {
      id: "oxford-reference-strength",
      question: "How well do your referees know your academic ability?",
      type: "select",
      required: true,
      options: [
        "Extremely well",
        "Moderately well",
        "Slightly"
      ]
    }
  ],

  billing: [
    {
      id: "oxford-funding-source",
      question: "Primary funding source",
      type: "select",
      required: true,
      options: [
        "Family support",
        "Government scholarship",
        "University scholarship",
        "External sponsorship",
        "Personal savings",
        "Student loan"
      ]
    },

    {
      id: "oxford-college-fees-awareness",
      question: "Do you understand Oxford international tuition and college fees?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    },

    {
      id: "oxford-scholarship-interest",
      question: "Interested in Oxford scholarships or bursaries?",
      type: "select",
      required: true,
      options: [
        "Yes",
        "No"
      ]
    }
  ]
};