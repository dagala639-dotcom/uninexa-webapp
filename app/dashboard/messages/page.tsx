import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../logout-button";
import MobileNav from "../mobile-nav";
import MessageComposer from "./message-composer";

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

  if (!user) redirect("/login");

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
              ["AI Matcher", "/dashboard/ai-matcher"],
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

        <section className="relative flex-1 overflow-hidden p-6 pb-28 lg:p-10">
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

              <div className="space-y-3">
                {!conversations || conversations.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                    <p className="font-semibold">No conversations yet.</p>
                    <p className="mt-2 text-sm text-white/40">
                      Send your first message to UniNexa support.
                    </p>
                  </div>
                ) : (
                  conversations.map((item, index) => (
                    <div
                      key={item.id}
                      className={`rounded-3xl border p-4 text-left ${
                        index === 0
                          ? "border-fuchsia-400/30 bg-fuchsia-500/10"
                          : "border-white/10 bg-black/20"
                      }`}
                    >
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-fuchsia-300">
                        {item.category || "Message"}
                      </p>
                      <p className="mt-3 line-clamp-2 text-sm text-white/45">
                        {item.last_message || "No messages yet."}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 shadow-[0_0_80px_rgba(168,85,247,0.12)] backdrop-blur-2xl">
              <div className="mb-6 border-b border-white/10 pb-5">
                <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                  {selectedConversation?.category || "Advisor"}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {selectedConversation?.title || "UniNexa Advisor"}
                </h3>
              </div>

              <div className="space-y-5">
                {!messages || messages.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/25 px-5 py-4 text-white/60">
                    No messages yet.
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

              <MessageComposer conversationId={selectedConversation?.id || null} />
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">Action center</h3>

                <div className="mt-5 space-y-3">
                  {updates.map(([title, status, label]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4"
                    >
                      <p className="font-medium">{title}</p>
                      <p className="mt-1 text-sm text-white/40">{status}</p>
                      <span className="mt-3 inline-block rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                        {label}
                      </span>
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