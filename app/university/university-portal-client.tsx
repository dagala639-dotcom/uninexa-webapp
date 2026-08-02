"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type UniversityAccount = {
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

export type UniversityApplicant = {
  id: string;
  university_account_id: string;
  application_id: string;
  student_user_id: string;
  status: string | null;
  notes: string | null;
  created_at: string | null;
};

export type ApplicationRow = {
  id: string;
  user_id: string;
  university_name: string | null;
  country: string | null;
  program: string | null;
  status: string | null;
  progress: number | null;
  created_at: string | null;
};

export type ProfileRow = {
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

export default function UniversityPortalClient({
  initialAccount,
  initialApplicants,
  initialApplications,
  initialProfiles,
}: {
  initialAccount: UniversityAccount;
  initialApplicants: UniversityApplicant[];
  initialApplications: ApplicationRow[];
  initialProfiles: ProfileRow[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState("");
  const [account, setAccount] = useState<UniversityAccount | null>(initialAccount);
  const [applicants, setApplicants] = useState(initialApplicants);
  const [applications, setApplications] = useState(initialApplications);
  const [profiles, setProfiles] = useState(initialProfiles);

  const loadPortal = useCallback(async () => {
    setError("");
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/university");
      return;
    }

    const { data: universityAccount, error: accountError } = await supabase
      .from("university_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (accountError) {
      setError(accountError.message);
      return;
    }

    if (!universityAccount) {
      router.push("/dashboard");
      return;
    }

    const { data: applicantData, error: applicantError } = await supabase
      .from("university_applicants")
      .select("*")
      .eq("university_account_id", universityAccount.id)
      .order("created_at", { ascending: false });

    if (applicantError) {
      setError(applicantError.message);
      return;
    }

    const applicationIds = applicantData?.map((item) => item.application_id) || [];
    const studentIds = applicantData?.map((item) => item.student_user_id) || [];

    let applicationData: ApplicationRow[] = [];
    let profileData: ProfileRow[] = [];

    if (applicationIds.length > 0) {
      const { data, error: applicationError } = await supabase
        .from("applications")
        .select("*")
        .in("id", applicationIds);

      if (applicationError) {
        setError(applicationError.message);
        return;
      }

      applicationData = data || [];
    }

    if (studentIds.length > 0) {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", studentIds);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      profileData = data || [];
    }

    setAccount(universityAccount);
    setApplicants(applicantData || []);
    setApplications(applicationData);
    setProfiles(profileData);
  }, [router, supabase]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/university");
    router.refresh();
  }, [router, supabase]);

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

  const updateApplicantStatus = useCallback(
    async (item: UniversityApplicant, status: string) => {
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
    },
    [supabase]
  );

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
