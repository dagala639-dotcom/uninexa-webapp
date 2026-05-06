import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../logout-button";

const updates = [
  ["KCSE Certificate", "Under UniNexa review", "Action pending"],
  ["CSS Profile", "Parent income details missing", "Required"],
  ["Personal Statement", "Needs revision", "Important"],
  ["Recommendation Letter", "Not uploaded", "Optional"],
];

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const selectedConversation = conversations?.[0];

  const { data: messages } = selectedConversation
    ? await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", selectedConversation.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  const totalUnread =
    conversations?.reduce(
      (sum, conversation) => sum + (conversation.unread_count || 0),
      0
    ) || 0;

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
              ["Messages", "/dashboard/messages"],
              ["Settings", "/dashboard/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/dashboard/messages"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="relative flex-1 overflow-hidden p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute left-1/3 top-72 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">Messages</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
                Your admissions inbox.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
                Advisor guidance, document verification updates, scholarship
                reminders, and university messages.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="relative mb-8 grid gap-4 md:grid-cols-4">
            {[
              [String(conversations?.length || 0), "Conversations"],
              [String(totalUnread), "Unread updates"],
              ["1", "Action required"],
              ["KCSE", "Verification active"],
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

          <div className="relative grid gap-8 xl:grid-cols-[0.8fr_1.35fr_0.75fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <div className="mb-5">
                <h3 className="text-xl font-semibold">Inbox</h3>
                <p className="mt-1 text-sm text-white/40">
                  Your active conversations.
                </p>
              </div>

              <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <input
                  placeholder="Search messages..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
              </div>

              <div className="space-y-3">
                {!conversations || conversations.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <p className="font-semibold">No conversations yet.</p>
                    <p className="mt-2 text-sm text-white/40">
                      UniNexa advisor messages and system updates will appear here.
                    </p>
                  </div>
                ) : (
                  conversations.map((item, index) => (
                    <button
                      key={item.id}
                      className={`w-full rounded-3xl border p-4 text-left transition ${
                        index === 0
                          ? "border-fuchsia-400/30 bg-fuchsia-500/10"
                          : "border-white/10 bg-black/20 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-fuchsia-300">
                            {item.category || "Message"}
                          </p>
                        </div>

                        <span className="text-xs text-white/35">
                          {new Date(item.updated_at).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-white/45">
                        {item.last_message || "No messages yet."}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/45">
                          {item.category || "General"}
                        </span>

                        {item.unread_count > 0 && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500 text-xs font-bold text-white">
                            {item.unread_count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 shadow-[0_0_80px_rgba(168,85,247,0.12)] backdrop-blur-2xl">
              <div className="mb-6 flex items-start justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                    {selectedConversation?.category || "Advisor"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    {selectedConversation?.title || "UniNexa Advisor"}
                  </h3>
                  <p className="mt-1 text-sm text-white/40">
                    Guidance for documents, applications, and scholarships.
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  Active
                </span>
              </div>

              <div className="space-y-5">
                {!messages || messages.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/25 px-5 py-4 text-white/60">
                    No messages in this conversation yet.
                  </div>
                ) : (
                  messages.map((message) => {
                    const isUser = message.sender === "You";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-[1.5rem] px-5 py-4 ${
                            isUser
                              ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white"
                              : "border border-white/10 bg-black/25 text-white/70"
                          }`}
                        >
                          <p className="mb-1 text-xs text-white/40">
                            {message.sender}
                          </p>
                          <p className="text-sm leading-relaxed">
                            {message.body}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                <textarea
                  rows={4}
                  placeholder="Write a message to your UniNexa advisor..."
                  className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-2">
                    <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
                      Attach file
                    </button>
                    <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
                      Ask AI
                    </button>
                  </div>

                  <button className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20">
                    Send message
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">Action center</h3>
                <p className="mt-2 text-sm text-white/45">
                  Important updates that need your attention.
                </p>

                <div className="mt-5 space-y-3">
                  {updates.map(([title, status, label]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{title}</p>
                          <p className="mt-1 text-sm text-white/40">
                            {status}
                          </p>
                        </div>

                        <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                          {label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">
                  KCSE verification timeline
                </h3>

                <div className="mt-5 space-y-4">
                  {[
                    ["Uploaded", true],
                    ["Under UniNexa review", true],
                    ["Sent to KNEC", false],
                    ["KNEC approval pending", false],
                    ["Verified", false],
                  ].map(([step, done]) => (
                    <div key={String(step)} className="flex gap-3">
                      <div
                        className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                          done
                            ? "bg-emerald-500 text-white"
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        {done ? "✓" : "•"}
                      </div>

                      <p
                        className={`text-sm ${
                          done ? "text-white" : "text-white/40"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">Quick channels</h3>

                <div className="mt-5 space-y-3">
                  {[
                    "UniNexa AI",
                    "Scholarships",
                    "Documents",
                    "Visa support",
                    "University updates",
                  ].map((channel) => (
                    <button
                      key={channel}
                      className="block w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/65 transition hover:bg-white/[0.06]"
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}