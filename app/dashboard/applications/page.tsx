import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../logout-button";
import MobileNav from "../mobile-nav";

export default async function ApplicationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const totalApplications = applications?.length || 0;

  const inProgress =
    applications?.filter((app) => app.status === "In progress").length || 0;

  const ready =
    applications?.filter((app) => (app.progress || 0) >= 80).length || 0;

  const submitted =
    applications?.filter((app) => app.status === "Submitted").length || 0;

  const averageProgress =
    totalApplications > 0
      ? Math.round(
          applications!.reduce((sum, app) => sum + (app.progress || 0), 0) /
            totalApplications
        )
      : 0;

  const nextApplication = applications?.[0];

  const stats = [
    ["Total applications", String(totalApplications)],
    ["In progress", String(inProgress)],
    ["Ready", String(ready)],
    ["Submitted", String(submitted)],
  ];

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
              <p className="text-sm font-medium text-fuchsia-300">
                Applications
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Your university applications.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-white/50">
                Universities added from the Universities page will appear here.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([title, value]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <p className="text-sm text-white/40">{title}</p>
                <h3 className="mt-3 text-3xl font-bold">{value}</h3>
              </div>
            ))}
          </div>

          <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 shadow-[0_0_80px_rgba(168,85,247,0.12)] backdrop-blur-2xl sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <p className="text-sm text-white/50">
                  Overall application progress
                </p>
                <h3 className="mt-3 text-4xl font-bold">
                  {averageProgress}% complete
                </h3>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                    style={{ width: `${averageProgress}%` }}
                  />
                </div>

                <p className="mt-4 text-sm text-white/45">
                  Add universities, choose programs, upload documents, and track
                  each application until submission.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm text-white/50">Next application</p>

                {nextApplication ? (
                  <>
                    <h4 className="mt-3 text-xl font-semibold">
                      {nextApplication.university_name}
                    </h4>
                    <p className="mt-2 text-sm text-white/40">
                      Deadline: {nextApplication.deadline || "Not set"}
                    </p>
                    <p className="mt-1 text-sm text-white/40">
                      Program: {nextApplication.program || "Undecided"}
                    </p>

                    <Link
                      href={`/dashboard/applications/${nextApplication.id}`}
                      className="mt-5 inline-block rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Open application
                    </Link>
                  </>
                ) : (
                  <>
                    <h4 className="mt-3 text-xl font-semibold">
                      No university added
                    </h4>
                    <p className="mt-2 text-sm text-white/40">
                      Start by adding a university.
                    </p>

                    <Link
                      href="/dashboard/universities"
                      className="mt-5 inline-block rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      Add universities
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    Application pipeline
                  </h3>
                  <p className="mt-1 text-sm text-white/40">
                    Your saved university applications.
                  </p>
                </div>

                <Link
                  href="/dashboard/universities"
                  className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20"
                >
                  Add application
                </Link>
              </div>

              {!applications || applications.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-black/20 p-8">
                  <h4 className="text-2xl font-semibold">
                    No applications yet.
                  </h4>
                  <p className="mt-2 text-sm text-white/50">
                    Go to Universities and add a school to start tracking your
                    application.
                  </p>

                  <Link
                    href="/dashboard/universities"
                    className="mt-6 inline-block rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black"
                  >
                    Add universities
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.06]"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                            {app.country || "Country not set"}
                          </p>
                          <h4 className="mt-2 text-xl font-semibold">
                            {app.university_name}
                          </h4>
                          <p className="mt-1 text-sm text-white/45">
                            {app.program || "Undecided"}
                          </p>
                        </div>

                        <span className="w-fit rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white/70">
                          {app.status || "In progress"}
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="text-white/40">Progress</span>
                          <span>{app.progress || 0}%</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                            style={{ width: `${app.progress || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {["Program", "Documents", "Deadline"].map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-200"
                          >
                            Set up: {item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-white/40">
                          Deadline: {app.deadline || "Not set"}
                        </p>

                        <Link
                          href={`/dashboard/applications/${app.id}`}
                          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">Required checklist</h3>
                <p className="mt-2 text-sm text-white/40">
                  Common documents needed across most applications.
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    ["Passport / ID", true],
                    ["KCSE Certificate", false],
                    ["Transcript", false],
                    ["Personal Statement", false],
                    ["Recommendation Letter", false],
                    ["IELTS / TOEFL", false],
                  ].map(([item, done]) => (
                    <div
                      key={String(item)}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                          done
                            ? "bg-emerald-500 text-white"
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        {done ? "✓" : "•"}
                      </div>

                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">Recommended next move</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Add a program, set your deadline, and upload your KCSE
                  certificate to improve application readiness.
                </p>

                <Link
                  href="/dashboard/documents"
                  className="mt-5 block rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Go to documents
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}