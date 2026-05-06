import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";
import MobileNav from "./mobile-nav";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id);

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id);

  const { data: trackedScholarships } = await supabase
    .from("student_scholarships")
    .select("*")
    .eq("user_id", user.id);

  const applicationCount = applications?.length || 0;
  const documentCount = documents?.length || 0;
  const scholarshipCount = trackedScholarships?.length || 0;

  const profileCompletion = 30;
  const documentCompletion = Math.min(Math.round((documentCount / 6) * 100), 100);
  const applicationReadiness = Math.min(
    Math.round((profileCompletion + documentCompletion + applicationCount * 10) / 2),
    100
  );

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/dashboard/profile" },
    { name: "Applications", href: "/dashboard/applications" },
    { name: "Universities", href: "/dashboard/universities" },
    { name: "Documents", href: "/dashboard/documents" },
    { name: "Scholarships", href: "/dashboard/scholarships" },
    { name: "Messages", href: "/dashboard/messages" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <div className="flex min-h-screen">
        <aside className="relative hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>
            <p className="mt-2 text-sm text-white/40">Student Portal</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  item.href === "/dashboard"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm font-semibold">{fullName}</p>
            <p className="mt-1 truncate text-xs text-white/40">{user.email}</p>
          </div>
        </aside>

        <section className="flex-1 p-4 pb-28 sm:p-6 lg:p-10">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">Dashboard</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Good evening, {fullName}.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-white/50">
                Your global study journey is organized in one premium workspace.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-5 shadow-[0_0_80px_rgba(168,85,247,0.12)] backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="text-sm text-white/50">Application readiness</p>
                <h3 className="mt-3 text-4xl font-bold">
                  {applicationReadiness}% complete
                </h3>

                <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                    style={{ width: `${applicationReadiness}%` }}
                  />
                </div>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50">
                  Complete your profile, upload documents, and start matching
                  with universities that fit your academic goals.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm font-medium text-white/60">Next step</p>
                <h4 className="mt-3 text-xl font-semibold">
                  Complete your profile
                </h4>
                <p className="mt-2 text-sm text-white/40">
                  Add personal information, address, contact details, education,
                  testing, and activities.
                </p>

                <Link
                  href="/dashboard/profile"
                  className="mt-5 inline-block rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Continue profile
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Profile", `${profileCompletion}%`, "3 of 10 sections"],
              ["Documents", `${documentCount}/6`, "Required files"],
              ["Applications", String(applicationCount), "Saved schools"],
              ["Scholarships", String(scholarshipCount), "Tracked routes"],
            ].map(([title, value, subtitle]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <p className="text-sm text-white/40">{title}</p>
                <h3 className="mt-3 text-3xl font-bold">{value}</h3>
                <p className="mt-2 text-sm text-white/40">{subtitle}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
              <h3 className="text-xl font-semibold">Your application journey</h3>
              <p className="mt-2 text-sm text-white/40">
                Follow each stage to complete your study abroad process.
              </p>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "Complete profile",
                    status: "In progress",
                    href: "/dashboard/profile",
                    active: true,
                  },
                  {
                    title: "Upload documents",
                    status: documentCount > 0 ? "In progress" : "Next",
                    href: "/dashboard/documents",
                    active: documentCount > 0,
                  },
                  {
                    title: "Match universities",
                    status: "Ready",
                    href: "/dashboard/universities",
                    active: applicationCount > 0,
                  },
                  {
                    title: "Submit applications",
                    status: applicationCount > 0 ? "In progress" : "Locked",
                    href: "/dashboard/applications",
                    active: applicationCount > 0,
                  },
                  {
                    title: "Find scholarships",
                    status: scholarshipCount > 0 ? "Tracking" : "Recommended",
                    href: "/dashboard/scholarships",
                    active: scholarshipCount > 0,
                  },
                  {
                    title: "Prepare for admission",
                    status: "Advisor support",
                    href: "/dashboard/messages",
                    active: false,
                  },
                ].map((step, index) => (
                  <Link
                    key={step.title}
                    href={step.href}
                    className="flex items-center gap-4 rounded-3xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.06]"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        step.active
                          ? "bg-gradient-to-r from-fuchsia-500 to-blue-500"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-white/40">{step.status}</p>
                    </div>

                    <span className="text-white/30">›</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">Recommended countries</h3>

                <div className="mt-5 space-y-3">
                  {["Canada", "United Kingdom", "Germany", "Australia"].map(
                    (country) => (
                      <Link
                        key={country}
                        href="/dashboard/universities"
                        className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.06]"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{country}</p>
                          <span className="text-sm text-fuchsia-300">Match</span>
                        </div>
                        <p className="mt-1 text-sm text-white/40">
                          Scholarships and student visa options available.
                        </p>
                      </Link>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-5 backdrop-blur-xl sm:p-6">
                <h3 className="text-xl font-semibold">UniNexa counselor</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Get guidance on universities, documents, scholarships, and
                  application deadlines.
                </p>

                <Link
                  href="/dashboard/messages"
                  className="mt-5 block w-full rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Open messages
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