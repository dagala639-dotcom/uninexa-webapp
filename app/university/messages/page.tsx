"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UniversityAccount = {
  id: string;
  university_name: string;
};

type UniversityMessage = {
  id: string;
  university_account_id: string;
  student_user_id: string;
  application_id: string | null;
  sender_id: string | null;
  sender_role: string | null;
  message: string;
  created_at: string;
};

export default function UniversityMessagesPage() {
  const supabase = createClient();
  const router = useRouter();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);

  const [account, setAccount] =
    useState<UniversityAccount | null>(null);

  const [messages, setMessages] = useState<
    UniversityMessage[]
  >([]);

  const [reply, setReply] = useState("");

  const [sending, setSending] = useState(false);

  async function loadMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/university");
      return;
    }

    const { data: universityAccount } = await supabase
      .from("university_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!universityAccount) {
      router.push("/university");
      return;
    }

    const { data } = await supabase
      .from("university_messages")
      .select("*")
      .eq("university_account_id", universityAccount.id)
      .order("created_at", { ascending: true });

    setAccount(universityAccount);
    setMessages(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("university-messages-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "university_messages",
        },
        () => loadMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage() {
    if (!reply.trim() || !account || sending) return;

    setSending(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("university_messages").insert({
      university_account_id: account.id,
      sender_id: user.id,
      sender_role: "university_admin",
      student_user_id:
        messages[messages.length - 1]?.student_user_id,
      application_id:
        messages[messages.length - 1]?.application_id,
      message: reply,
      created_at: new Date().toISOString(),
    });

    setReply("");
    setSending(false);

    loadMessages();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading messages...
      </main>
    );
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
              University Portal
            </p>
          </div>

          <nav className="space-y-2">
            {[
              ["Dashboard", "/university"],
              ["Applicants", "/university/applicants"],
              ["Documents", "/university/documents"],
              ["Messages", "/university/messages"],
              ["Profile", "/university/profile"],
              ["Settings", "/university/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/university/messages"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <section className="flex flex-1 flex-col overflow-hidden">
          {/* HEADER */}
          <div className="border-b border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <p className="text-sm font-medium text-fuchsia-300">
              University Communication Center
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              {account?.university_name}
            </h1>

            <p className="mt-3 text-sm text-white/45">
              Realtime communication with UniNexa applicants.
            </p>
          </div>

          {/* CHAT */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-5xl space-y-5">
              {messages.map((msg) => {
                const isUniversity =
                  msg.sender_role ===
                  "university_admin";

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isUniversity
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-2xl rounded-[1.8rem] px-5 py-4 ${
                        isUniversity
                          ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                          : "border border-white/10 bg-black/25"
                      }`}
                    >
                      <p className="mb-2 text-xs text-white/45">
                        {isUniversity
                          ? account?.university_name
                          : "Student"}
                      </p>

                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">
                        {msg.message}
                      </p>

                      <p className="mt-3 text-xs text-white/35">
                        {new Date(
                          msg.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}

              {!messages.length && (
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center text-white/45">
                  No messages yet.
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* INPUT */}
          <div className="border-t border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="mx-auto flex max-w-5xl gap-4">
              <textarea
                value={reply}
                onChange={(e) =>
                  setReply(e.target.value)
                }
                rows={3}
                placeholder="Message applicant..."
                className="flex-1 resize-none rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/40"
              />

              <button
                onClick={sendMessage}
                disabled={
                  !reply.trim() || sending
                }
                className="rounded-3xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_0_40px_rgba(168,85,247,0.35)] disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}