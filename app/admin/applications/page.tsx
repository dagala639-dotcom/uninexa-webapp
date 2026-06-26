"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ApplicationRow = {
  id: string;
  user_id: string;
  university_name: string | null;
  country: string | null;
  city?: string | null;
  application_type?: string | null;
  program: string | null;
  deadline: string | null;
  status: string | null;
  progress: number | null;
  submitted_at?: string | null;
  created_at: string | null;
  updated_at?: string | null;
};

type ProfileRow = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  county: string | null;
  kcse_mean_grade: string | null;
  high_school_name: string | null;
};

type FormRow = {
  id: string;
  application_id: string;
  user_id: string;
  section: string;
  answers: Record<string, string> | null;
  updated_at: string | null;
};

const visibleStatuses = [
  "Submitted",
  "Under review",
  "Accepted",
  "Rejected",
  "Deferred",
  "Needs attention",
];

export default function AdminApplicationsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [forms, setForms] = useState<FormRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [message, setMessage] = useState("");

  async function loadData() {
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleData?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const { data: appData, error: appError } = await supabase
      .from("applications")
      .select("*")
      .in("status", visibleStatuses)
      .order("updated_at", { ascending: false });

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(
        "user_id, full_name, email, phone, county, kcse_mean_grade, high_school_name"
      );

    const { data: formData, error: formError } = await supabase
      .from("application_forms")
      .select("*")
      .order("updated_at", { ascending: false });

    if (appError) setMessage(appError.message);
    if (profileError) setMessage(profileError.message);
    if (formError) setMessage(formError.message);

    setApplications(appData || []);
    setProfiles(profileData || []);
    setForms(formData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function getProfile(userId: string) {
    return profiles.find((profile) => profile.user_id === userId);
  }

  function getApplicationForms(applicationId: string) {
    return forms.filter((form) => form.application_id === applicationId);
  }

  function completedSectionCount(applicationId: string) {
    const appForms = getApplicationForms(applicationId);

    return appForms.filter((form) => {
      if (!form.answers) return false;

      return Object.values(form.answers).some(
        (value) => value && String(value).trim().length > 0
      );
    }).length;
  }

  const filteredApplications = useMemo(() => {
    const term = search.toLowerCase().trim();

    return applications.filter((app) => {
      const profile = getProfile(app.user_id);

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      const matchesSearch =
        !term ||
        app.university_name?.toLowerCase().includes(term) ||
        app.country?.toLowerCase().includes(term) ||
        app.city?.toLowerCase().includes(term) ||
        app.program?.toLowerCase().includes(term) ||
        app.status?.toLowerCase().includes(term) ||
        app.user_id.toLowerCase().includes(term) ||
        profile?.full_name?.toLowerCase().includes(term) ||
        profile?.email?.toLowerCase().includes(term) ||
        profile?.kcse_mean_grade?.toLowerCase().includes(term) ||
        profile?.high_school_name?.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [applications, profiles, search, statusFilter]);

  const submittedCount = applications.filter(
    (app) => app.status === "Submitted"
  ).length;

  const acceptedCount = applications.filter(
    (app) => app.status === "Accepted"
  ).length;

  const needsAttentionCount = applications.filter(
    (app) => app.status === "Needs attention"
  ).length;

  const averageProgress =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (sum, app) => sum + Number(app.progress || 0),
            0
          ) / applications.length
        )
      : 0;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          Loading applications...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>
            <p className="mt-2 text-sm text-white/40">Admin Console</p>
          </div>

          <nav className="space-y-2">
            {[
              ["Overview", "/admin"],
              ["Students", "/admin/students"],
              ["Documents", "/admin/documents"],
              ["KCSE Verification", "/admin/kcse-verification"],
              ["Applications", "/admin/applications"],
              ["Messages", "/admin/messages"],
              ["Universities", "/admin/universities"],
              ["Scholarships", "/admin/scholarships"],
              ["Settings", "/admin/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/admin/applications"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="relative flex-1 overflow-hidden p-4 pb-20 sm:p-6 lg:p-10">
          <div className="relative mb-8">
            <p className="text-sm font-medium text-fuchsia-300">
              Applications
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
              Submitted applications.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              Admin can view submitted applications only. University accounts
              handle decisions like accepted, rejected, or under review.
            </p>
          </div>

          {message && (
            <div className="relative mb-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
              {message}
            </div>
          )}

          <div className="relative mb-8 grid gap-4 md:grid-cols-5">
            {[
              [String(applications.length), "Visible applications"],
              [String(submittedCount), "Submitted"],
              [String(acceptedCount), "Accepted"],
              [String(needsAttentionCount), "Needs attention"],
              [`${averageProgress}%`, "Avg progress"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <p className="text-3xl font-bold">{value}</p>
                <p className="mt-2 text-sm text-white/40">{label}</p>
              </div>
            ))}
          </div>

          <div className="relative mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl lg:grid-cols-[1fr_0.35fr_0.25fr]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search submitted applications..."
              className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none focus:border-fuchsia-400/50"
            >
              <option value="All" className="bg-[#070B14]">
                All submitted statuses
              </option>

              {visibleStatuses.map((status) => (
                <option key={status} value={status} className="bg-[#070B14]">
                  {status}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={loadData}
              className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Refresh
            </button>
          </div>

          <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-5 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl sm:p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold">Application records</h3>
              <p className="mt-2 text-sm text-white/40">
                Read-only admin view of submitted applications.
              </p>
            </div>

            <div className="grid gap-5">
              {filteredApplications.map((app) => {
                const profile = getProfile(app.user_id);
                const completeSections = completedSectionCount(app.id);

                return (
                  <div
                    key={app.id}
                    className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                          {app.country || "Country not set"}
                        </p>

                        <h4 className="mt-2 text-2xl font-semibold">
                          {app.university_name || "Unnamed university"}
                        </h4>

                        <p className="mt-1 text-sm text-white/45">
                          {app.program || "Program undecided"} ·{" "}
                          {app.application_type || "Application"}
                        </p>

                        <p className="mt-2 text-sm text-white/35">
                          Student: {profile?.full_name || "Unknown student"} ·{" "}
                          {profile?.email || "No email"}
                        </p>
                      </div>

                      <div className="w-fit rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
                        {app.status || "Submitted"}
                      </div>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                        style={{ width: `${app.progress || 0}%` }}
                      />
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                      <Info label="Progress" value={`${app.progress || 0}%`} />
                      <Info label="Completed sections" value={`${completeSections}/8`} />
                      <Info label="Deadline" value={app.deadline || "Not set"} />
                      <Info label="KCSE grade" value={profile?.kcse_mean_grade || "Not set"} />
                      <Info label="High school" value={profile?.high_school_name || "Not set"} />
                      <Info
                        label="Created"
                        value={
                          app.created_at
                            ? new Date(app.created_at).toLocaleDateString()
                            : "Unknown"
                        }
                      />
                      <Info
                        label="Submitted"
                        value={
                          app.submitted_at
                            ? new Date(app.submitted_at).toLocaleDateString()
                            : "Not submitted"
                        }
                      />
                      <Info label="Student ID" value={app.user_id.slice(0, 8) + "..."} />
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_0.4fr]">
                      <div className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm font-semibold text-white/80">
                        Status: {app.status || "Submitted"}
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/admin/students/${app.user_id}`}
                          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10"
                        >
                          Student
                        </Link>

                        <Link
                          href={`/admin/applications/${app.id}`}
                        
                          className="flex-1 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-4 text-center text-sm font-semibold text-white"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!filteredApplications.length && (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-8 text-center text-sm text-white/45">
                  No submitted applications found.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-2 break-words text-sm text-white/75">{value}</p>
    </div>
  );
}