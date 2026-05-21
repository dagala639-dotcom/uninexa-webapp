"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "../logout-button";
import MobileNav from "../mobile-nav";

type University = {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  website: string | null;
  tuition: string | null;
  application_fee: string | null;
  programs: string[] | null;
  deadline: string | null;
  ranking: string | null;
  description: string | null;
  scholarships_available: boolean | null;
  accepts_kcse: boolean | null;
  accepts_duolingo: boolean | null;
  visa_support: boolean | null;
  featured: boolean | null;
  status: string | null;
};

type ApplicationRow = {
  id: string;
  university_name: string | null;
};

function getFlag(country?: string | null) {
  const flags: Record<string, string> = {
    Kenya: "🇰🇪",
    Canada: "🇨🇦",
    "United Kingdom": "🇬🇧",
    Australia: "🇦🇺",
    Germany: "🇩🇪",
    Hungary: "🇭🇺",
    "United States": "🇺🇸",
    USA: "🇺🇸",
  };

  return flags[country || ""] || "🎓";
}

export default function UniversitiesPage() {
  const supabase = useMemo(() => createClient(), []);

  const [universities, setUniversities] = useState<University[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [message, setMessage] = useState("");
  const [loadingUniversity, setLoadingUniversity] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function getCurrentUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.user;
  }

  async function loadUniversities() {
    const { data, error } = await supabase
      .from("universities")
      .select("*")
      .eq("status", "Published")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setUniversities(data || []);
    }

    setLoading(false);
  }

  async function loadApplications() {
    const user = await getCurrentUser();

    if (!user) return;

    const { data } = await supabase
      .from("applications")
      .select("id, university_name")
      .eq("user_id", user.id);

    setApplications(data || []);
  }

  useEffect(() => {
    loadUniversities();
    loadApplications();

    const channel = supabase
      .channel("student-universities-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "universities" },
        () => loadUniversities()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredUniversities = universities.filter((university) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      university.name.toLowerCase().includes(query) ||
      university.country?.toLowerCase().includes(query) ||
      university.city?.toLowerCase().includes(query) ||
      university.programs?.join(" ").toLowerCase().includes(query)
    );
  });

  const countries = Array.from(
    new Set(universities.map((uni) => uni.country).filter(Boolean))
  );

  const countryCount = countries.length;

  function isAdded(universityName: string) {
    return applications.some((app) => app.university_name === universityName);
  }

  async function addToApplications(university: University) {
    setMessage("");
    setLoadingUniversity(university.name);

    const user = await getCurrentUser();

    if (!user) {
      setMessage("Please log in first.");
      setLoadingUniversity("");
      return;
    }

    const alreadyAdded = isAdded(university.name);

    if (alreadyAdded) {
      setMessage(`${university.name} is already in your Applications.`);
      setLoadingUniversity("");
      return;
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        university_name: university.name,
        country: university.country,
        city: university.city,
        application_type: "Undergraduate",
        program: "Undecided",
        deadline: university.deadline || "Not set",
        status: "In progress",
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id, university_name")
      .single();

    setLoadingUniversity("");

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data) {
      setApplications((prev) => [...prev, data]);
    }

    setMessage(`${university.name} added to Applications successfully.`);
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
              ["AI Matcher", "/dashboard/ai-matcher"],
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

        <section className="relative flex-1 overflow-hidden p-6 pb-28 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute left-1/3 top-60 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                Universities
              </p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
                Add universities.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
                Build your study-abroad application list from universities added
                by UniNexa admins.
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
                  This is your university marketplace. Universities added from
                  the admin panel appear here automatically.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    [String(universities.length), "Published schools"],
                    [String(countryCount), "Countries"],
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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by university, country, or program..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <div className="mt-5 space-y-3">
                  {countries.slice(0, 6).map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => setSearch(country || "")}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:bg-white/[0.08]"
                    >
                      <span className="text-sm text-white/70">{country}</span>

                      <span className="text-xs text-fuchsia-300">
                        Available
                      </span>
                    </button>
                  ))}

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/50 transition hover:bg-white/[0.06]"
                    >
                      Clear search
                    </button>
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

            {loading ? (
              <div className="rounded-[2rem] border border-white/10 bg-black/20 p-8 text-white/60">
                Loading universities...
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-2">
                {filteredUniversities.map((university) => {
                  const added = isAdded(university.name);

                  return (
                    <div
                      key={university.id}
                      className={`group rounded-[2rem] border p-5 transition ${
                        added
                          ? "border-white/10 bg-white/[0.03] opacity-70"
                          : "border-white/10 bg-gradient-to-br from-black/30 to-white/[0.03] hover:-translate-y-1 hover:border-fuchsia-400/30 hover:bg-white/[0.07] hover:shadow-[0_0_50px_rgba(217,70,239,0.12)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl">
                            {getFlag(university.country)}
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fuchsia-300">
                              {university.country || "Country not set"}
                            </p>

                            <h4 className="mt-2 text-xl font-semibold">
                              {university.name}
                            </h4>

                            <p className="mt-1 text-sm text-white/40">
                              {university.city || "City not set"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${
                            added
                              ? "border-white/10 bg-white/10 text-white/45"
                              : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                          }`}
                        >
                          {added
                            ? "Added"
                            : university.featured
                            ? "Featured"
                            : "Available"}
                        </span>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        <Info
                          label="Programs"
                          value={university.programs?.join(", ") || "Not set"}
                        />
                        <Info
                          label="Deadline"
                          value={university.deadline || "Not set"}
                        />
                        <Info
                          label="Tuition"
                          value={university.tuition || "Not set"}
                        />
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {university.scholarships_available && (
                          <Badge text="Scholarships" />
                        )}
                        {university.accepts_kcse && (
                          <Badge text="KCSE accepted" />
                        )}
                        {university.accepts_duolingo && (
                          <Badge text="Duolingo accepted" />
                        )}
                        {university.visa_support && (
                          <Badge text="Visa support" />
                        )}
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => addToApplications(university)}
                          disabled={loadingUniversity === university.name || added}
                          className={`flex-1 rounded-2xl px-5 py-4 text-sm font-semibold transition ${
                            added
                              ? "cursor-not-allowed bg-white/10 text-white/40"
                              : "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-fuchsia-500/20 hover:scale-[1.01] disabled:opacity-50"
                          }`}
                        >
                          {added
                            ? "Added"
                            : loadingUniversity === university.name
                            ? "Adding..."
                            : "Add to Applications"}
                        </button>

                        {university.website ? (
                          <a
                            href={university.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10"
                          >
                            View site
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white/40"
                          >
                            No site
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredUniversities.length === 0 && (
                  <div className="rounded-[2rem] border border-white/10 bg-black/20 p-6 text-white/60 xl:col-span-2">
                    No universities match your search.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-200">
      {text}
    </span>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-2 line-clamp-2 text-sm text-white/75">{value}</p>
    </div>
  );
}