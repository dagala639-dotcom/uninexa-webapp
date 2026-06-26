"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UniversityAccount = {
  id: string;
  user_id: string;
  university_name: string;
  country: string | null;
  city: string | null;
  website: string | null;
  contact_name: string | null;
  contact_email: string | null;
  status: string | null;
  membership_tier: string | null;
};

type UniversityApplicant = {
  id: string;
  university_account_id: string;
  application_id: string;
  student_user_id: string;
  status: string | null;
  notes: string | null;
  created_at: string | null;
};

type ApplicationRow = {
  id: string;
  user_id: string;
  university_name: string | null;
  country: string | null;
  program: string | null;
  status: string | null;
  progress: number | null;
  created_at: string | null;
};

type ProfileRow = {
  user_id: string;
  full_name: string | null;
  email: string | null;
};

const decisionStatuses = [
  "Submitted",
  "Under review",
  "Accepted",
  "Rejected",
  "Deferred",
  "Waitlisted",
  "Needs attention",
];

export default function UniversityPortalPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "dashboard">("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [savingId, setSavingId] = useState("");

  const [account, setAccount] = useState<UniversityAccount | null>(null);
  const [applicants, setApplicants] = useState<UniversityApplicant[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);

  async function loadPortal() {
    setError("");
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      setMode("login");
      setLoading(false);
      return;
    }

    const { data: universityAccount, error: accountError } = await supabase
      .from("university_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (accountError) {
      setError(accountError.message);
      setMode("login");
      setLoading(false);
      return;
    }

    if (!universityAccount) {
      setError("No university account found for this email.");
      setMode("login");
      setLoading(false);
      return;
    }

    const { data: applicantData, error: applicantError } = await supabase
      .from("university_applicants")
      .select("*")
      .eq("university_account_id", universityAccount.id)
      .order("created_at", { ascending: false });

    if (applicantError) {
      setError(applicantError.message);
      setLoading(false);
      return;
    }

    const applicationIds = applicantData?.map((item) => item.application_id) || [];

    let applicationData: ApplicationRow[] = [];

    if (applicationIds.length > 0) {
      const { data, error: applicationError } = await supabase
        .from("applications")
        .select("*")
        .in("id", applicationIds);

      if (applicationError) {
        setError(applicationError.message);
      }

      applicationData = data || [];
    }

    const studentIds = applicantData?.map((item) => item.student_user_id) || [];

    let profileData: ProfileRow[] = [];

    if (studentIds.length > 0) {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", studentIds);

      if (profileError) {
        setError(profileError.message);
      }

      profileData = data || [];
    }

    setProfiles(profileData);
    setAccount(universityAccount);
    setApplicants(applicantData || []);
    setApplications(applicationData);
    setMode("dashboard");
    setLoading(false);
  }

  useEffect(() => {
    loadPortal();
  }, []);

  async function handleLogin(formData: FormData) {
    setSigningIn(true);
    setError("");

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setSigningIn(false);
      return;
    }

    await loadPortal();
    setSigningIn(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setAccount(null);
    setApplicants([]);
    setApplications([]);
    setProfiles([]);
    setMode("login");
    router.refresh();
  }

  function getApplication(applicationId: string) {
    return applications.find((app) => app.id === applicationId);
  }

  function getProfile(userId: string) {
    return profiles.find((profile) => profile.user_id === userId);
  }

  function progressForStatus(status: string) {
    if (status === "Accepted") return 100;
    if (status === "Rejected") return 100;
    if (status === "Deferred") return 85;
    if (status === "Waitlisted") return 85;
    if (status === "Under review") return 75;
    if (status === "Needs attention") return 65;
    if (status === "Submitted") return 60;
    return 50;
  }

  async function updateApplicantStatus(item: UniversityApplicant, status: string) {
    setSavingId(item.id);
    setError("");
    setMessage("");

    const progress = progressForStatus(status);

    const { error: applicantError } = await supabase
      .from("university_applicants")
      .update({
        status,
      })
      .eq("id", item.id);

    if (applicantError) {
      setError(applicantError.message);
      setSavingId("");
      return;
    }

    const { error: applicationError } = await supabase
      .from("applications")
      .update({
        status,
        progress,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.application_id);

    if (applicationError) {
      setError(applicationError.message);
      setSavingId("");
      return;
    }

    setApplicants((prev) =>
      prev.map((applicant) =>
        applicant.id === item.id ? { ...applicant, status } : applicant
      )
    );

    setApplications((prev) =>
      prev.map((app) =>
        app.id === item.application_id ? { ...app, status, progress } : app
      )
    );

    setMessage(`Application marked as ${status}.`);
    setSavingId("");
  }

  const underReviewApplicants = applicants.filter((item) => {
    const app = getApplication(item.application_id);
    const status = app?.status || item.status;

    return (
      status === "Submitted" ||
      status === "Under review" ||
      status === "New applicant"
    );
  });

  const acceptedApplicants = applicants.filter((item) => {
    const app = getApplication(item.application_id);
    return app?.status === "Accepted" || item.status === "Accepted";
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          Loading university portal...
        </div>
      </main>
    );
  }

  if (mode === "login") {
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

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>

            <p className="mt-2 text-sm text-white/40">University Portal</p>
          </div>

          <nav className="space-y-2">
            {[
              ["Dashboard", "/university"],
              ["Applicants", "/university/applicants"],
              ["Documents", "/university/documents"],
              ["Profile", "/university/profile"],
              ["Settings", "/university/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/university"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/60 transition hover:bg-white/[0.06]"
          >
            Log out
          </button>
        </aside>

        <section className="relative flex-1 overflow-hidden p-4 pb-20 sm:p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute left-1/3 top-72 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                University Dashboard
              </p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
                {account?.university_name}
              </h2>

              <p className="mt-4 max-w-2xl text-sm text-white/45">
                Review routed applicants and send final decisions directly to
                the student application tracker.
              </p>
            </div>

            <button
              onClick={loadPortal}
              className="w-fit rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Refresh data
            </button>
          </div>

          {message && (
            <div className="relative mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
              {message}
            </div>
          )}

          {error && (
            <div className="relative mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="relative mb-8 grid gap-4 md:grid-cols-4">
            {[
              [String(applicants.length), "Total applicants"],
              [String(underReviewApplicants.length), "Under review"],
              [String(acceptedApplicants.length), "Accepted"],
              [account?.membership_tier || "Starter", "Membership"],
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

          <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-6 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold">Recent applicants</h3>

              <p className="mt-2 text-sm text-white/40">
                Student applications routed to your institution.
              </p>
            </div>

            <div className="space-y-4">
              {applicants.slice(0, 10).map((item) => {
                const app = getApplication(item.application_id);
                const profile = getProfile(item.student_user_id);
                const currentStatus =
                  app?.status || item.status || "New applicant";

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-white/10 bg-black/25 p-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                          Applicant
                        </p>

                        <h4 className="mt-2 text-xl font-semibold">
                          {profile?.full_name || "Unknown student"}
                        </h4>

                        <p className="mt-1 text-sm text-white/45">
                          {profile?.email || "No email"}
                        </p>

                        <p className="mt-2 text-sm text-white/45">
                          Program: {app?.program || "Program undecided"}
                        </p>

                        <p className="mt-1 text-sm text-white/45">
                          Application status: {currentStatus}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <select
                          value={currentStatus}
                          disabled={savingId === item.id}
                          onChange={(e) =>
                            updateApplicantStatus(item, e.target.value)
                          }
                          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none disabled:opacity-50"
                        >
                          {decisionStatuses.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-[#070B14]"
                            >
                              {status}
                            </option>
                          ))}
                        </select>

                        <span className="w-fit rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
                          {currentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500"
                        style={{ width: `${app?.progress || 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {!applicants.length && (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-8 text-center text-sm text-white/45">
                  No applicants have been routed to your institution yet.
                </div>
              )}
            </div>
          </div>
        </section>
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
