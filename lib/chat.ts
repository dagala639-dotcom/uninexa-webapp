import type { SupabaseClient } from "@supabase/supabase-js";

export type ChatConversation = {
  id: string;
  user_id?: string | null;
  student_user_id?: string | null;
  student_id?: string | null;
  title?: string | null;
  category?: string | null;
  last_message?: string | null;
  last_message_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender?: string | null;
  sender_user_id?: string | null;
  sender_id?: string | null;
  sender_role?: "student" | "admin" | string | null;
  body?: string | null;
  message?: string | null;
  created_at?: string | null;
};

type ChatRole = "student" | "admin";
type ChatPayload = Record<string, string | number | boolean | null>;
type SupabaseError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

const ADVISOR_TITLE = "UniNexa Advisor";

export function getConversationStudentId(conversation: ChatConversation) {
  return (
    conversation.student_user_id ||
    conversation.student_id ||
    conversation.user_id ||
    ""
  );
}

export function getMessageText(message: ChatMessage) {
  return message.body || message.message || "";
}

export function isMessageFromRole(
  message: ChatMessage,
  role: ChatRole,
  userId?: string
) {
  if (message.sender_role === role) return true;

  if (userId) {
    return message.sender_user_id === userId || message.sender_id === userId;
  }

  const sender = message.sender?.toLowerCase() || "";

  if (role === "admin") {
    return sender.includes("admin") || sender.includes("advisor");
  }

  return sender === "you" || sender.includes("student");
}

export async function createAdvisorConversation(
  supabase: SupabaseClient,
  studentId: string,
  lastMessage = "Start a conversation with your UniNexa advisor."
) {
  const now = new Date().toISOString();
  const withMetadata = {
    user_id: studentId,
    title: ADVISOR_TITLE,
    category: "Advisor",
    last_message: lastMessage,
    updated_at: now,
  };
  const minimal = {
    user_id: studentId,
    title: ADVISOR_TITLE,
    last_message: lastMessage,
    updated_at: now,
  };

  return insertWithFallback<ChatConversation>(supabase, "conversations", [
    {
      ...withMetadata,
      student_user_id: studentId,
      student_id: studentId,
    },
    {
      ...withMetadata,
      student_user_id: studentId,
    },
    {
      ...withMetadata,
      student_id: studentId,
    },
    withMetadata,
    {
      ...minimal,
      student_user_id: studentId,
    },
    {
      ...minimal,
      student_id: studentId,
    },
    minimal,
  ]);
}

export async function sendChatMessage({
  supabase,
  conversationId,
  senderUserId,
  senderRole,
  body,
}: {
  supabase: SupabaseClient;
  conversationId: string;
  senderUserId: string;
  senderRole: ChatRole;
  body: string;
}) {
  const now = new Date().toISOString();
  const cleanBody = body.trim();
  const senderLabel =
    senderRole === "admin" ? "UniNexa Admin" : "Student";
  const base = {
    conversation_id: conversationId,
    body: cleanBody,
    created_at: now,
  };

  return insertWithFallback<ChatMessage>(supabase, "messages", [
    {
      ...base,
      sender: senderLabel,
      sender_user_id: senderUserId,
      sender_id: senderUserId,
      sender_role: senderRole,
      message: cleanBody,
    },
    {
      ...base,
      sender: senderLabel,
      sender_user_id: senderUserId,
      sender_role: senderRole,
    },
    {
      ...base,
      sender_id: senderUserId,
      sender_role: senderRole,
      message: cleanBody,
    },
    {
      ...base,
      sender_id: senderUserId,
    },
    {
      ...base,
      sender: senderLabel,
    },
    base,
  ]);
}

export async function updateConversationAfterMessage(
  supabase: SupabaseClient,
  conversationId: string,
  lastMessage: string
) {
  const now = new Date().toISOString();

  await updateWithFallback(supabase, "conversations", conversationId, [
    {
      last_message: lastMessage,
      last_message_at: now,
      updated_at: now,
    },
    {
      last_message: lastMessage,
      updated_at: now,
    },
    {
      updated_at: now,
    },
  ]);

  return now;
}

async function insertWithFallback<T>(
  supabase: SupabaseClient,
  table: string,
  payloads: ChatPayload[]
) {
  let lastError: SupabaseError | null = null;

  for (const payload of payloads) {
    const { data, error } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (!error) return data as T;

    lastError = error;

    if (!canTryFallback(error)) {
      throw new Error(error.message || `Could not insert ${table}.`);
    }
  }

  throw new Error(lastError?.message || `Could not insert ${table}.`);
}

async function updateWithFallback(
  supabase: SupabaseClient,
  table: string,
  id: string,
  payloads: ChatPayload[]
) {
  let lastError: SupabaseError | null = null;

  for (const payload of payloads) {
    const { error } = await supabase.from(table).update(payload).eq("id", id);

    if (!error) return;

    lastError = error;

    if (!canTryFallback(error)) {
      throw new Error(error.message || `Could not update ${table}.`);
    }
  }

  throw new Error(lastError?.message || `Could not update ${table}.`);
}

function canTryFallback(error: SupabaseError) {
  const text = [
    error.code,
    error.message,
    error.details,
    error.hint,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    text.includes("pgrst204") ||
    text.includes("schema cache") ||
    text.includes("could not find") ||
    text.includes("column") ||
    text.includes("null value")
  );
}
