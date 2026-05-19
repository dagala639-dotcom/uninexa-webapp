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

type SavedForm = {
  section: string;
  answers: Record<string, string> | null;
};

export async function updateApplicationProgress(
  applicationId: string,
  userId: string
) {
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("applications")
    .select("id, university_name")
    .eq("id", applicationId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!application) return 0;

  const { data: forms } = await supabase
    .from("application_forms")
    .select("section, answers")
    .eq("application_id", applicationId)
    .eq("user_id", userId);

  const savedForms = (forms || []) as SavedForm[];

  const universitySections = getUniversityQuestions(
    application.university_name
  );

  function hasAnyAnswer(answers: Record<string, string>) {
    return Object.values(answers).some(
      (value) => value && String(value).trim().length > 0
    );
  }

  function sectionComplete(section: string) {
    const form = savedForms.find((item) => item.section === section);

    if (!form?.answers) return false;

    const answers = form.answers;

    const sectionQuestions =
      universitySections[
        section as keyof typeof universitySections
      ] || [];

    const requiredQuestions = sectionQuestions.filter(
      (question: { required?: boolean }) => question.required
    );

    if (requiredQuestions.length === 0) {
      return hasAnyAnswer(answers);
    }

    return requiredQuestions.every((question: { id: string }) => {
      const value = answers[question.id];
      return value && String(value).trim().length > 0;
    });
  }

  const completedSections =
    requiredSections.filter(sectionComplete).length;

  const progress = Math.round(
    (completedSections / requiredSections.length) * 100
  );

  const { error } = await supabase
    .from("applications")
    .update({
      progress,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return progress;
}