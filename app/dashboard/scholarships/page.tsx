import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../logout-button";
import MobileNav from "../mobile-nav";

type Scholarship = {
  id: string;
  name: string | null;
  provider: string | null;
  region: string | null;
  funding: string | null;
  level: string | null;
  deadline: string | null;
  website_url: string | null;
  requirements: string[] | null;
};

export default async function ScholarshipsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: scholarships } = await supabase
    .from("scholarships")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: trackedScholarships } = await supabase
    .from("student_scholarships")
    .select("*")
    .eq("user_id", user.id);

  const { data: cssProfile } = await supabase
    .from("css_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const trackedIds =
    trackedScholarships?.map((item) => item.scholarship_id) || [];

  const readiness = 58;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
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
              ["AI Matcher", "/dashboard/ai-matcher"],
              ["Messages", "/dashboard/messages"],
              ["Settings", "/dashboard/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/dashboard/scholarships"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="relative flex-1 overflow-hidden p-4 pb-28 sm:p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute left-1/3 top-72 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                Scholarships
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl">
                Fund your journey.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
                Match Kenyan students with international scholarships, CSS
                Profile financial aid, and fully funded opportunities.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="relative mb-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-5 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-5 inline-flex rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-xs font-medium text-fuchsia-200">
                  Scholarship readiness
                </div>

                <h3 className="text-3xl font-bold leading-tight lg:text-5xl">
                  {readiness}% ready for funding.
                </h3>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                    style={{ width: `${readiness}%` }}
                  />
                </div>

                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/50">
                  Upload financial documents, prepare recommendation letters,
                  improve your personal statement, and complete CSS Profile
                  preparation.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <p className="text-2xl font-bold">
                      {scholarships?.length || 0}
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      Scholarship routes
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <p className="text-2xl font-bold">
                      {trackedScholarships?.length || 0}
                    </p>
                    <p className="mt-1 text-xs text-white/40">Tracking</p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <p className="text-2xl font-bold">CSS</p>
                    <p className="mt-1 text-xs text-white/40">
                      Financial aid
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
                <p className="text-sm font-medium text-white/60">
                  Missing for strongest applications
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    "Personal statement",
                    "Recommendation letter",
                    "Parent income details",
                    "Bank statement / sponsor letter",
                    "English test result",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                    >
                      <span className="text-sm text-white/70">{item}</span>
                      <span className="text-xs text-orange-300">Needed</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/dashboard/documents"
                  className="mt-5 block rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Upload documents
                </Link>
              </div>
            </div>
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold">
                  Scholarship matches
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  Scholarship opportunities stored in Supabase.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {(scholarships as Scholarship[] | null)?.map((scholarship) => (
                  <div
                    key={scholarship.id}
                    className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-black/30 to-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-fuchsia-400/30 hover:shadow-[0_0_50px_rgba(217,70,239,0.12)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300">
                          {scholarship.region}
                        </p>

                        <h4 className="mt-2 text-xl font-semibold">
                          {scholarship.name}
                        </h4>

                        <p className="mt-1 text-sm text-white/40">
                          {scholarship.provider}
                        </p>
                      </div>

                      <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                        Active
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Info label="Funding" value={scholarship.funding} />
                      <Info label="Level" value={scholarship.level} />
                      <Info label="Deadline" value={scholarship.deadline} />
                      <Info label="Region" value={scholarship.region} />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {scholarship.requirements?.map((req: string) => (
                        <span
                          key={req}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55"
                        >
                          {req}
                        </span>
                      ))}
                    </div>

                    <a
                      href={scholarship.website_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 block w-full rounded-2xl px-5 py-4 text-center text-sm font-semibold transition ${
                        trackedIds.includes(scholarship.id)
                          ? "border border-emerald-400/20 bg-emerald-500/20 text-emerald-200"
                          : "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-fuchsia-500/20 hover:scale-[1.01]"
                      }`}
                    >
                      Open scholarship site
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">CSS Profile Center</h3>

                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Prepare financial aid requirements for universities using CSS
                  Profile.
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    ["Parent income", cssProfile?.parent_income_status || "Missing"],
                    ["Bank statements", cssProfile?.bank_statement_status || "Missing"],
                    ["Assets & property", cssProfile?.assets_status || "Not started"],
                    [
                      "Household expenses",
                      cssProfile?.household_expenses_status || "Not started",
                    ],
                    [
                      "CSS submission",
                      cssProfile?.css_submission_status || "Not submitted",
                    ],
                  ].map(([item, status]) => (
                    <div
                      key={String(item)}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium">{item}</p>
                        <span className="text-xs text-orange-300">
                          {status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href="https://cssprofile.collegeboard.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block w-full rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Open CSS Profile
                </a>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">
                  Net Price Calculator
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Estimate your yearly cost after scholarships, sponsor support,
                  and expected aid. Approximate rate: 1 USD = 130 KES.
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    ["Tuition", "$12,000"],
                    ["Accommodation", "$3,500"],
                    ["Living costs", "$2,400"],
                    ["Insurance", "$800"],
                    ["Visa + passport", "$500"],
                    ["Flight estimate", "$900"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <span className="text-sm text-white/55">{label}</span>
                      <span className="text-sm font-semibold text-white/80">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">
                      Scholarship / aid
                    </span>
                    <span className="text-sm font-semibold text-emerald-300">
                      -$5,000
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-white/60">
                      Sponsor contribution
                    </span>
                    <span className="text-sm font-semibold text-emerald-300">
                      -$3,000
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
                  <p className="text-sm text-white/50">
                    Estimated funding gap
                  </p>

                  <h4 className="mt-2 text-3xl font-bold">$12,100</h4>

                  <p className="mt-1 text-sm text-white/45">
                    Approx. KES 1,573,000 per year
                  </p>

                  <div className="mt-4 rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
                    High funding gap - scholarship support recommended
                  </div>
                </div>

                <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]">
                  Open full calculator
                </button>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">
                  Scholarship calendar
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  Important scholarship cycles.
                </p>

                <div className="mt-5 space-y-3">
                  {(scholarships as Scholarship[] | null)?.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="font-medium">{item.name}</p>
                      <p className="mt-1 text-sm text-white/40">
                        {item.deadline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">Best funding routes</h3>

                <div className="mt-5 space-y-3">
                  {[
                    "Fully funded government scholarships",
                    "University merit scholarships",
                    "Need-based financial aid",
                    "CSS Profile institutional aid",
                    "Partner university discounts",
                  ].map((route) => (
                    <div
                      key={route}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65"
                    >
                      {route}
                    </div>
                  ))}
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

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-2 text-sm text-white/75">{value || "Not set"}</p>
    </div>
  );
}
