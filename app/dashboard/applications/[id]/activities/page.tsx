import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../../logout-button";
import MobileNav from "../../../mobile-nav";
import { getUniversityQuestions } from "../university-questions";
import { saveActivitiesDraft } from "./actions";

export default async function ActivitiesPage({
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
    .eq("section", "activities")
    .maybeSingle();

  const questions = getUniversityQuestions(application.university_name).activities;
  const answers = draft?.answers || {};
  const saveDraft = saveActivitiesDraft.bind(null, id);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[320px] shrink-0 border-r border-white/10 bg-[#0A0F1D] p-5 lg:block">
          <Link href="/dashboard/applications" className="text-sm text-fuchsia-300">
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
                  name === "Activities"
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
              <p className="text-sm font-medium text-fuchsia-300">Activities</p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Activities & leadership
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-white/50">
                Add leadership roles, clubs, sports, volunteering, work experience,
                awards, or community involvement.
              </p>
            </div>

            <LogoutButton />
          </div>

          {saved === "1" && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
              Activities draft saved successfully.
            </div>
          )}

          <form
            action={saveDraft}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold">Activity 1</h3>
                <p className="mt-2 text-sm text-white/45">
                  Start with your strongest or most meaningful activity.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70"
              >
                <PlusCircle className="h-4 w-4" />
                Add activity
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                id="activity_type"
                label="Activity type"
                type="select"
                required
                options={[
                  "Leadership",
                  "Community service",
                  "Sports",
                  "Arts",
                  "Work experience",
                  "Academic club",
                  "Religious activity",
                  "Family responsibility",
                  "Other",
                ]}
                defaultValue={answers.activity_type || ""}
              />

              <Field
                id="activity_name"
                label="Activity name"
                type="text"
                required
                defaultValue={answers.activity_name || ""}
                placeholder="e.g. Debate Club, Football Team, School President"
              />

              <Field
                id="role_position"
                label="Role / Position"
                type="text"
                required
                defaultValue={answers.role_position || ""}
                placeholder="e.g. Headboy, Team Captain, Volunteer"
              />

              <Field
                id="years_involved"
                label="Years involved"
                type="select"
                required
                options={["Less than 1 year", "1 year", "2 years", "3 years", "4 years", "5+ years"]}
                defaultValue={answers.years_involved || ""}
              />

              <Field
                id="hours_per_week"
                label="Hours per week"
                type="text"
                defaultValue={answers.hours_per_week || ""}
                placeholder="e.g. 3"
              />

              <Field
                id="weeks_per_year"
                label="Weeks per year"
                type="text"
                defaultValue={answers.weeks_per_year || ""}
                placeholder="e.g. 30"
              />

              <Field
                id="activity_description"
                label="Description"
                type="textarea"
                required
                defaultValue={answers.activity_description || ""}
                placeholder="Briefly describe what you did, your responsibilities, and your impact."
              />

              {questions.map((question) => {
                if (
                  [
                    "activity_type",
                    "activity_name",
                    "role_position",
                    "years_involved",
                    "hours_per_week",
                    "weeks_per_year",
                    "activity_description",
                  ].includes(question.id)
                ) {
                  return null;
                }

                const defaultValue =
                  answers[question.id] ||
                  profile?.[question.id] ||
                  application?.[question.id] ||
                  "";

                return (
                  <Field
                    key={question.id}
                    id={question.id}
                    label={question.label}
                    type={question.type}
                    required={question.required}
                    options={question.options}
                    defaultValue={defaultValue}
                    placeholder={question.placeholder}
                  />
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/dashboard/applications/${id}/testing`}
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
                href={`/dashboard/applications/${id}/family`}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
              >
                Continue to Family
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
  type,
  required,
  options,
  defaultValue,
  placeholder,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className={type === "textarea" ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
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
            <option key={option} value={option} className="bg-[#070B14]">
              {option}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/10 p-4">
          {options?.map((option) => (
            <label key={option} className="flex items-center gap-3 text-sm text-white/70">
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
          type="text"
          required={required}
          defaultValue={defaultValue}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
        />
      )}
    </div>
  );
}