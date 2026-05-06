"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(formData: FormData) {
    setError("");
    setLoading(true);

    const fullName = String(formData.get("fullName"));
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070B14] px-6 text-white">
      {/* Background glow */}
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute right-0 top-20 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_0_60px_rgba(168,85,247,0.15)] backdrop-blur-2xl">
        {/* Brand */}
        <div className="mb-8">
          <span className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-lg font-semibold uppercase tracking-[0.35em] text-transparent">
            UniNexa
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Begin your
            <br />
            global journey.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-white/50">
            Join UniNexa and access global education opportunities designed for ambitious students.
          </p>
        </div>

        {/* Form */}
        <form action={handleSignup} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Full name
            </label>

            <input
              name="fullName"
              type="text"
              required
              placeholder="Abednego Dagala"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition-all placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Email address
            </label>

            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition-all placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Password
            </label>

            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition-all placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition-all hover:scale-[1.01] hover:shadow-fuchsia-500/40 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-fuchsia-300 transition hover:text-fuchsia-200"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}