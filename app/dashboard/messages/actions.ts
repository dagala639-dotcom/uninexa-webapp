"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendStudentMessage(
  conversationId: string | null,
  body: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const cleanBody = body.trim();

  if (!cleanBody) return;

  let activeConversationId = conversationId;

  if (!activeConversationId) {
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title: "UniNexa Advisor",
        category: "Advisor",
        last_message: cleanBody,
        unread_count: 0,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    activeConversationId = conversation.id;
  }

  const { error: messageError } = await supabase.from("messages").insert({
    conversation_id: activeConversationId,
    sender: "You",
    body: cleanBody,
    created_at: new Date().toISOString(),
  });

  if (messageError) throw new Error(messageError.message);

  const { error: conversationError } = await supabase
    .from("conversations")
    .update({
      last_message: cleanBody,
      updated_at: new Date().toISOString(),
    })
    .eq("id", activeConversationId)
    .eq("user_id", user.id);

  if (conversationError) throw new Error(conversationError.message);

  revalidatePath("/dashboard/messages");
}