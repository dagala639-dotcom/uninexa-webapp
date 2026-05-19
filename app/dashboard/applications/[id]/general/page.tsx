import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import GeneralForm from "./general-form";

export default async function GeneralApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!application) redirect("/dashboard/applications");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: draft } = await supabase
    .from("application_forms")
    .select("*")
    .eq("application_id", id)
    .eq("user_id", user.id)
    .eq("section", "general")
    .maybeSingle();

  const answers = draft?.answers || {};

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4">
          <p className="mb-4 text-sm text-white/50">Application progress</p>

          {[
            ["Application Information", `/dashboard/applications/${id}`],
            ["General", `/dashboard/applications/${id}/general`],
            ["Academics", `/dashboard/applications/${id}/academics`],
            ["Testing", `/dashboard/applications/${id}/testing`],
            ["Activities", `/dashboard/applications/${id}/activities`],
            ["Family", `/dashboard/applications/${id}/family`],
            ["Documents", `/dashboard/applications/${id}/documents`],
            ["Recommendations", `/dashboard/applications/${id}/recommendations`],
            ["Billing", `/dashboard/applications/${id}/billing`],
            ["Review & Submit", `/dashboard/applications/${id}/review`],
          ].map(([name, href]) => (
            <Link
              key={name}
              href={href}
              className={`mb-3 block rounded-2xl border px-5 py-4 text-sm transition ${
                name === "General"
                  ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                  : "border-white/10 bg-black/20 text-white/60 hover:bg-white/5"
              }`}
            >
              {name}
            </Link>
          ))}
        </aside>

        <div>
          <p className="text-sm text-fuchsia-300">
            Apply to {application.university_name}
          </p>

          <h1 className="mt-3 text-4xl font-bold">General</h1>

          <p className="mt-2 text-white/50">
            These questions are required by {application.university_name}. Your
            answers save automatically.
          </p>

          <div className="mt-8">
            <GeneralForm
              applicationId={id}
              profile={profile || {}}
              application={application}
              initialAnswers={answers}
            />
          </div>
        </div>
      </section>
    </main>
  );
}