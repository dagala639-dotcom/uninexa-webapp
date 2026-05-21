import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function fallbackMatcher(body: any) {
  const program = String(body?.program || "your chosen program");
  const budget = String(body?.budget || "your budget");
  const countryPreference = String(body?.countryPreference || "multiple countries");
  const scholarshipNeed = String(body?.scholarshipNeed || "Not sure");

  return {
    fallback: true,
    summary:
      "AI quota is not active yet, so UniNexa is showing smart demo matches based on common Kenyan student pathways.",
    matches: [
      {
        university: "University of Debrecen",
        country: "Hungary",
        fitScore: 88,
        admissionChance: "High",
        why: [
          "Often more affordable than many UK, US, Canadian, and Australian options.",
          "Strong fit for students interested in medicine, health sciences, engineering, IT, and business.",
          `Useful option if your budget is around ${budget} and scholarship support is important.`,
        ],
        estimatedCost: "Approx. €7,000–€12,000 per year depending on program",
        scholarshipAdvice:
          "Check Stipendium Hungaricum and university-level scholarships. Kenyan applicants should also watch Ministry of Education nomination routes.",
        nextSteps: [
          `Confirm entry requirements for ${program}.`,
          "Prepare KCSE certificate, transcript, passport, and English language proof.",
          "Check scholarship deadlines early.",
        ],
      },
      {
        university: "Arizona State University",
        country: "United States",
        fitScore: 82,
        admissionChance: "Medium to High",
        why: [
          "Flexible international admissions pathway.",
          "Good option for technology, business, engineering, design, and data-related programs.",
          "Can work well for students who want a large university with many program choices.",
        ],
        estimatedCost: "Approx. $30,000–$45,000 per year before aid",
        scholarshipAdvice:
          scholarshipNeed === "Very high"
            ? "Apply only with a strong scholarship strategy because US costs can be high."
            : "Check merit scholarships and institutional aid options.",
        nextSteps: [
          "Confirm SAT/ACT optional policy and English proficiency requirements.",
          "Prepare academic documents and personal statement.",
          "Compare total cost against scholarship availability.",
        ],
      },
      {
        university: "University of Manchester",
        country: "United Kingdom",
        fitScore: 78,
        admissionChance: "Medium",
        why: [
          "Strong global brand and broad program range.",
          "Good for business, engineering, health sciences, humanities, and social sciences.",
          "UK applications can be structured well for Kenyan students through clear course choices.",
        ],
        estimatedCost: "Approx. £25,000–£35,000 per year depending on course",
        scholarshipAdvice:
          "Look for university-specific international scholarships, Chevening for future postgraduate study, and external awards.",
        nextSteps: [
          "Confirm exact course requirements.",
          "Prepare personal statement and reference.",
          "Check whether application is direct or through UCAS.",
        ],
      },
      {
        university: "Constructor University",
        country: "Germany",
        fitScore: 80,
        admissionChance: "Medium to High",
        why: [
          "Strong tech and STEM orientation.",
          "Good match for students interested in computer science, AI, robotics, engineering, and data.",
          `Useful alternative if preferred countries include ${countryPreference}.`,
        ],
        estimatedCost: "Approx. €20,000+ per year before aid",
        scholarshipAdvice:
          "Check institutional scholarships and tuition support. Germany can also be attractive because of strong post-study work opportunities.",
        nextSteps: [
          "Check program-specific admission requirements.",
          "Prepare academic records and English proof.",
          "Compare scholarship package before committing.",
        ],
      },
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(fallbackMatcher(body));
    }

    const prompt = `
You are UniNexa AI, an admissions advisor for Kenyan and East African students.

Match this student with suitable international universities.

Student details:
${JSON.stringify(body, null, 2)}

Return a JSON object only with this structure:
{
  "summary": "short summary",
  "matches": [
    {
      "university": "name",
      "country": "country",
      "fitScore": 85,
      "admissionChance": "High / Medium / Low",
      "why": ["reason 1", "reason 2", "reason 3"],
      "estimatedCost": "estimated yearly cost",
      "scholarshipAdvice": "short advice",
      "nextSteps": ["step 1", "step 2"]
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON admissions matching engine for Kenyan and East African students.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = completion.choices[0]?.message?.content;

    return NextResponse.json(JSON.parse(result || "{}"));
  } catch (error: any) {
    const message = String(error?.message || "");

    if (
      message.includes("quota") ||
      message.includes("429") ||
      message.includes("billing") ||
      message.includes("Incorrect API key") ||
      message.includes("401")
    ) {
      const body = await request.json().catch(() => ({}));
      return NextResponse.json(fallbackMatcher(body));
    }

    return NextResponse.json(
      { error: message || "AI matcher failed." },
      { status: 500 }
    );
  }
}