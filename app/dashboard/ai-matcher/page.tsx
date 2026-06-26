"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "../logout-button";
import MobileNav from "../mobile-nav";

export default function AIMatcherPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary?: string;
    matches?: Array<{
      university: string;
      country: string;
      fitScore: number;
      admissionChance: string;
      why?: string[];
      estimatedCost: string;
      scholarshipAdvice: string;
      nextSteps?: string[];
    }>;
  } | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setResult(null);

    const payload = {
      program: formData.get("program"),
      kcseGrade: formData.get("kcseGrade"),
      budget: formData.get("budget"),
      countryPreference: formData.get("countryPreference"),
      englishTest: formData.get("englishTest"),
      scholarshipNeed: formData.get("scholarshipNeed"),
      interests: formData.get("interests"),
    };

    const response = await fetch("/api/ai/university-matcher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "AI matcher failed.");
      setLoading(false);
      return;
    }

    setResult(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="mx-auto max-w-7xl p-4 pb-28 sm:p-6 lg:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-fuchsia-300">
              UniNexa AI
            </p>
            <h1 className="mt-2 text-4xl font-bold">
              AI University Matcher
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/50">
              Get university recommendations based on Kenyan student context,
              budget, KCSE grade, scholarships, and study goals.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            action={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="grid gap-5">
              <Input name="program" label="Preferred program" placeholder="Computer Science, Nursing, Business..." />

              <Input name="kcseGrade" label="KCSE mean grade" placeholder="A-, B+, B..." />

              <Input name="budget" label="Annual budget" placeholder="e.g. $8,000, $15,000, KES 1M" />

              <Input name="countryPreference" label="Preferred country" placeholder="Canada, UK, USA, Germany..." />

              <Select
                name="englishTest"
                label="English test status"
                options={[
                  "Not taken yet",
                  "IELTS",
                  "TOEFL iBT",
                  "Duolingo English Test",
                  "PTE Academic",
                ]}
              />

              <Select
                name="scholarshipNeed"
                label="Scholarship need"
                options={[
                  "Very high",
                  "Moderate",
                  "Low",
                  "Not sure",
                ]}
              />

              <Textarea
                name="interests"
                label="Career goals / interests"
                placeholder="Tell UniNexa AI about your goals, strengths, and what you want from a university..."
              />
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "Matching..." : "Generate Matches"}
            </button>

            <Link
              href="/dashboard"
              className="mt-4 block text-center text-sm text-white/45 hover:text-white"
            >
              Back to dashboard
            </Link>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            {!result ? (
              <div className="text-white/50">
                Your AI results will appear here.
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">AI Match Summary</h2>
                <p className="mt-3 text-sm text-white/55">
                  {result.summary}
                </p>

                <div className="mt-6 space-y-5">
                  {result.matches?.map((match) => (
                    <div
                      key={match.university}
                      className="rounded-3xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {match.university}
                          </h3>
                          <p className="mt-1 text-sm text-white/40">
                            {match.country}
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                          {match.fitScore}% fit
                        </span>
                      </div>

                      <p className="mt-4 text-sm text-fuchsia-300">
                        Chance: {match.admissionChance}
                      </p>

                      <div className="mt-4 space-y-2">
                        {match.why?.map((reason: string) => (
                          <p key={reason} className="text-sm text-white/60">
                            • {reason}
                          </p>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Info label="Estimated cost" value={match.estimatedCost} />
                        <Info label="Scholarship advice" value={match.scholarshipAdvice} />
                      </div>

                      <div className="mt-5">
                        <p className="text-sm font-semibold">Next steps</p>
                        <div className="mt-2 space-y-2">
                          {match.nextSteps?.map((step: string) => (
                            <p key={step} className="text-sm text-white/50">
                              → {step}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <MobileNav />
    </main>
  );
}

function Input(props: {
  name: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{props.label}</label>
      <input
        name={props.name}
        required
        placeholder={props.placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30"
      />
    </div>
  );
}

function Textarea(props: {
  name: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{props.label}</label>
      <textarea
        name={props.name}
        rows={5}
        placeholder={props.placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30"
      />
    </div>
  );
}

function Select(props: {
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{props.label}</label>
      <select
        name={props.name}
        required
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none"
      >
        <option value="" className="bg-[#070B14]">Select option</option>
        {props.options.map((option) => (
          <option key={option} value={option} className="bg-[#070B14]">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-2 text-sm text-white/70">{value}</p>
    </div>
  );
}
