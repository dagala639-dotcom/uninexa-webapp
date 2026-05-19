import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../../logout-button";
import MobileNav from "../../../mobile-nav";

export default async function StartApplicationPage({
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

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Student Portal
            </p>
          </div>

          <nav className="space-y-2">
            {[
              ["Dashboard", "/dashboard"],
              ["Profile", "/dashboard/profile"],
              ["Applications", "/dashboard/applications"],
              ["Universities", "/dashboard/universities"],
              ["Documents", "/dashboard/documents"],
              ["Scholarships", "/dashboard/scholarships"],
              ["Messages", "/dashboard/messages"],
              ["Settings", "/dashboard/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/dashboard/applications"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-4 pb-28 sm:p-6 lg:p-10">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href={`/dashboard/applications/${application.id}`}
                className="text-sm text-fuchsia-300 hover:text-fuchsia-200"
              >
                ← Back to application
              </Link>

              <p className="mt-5 text-sm font-medium text-fuchsia-300">
                Start Application
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {application.university_name}
              </h2>

              <p className="mt-3 text-sm text-white/50">
                UniNexa auto-filled your available information.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">
                Application Form
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Complete missing university-specific information below.
              </p>
            </div>

            <form className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full legal name"
                defaultValue={profile?.full_name || ""}
              />

              <Input
                label="Preferred name"
                defaultValue={profile?.preferred_name || ""}
              />

              <Input
                label="Email address"
                defaultValue={profile?.email || user.email || ""}
              />

              <Input
                label="Phone number"
                defaultValue={profile?.phone || ""}
              />

              <Input
                label="Country"
                defaultValue={profile?.country || "Kenya"}
              />

              <Input
                label="County"
                defaultValue={profile?.county || ""}
              />

              <Input
                label="High school"
                defaultValue={profile?.high_school_name || ""}
              />

              <Input
                label="KCSE mean grade"
                defaultValue={profile?.kcse_mean_grade || ""}
              />

              <Input
                label="Intended program"
                defaultValue={application.program || ""}
              />

              <Select
                label="Preferred intake"
                options={[
                  "Fall 2026",
                  "Spring 2027",
                  "Summer 2027",
                ]}
              />

              <Select
                label="English proficiency exam"
                options={[
                  "IELTS",
                  "TOEFL",
                  "Duolingo English Test",
                  "PTE Academic",
                  "None yet",
                ]}
              />

              <Input
                label="Exam score"
                defaultValue={profile?.exam_score || ""}
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Personal statement
                </label>

                <textarea
                  rows={6}
                  defaultValue={profile?.bio || ""}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
                  placeholder="Write your personal statement..."
                />
              </div>

              <div className="md:col-span-2">
                <h4 className="mb-4 text-xl font-semibold">
                  Attached documents
                </h4>

                <div className="grid gap-3 sm:grid-cols-2">
                  {documents?.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="font-medium">
                        {doc.document_type}
                      </p>

                      <p className="mt-1 text-sm text-white/40">
                        {doc.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/10"
                >
                  Save draft
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
                >
                  Submit application
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
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
}: {
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
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