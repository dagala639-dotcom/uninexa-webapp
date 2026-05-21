import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMessagesPage() {
  const supabase = await createClient();

 const {
  data: { session },
} = await supabase.auth.getSession();

const user = session?.user;
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

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false });

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
              Admin Messages Center
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
                  href === "/admin/messages"
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
            Back to admin dashboard
          </Link>
        </aside>

        {/* MAIN */}
        <section className="relative flex-1 overflow-hidden p-6 lg:p-10">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute right-0 top-52 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-10">
            <p className="text-sm font-medium text-fuchsia-300">
              Communication Center
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight lg:text-6xl">
              Student messages.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">
              Monitor conversations, support requests, admissions guidance,
              scholarship inquiries, and realtime communication between
              UniNexa admins and students.
            </p>
          </div>

          {/* STATS */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold">
                {conversations?.length || 0}
              </p>

              <p className="mt-2 text-sm text-white/40">
                Total conversations
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold">
                {
                  conversations?.filter(
                    (c) =>
                      c.status === "unread" ||
                      c.admin_read === false
                  ).length || 0
                }
              </p>

              <p className="mt-2 text-sm text-white/40">
                Unread conversations
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold">
                {
                  conversations?.filter(
                    (c) => c.priority === "high"
                  ).length || 0
                }
              </p>

              <p className="mt-2 text-sm text-white/40">
                High priority
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="text-3xl font-bold">
                {
                  conversations?.filter(
                    (c) => c.category === "Scholarship"
                  ).length || 0
                }
              </p>

              <p className="mt-2 text-sm text-white/40">
                Scholarship chats
              </p>
            </div>
          </div>

          {/* CONVERSATIONS */}
          <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02] p-6 shadow-[0_0_90px_rgba(168,85,247,0.12)] backdrop-blur-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  Conversation inbox
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Connected directly to Supabase conversations table.
                </p>
              </div>

              <button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
                Realtime active
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error.message}
              </div>
            )}

            <div className="space-y-4">
              {conversations?.map((conversation) => (
                <div
                  key={conversation.id}
                  className="rounded-3xl border border-white/10 bg-black/25 p-6 transition hover:border-fuchsia-500/30 hover:bg-white/[0.03]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-200">
                          {conversation.category || "General"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            conversation.priority === "high"
                              ? "bg-red-500/15 text-red-200"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {conversation.priority || "normal"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            conversation.admin_read === false
                              ? "bg-orange-500/15 text-orange-200"
                              : "bg-emerald-500/15 text-emerald-200"
                          }`}
                        >
                          {conversation.admin_read === false
                            ? "Unread"
                            : "Read"}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold">
                        {conversation.subject || "No subject"}
                      </h3>

                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/50">
                        {conversation.last_message ||
                          conversation.preview ||
                          "No preview available"}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/40">
                        <span>
                          Student ID: {conversation.user_id}
                        </span>

                        <span>
                          Updated:{" "}
                          {conversation.updated_at
                            ? new Date(
                                conversation.updated_at
                              ).toLocaleString()
                            : "Unknown"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/admin/messages/${conversation.id}`}
                        className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/20"
                      >
                        Open chat
                      </Link>

                      <button className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-5 py-3 text-sm font-medium text-fuchsia-200 transition hover:bg-fuchsia-500/20">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!conversations?.length && (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-10 text-center">
                  <h3 className="text-xl font-semibold">
                    No conversations yet
                  </h3>

                  <p className="mt-3 text-sm text-white/45">
                    Student conversations will appear here automatically.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}