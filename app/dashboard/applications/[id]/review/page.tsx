import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  Lock,
  Send,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../../logout-button";
import MobileNav from "../../../mobile-nav";
import { submitApplication } from "./actions";

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

const sectionLabels: Record<string, string> = {
  general: "General",
  academics: "Academics",
  testing: "Testing",
  activities: "Activities",
  family: "Family",
  documents: "Documents",
  recommendations: "Recommendations",
  billing: "Billing",
};

async function ReviewSubmitPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ submitted?: string }>;
}) {
  const { id } = await params;
  const submitted = (await searchParams)?.submitted;

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

  const { data: forms } = await supabase
    .from("application_forms")
    .select("*")
    .eq("application_id", id)
    .eq("user_id", user.id);

  const savedSections = forms || [];

  function sectionComplete(section: string) {
    const form = savedSections.find((item) => item.section === section);
    if (!form?.answers) return false;

    const answers = form.answers as Record<string, string>;

    return Object.values(answers).some((value) => {
      return value && String(value).trim().length > 0;
    });
  }

  const completion = requiredSections.map((section) => ({
    section,
    label: sectionLabels[section],
    complete: sectionComplete(section),
  }));

  const allComplete = completion.every((item) => item.complete);

  const submit = submitApplication.bind(null, id);

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
              ["Recommendations", `/dashboard/applications/${id}/recommendations`],
              ["Billing", `/dashboard/applications/${id}/billing`],
              ["Review & Submit", `/dashboard/applications/${id}/review`],
            ].map(([name, href]) => (
              <Link
                key={name}
                href={href}
                className={`block rounded-2xl border px-4 py-4 text-sm transition ${
                  name === "Review & Submit"
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
                Review & Submit
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Final application review
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-white/50">
                Review your saved sections before submitting your application to{" "}
                {application.university_name}.
              </p>
            </div>

            <LogoutButton />
          </div>

          {submitted === "1" && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
              Application submitted successfully.
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
              <div className="flex items-center gap-3">
                <FileCheck2 className="h-6 w-6 text-fuchsia-300" />
                <h3 className="text-2xl font-semibold">
                  Section checklist
                </h3>
              </div>

              <p className="mt-3 text-sm text-white/45">
                A section only shows complete after you save information in that
                section.
              </p>

              <div className="mt-8 space-y-4">
                {completion.map((item) => (
                  <Link
                    key={item.section}
                    href={`/dashboard/applications/${id}/${item.section}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          item.complete
                            ? "bg-emerald-500 text-white"
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        {item.complete ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <AlertCircle className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold">{item.label}</p>
                        <p className="mt-1 text-sm text-white/40">
                          {item.complete ? "Completed" : "Needs attention"}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm text-fuchsia-300">
                      Review
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold">
                  Submission status
                </h3>

                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/45">Current status</p>
                  <p className="mt-2 text-xl font-bold">
                    {application.status || "In progress"}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/45">University</p>
                  <p className="mt-2 text-lg font-semibold">
                    {application.university_name}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/45">Program</p>
                  <p className="mt-2 text-lg font-semibold">
                    {application.program || "Not selected"}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">
                  Final confirmation
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  By submitting, you confirm that the information provided is
                  accurate and that your documents are genuine.
                </p>

                {!allComplete && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0" />
                    Complete and save all required sections before submission.
                  </div>
                )}

                <form action={submit} className="mt-6">
                  <button
                    type="submit"
                    disabled={!allComplete || application.status === "Submitted"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                    {application.status === "Submitted"
                      ? "Application Submitted"
                      : "Submit Application"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}
export default ReviewSubmitPage;