"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateApplicationProgress } from "../update-progress";

export async function saveBillingDraft(
  applicationId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const answers: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    answers[key] = String(value);
  }

  const { data: existing } = await supabase
    .from("application_forms")
    .select("id")
    .eq("application_id", applicationId)
    .eq("user_id", user.id)
    .eq("section", "billing")
    .maybeSingle();

  if (existing) {
    await supabase
      .from("application_forms")
      .update({
        answers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("application_forms").insert({
      application_id: applicationId,
      user_id: user.id,
      section: "billing",
      answers,
    });
    await updateApplicationProgress(applicationId, user.id);
  }

  redirect(`/dashboard/applications/${applicationId}/billing?saved=1`);
}