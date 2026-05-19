import { createClient } from "@/lib/supabase/server";
import { getUniversityQuestions } from "./university-questions";

const requiredSections = [
  "general",
  "academics",
  "testing",
  "activities",
  "family",
  "documents",
  "recommendations",
  "billing",
];

export async function updateApplicationProgress(
  applicationId: string,
  userId: string
) {
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .eq("user_id", userId)
    .single();

  if (!application) return 0;

  const { data: forms } = await supabase
    .from("application_forms")
    .select("section, answers")
    .eq("application_id", applicationId)
    .eq("user_id", userId);

  const universitySections = getUniversityQuestions(
    application.university_name
  );

  function sectionComplete(section: string) {
    const form = forms?.find((item) => item.section === section);
    if (!form?.answers) return false;

    const answers = form.answers as Record<string, string>;

    const sectionQuestions =
      universitySections[section as keyof typeof universitySections] || [];

    const requiredQuestions = sectionQuestions.filter((q) => q.required);

    if (requiredQuestions.length === 0) {
      return Object.values(answers).some(
        (value) => value && String(value).trim().length > 0
      );
    }

    return requiredQuestions.every((question) => {
      const value = answers[question.id];
      return value && String(value).trim().length > 0;
    });
  }

  const completedSections = requiredSections.filter(sectionComplete).length;

  const progress = Math.round(
    (completedSections / requiredSections.length) * 100
  );

  await supabase
    .from("applications")
    .update({
      progress,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .eq("user_id", userId);

  return progress;
}