import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../../logout-button";
import MobileNav from "../../../mobile-nav";
import { getUniversityQuestions } from "@/lib/universities-questions";
import DocumentsForm from "./documents-form";

export default async function DocumentsPage({
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

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id);

  const { data: draft } = await supabase
    .from("application_forms")
    .select("*")
    .eq("application_id", id)
    .eq("user_id", user.id)
    .eq("section", "documents")
    .maybeSingle();

  const questions =
    getUniversityQuestions(application.university_name).documents || [];

  const answers = draft?.answers || {};

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[320px] shrink-0 border-r border-white/10 bg-[#0A0F1D] p-5 lg:block">
          <Link
            href="/dashboard/applications"
            className="text-sm text-fuchsia-300"
          >
            ← Back to applications
          </Link>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
              Apply to
            </p>

            <h1 className="mt-3 text-2xl font-bold">
              {application.university_name}
            </h1>

            <p className="mt-2 text-sm text-white/45">
              {application.country || "Country not set"}
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {[
              ["Application Information", `/dashboard/applications/${id}`],
              ["General", `/dashboard/applications/${id}/general`],
              ["Academics", `/dashboard/applications/${id}/academics`],
              ["Testing", `/dashboard/applications/${id}/testing`],
              ["Activities", `/dashboard/applications/${id}/activities`],
              ["Family", `/dashboard/applications/${id}/family`],
              ["Documents", `/dashboard/applications/${id}/documents`],
              [
                "Recommendations",
                `/dashboard/applications/${id}/recommendations`,
              ],
              ["Billing", `/dashboard/applications/${id}/billing`],
              ["Review & Submit", `/dashboard/applications/${id}/review`],
            ].map(([name, href]) => (
              <Link
                key={name}
                href={href}
                className={`block rounded-2xl border px-4 py-4 text-sm transition ${
                  name === "Documents"
                    ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-4 pb-28 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                Documents
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Required documents
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-white/50">
                Review documents required by {application.university_name}.
                Your document checklist saves automatically.
              </p>
            </div>

            <LogoutButton />
          </div>

          <DocumentsForm
            applicationId={id}
            questions={questions}
            initialAnswers={answers}
            documents={documents || []}
          />
        </section>
      </div>

      <MobileNav />
    </main>
  );
}