"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { updateApplicationProgress } from "../update-progress";

export async function saveGeneralDraft(
  applicationId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const answers = {
    full_name: formData.get("full_name"),
    preferred_name: formData.get("preferred_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    county: formData.get("county"),
    intended_program: formData.get("intended_program"),
    preferred_intake: formData.get("preferred_intake"),
    university_interest_reason: formData.get(
      "university_interest_reason"
    ),
  };

  await supabase.from("application_forms").upsert(
    {
      application_id: applicationId,
      user_id: user.id,
      section: "general",
      answers,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "application_id,section",
    }
  );

  await updateApplicationProgress(applicationId, user.id);

  redirect(
    `/dashboard/applications/${applicationId}/general?saved=1`
  );
}