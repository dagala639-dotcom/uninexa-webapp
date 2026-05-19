"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute -left-20 top-0 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-3xl" />

      <section className="relative hidden w-1/2 flex-col justify-between border-r border-white/10 bg-white/[0.03] p-10 backdrop-blur-2xl lg:flex">
        <div>
          <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-3xl font-black uppercase tracking-[0.35em] text-transparent">
            UniNexa
          </h1>

          <p className="mt-3 text-sm text-white/40">
            Global Student Portal
          </p>
        </div>

        <div>
          <div className="inline-flex rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-xs font-medium text-fuchsia-200">
            Premium admissions workspace
          </div>

          <h2 className="mt-6 text-5xl font-bold leading-tight">
            Study abroad.
            <br />
            Smarter.
          </h2>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50">
            UniNexa helps Kenyan students organize profiles, applications,
            scholarships, documents, and admissions support in one powerful
            platform.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Universities", "Global matching"],
              ["Scholarships", "Funding routes"],
              ["Applications", "One dashboard"],
            ].map(([title, subtitle]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-black/20 p-5"
              >
                <p className="text-lg font-semibold">{title}</p>
                <p className="mt-2 text-sm text-white/40">{subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-white/30">
          © 2026 UniNexa. All rights reserved.
        </div>
      </section>

      <section className="relative flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_0_90px_rgba(168,85,247,0.12)] backdrop-blur-2xl sm:p-8">
          <div className="mb-8">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60">
              Welcome back
            </div>

            <h2 className="text-4xl font-bold tracking-tight">
              Login to UniNexa
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/45">
              Continue your applications, documents, scholarships, and student
              journey.
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Email address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@email.com"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-white/70">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-fuchsia-300 hover:text-fuchsia-200"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-white/45">
              Don&apos;t have an account?
            </p>

            <Link
              href="/signup"
              className="mt-3 inline-block text-sm font-semibold text-fuchsia-300 hover:text-fuchsia-200"
            >
              Create UniNexa account →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}