"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UniversityAccount = {
  id: string;
  user_id: string;
  university_name: string;
};

type UniversityApplicant = {
  id: string;
  university_account_id: string;
  application_id: string;
  student_user_id: string;
  status: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at?: string | null;
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
  submitted_at?: string | null;
};

type ProfileRow = {
  user_id: string;
  full_name: string | null;
};

export default function UniversityApplicantsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [account, setAccount] =
    useState<UniversityAccount | null>(null);

  const [applicants, setApplicants] = useState<
    UniversityApplicant[]
  >([]);

  const [applications, setApplications] = useState<
    ApplicationRow[]
  >([]);

  const [profiles, setProfiles] = useState<
    ProfileRow[]
  >([]);

  const [savingId, setSavingId] = useState("");

  async function loadApplicants() {
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      router.push("/university");
      return;
    }

    const {
      data: universityAccount,
      error: accountError,
    } = await supabase
      .from("university_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (accountError) {
      setMessage(accountError.message);
      setLoading(false);
      return;
    }

    if (!universityAccount) {
      router.push("/university");
      return;
    }

    const {
      data: applicantData,
      error: applicantError,
    } = await supabase
      .from("university_applicants")
      .select("*")
      .eq(
        "university_account_id",
        universityAccount.id
      )
      .order("created_at", {
        ascending: false,
      });

    if (applicantError) {
      setMessage(applicantError.message);
      setLoading(false);
      return;
    }

    const applicationIds =
      applicantData?.map(
        (a) => a.application_id
      ) || [];

    let applicationData: ApplicationRow[] = [];

    if (applicationIds.length > 0) {
      const {
        data,
        error: applicationsError,
      } = await supabase
        .from("applications")
        .select("*")
        .in("id", applicationIds);

      if (applicationsError) {
        setMessage(applicationsError.message);
      }

      applicationData = data || [];
    }

    const studentIds =
      applicantData?.map(
        (a) => a.student_user_id
      ) || [];

    let profileData: ProfileRow[] = [];

    if (studentIds.length > 0) {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", studentIds);

      profileData = data || [];
    }

    setAccount(universityAccount);
    setApplicants(applicantData || []);
    setApplications(applicationData);
    setProfiles(profileData);

    setLoading(false);
  }

  useEffect(() => {
    loadApplicants();
  }, []);
async function updateApplicantStatus(
  applicantId: string,
  applicationId: string,
  status: string
) {
  setSavingId(applicantId);
  setMessage("");

  const { error: applicantError } = await supabase
    .from("university_applicants")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicantId);

  if (applicantError) {
    setMessage(applicantError.message);
    setSavingId("");
    return;
  }

  const { error: applicationError } = await supabase
    .from("applications")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (applicationError) {
    setMessage(applicationError.message);
  } else {
    await loadApplicants();
  }

  setSavingId("");
}

  function getApplication(
    applicationId: string
  ) {
    return applications.find(
      (app) => app.id === applicationId
    );
  }

  function getProfile(studentId: string) {
    return profiles.find(
      (profile) => profile.user_id === studentId
    );
  }

  const stats = useMemo(() => {
    return {
      total: applicants.length,

      underReview: applicants.filter(
        (a) => a.status === "Under review"
      ).length,

      accepted: applicants.filter(
        (a) => a.status === "Accepted"
      ).length,

      rejected: applicants.filter(
        (a) => a.status === "Rejected"
      ).length,
    };
  }, [applicants]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading applicants...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>

            <p className="mt-2 text-sm text-white/40">
              University Portal
            </p>
          </div>

          <nav className="space-y-2">
            {[
              ["Dashboard", "/university"],
              [
                "Applicants",
                "/university/applicants",
              ],
              [
                "Documents",
                "/university/documents",
              ],
              [
                "Messages",
                "/university/messages",
              ],
              [
                "Profile",
                "/university/profile",
              ],
              [
                "Settings",
                "/university/settings",
              ],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href ===
                  "/university/applicants"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <section className="relative flex-1 overflow-hidden p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />

          <div className="relative mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                Applicant Pipeline
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight lg:text-6xl">
                {account?.university_name}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">
                Review applicants,
                update admissions stages,
                and manage your
                institutional admissions
                workflow.
              </p>
            </div>

            <button
              type="button"
              onClick={loadApplicants}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Refresh
            </button>
          </div>

          {message && (
            <div className="relative mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
              {message}
            </div>
          )}

          {/* STATS */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {[
              [
                String(stats.total),
                "Total applicants",
              ],

              [
                String(stats.underReview),
                "Under review",
              ],

              [
                String(stats.accepted),
                "Accepted",
              ],

              [
                String(stats.rejected),
                "Rejected",
              ],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <p className="text-3xl font-bold">
                  {value}
                </p>

                <p className="mt-2 text-sm text-white/40">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* APPLICANTS */}
          <div className="space-y-5">
            {applicants.map((item) => {
              const app = getApplication(
                item.application_id
              );

              const profile = getProfile(
                item.student_user_id
              );

              return (
                <div
                  key={item.id}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                        Applicant
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold">
                        {app?.program ||
                          "Program not specified"}
                      </h2>

                      <p className="mt-1 text-sm text-white/40">
                        {app?.university_name ||
                          account?.university_name}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/45">
                        <span>
                          Country:{" "}
                          {app?.country ||
                            "Unknown"}
                        </span>

                        <span>
                          Student:{" "}
                          {profile?.full_name ||
                            "Unknown student"}
                        </span>

                        <span>
                          Submitted:{" "}
                          {app?.submitted_at
                            ? new Date(
                                app.submitted_at
                              ).toLocaleDateString()
                            : item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </div>

                      <div className="mt-5 h-2 w-full max-w-xl overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500"
                          style={{
                            width: `${
                              app?.progress || 0
                            }%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-white/35">
                        Application progress:{" "}
                        {app?.progress || 0}%
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <select
                        value={
                          item.status ||
                          "New applicant"
                        }
                       onChange={(e) =>
  updateApplicantStatus(
    item.id,
    item.application_id,
    e.target.value
  )
}
                        disabled={
                          savingId === item.id
                        }
                        className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none disabled:opacity-50"
                      >
                        {[
                          "New applicant",
                          "Under review",
                          "Interview",
                          "Conditional offer",
                          "Accepted",
                          "Rejected",
                        ].map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-[#070B14]"
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                      <Link
                        href={`/university/documents?student=${item.student_user_id}`}
                        className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-center text-sm transition hover:bg-white/20"
                      >
                        View documents
                      </Link>

                      <Link
                        href={`/university/applicants/${item.id}`}
                        className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-5 py-3 text-center text-sm font-semibold"
                      >
                        Open applicant
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {!applicants.length && (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center text-white/45">
                No applicants routed to
                your institution yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}