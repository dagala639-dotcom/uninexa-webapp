import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, HelpCircle } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getUniversityQuestions } from "@/lib/universities-questions";
import LogoutButton from "../../logout-button";
import MobileNav from "../../mobile-nav";

const sectionRoutes = (id: string): Record<string, string> => ({
  "Application Information": `/dashboard/applications/${id}`,
  General: `/dashboard/applications/${id}/general`,
  Academics: `/dashboard/applications/${id}/academics`,
  Testing: `/dashboard/applications/${id}/testing`,
  Activities: `/dashboard/applications/${id}/activities`,
  Family: `/dashboard/applications/${id}/family`,
  Documents: `/dashboard/applications/${id}/documents`,
  Recommendations: `/dashboard/applications/${id}/recommendations`,
  Billing: `/dashboard/applications/${id}/billing`,
  "Review & Submit": `/dashboard/applications/${id}/review`,
});

const sectionKeys: Record<string, string | null> = {
  "Application Information": null,
  General: "general",
  Academics: "academics",
  Testing: "testing",
  Activities: "activities",
  Family: "family",
  Documents: "documents",
  Recommendations: "recommendations",
  Billing: "billing",
  "Review & Submit": null,
};

export default async function ApplicationWorkspacePage({
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

  const universityQuestions = getUniversityQuestions(application.university_name);

  const sections = [
    "Application Information",
    ...(universityQuestions.general?.length ? ["General"] : []),
    ...(universityQuestions.academics?.length ? ["Academics"] : []),
    ...(universityQuestions.testing?.length ? ["Testing"] : []),
    ...(universityQuestions.activities?.length ? ["Activities"] : []),
    ...(universityQuestions.family?.length ? ["Family"] : []),
    ...(universityQuestions.documents?.length ? ["Documents"] : []),
    ...(universityQuestions.recommendations?.length ? ["Recommendations"] : []),
    "Billing",
    "Review & Submit",
  ];

  const { data: forms } = await supabase
    .from("application_forms")
    .select("section, answers")
    .eq("application_id", id)
    .eq("user_id", user.id);

  function formComplete(section: string) {
    const form = forms?.find((item) => item.section === section);

    if (!form?.answers) return false;

    const answers = form.answers as Record<string, string>;

    return Object.values(answers).some(
      (value) => value && String(value).trim().length > 0
    );
  }

  const completion = sections.map((section) => {
    if (section === "Application Information") return true;
    if (section === "Review & Submit") return false;

    const key = sectionKeys[section];

    return key ? formComplete(key) : false;
  });

  const completedSections = completion.filter(Boolean).length;

  const progress = Math.round((completedSections / completion.length) * 100);

  const routes = sectionRoutes(application.id);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[320px] shrink-0 border-r border-white/10 bg-[#0A0F1D] lg:block">
          <div className="border-b border-white/10 p-6">
            <Link
              href="/dashboard/applications"
              className="text-sm text-fuchsia-300 hover:text-fuchsia-200"
            >
              ← Back to applications
            </Link>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                Apply to
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                {application.university_name}
              </h1>

              <p className="mt-2 text-sm text-white/45">
                {application.country || "Country not set"}
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-white/45">Application progress</p>

              <h3 className="mt-2 text-4xl font-bold">{progress}%</h3>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-2">
              {sections.map((section, index) => (
                <Link
                  key={section}
                  href={routes[section]}
                  className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition ${
                    index === 0
                      ? "border-fuchsia-400/30 bg-fuchsia-500/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      completion[index]
                        ? "bg-emerald-500 text-white"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {completion[index] ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{section}</p>

                    <p className="mt-1 text-xs text-white/40">
                      {completion[index]
                        ? "Completed"
                        : section === "Review & Submit"
                          ? "Final step"
                          : "Needs attention"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex-1 p-4 pb-28 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                Application Information
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Continue your application
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-white/50">
                UniNexa organizes your application into saved sections. Complete
                each section before final submission.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">Application Overview</h3>

              <p className="mt-2 text-sm text-white/45">
                Review your current application details and continue from any
                section.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoCard
                label="University"
                value={application.university_name || "Not set"}
              />

              <InfoCard
                label="Country"
                value={application.country || "Not set"}
              />

              <InfoCard
                label="Program"
                value={application.program || "Not selected"}
              />

              <InfoCard
                label="Application status"
                value={application.status || "In progress"}
              />

              <InfoCard label="Progress" value={`${progress}% complete`} />

              <InfoCard
                label="Next recommended step"
                value={
                  completion[1]
                    ? "Continue to next section"
                    : "Complete General section"
                }
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/dashboard/applications/${application.id}/general`}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
              >
                Continue Application
              </Link>

              <Link
                href={`/dashboard/applications/${application.id}/review`}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10"
              >
                Review Progress
              </Link>
            </div>
          </div>
        </section>

        <aside className="hidden w-[24rem] border-l border-white/10 bg-[#0A0F1D] p-6 xl:block">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-fuchsia-300" />

              <h3 className="text-xl font-semibold">Help & Support</h3>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold">Autosave enabled</p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  Your application sections save automatically as you complete
                  them.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold">Submission checklist</p>

                <ul className="mt-3 space-y-2 text-sm text-white/55">
                  <li>• Complete each required section</li>
                  <li>• Upload required documents</li>
                  <li>• Review billing information</li>
                  <li>• Submit from Review & Submit</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <MobileNav />
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
}