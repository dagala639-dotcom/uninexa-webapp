import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../logout-button";
import MobileNav from "../../mobile-nav";

const universityRequirements: Record<string, string[]> = {
  "University of Toronto": [
    "Choose program",
    "Upload KCSE certificate",
    "Upload transcript",
    "English test: IELTS / TOEFL / Duolingo",
    "Supplementary application if required",
    "Application fee",
  ],
  "University of Manchester": [
    "Choose course",
    "Personal statement",
    "Academic transcript",
    "Reference letter",
    "English language proof",
    "UCAS or direct application review",
  ],
  "University of Melbourne": [
    "Choose course",
    "Academic transcript",
    "KCSE certificate",
    "English test result",
    "Passport / National ID",
    "Financial documents",
  ],
  default: [
    "Choose program",
    "Upload academic documents",
    "Upload passport / ID",
    "Write personal statement",
    "Add recommendation letter",
    "Set application deadline",
  ],
};

export default async function ApplicationDetailPage({
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

  const requirements =
    universityRequirements[application.university_name] ||
    universityRequirements.default;

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>
            <p className="mt-2 text-sm text-white/40">Student Portal</p>
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
                href="/dashboard/applications"
                className="text-sm text-fuchsia-300 hover:text-fuchsia-200"
              >
                ← Back to applications
              </Link>

              <p className="mt-5 text-sm font-medium text-fuchsia-300">
                Application
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {application.university_name}
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-white/50">
                {application.country || "Country not set"} ·{" "}
                {application.program || "Program not selected"}
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 shadow-[0_0_80px_rgba(168,85,247,0.12)] backdrop-blur-2xl sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm text-white/50">Application progress</p>

                <h3 className="mt-3 text-4xl font-bold">
                  {application.progress || 0}% complete
                </h3>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                    style={{ width: `${application.progress || 0}%` }}
                  />
                </div>

                <p className="mt-4 text-sm text-white/45">
                  Complete the university-specific requirements below before
                  submission.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/50">Status</p>

                <h4 className="mt-3 text-xl font-semibold">
                  {application.status || "In progress"}
                </h4>

                <p className="mt-2 text-sm text-white/40">
                  Deadline: {application.deadline || "Not set"}
                </p>

                <p className="mt-1 text-sm text-white/40">
                  Program: {application.program || "Undecided"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
              <h3 className="text-2xl font-semibold">
                University-specific checklist
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Different universities need different application materials.
              </p>

              <div className="mt-6 space-y-4">
                {requirements.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-3xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/50">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{item}</p>
                      <p className="text-sm text-white/40">Required step</p>
                    </div>

                    <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">Application details</h3>

                <div className="mt-5 space-y-3">
                  {[
                    ["University", application.university_name],
                    ["Country", application.country || "Not set"],
                    ["Program", application.program || "Undecided"],
                    ["Deadline", application.deadline || "Not set"],
                    ["Status", application.status || "In progress"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-xs text-white/35">{label}</p>
                      <p className="mt-2 text-sm text-white/75">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">Next actions</h3>

                <div className="mt-5 space-y-3">
                  <Link
                    href="/dashboard/profile"
                    className="block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65 transition hover:bg-white/[0.06]"
                  >
                    Complete profile
                  </Link>

                  <Link
                    href="/dashboard/documents"
                    className="block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65 transition hover:bg-white/[0.06]"
                  >
                    Upload documents
                  </Link>

                  <Link
                    href="/dashboard/scholarships"
                    className="block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65 transition hover:bg-white/[0.06]"
                  >
                    Find scholarships
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}