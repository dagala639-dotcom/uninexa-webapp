"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { ArrowLeft, Search, Send, UserRound } from "lucide-react";

type Conversation = ChatConversation & {
  assigned_staff_user_id?: string | null;
  assigned_staff_id?: string | null;
  status?: string | null;
};

type Message = ChatMessage;

type Profile = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone?: string | null;
  county?: string | null;
};

type Application = {
  id: string;
  user_id: string;
  university_name: string | null;
  program: string | null;
  status: string | null;
  progress: number | null;
};

export default function AdminMessagesPage() {
  const supabase = useMemo(() => createClient(), []);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState("");
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-conversations-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          loadData(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if (!selectedConversation?.id) return;

    loadMessages(selectedConversation.id);

    const channel = supabase
      .channel(`admin-messages-${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
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
  }, [selectedConversation?.id, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getStudentId(conversation: Conversation) {
    return getConversationStudentId(conversation);
  }

  function getProfile(userId: string) {
    return profiles.find((profile) => profile.user_id === userId);
  }

  function getStudentApplication(userId: string) {
    return applications.find((app) => app.user_id === userId);
  }

  async function loadData(showLoading = true) {
    if (showLoading) {
      setLoading(true);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setAdminId(user.id);

    const { data: conversationData } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    const studentIds = Array.from(
      new Set(
        (conversationData || [])
          .map((item: Conversation) => getStudentId(item))
          .filter(Boolean)
      )
    );

    let profileData: Profile[] = [];
    let applicationData: Application[] = [];

    if (studentIds.length > 0) {
      const { data: profilesResult } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, phone, county")
        .in("user_id", studentIds);

      const { data: applicationsResult } = await supabase
        .from("applications")
        .select("id, user_id, university_name, program, status, progress")
        .in("user_id", studentIds);

      profileData = profilesResult || [];
      applicationData = applicationsResult || [];
    }

    setConversations(conversationData || []);
    setProfiles(profileData);
    setApplications(applicationData);

    if (conversationData?.length) {
      const activeConversation = selectedConversation
        ? conversationData.find(
            (item: Conversation) => item.id === selectedConversation.id
          )
        : null;

      setSelectedConversation(activeConversation || conversationData[0]);
    }

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

  async function openConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation || !adminId) return;

    const text = newMessage.trim();
    setNewMessage("");
    setSendError("");

    try {
      const data = await sendChatMessage({
        supabase,
        conversationId: selectedConversation.id,
        senderUserId: adminId,
        senderRole: "admin",
        body: text,
      });

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.id)) return prev;
        return [...prev, data];
      });

      const updatedAt = await updateConversationAfterMessage(
        supabase,
        selectedConversation.id,
        text
      );

      const updatedConversation = {
        ...selectedConversation,
        last_message: text,
        last_message_at: updatedAt,
        updated_at: updatedAt,
      };

      setSelectedConversation(updatedConversation);
      setConversations((prev) =>
        prev
          .map((conversation) =>
            conversation.id === selectedConversation.id
              ? updatedConversation
              : conversation
          )
          .sort((a, b) =>
            String(b.updated_at || "").localeCompare(String(a.updated_at || ""))
          )
      );
    } catch (error) {
      setSendError(getErrorMessage(error));
      setNewMessage(text);
      return;
    }
  }

  const filteredConversations = conversations.filter((conversation) => {
    const studentId = getStudentId(conversation);
    const profile = getProfile(studentId);
    const app = getStudentApplication(studentId);
    const term = search.toLowerCase().trim();

    if (!term) return true;

    return (
      profile?.full_name?.toLowerCase().includes(term) ||
      profile?.email?.toLowerCase().includes(term) ||
      app?.university_name?.toLowerCase().includes(term) ||
      app?.status?.toLowerCase().includes(term) ||
      conversation.last_message?.toLowerCase().includes(term)
    );
  });

  const selectedStudentId = selectedConversation
    ? getStudentId(selectedConversation)
    : "";

  const selectedProfile = getProfile(selectedStudentId);
  const selectedApplication = getStudentApplication(selectedStudentId);

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
        <aside className="w-[380px] shrink-0 border-r border-white/10 bg-[#080D1A]">
          <div className="border-b border-white/10 p-6">
            <Link
              href="/admin"
              className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to admin
            </Link>

            <h1 className="text-3xl font-bold">Messages</h1>

            <p className="mt-2 text-sm text-white/40">
              Student support inbox
            </p>

            <div className="relative mt-5">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-4 pl-11 pr-4 text-sm outline-none placeholder:text-white/30 focus:border-fuchsia-400/40"
              />
            </div>
          </div>

          <div className="h-[calc(100vh-190px)] overflow-y-auto p-4">
            <div className="space-y-3">
              {filteredConversations.map((conversation) => {
                const studentId = getStudentId(conversation);
                const profile = getProfile(studentId);
                const app = getStudentApplication(studentId);
                const active = selectedConversation?.id === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => openConversation(conversation)}
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      active
                        ? "border-fuchsia-400/40 bg-fuchsia-500/15"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 font-bold">
                        {profile?.full_name?.charAt(0)?.toUpperCase() || "S"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate font-semibold">
                            {profile?.full_name || "Unknown student"}
                          </p>

                          <span className="text-xs text-white/30">
                            {conversation.updated_at
                              ? new Date(conversation.updated_at).toLocaleDateString()
                              : ""}
                          </span>
                        </div>

                        <p className="mt-1 truncate text-sm text-white/45">
                          {conversation.last_message || "No messages yet"}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                            {app?.status || "Student"}
                          </span>

                          {conversation.category && (
                            <span className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs text-fuchsia-200">
                              {conversation.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {!filteredConversations.length && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/40">
                  No conversations found.
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="flex h-screen min-w-0 flex-1 flex-col">
          {selectedConversation ? (
            <>
              <div className="shrink-0 border-b border-white/10 bg-[#070B14] p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 text-xl font-bold">
                      {selectedProfile?.full_name?.charAt(0)?.toUpperCase() ||
                        "S"}
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedProfile?.full_name || "Unknown student"}
                      </h2>

                      <p className="mt-1 text-sm text-white/45">
                        {selectedProfile?.email || "No email"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                          Active student
                        </span>

                        <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                          {selectedApplication?.status || "No application"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/admin/students/${selectedStudentId}`}
                    className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-5 transition hover:border-fuchsia-400/40 hover:bg-white/[0.07]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500">
                      <UserRound className="h-5 w-5 text-white" />
                    </div>

                    <div>
                      <p className="text-sm text-white/40">
                        Open full student profile
                      </p>

                      <h3 className="mt-1 text-lg font-semibold text-white">
                        View student details
                      </h3>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
                <div className="space-y-5">
                  {messages.map((message) => {
                    const mine = isMessageFromRole(message, "admin", adminId);
            

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          mine ? "justify-end" : "justify-start"
                        }`}
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
                {sendError && (
                  <div className="mb-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {sendError}
                  </div>
                )}

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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to send message.";
}
