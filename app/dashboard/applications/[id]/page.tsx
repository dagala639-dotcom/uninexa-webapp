import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Circle,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  Mail,
  Phone,
  Send,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../logout-button";
import MobileNav from "../../mobile-nav";

const sections = [
  "Application Information",
  "General",
  "Academics",
  "Testing",
  "Activities",
  "Family",
  "Documents",
  "Recommendations",
  "Billing",
  "Review & Submit",
];

const requiredFields = {
  general: [
    "full_name",
    "email",
    "phone",
    "country",
    "county",
  ],

  academics: [
    "high_school_name",
    "kcse_mean_grade",
    "intended_program",
  ],

  testing: [
    "english_exam",
  ],

  activities: [
    "activity_name",
  ],

  family: [
    "guardian_1_name",
    "guardian_1_phone",
  ],

  documents: [
    "KCSE Certificate",
    "Passport / National ID",
  ],

  recommendations: [
    "recommender_name",
    "recommender_email",
  ],
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

  if (!user) {
    redirect("/login");
  }

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!application) {
    redirect("/dashboard/applications");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id);

  function hasFields(fields: string[]) {
    return fields.every((field) => {
      if (
        field === "KCSE Certificate" ||
        field === "Passport / National ID"
      ) {
        return documents?.some(
          (doc) =>
            doc.document_type === field &&
            doc.file_path
        );
      }

      return Boolean(profile?.[field]);
    });
  }

  const completion = [
  true,
  hasFields(requiredFields.general),
  hasFields(requiredFields.academics),
  hasFields(requiredFields.testing),
  hasFields(requiredFields.activities),
  hasFields(requiredFields.family),
  hasFields(requiredFields.documents),
  hasFields(requiredFields.recommendations),
  false,
  false,
];

const completedSections = completion.filter(Boolean).length;

const progress = Math.round(
  (completedSections / completion.length) * 100
);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        {/* LEFT SIDEBAR */}
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
              <p className="text-sm text-white/45">
                Application progress
              </p>

              <h3 className="mt-2 text-4xl font-bold">
                {progress}%
              </h3>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-2">
              {sections.map((section, index) => {
                const sectionRoutes: Record<string, string> = {
  "Application Information": `/dashboard/applications/${application.id}`,
  General: `/dashboard/applications/${application.id}/general`,
  Academics: `/dashboard/applications/${application.id}/academics`,
  Testing: `/dashboard/applications/${application.id}/testing`,
  Activities: `/dashboard/applications/${application.id}/activities`,
  Family: `/dashboard/applications/${application.id}/family`,
  Documents: `/dashboard/applications/${application.id}/documents`,
  Recommendations: `/dashboard/applications/${application.id}/recommendations`,
  Billing: `/dashboard/applications/${application.id}/billing`,
  "Review & Submit": `/dashboard/applications/${application.id}/review`,
};

const href = sectionRoutes[section];

                return (
                  <Link
                    key={section}
                    href={href}
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
                      <p className="font-medium">
                        {section}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        {completion[index]
                          ? "Completed"
                          : section === "Review & Submit"
                            ? "Locked"
                            : "Needs attention"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* CENTER */}
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
                UniNexa auto-fills information from your student profile.
                Complete university-specific questions before submission.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">
                General Information
              </h3>

              <p className="mt-2 text-sm text-white/45">
                Required information for this application.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full legal name"
                required
                defaultValue={profile?.full_name || ""}
              />

              <Input
                label="Preferred name"
                defaultValue={profile?.preferred_name || ""}
              />

              <Input
                label="Email address"
                required
                defaultValue={profile?.email || ""}
              />

              <Input
                label="Phone number"
                required
                defaultValue={profile?.phone || ""}
              />

              <Input
                label="Country"
                required
                defaultValue={profile?.country || "Kenya"}
              />

              <Input
                label="County"
                required
                defaultValue={profile?.county || ""}
              />

              <Input
                label="Intended Program"
                required
                defaultValue={application.program || ""}
              />

              <Select
                label="Preferred Intake"
                required
                options={[
                  "Fall 2026",
                  "Spring 2027",
                  "Summer 2027",
                ]}
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Why are you interested in this university?
                  <span className="ml-1 text-red-400">*</span>
                </label>

                <textarea
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
                  placeholder="Explain your academic goals and why this university fits your future plans..."
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/10">
                Save Draft
              </button>

              <Link
                href={`/dashboard/applications/${application.id}/start?section=academics`}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
              >
                Continue
              </Link>
            </div>
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden w-[24rem] border-l border-white/10 bg-[#0A0F1D] p-6 xl:block">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-fuchsia-300" />
              <h3 className="text-xl font-semibold">
                Help & Support
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold">
                  Application review
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  UniNexa checks your application sections before final submission.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold">
                  Missing requirements
                </p>

                <ul className="mt-3 space-y-2 text-sm text-white/55">
                  <li>• English test result</li>
                  <li>• Personal statement</li>
                  <li>• Recommender details</li>
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

function Input({
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
      </label>

      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
      />
    </div>
  );
}

function Select({
  label,
  options,
  required,
}: {
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
      </label>

      <select className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none focus:border-fuchsia-400/50 focus:bg-white/[0.14]">
        <option className="bg-[#070B14]">
          Select option
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#070B14]"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}