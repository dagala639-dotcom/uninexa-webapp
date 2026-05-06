import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (roleData?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .order("uploaded_at", { ascending: false });

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false });

  const pendingKcse =
    documents?.filter(
      (doc) =>
        doc.document_type === "KCSE Certificate" &&
        doc.status !== "Verified"
    ).length || 0;

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>
            <p className="mt-2 text-sm text-white/40">Admin Console</p>
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
                  href === "/admin"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard"
            className="mt-8 block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.06]"
          >
            Back to student portal
          </Link>
        </aside>

        <section className="relative flex-1 overflow-hidden p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute left-1/3 top-72 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8">
            <p className="text-sm font-medium text-fuchsia-300">
              Admin Dashboard
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
              UniNexa control center.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              Review students, track documents, manage KCSE verification,
              monitor applications, and support student messages.
            </p>
          </div>

          <div className="relative mb-8 grid gap-4 md:grid-cols-4">
            {[
              [String(documents?.length || 0), "Documents uploaded"],
              [String(pendingKcse), "KCSE pending"],
              [String(applications?.length || 0), "Applications"],
              [String(conversations?.length || 0), "Conversations"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <p className="text-3xl font-bold">{value}</p>
                <p className="mt-2 text-sm text-white/40">{label}</p>
              </div>
            ))}
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-6 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">
                    KCSE verification queue
                  </h3>
                  <p className="mt-2 text-sm text-white/40">
                    Certificates waiting for review, KNEC submission, or final
                    verification.
                  </p>
                </div>

                <Link
                  href="/admin/kcse-verification"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Open queue
                </Link>
              </div>

              <div className="space-y-4">
                {documents
                  ?.filter((doc) => doc.document_type === "KCSE Certificate")
                  .slice(0, 5)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-3xl border border-white/10 bg-black/25 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                            KCSE Certificate
                          </p>
                          <h4 className="mt-2 text-lg font-semibold">
                            Student ID: {doc.user_id}
                          </h4>
                          <p className="mt-1 text-sm text-white/40">
                            Stage: {doc.verification_stage || "Not set"}
                          </p>
                        </div>

                        <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                          {doc.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}

                {pendingKcse === 0 && (
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-6 text-sm text-white/50">
                    No KCSE certificates are currently pending.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">Quick actions</h3>

                <div className="mt-5 space-y-3">
                  {[
                    ["Review documents", "/admin/documents"],
                    ["Update KCSE status", "/admin/kcse-verification"],
                    ["Message students", "/admin/messages"],
                    ["View applications", "/admin/applications"],
                    ["Manage scholarships", "/admin/scholarships"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65 transition hover:bg-white/[0.06]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">Admin role active</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Signed in as an authorized UniNexa admin. Student accounts
                  without admin role are redirected back to the dashboard.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">Recent applications</h3>

                <div className="mt-5 space-y-3">
                  {applications?.slice(0, 4).map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="font-medium">{app.university_name}</p>
                      <p className="mt-1 text-sm text-white/40">
                        {app.country || "Country not set"} ·{" "}
                        {app.status || "In progress"}
                      </p>
                    </div>
                  ))}

                  {!applications?.length && (
                    <p className="text-sm text-white/45">
                      No applications yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}