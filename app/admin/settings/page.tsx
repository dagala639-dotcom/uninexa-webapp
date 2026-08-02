import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleData?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Admin Settings
            </p>
          </div>

          <nav className="space-y-2">
            {[
              ["Overview", "/admin"],
              ["Students", "/admin/students"],
              ["Documents", "/admin/documents"],
              ["KCSE Verification", "/admin/kcse-verification"],
              ["Applications", "/admin/applications"],
              ["Messages", "/admin/messages"],
              ["Scholarships", "/admin/scholarships"],
              ["Settings", "/admin/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/admin/settings"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          <Link
            href="/admin"
            className="mt-8 block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.06]"
          >
            Back to dashboard
          </Link>
        </aside>

        {/* MAIN */}
        <section className="relative flex-1 overflow-hidden p-6 lg:p-10">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute right-0 top-52 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-10">
            <p className="text-sm font-medium text-fuchsia-300">
              System Configuration
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight lg:text-6xl">
              Platform settings.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">
              Configure UniNexa system behavior, admin permissions,
              AI settings, realtime infrastructure, and application workflows.
            </p>
          </div>

          {/* SETTINGS GRID */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* AI */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    AI Configuration
                  </h2>

                  <p className="mt-2 text-sm text-white/45">
                    Manage UniNexa AI systems and matching engine.
                  </p>
                </div>

                <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-xs text-emerald-200">
                  Active
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">
                    University Matching AI
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    GPT-powered recommendation engine enabled.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">
                    Scholarship Recommendation Engine
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    Intelligent funding recommendations enabled.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">
                    Essay Assistant
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    AI statement review and improvement system.
                  </p>
                </div>
              </div>
            </div>

            {/* REALTIME */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Realtime Infrastructure
                  </h2>

                  <p className="mt-2 text-sm text-white/45">
                    Supabase live synchronization and subscriptions.
                  </p>
                </div>

                <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-xs text-emerald-200">
                  Live
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Applications realtime sync",
                  "Admin messaging realtime",
                  "Document verification realtime",
                  "AI results live updates",
                  "Student dashboard live refresh",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="text-sm">{item}</p>

                    <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(74,222,128,0.8)]" />
                  </div>
                ))}
              </div>
            </div>

            {/* SECURITY */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold">
                Security & Permissions
              </h2>

              <p className="mt-2 text-sm text-white/45">
                Admin access and platform protection.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">
                    Role-based admin authentication
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    Connected to Supabase user_roles table.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">
                    Row-level security enabled
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    Database policies active across platform.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-medium">
                    Document protection
                  </p>

                  <p className="mt-1 text-sm text-white/45">
                    Secure Supabase storage bucket integration.
                  </p>
                </div>
              </div>
            </div>

            {/* FUTURE */}
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold">
                Upcoming SaaS Modules
              </h2>

              <p className="mt-2 text-sm text-white/45">
                Planned enterprise expansion roadmap.
              </p>

              <div className="mt-6 space-y-4">
                {[
                  "University partner portal",
                  "Loan provider integrations",
                  "Visa workflow tracking",
                  "CRM pipeline system",
                  "Student analytics dashboard",
                  "Institution reporting",
                  "Admissions automation",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/75"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  UniNexa Infrastructure
                </h3>

                <p className="mt-2 text-sm text-white/45">
                  International admissions infrastructure for African students.
                </p>
              </div>

              <div className="rounded-full bg-emerald-500/15 px-5 py-3 text-sm text-emerald-200">
                System operational
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
