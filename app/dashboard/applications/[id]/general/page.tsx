import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-fuchsia-300">
            Apply to {application.university_name}
          </p>

          <h1 className="mt-3 text-4xl font-bold">General</h1>

          <p className="mt-2 text-white/50">
            These questions are required by {application.university_name}.
          </p>

          <form className="mt-8 space-y-7">
            <Select
              label="Student status *"
              options={[
                "First-year undergraduate applicant",
                "Transfer applicant",
                "International undergraduate applicant",
              ]}
            />

            <Select
              label="Preferred start term *"
              options={[
                "Fall 2026",
                "Spring 2027",
                "Summer 2027",
                "Fall 2027",
              ]}
            />

            <Select
              label="Preferred residence during your first year *"
              options={[
                "On-campus housing",
                "Off-campus housing",
                "I have not decided",
                "Not applicable",
              ]}
            />

            <Select
              label="Preferred testing plan *"
              options={[
                "I will submit SAT/ACT scores",
                "I will apply test optional",
                "I have not decided",
              ]}
            />

            <Radio
              label="Do you intend to pursue need-based financial aid? *"
              name="financialAid"
            />

            <Select
              label="Religious preference"
              options={[
                "Prefer not to say",
                "Christian",
                "Muslim",
                "Hindu",
                "Other",
                "No religious preference",
              ]}
            />

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/70"
              >
                Save Draft
              </button>

              <Link
                href={`/dashboard/applications/${id}/academics`}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-6 py-4 text-sm font-semibold"
              >
                Continue
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function Select({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-white/80">
        {label}
      </label>

      <select className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none">
        <option className="bg-[#070B14]">Choose an option</option>

        {options.map((option) => (
          <option key={option} className="bg-[#070B14]">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Radio({ label, name }: { label: string; name: string }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-white/80">{label}</p>

      <div className="space-y-3">
        {["Yes", "No"].map((option) => (
          <label key={option} className="flex items-center gap-3 text-white/70">
            <input type="radio" name={name} />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}