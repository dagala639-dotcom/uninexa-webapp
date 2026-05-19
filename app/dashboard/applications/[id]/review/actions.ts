"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { updateApplicationProgress } from "../update-progress";

export async function submitApplication(
  applicationId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: forms } = await supabase
    .from("application_forms")
    .select("*")
    .eq("application_id", applicationId)
    .eq("user_id", user.id);

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

  const completedSections = new Set(
    (forms || [])
      .filter((form) => {
        if (!form.answers) return false;

        const values = Object.values(form.answers);

        return values.some(
          (value) =>
            value &&
            String(value).trim().length > 0
        );
      })
      .map((form) => form.section)
  );

  const missingSections = requiredSections.filter(
    (section) => !completedSections.has(section)
  );

  if (missingSections.length > 0) {
    redirect(
      `/dashboard/applications/${applicationId}/review?error=incomplete`
    );
  }

  const { error } = await supabase
    .from("applications")
    .update({
      status: "Submitted",
      progress: 100,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  await updateApplicationProgress(
    applicationId,
    user.id
  );

  redirect(
    `/dashboard/applications/${applicationId}/review?submitted=1`
  );
}