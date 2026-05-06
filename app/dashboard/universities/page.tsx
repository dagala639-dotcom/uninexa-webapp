"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "../logout-button";

const universities = [
  {
    name: "University of Toronto",
    country: "Canada",
    flag: "🇨🇦",
    city: "Toronto",
    programs: "Computer Science, Engineering, Business",
    deadline: "15 Jan 2027",
    fee: "$45,000 / year",
    tag: "Highly ranked",
  },
  {
    name: "University of Manchester",
    country: "United Kingdom",
    flag: "🇬🇧",
    city: "Manchester",
    programs: "Business, Engineering, Health Sciences",
    deadline: "30 Jan 2027",
    fee: "£29,000 / year",
    tag: "Strong global brand",
  },
  {
    name: "University of Melbourne",
    country: "Australia",
    flag: "🇦🇺",
    city: "Melbourne",
    programs: "Data Science, Medicine, Commerce",
    deadline: "12 Feb 2027",
    fee: "A$48,000 / year",
    tag: "Popular student city",
  },
  {
    name: "Arizona State University",
    country: "United States",
    flag: "🇺🇸",
    city: "Arizona",
    programs: "Software Engineering, Business, Design",
    deadline: "1 Mar 2027",
    fee: "$33,000 / year",
    tag: "Flexible admissions",
  },
  {
    name: "University of Debrecen",
    country: "Hungary",
    flag: "🇭🇺",
    city: "Debrecen",
    programs: "Medicine, Engineering, IT",
    deadline: "15 Apr 2027",
    fee: "€7,500 / year",
    tag: "Affordable Europe",
  },
  {
    name: "Constructor University",
    country: "Germany",
    flag: "🇩🇪",
    city: "Bremen",
    programs: "Computer Science, Robotics, AI",
    deadline: "1 May 2027",
    fee: "€20,000 / year",
    tag: "Tech focused",
  },
];

export default function UniversitiesPage() {
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [loadingUniversity, setLoadingUniversity] = useState("");

  async function addToApplications(university: (typeof universities)[number]) {
    setMessage("");
    setLoadingUniversity(university.name);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in first.");
      setLoadingUniversity("");
      return;
    }

    const { error } = await supabase.from("applications").insert({
      user_id: user.id,
      university_name: university.name,
      country: university.country,
      program: "Undecided",
      deadline: university.deadline,
      status: "In progress",
      progress: 10,
    });

    setLoadingUniversity("");

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`${university.name} added to Applications.`);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>
            <p className="mt-2 text-sm text-white/40">Student Portal</p>
          </div>

          <nav className="space-y-2">
            {[
              ["Dashboard", "/dashboard"],
              ["Profile", "/dashboard/profile"],
              ["Applications", "/dashboard/applications"],
              ["Universities", "/dashboard/universities"],
              ["Documents", "/dashboard/documents"],
              ["Scholarships", "/dashboard/scholarships"],
              ["Messages", "/dashboard/messages"],
              ["Settings", "/dashboard/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/dashboard/universities"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="relative flex-1 overflow-hidden p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute left-1/3 top-60 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                Universities
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
                Add universities.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
                Build your study-abroad application list and send universities
                directly into your application tracker.
              </p>
            </div>

            <LogoutButton />
          </div>

          {message && (
            <div className="relative mb-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
              {message}
            </div>
          )}

          <div className="relative mb-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-6 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl lg:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-5 inline-flex rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-2 text-xs font-medium text-fuchsia-200">
                  Global admissions workspace
                </div>

                <h3 className="text-3xl font-bold leading-tight lg:text-5xl">
                  Find the right schools.
                  <br />
                  Add them in one click.
                </h3>

                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/50">
                  This is your university shortlist. As UniNexa gets partners,
                  this becomes your official application marketplace.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ["6", "Featured schools"],
                    ["6", "Countries"],
                    ["1-click", "Applications"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-3xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="mt-1 text-xs text-white/40">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
                <p className="text-sm font-medium text-white/60">
                  Search universities
                </p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
                  <input
                    placeholder="Search by university, country, or program..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <div className="mt-5 space-y-3">
                  {["Canada", "United Kingdom", "Australia", "Germany"].map(
                    (country) => (
                      <div
                        key={country}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                      >
                        <span className="text-sm text-white/70">{country}</span>
                        <span className="text-xs text-fuchsia-300">
                          Available
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="text-2xl font-semibold">
                  Available universities
                </h3>
                <p className="mt-2 text-sm text-white/40">
                  Select a university and add it to your Applications page.
                </p>
              </div>

              <Link
                href="/dashboard/applications"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10"
              >
                View applications
              </Link>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {universities.map((university) => (
                <div
                  key={university.name}
                  className="group rounded-[2rem] border border-white/10 bg-gradient-to-br from-black/30 to-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-fuchsia-400/30 hover:bg-white/[0.07] hover:shadow-[0_0_50px_rgba(217,70,239,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl">
                        {university.flag}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300">
                          {university.country}
                        </p>
                        <h4 className="mt-2 text-xl font-semibold">
                          {university.name}
                        </h4>
                        <p className="mt-1 text-sm text-white/40">
                          {university.city}
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                      {university.tag}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-white/35">Programs</p>
                      <p className="mt-2 line-clamp-2 text-sm text-white/75">
                        {university.programs}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-white/35">Deadline</p>
                      <p className="mt-2 text-sm text-white/75">
                        {university.deadline}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <p className="text-xs text-white/35">Tuition</p>
                      <p className="mt-2 text-sm text-white/75">
                        {university.fee}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => addToApplications(university)}
                      disabled={loadingUniversity === university.name}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
                    >
                      {loadingUniversity === university.name
                        ? "Adding..."
                        : "Add to Applications"}
                    </button>

                    <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/10">
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}