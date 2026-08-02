"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  createAdvisorConversation,
  sendChatMessage,
  updateConversationAfterMessage,
} from "@/lib/chat";

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
    const conversation = await createAdvisorConversation(
      supabase,
      user.id,
      cleanBody
    );

    activeConversationId = conversation.id;
  }

  await sendChatMessage({
    supabase,
    conversationId: activeConversationId,
    senderUserId: user.id,
    senderRole: "student",
    body: cleanBody,
  });

  await updateConversationAfterMessage(supabase, activeConversationId, cleanBody);

  revalidatePath("/dashboard/messages");
}
