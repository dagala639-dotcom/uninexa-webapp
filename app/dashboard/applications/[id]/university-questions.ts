export type QuestionType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "file";

export type UniversityQuestion = {
  id: string;
  label: string;
  type: QuestionType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export type UniversityQuestionSections = {
  general: UniversityQuestion[];
  academics: UniversityQuestion[];
  testing: UniversityQuestion[];
  activities: UniversityQuestion[];
  family: UniversityQuestion[];
  documents: UniversityQuestion[];
  recommendations: UniversityQuestion[];
  scholarships: UniversityQuestion[];
};

export const defaultQuestions: UniversityQuestionSections = {
  general: [
    {
      id: "student_status",
      label: "Student status",
      type: "select",
      required: true,
      options: ["First-year applicant", "Transfer applicant", "International applicant"],
    },
    {
      id: "preferred_start_term",
      label: "Preferred start term",
      type: "select",
      required: true,
      options: ["Fall 2026", "Spring 2027", "Summer 2027", "Fall 2027"],
    },
    {
      id: "need_based_aid",
      label: "Do you intend to pursue need-based financial aid?",
      type: "radio",
      required: true,
      options: ["Yes", "No"],
    },
  ],
  academics: [
    {
      id: "first_choice_program",
      label: "First choice academic program",
      type: "text",
      required: true,
    },
    {
      id: "second_choice_program",
      label: "Second choice academic program",
      type: "text",
    },
    {
      id: "kcse_mean_grade",
      label: "KCSE mean grade",
      type: "text",
      required: true,
    },
  ],
  testing: [
    {
      id: "english_test",
      label: "English proficiency exam",
      type: "select",
      required: true,
      options: ["IELTS", "TOEFL iBT", "Duolingo English Test", "PTE Academic", "Not taken yet"],
    },
    {
      id: "english_score",
      label: "English test score",
      type: "text",
    },
  ],
  activities: [
    {
      id: "activity_summary",
      label: "Briefly describe your main extracurricular activity",
      type: "textarea",
    },
  ],
  family: [
    {
      id: "siblings_applying",
      label: "Are any siblings also applying for undergraduate admission this year?",
      type: "radio",
      options: ["Yes", "No"],
    },
  ],
  documents: [
    {
      id: "academic_transcript",
      label: "Academic transcript",
      type: "file",
      required: true,
    },
    {
      id: "kcse_certificate",
      label: "KCSE certificate/result slip",
      type: "file",
      required: true,
    },
    {
      id: "passport",
      label: "Passport or national ID",
      type: "file",
      required: true,
    },
  ],
  recommendations: [
    {
      id: "recommender_name",
      label: "Recommender full name",
      type: "text",
      required: true,
    },
    {
      id: "recommender_email",
      label: "Recommender email",
      type: "text",
      required: true,
    },
    {
      id: "recommender_relationship",
      label: "Relationship to recommender",
      type: "select",
      required: true,
      options: ["Teacher", "Counsellor", "Principal", "Employer", "Mentor", "Other"],
    },
    {
      id: "recommender_permission",
      label: "The recommender has agreed to be contacted",
      type: "checkbox",
      required: true,
    },
  ],
  scholarships: [
    {
      id: "scholarship_interest",
      label: "Are you interested in scholarships or financial aid?",
      type: "radio",
      required: true,
      options: ["Yes", "No"],
    },
  ],
};

export const universityQuestions: Record<string, UniversityQuestionSections> = {
  "Arizona State University": {
    ...defaultQuestions,
    general: [
      {
        id: "student_status",
        label: "Student status",
        type: "select",
        required: true,
        options: ["First-year international student", "Transfer international student"],
      },
      {
        id: "preferred_start_term",
        label: "Preferred start term",
        type: "select",
        required: true,
        options: ["Fall 2026", "Spring 2027", "Summer 2027", "Fall 2027"],
      },
      {
        id: "campus_preference",
        label: "Preferred ASU campus or location",
        type: "select",
        required: true,
        options: ["Tempe", "Downtown Phoenix", "Polytechnic", "West Valley", "Online", "Not sure"],
      },
      {
        id: "housing_plan",
        label: "Preferred residence during your first year",
        type: "select",
        required: true,
        options: ["On-campus housing", "Off-campus housing", "Not decided"],
      },
    ],
    academics: [
      {
        id: "first_choice_program",
        label: "First choice ASU major/program",
        type: "text",
        required: true,
      },
      {
        id: "second_choice_program",
        label: "Second choice ASU major/program",
        type: "text",
      },
      {
        id: "high_school_completion",
        label: "Have you completed or will you complete high school before enrollment?",
        type: "radio",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "kcse_mean_grade",
        label: "KCSE mean grade",
        type: "text",
        required: true,
      },
    ],
    testing: [
      {
        id: "english_test",
        label: "English proficiency method",
        type: "select",
        required: true,
        options: ["TOEFL iBT", "IELTS", "Duolingo English Test", "PTE Academic", "Other", "Not taken yet"],
      },
      {
        id: "english_score",
        label: "English proficiency score",
        type: "text",
      },
      {
        id: "sat_act_plan",
        label: "Do you plan to submit SAT/ACT scores?",
        type: "radio",
        required: true,
        options: ["Yes", "No", "Not sure"],
      },
    ],
  },

  "University of Manchester": {
    ...defaultQuestions,
    general: [
      {
        id: "application_route",
        label: "Application route",
        type: "select",
        required: true,
        options: ["UCAS", "Direct application", "Not sure"],
      },
      {
        id: "preferred_start_term",
        label: "Preferred start date",
        type: "select",
        required: true,
        options: ["September 2026", "January 2027", "September 2027"],
      },
      {
        id: "fee_status",
        label: "Expected fee status",
        type: "select",
        required: true,
        options: ["International", "Home/UK", "Not sure"],
      },
    ],
    academics: [
      {
        id: "course_choice",
        label: "Chosen University of Manchester course",
        type: "text",
        required: true,
      },
      {
        id: "second_course_choice",
        label: "Second course choice",
        type: "text",
      },
      {
        id: "kcse_mean_grade",
        label: "KCSE mean grade",
        type: "text",
        required: true,
      },
      {
        id: "relevant_subjects",
        label: "Relevant KCSE subjects for your chosen course",
        type: "textarea",
        required: true,
      },
    ],
    documents: [
      {
        id: "academic_transcript",
        label: "Academic transcript",
        type: "file",
        required: true,
      },
      {
        id: "personal_statement",
        label: "Personal statement",
        type: "file",
        required: true,
      },
      {
        id: "reference_letter",
        label: "Reference letter",
        type: "file",
        required: true,
      },
      {
        id: "english_language_proof",
        label: "English language proof",
        type: "file",
        required: true,
      },
      {
        id: "passport",
        label: "Passport or national ID",
        type: "file",
        required: true,
      },
    ],
  },

  "University of Toronto": {
    ...defaultQuestions,
    general: [
      {
        id: "application_route",
        label: "Application route",
        type: "select",
        required: true,
        options: ["OUAC", "Join U of T applicant portal", "Not sure"],
      },
      {
        id: "preferred_campus",
        label: "Preferred campus",
        type: "select",
        required: true,
        options: ["St. George", "Scarborough", "Mississauga", "Not sure"],
      },
      {
        id: "preferred_start_term",
        label: "Preferred start term",
        type: "select",
        required: true,
        options: ["Fall 2026", "Fall 2027"],
      },
    ],
    academics: [
      {
        id: "first_choice_program",
        label: "First choice U of T program",
        type: "text",
        required: true,
      },
      {
        id: "second_choice_program",
        label: "Second choice U of T program",
        type: "text",
      },
      {
        id: "senior_english",
        label: "Have you completed senior-level English or equivalent?",
        type: "radio",
        required: true,
        options: ["Yes", "No", "In progress"],
      },
      {
        id: "program_prerequisites",
        label: "Relevant prerequisite subjects for your program",
        type: "textarea",
        required: true,
      },
    ],
    documents: [
      {
        id: "academic_transcript",
        label: "Academic transcript",
        type: "file",
        required: true,
      },
      {
        id: "kcse_certificate",
        label: "KCSE certificate/result slip",
        type: "file",
        required: true,
      },
      {
        id: "english_proof",
        label: "English language proof if required",
        type: "file",
      },
      {
        id: "supplementary_application",
        label: "Supplementary application if required by program",
        type: "file",
      },
    ],
  },

  "University of Melbourne": {
    ...defaultQuestions,
    general: [
      {
        id: "application_route",
        label: "Application route",
        type: "select",
        required: true,
        options: ["Direct international application", "Authorized representative", "Not sure"],
      },
      {
        id: "preferred_intake",
        label: "Preferred intake",
        type: "select",
        required: true,
        options: ["Semester 1 February/March", "Semester 2 July", "Not sure"],
      },
      {
        id: "under_18",
        label: "Will you be under 18 when you start?",
        type: "radio",
        required: true,
        options: ["Yes", "No"],
      },
    ],
    academics: [
      {
        id: "first_choice_course",
        label: "First choice University of Melbourne course",
        type: "text",
        required: true,
      },
      {
        id: "second_choice_course",
        label: "Second choice course",
        type: "text",
      },
      {
        id: "kcse_mean_grade",
        label: "KCSE mean grade",
        type: "text",
        required: true,
      },
      {
        id: "course_prerequisites",
        label: "Relevant course prerequisites completed",
        type: "textarea",
        required: true,
      },
    ],
    testing: [
      {
        id: "english_test",
        label: "English language test",
        type: "select",
        required: true,
        options: ["IELTS", "TOEFL iBT", "PTE Academic", "Cambridge English", "Not taken yet"],
      },
      {
        id: "english_score",
        label: "English language score",
        type: "text",
      },
    ],
    documents: [
      {
        id: "academic_transcript",
        label: "Academic transcript",
        type: "file",
        required: true,
      },
      {
        id: "kcse_certificate",
        label: "KCSE certificate/result slip",
        type: "file",
        required: true,
      },
      {
        id: "passport",
        label: "Passport",
        type: "file",
        required: true,
      },
      {
        id: "english_test_result",
        label: "English test result",
        type: "file",
        required: true,
      },
      {
        id: "financial_documents",
        label: "Financial documents",
        type: "file",
      },
    ],
  },
};

export function getUniversityQuestions(universityName?: string) {
  if (!universityName) return defaultQuestions;

  return universityQuestions[universityName] || defaultQuestions;
}