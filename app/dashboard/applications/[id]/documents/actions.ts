"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateApplicationProgress } from "../update-progress";

type DocumentsAnswers = Record<string, string>;

export async function saveDocumentsDraft(
  applicationId: string,
  data: DocumentsAnswers | FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const answers: DocumentsAnswers = {};

  if (data instanceof FormData) {
    for (const [key, value] of data.entries()) {
      answers[key] = String(value);
    }
  } else {
    Object.entries(data).forEach(([key, value]) => {
      answers[key] = String(value ?? "");
    });
  }

  const { data: existing } = await supabase
    .from("application_forms")
    .select("id")
    .eq("application_id", applicationId)
    .eq("user_id", user.id)
    .eq("section", "documents")
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("application_forms")
      .update({
        answers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("application_forms").insert({
      application_id: applicationId,
      user_id: user.id,
      section: "documents",
      answers,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  await updateApplicationProgress(applicationId, user.id);

  return {
    success: true,
  };
}