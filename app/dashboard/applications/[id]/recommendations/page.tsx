import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Mail,
  User,
  GraduationCap,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../../logout-button";
import MobileNav from "../../../mobile-nav";

import { getUniversityQuestions } from "../university-questions";
import { saveRecommendationsDraft } from "./actions";

export default async function RecommendationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const saved = (await searchParams)?.saved;

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

  const { data: draft } = await supabase
    .from("application_forms")
    .select("*")
    .eq("application_id", id)
    .eq("user_id", user.id)
    .eq("section", "recommendations")
    .maybeSingle();

  const questions =
    getUniversityQuestions(application.university_name)
      .recommendations;

  const answers = draft?.answers || {};

  const saveDraft =
    saveRecommendationsDraft.bind(null, id);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        {/* LEFT SIDEBAR */}
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
                  name === "Recommendations"
                    ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <section className="flex-1 p-4 pb-28 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                Recommendations
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Recommender information
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-white/50">
                Add teachers, counselors, mentors,
                or referees who will support your
                application to{" "}
                {application.university_name}.
              </p>
            </div>

            <LogoutButton />
          </div>

          {saved === "1" && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
              Recommendations draft saved successfully.
            </div>
          )}

          <form
            action={saveDraft}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6"
          >
            {/* RECOMMENDER 1 */}
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-fuchsia-300" />

                <div>
                  <h3 className="text-2xl font-semibold">
                    Recommender 1
                  </h3>

                  <p className="mt-1 text-sm text-white/45">
                    Main academic recommender
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <Field
                  id="recommender_1_name"
                  label="Full name"
                  required
                  defaultValue={
                    answers.recommender_1_name || ""
                  }
                />

                <Field
                  id="recommender_1_email"
                  label="Email address"
                  required
                  defaultValue={
                    answers.recommender_1_email || ""
                  }
                />

                <Field
                  id="recommender_1_phone"
                  label="Phone number"
                  defaultValue={
                    answers.recommender_1_phone || ""
                  }
                />

                <Field
                  id="recommender_1_school"
                  label="School / Institution"
                  defaultValue={
                    answers.recommender_1_school || ""
                  }
                />

                <Field
                  id="recommender_1_subject"
                  label="Subject taught"
                  defaultValue={
                    answers.recommender_1_subject || ""
                  }
                />

                <Field
                  id="recommender_1_relationship"
                  label="Relationship"
                  type="select"
                  required
                  options={[
                    "Teacher",
                    "School counselor",
                    "Principal",
                    "Mentor",
                    "Employer",
                    "Coach",
                    "Other",
                  ]}
                  defaultValue={
                    answers.recommender_1_relationship || ""
                  }
                />

                <Field
                  id="recommender_1_years"
                  label="Years known"
                  type="select"
                  options={[
                    "Less than 1 year",
                    "1 year",
                    "2 years",
                    "3 years",
                    "4+ years",
                  ]}
                  defaultValue={
                    answers.recommender_1_years || ""
                  }
                />

                <Field
                  id="recommendation_strength"
                  label="Recommendation strength"
                  type="radio"
                  options={[
                    "Outstanding",
                    "Strong",
                    "Good",
                    "Average",
                  ]}
                  defaultValue={
                    answers.recommendation_strength || ""
                  }
                />
              </div>
            </div>

            {/* OPTIONAL SECTION */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-blue-300" />

                <div>
                  <h3 className="text-2xl font-semibold">
                    Additional Notes
                  </h3>

                  <p className="mt-1 text-sm text-white/45">
                    Optional recommendation context
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <Field
                  id="waive_right_to_view"
                  label="Do you waive your right to view recommendation letters?"
                  type="radio"
                  required
                  options={["Yes", "No"]}
                  defaultValue={
                    answers.waive_right_to_view || ""
                  }
                />

                <Field
                  id="recommendation_notes"
                  label="Additional notes"
                  type="textarea"
                  defaultValue={
                    answers.recommendation_notes || ""
                  }
                  placeholder="Add any extra context about your recommenders..."
                />
              </div>
            </div>

            {/* UNIVERSITY QUESTIONS */}
            <div className="mt-6 grid gap-5">
              {questions.map((question) => {
                const skipFields = [
                  "recommender_1_name",
                  "recommender_1_email",
                  "recommender_1_phone",
                  "recommender_1_school",
                  "recommender_1_subject",
                  "recommender_1_relationship",
                  "recommender_1_years",
                  "recommendation_strength",
                  "waive_right_to_view",
                  "recommendation_notes",
                ];

                if (skipFields.includes(question.id)) {
                  return null;
                }

                return (
                  <Field
                    key={question.id}
                    id={question.id}
                    label={question.label}
                    type={question.type}
                    required={question.required}
                    options={question.options}
                    defaultValue={
                      answers[question.id] || ""
                    }
                    placeholder={question.placeholder}
                  />
                );
              })}
            </div>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/dashboard/applications/${id}/documents`}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10"
              >
                Previous
              </Link>

              <button
                type="submit"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/10"
              >
                Save Draft
              </button>

              <Link
                href={`/dashboard/applications/${id}/billing`}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
              >
                Continue to Billing
              </Link>
            </div>
          </form>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  options,
  defaultValue,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className={type === "textarea" ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}

        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
      </label>

      {type === "textarea" ? (
        <textarea
          name={id}
          rows={6}
          required={required}
          defaultValue={defaultValue}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
        />
      ) : type === "select" ? (
        <select
          name={id}
          required={required}
          defaultValue={defaultValue || ""}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
        >
          <option value="" className="bg-[#070B14]">
            Select option
          </option>

          {options?.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#070B14]"
            >
              {option}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/10 p-4">
          {options?.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 text-sm text-white/70"
            >
              <input
                type="radio"
                name={id}
                value={option}
                required={required}
                defaultChecked={defaultValue === option}
              />

              {option}
            </label>
          ))}
        </div>
      ) : (
        <input
          name={id}
          type={type}
          required={required}
          defaultValue={defaultValue}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
        />
      )}
    </div>
  );
}