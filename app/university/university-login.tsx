"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UniversityLogin() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  async function handleLogin(formData: FormData) {
    setSigningIn(true);
    setError("");

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setSigningIn(false);
      return;
    }

    router.refresh();
    setSigningIn(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-sm font-medium text-fuchsia-300">
            UniNexa University Portal
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight lg:text-6xl">
            Institutional access for partner universities.
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/50">
            Review applicants, manage student pipelines, access verified
            documents, and participate in UniNexa&apos;s African admissions
            infrastructure.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            action={handleLogin}
            className="rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_90px_rgba(168,85,247,0.15)] backdrop-blur-2xl sm:p-8"
          >
            <h2 className="text-2xl font-semibold">University Login</h2>

            <p className="mt-2 text-sm text-white/45">
              Use the institutional account issued by UniNexa.
            </p>

            <div className="mt-8 space-y-5">
              <Input
                name="email"
                label="Institution email"
                type="email"
                placeholder="admissions@university.edu"
              />

              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="********"
              />
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={signingIn}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 disabled:opacity-50"
            >
              {signingIn ? "Signing in..." : "Access university portal"}
            </button>
          </form>

          <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-6 backdrop-blur-xl sm:p-8">
            <h2 className="text-2xl font-semibold">
              Built for admissions teams
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Access qualified African student applicants",
                "Review student application progress",
                "Update applicant decisions",
                "Send accepted, rejected, deferred, or waitlisted outcomes",
                "Sync decisions directly to student applications",
                "View future analytics and recruitment insights",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white/70"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/60">{label}</label>

      <input
        {...props}
        required
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/40"
      />
    </div>
  );
}
