"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Conversation = {
  id: string;
  user_id: string;
  title?: string | null;
  subject?: string | null;
  category?: string | null;
  last_message?: string | null;
  updated_at?: string | null;
};

type Message = {
  id: string;
  conversation_id: string;
  sender?: string | null;
  sender_role?: string | null;
  sender_id?: string | null;
  body?: string | null;
  message?: string | null;
  created_at: string;
};

export default function AdminConversationPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const conversationId = String(params.id);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function loadThread() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleData?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const { data: convo, error: convoError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .maybeSingle();

    if (convoError || !convo) {
      router.push("/admin/messages");
      return;
    }

    const { data: msgs, error: msgsError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (msgsError) {
      setError(msgsError.message);
    }

    setConversation(convo);
    setMessages(msgs || []);
    setLoading(false);

    await supabase
      .from("conversations")
      .update({ admin_read: true })
      .eq("id", conversationId);
  }

  useEffect(() => {
    loadThread();

    const channel = supabase
      .channel(`admin-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => loadThread()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendReply() {
    const cleanReply = reply.trim();
    if (!cleanReply || sending) return;

    setSending(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: insertError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender: "UniNexa Admin",
      sender_role: "admin",
      sender_id: user.id,
      body: cleanReply,
      message: cleanReply,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      setError(insertError.message);
      setSending(false);
      return;
    }

    await supabase
      .from("conversations")
      .update({
        last_message: cleanReply,
        updated_at: new Date().toISOString(),
        admin_read: true,
      })
      .eq("id", conversationId);

    setReply("");
    await loadThread();
    setSending(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading chat...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-4 sm:p-6 lg:p-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-fuchsia-300">Admin Chat</p>
            <h1 className="mt-2 text-3xl font-bold">
              {conversation?.title || conversation?.subject || "Student conversation"}
            </h1>
            <p className="mt-2 text-sm text-white/40">
              Student ID: {conversation?.user_id}
            </p>
          </div>

          <Link
            href="/admin/messages"
            className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm hover:bg-white/20"
          >
            Back
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="flex flex-1 flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
          <div className="border-b border-white/10 p-5">
            <p className="text-sm text-white/45">
              Realtime conversation thread
            </p>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {messages.map((msg) => {
              const isAdmin =
                msg.sender_role === "admin" ||
                msg.sender === "UniNexa Admin" ||
                msg.sender === "Admin";

              const text = msg.body || msg.message || "";

              return (
                <div
                  key={msg.id}
                  className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-[1.5rem] px-5 py-4 ${
                      isAdmin
                        ? "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white"
                        : "border border-white/10 bg-black/30 text-white/75"
                    }`}
                  >
                    <p className="mb-1 text-xs text-white/45">
                      {isAdmin ? "UniNexa Admin" : msg.sender || "Student"}
                    </p>

                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {text}
                    </p>

                    <p className="mt-3 text-xs text-white/35">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}

            {!messages.length && (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-10 text-center text-white/45">
                No messages yet.
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 p-5">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Type your reply to the student..."
              className="w-full resize-none rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50"
            />

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send reply"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}