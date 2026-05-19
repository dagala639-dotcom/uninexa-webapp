"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveApplicationDraft(
  applicationId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not logged in");
  }

  const payload = {
    full_name: String(formData.get("full_name") || ""),
    preferred_name: String(formData.get("preferred_name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    country: String(formData.get("country") || ""),
    county: String(formData.get("county") || ""),
    high_school: String(formData.get("high_school") || ""),
    kcse_mean_grade: String(formData.get("kcse_mean_grade") || ""),
    intended_program: String(formData.get("intended_program") || ""),
    preferred_intake: String(formData.get("preferred_intake") || ""),
    english_exam: String(formData.get("english_exam") || ""),
    exam_score: String(formData.get("exam_score") || ""),
    personal_statement: String(
      formData.get("personal_statement") || ""
    ),
  };

  const { error } = await supabase.from("application_forms").upsert(
    {
      user_id: user.id,
      application_id: applicationId,
      form_data: payload,
      status: "Draft",
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,application_id",
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  await supabase
    .from("applications")
    .update({
      program: payload.intended_program || "Undecided",
      progress: 35,
      status: "In progress",
    })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  revalidatePath(`/dashboard/applications`);
  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath(`/dashboard/applications/${applicationId}/start`);
}

export async function submitApplicationForm(
  applicationId: string,
  formData: FormData
) {
  await saveApplicationDraft(applicationId, formData);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not logged in");
  }

  const { error: formError } = await supabase
    .from("application_forms")
    .update({
      status: "Submitted",
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("application_id", applicationId)
    .eq("user_id", user.id);

  if (formError) {
    throw new Error(formError.message);
  }

  const { error: appError } = await supabase
    .from("applications")
    .update({
      status: "Submitted",
      progress: 100,
    })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (appError) {
    throw new Error(appError.message);
  }

  revalidatePath(`/dashboard/applications`);
  revalidatePath(`/dashboard/applications/${applicationId}`);
  revalidatePath(`/dashboard/applications/${applicationId}/start`);
}