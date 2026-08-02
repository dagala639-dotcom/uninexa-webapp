"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  type ChatConversation,
  type ChatMessage,
  getConversationStudentId,
  getMessageText,
  isMessageFromRole,
  sendChatMessage,
  updateConversationAfterMessage,
} from "@/lib/chat";

type Conversation = ChatConversation & {
  title?: string | null;
  subject?: string | null;
};

type Message = ChatMessage;

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
      router.push("/admin/login");
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
      router.push("/admin/login");
      return;
    }

    try {
      await sendChatMessage({
        supabase,
        conversationId,
        senderUserId: user.id,
        senderRole: "admin",
        body: cleanReply,
      });

      await updateConversationAfterMessage(supabase, conversationId, cleanReply);
    } catch (error) {
      setError(getErrorMessage(error));
      setSending(false);
      return;
    }

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
              Student ID: {conversation ? getConversationStudentId(conversation) : ""}
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
              const isAdmin = isMessageFromRole(msg, "admin");
              const text = getMessageText(msg);

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
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleString()
                        : ""}
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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to send message.";
}
