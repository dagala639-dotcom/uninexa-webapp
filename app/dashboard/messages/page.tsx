"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";

type Conversation = {
  id: string;
  user_id: string;
  student_user_id?: string | null;
  title?: string | null;
  category?: string | null;
  last_message?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

type Message = {
  id: string;
  conversation_id: string;
  sender?: string | null;
  sender_user_id?: string | null;
  sender_role?: string | null;
  body?: string | null;
  message?: string | null;
  created_at: string;
};

export default function StudentMessagesPage() {
  const supabase = useMemo(() => createClient(), []);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!conversation) return;

    loadMessages(conversation.id);

    const channel = supabase
      .channel(`student-advisor-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const incoming = payload.new as Message;

          setMessages((prev) => {
            if (prev.some((msg) => msg.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadData() {
    setLoading(true);
    setSendError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setStudentId(user.id);

    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .eq("title", "UniNexa Advisor")
      .maybeSingle();

    if (existingConversation) {
      setConversation(existingConversation);
      setLoading(false);
      return;
    }

    const { data: newConversation, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        student_user_id: user.id,
        title: "UniNexa Advisor",
        category: "Advisor",
        last_message: "Start a conversation with your UniNexa advisor.",
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      setSendError(error.message);
      setLoading(false);
      return;
    }

    setConversation(newConversation);
    setLoading(false);
  }

  async function loadMessages(conversationId: string) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  function getMessageText(message: Message) {
    return message.body || message.message || "";
  }

  async function sendMessage() {
    if (!newMessage.trim() || !conversation || !studentId) return;

    const text = newMessage.trim();

    setNewMessage("");
    setSendError("");

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender: studentId,
        sender_user_id: studentId,
        sender_role: "student",
        body: text,
      })
      .select()
      .single();

    if (error) {
      setSendError(error.message);
      setNewMessage(text);
      return;
    }

    if (data) {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.id)) return prev;
        return [...prev, data as Message];
      });
    }

    await supabase
      .from("conversations")
      .update({
        last_message: text,
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversation.id);

    setConversation({
      ...conversation,
      last_message: text,
      updated_at: new Date().toISOString(),
    });
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
        <aside className="w-[360px] shrink-0 border-r border-white/10 bg-[#080D1A]">
          <div className="border-b border-white/10 p-6">
            <Link
              href="/dashboard"
              className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>

            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="mt-2 text-sm text-white/40">
              UniNexa support & counseling
            </p>
          </div>

          <div className="p-4">
            <div className="rounded-3xl border border-fuchsia-400/40 bg-fuchsia-500/15 p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">UniNexa Advisor</p>
                  <p className="mt-1 truncate text-sm text-white/45">
                    {conversation?.last_message ||
                      "Start a conversation with your UniNexa advisor."}
                  </p>

                  <div className="mt-3">
                    <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs text-fuchsia-100">
                      Advisor
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex h-screen min-w-0 flex-1 flex-col">
          <div className="shrink-0 border-b border-white/10 bg-[#070B14] p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">UniNexa Advisor</h2>
                <p className="mt-1 text-sm text-white/45">
                  Admissions counselors & support team
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
            {sendError && (
              <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {sendError}
              </div>
            )}

            <div className="space-y-5">
              {messages.length === 0 && (
                <div className="mx-auto mt-20 max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500">
                    <ShieldCheck className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-2xl font-bold">
                    Welcome to UniNexa Advisor
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/50">
                    Ask about applications, documents, scholarships, KCSE
                    verification, admissions, or study abroad support.
                  </p>
                </div>
              )}

              {messages.map((message) => {
                const mine = message.sender_role === "student";

                return (
                  <div
                    key={message.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-3xl px-5 py-4 ${
                        mine
                          ? "bg-gradient-to-r from-fuchsia-500 to-blue-500"
                          : "border border-white/10 bg-white/[0.06]"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {getMessageText(message)}
                      </p>

                      <p className="mt-2 text-right text-xs text-white/50">
                        {message.created_at
                          ? new Date(message.created_at).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#070B14] p-5">
            <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Type your message..."
                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/30"
              />

              <button
                type="button"
                onClick={sendMessage}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 transition hover:scale-[1.02]"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
