"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ImageIcon,
  Paperclip,
  Search,
  Send,
} from "lucide-react";

type Conversation = {
  id: string;
  student_id: string;
  assigned_staff_id: string | null;
  last_message: string | null;
  updated_at: string;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type Profile = {
  user_id: string;
  full_name: string | null;
  email: string | null;
};

export default function AdminMessagesPage() {
  const supabase = useMemo(() => createClient(), []);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);

  const [adminId, setAdminId] = useState("");

  const [conversations, setConversations] = useState<
    Conversation[]
  >([]);

  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    loadMessages(selectedConversation.id);

    const channel = supabase
      .channel(`messages-${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [
            ...prev,
            payload.new as Message,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setAdminId(user.id);

    const { data: conversationsData } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", {
        ascending: false,
      });

    const studentIds =
      conversationsData?.map((c) => c.student_id) || [];

    let profileData: Profile[] = [];

    if (studentIds.length > 0) {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", studentIds);

      profileData = data || [];
    }

    setConversations(conversationsData || []);
    setProfiles(profileData);

    if (conversationsData?.length) {
      setSelectedConversation(conversationsData[0]);
    }

    setLoading(false);
  }

  async function loadMessages(conversationId: string) {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", {
        ascending: true,
      });

    setMessages(data || []);
  }

  async function sendMessage() {
    if (!messageInput.trim()) return;

    if (!selectedConversation) return;

    const text = messageInput.trim();

    setMessageInput("");

    await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: adminId,
      body: text,
    });

    await supabase
      .from("conversations")
      .update({
        last_message: text,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedConversation.id);

    await loadData();
  }

  function getProfile(userId: string) {
    return profiles.find(
      (profile) => profile.user_id === userId
    );
  }

  if (loading) {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-[#050816] text-white">
        Loading messages...
      </main>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-[#050816] text-white">
      <div className="flex h-screen w-screen">
        {/* LEFT SIDEBAR */}

        <aside className="w-[360px] shrink-0 border-r border-white/10 bg-black/20">
          <div className="border-b border-white/10 p-6">
            <h1 className="text-4xl font-bold">
              Messages
            </h1>

            <div className="relative mt-5">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

              <input
                placeholder="Search conversations..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-11 pr-4 text-sm outline-none placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="h-[calc(100vh-140px)] overflow-y-auto p-4">
            <div className="space-y-3">
              {conversations.map((conversation) => {
                const student = getProfile(
                  conversation.student_id
                );

                const active =
                  selectedConversation?.id ===
                  conversation.id;

                return (
                  <button
                    key={conversation.id}
                    onClick={() =>
                      setSelectedConversation(
                        conversation
                      )
                    }
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      active
                        ? "border-fuchsia-400/30 bg-fuchsia-500/10"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 font-bold">
                        {student?.full_name
                          ?.charAt(0)
                          ?.toUpperCase() || "S"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="truncate font-semibold">
                            {student?.full_name ||
                              "Unknown student"}
                          </h3>

                          <span className="text-xs text-white/30">
                            {conversation.updated_at
                              ? new Date(
                                  conversation.updated_at
                                ).toLocaleDateString()
                              : ""}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm text-white/45">
                          {conversation.last_message ||
                            "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT CHAT PANEL */}

        <section className="flex h-screen min-w-0 flex-1 flex-col">
          {selectedConversation ? (
            <>
              {/* HEADER */}

              <div className="flex h-[86px] shrink-0 items-center gap-4 border-b border-white/10 px-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 text-lg font-bold">
                  {getProfile(
                    selectedConversation.student_id
                  )
                    ?.full_name?.charAt(0)
                    ?.toUpperCase() || "S"}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold">
                    {getProfile(
                      selectedConversation.student_id
                    )?.full_name || "Unknown student"}
                  </h2>

                  <p className="text-sm text-white/40">
                    Student
                  </p>
                </div>
              </div>

              {/* CHAT MESSAGES */}

              <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
                <div className="space-y-5">
                  {messages.map((message) => {
                    const isAdmin =
                      message.sender_id === adminId;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isAdmin
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-3xl px-5 py-4 ${
                            isAdmin
                              ? "bg-gradient-to-r from-fuchsia-500 to-blue-500"
                              : "bg-white/10"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.body}
                          </p>

                          <p className="mt-2 text-right text-xs text-white/50">
                            {new Date(
                              message.created_at
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={bottomRef} />
                </div>
              </div>

              {/* INPUT */}

              <div className="shrink-0 border-t border-white/10 p-6">
                <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
                  <button className="rounded-2xl p-3 text-white/50 hover:bg-white/10">
                    <Paperclip className="h-5 w-5" />
                  </button>

                  <button className="rounded-2xl p-3 text-white/50 hover:bg-white/10">
                    <ImageIcon className="h-5 w-5" />
                  </button>

                  <input
                    value={messageInput}
                    onChange={(e) =>
                      setMessageInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent px-2 py-3 outline-none placeholder:text-white/30"
                  />

                  <button
                    onClick={sendMessage}
                    className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 p-4 transition hover:scale-[1.02]"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-white/40">
              Select a conversation
            </div>
          )}
        </section>
      </div>
    </main>
  );
}