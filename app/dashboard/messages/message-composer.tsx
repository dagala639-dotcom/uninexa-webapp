"use client";

import { useState, useTransition } from "react";
import { sendStudentMessage } from "./actions";

export default function MessageComposer({
  conversationId,
}: {
  conversationId: string | null;
}) {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    if (!body.trim()) {
      setError("Write a message first.");
      return;
    }

    setError("");

    startTransition(async () => {
      await sendStudentMessage(conversationId, body);
      setBody("");
    });
  }

  return (
    <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
      {error && (
        <p className="mb-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <textarea
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a message to your UniNexa advisor..."
        className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/30"
      />

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSend}
          disabled={isPending}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send message"}
        </button>
      </div>
    </div>
  );
}