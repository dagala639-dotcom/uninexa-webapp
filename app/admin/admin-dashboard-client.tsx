"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type DocumentRow = {
  id: string;
  user_id: string;
  document_type: string | null;
  file_path: string | null;
  status: string | null;
  verification_stage: string | null;
  uploaded_at: string | null;
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

export type ConversationRow = {
  id: string;
  user_id: string;
  title: string | null;
  category: string | null;
  last_message: string | null;
  unread_count: number | null;
  updated_at: string | null;
};

export type UniversityRow = {
  id: string;
  name: string;
  status: string | null;
  featured: boolean | null;
};

export type AdminDashboardData = {
  studentCount: number;
  documents: DocumentRow[];
  applications: ApplicationRow[];
  conversations: ConversationRow[];
  universities: UniversityRow[];
  scholarshipTrackingCount: number;
};

export default function AdminDashboardClient({
  initialData,
}: {
  initialData: AdminDashboardData;
}) {
  const supabase = useMemo(() => createClient(), []);

  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");
  const [studentCount, setStudentCount] = useState(initialData.studentCount);
  const [documents, setDocuments] = useState(initialData.documents);
  const [applications, setApplications] = useState(initialData.applications);
  const [conversations, setConversations] = useState(initialData.conversations);
  const [universities, setUniversities] = useState(initialData.universities);
  const [scholarshipTrackingCount, setScholarshipTrackingCount] = useState(
    initialData.scholarshipTrackingCount
  );
  const [search, setSearch] = useState("");

  const loadAdminData = useCallback(async () => {
    setMessage("");

    const [
      { count: profilesCount },
      { data: docs, error: documentsError },
      { data: apps, error: applicationsError },
      { data: convos, error: conversationsError },
      { data: universityData, error: universitiesError },
      { count: trackedCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("documents").select("*").order("uploaded_at", { ascending: false }),
      supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false }),
      supabase
        .from("universities")
        .select("id, name, status, featured")
        .order("created_at", { ascending: false }),
      supabase
        .from("student_scholarships")
        .select("*", { count: "exact", head: true }),
    ]);

    const firstError =
      documentsError ||
      applicationsError ||
      conversationsError ||
      universitiesError;

    if (firstError) {
      setMessage(firstError.message);
      return;
    }

    setStudentCount(profilesCount || 0);
    setDocuments(docs || []);
    setApplications(apps || []);
    setConversations(convos || []);
    setUniversities(universityData || []);
    setScholarshipTrackingCount(trackedCount || 0);
  }, [supabase]);

  const updateKcseStatus = useCallback(
    async (documentId: string, status: string, verificationStage: string) => {
      setSavingId(documentId);
      setMessage("");

      const { error } = await supabase
        .from("documents")
        .update({
          status,
          verification_stage: verificationStage,
        })
        .eq("id", documentId);

      if (error) {
        setMessage(error.message);
        setSavingId("");
        return;
      }

      setMessage("KCSE status saved successfully.");
      await loadAdminData();
      setSavingId("");
    },
    [loadAdminData, supabase]
  );

  const pendingKcse = documents.filter(
    (doc) =>
      doc.document_type === "KCSE Certificate" &&
      doc.status !== "Verified"
  );

  const submittedApplications = applications.filter(
    (app) => app.status === "Submitted"
  );

  const publishedUniversities = universities.filter(
    (uni) => uni.status === "Published"
  );

  const filteredApplications = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return applications;

    return applications.filter((app) => {
      return (
        app.university_name?.toLowerCase().includes(term) ||
        app.country?.toLowerCase().includes(term) ||
        app.program?.toLowerCase().includes(term) ||
        app.status?.toLowerCase().includes(term) ||
        app.user_id?.toLowerCase().includes(term)
      );
    });
  }, [applications, search]);

  const revenueEstimate = applications.length * 80;

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
                  href === "/admin"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard"
            className="mt-8 block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.06]"
          >
            Back to student portal
          </Link>
        </aside>

        <section className="relative flex-1 overflow-hidden p-4 pb-20 sm:p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute left-1/3 top-72 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                Admin Dashboard
              </p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
                UniNexa control center.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
                Student operations, KCSE verification, applications, documents,
                universities, scholarships, and admissions support.
              </p>
            </div>

            <button
              type="button"
              onClick={loadAdminData}
              className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm text-white/80 transition hover:bg-white/15"
            >
              Refresh data
            </button>
          </div>

          {message && (
            <div className="relative mb-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
              {message}
            </div>
          )}

          <div className="relative mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
            {[
              [String(studentCount), "Students"],
              [String(applications.length), "Applications"],
              [String(submittedApplications.length), "Submitted"],
              [String(documents.length), "Documents"],
              [String(pendingKcse.length), "KCSE pending"],
              [String(publishedUniversities.length), "Universities"],
              [`$${revenueEstimate}`, "Est. revenue"],
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

          <div className="relative mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="grid gap-4 lg:grid-cols-[1fr_0.35fr]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applications by university, country, program, status, or student ID..."
                className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50"
              />

              <button
                onClick={loadAdminData}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-4 text-sm font-semibold"
              >
                Refresh dashboard
              </button>
            </div>
          </div>

          <div className="relative grid gap-8 xl:grid-cols-[1.25fr_0.9fr]">
            <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-6 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl">
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">
                    KCSE verification queue
                  </h3>
                  <p className="mt-2 text-sm text-white/40">
                    Update certificate progress. Changes save to Supabase.
                  </p>
                </div>

                <Link
                  href="/admin/kcse-verification"
                  className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Open queue
                </Link>
              </div>

              <div className="space-y-4">
                {documents
                  .filter((doc) => doc.document_type === "KCSE Certificate")
                  .slice(0, 8)
                  .map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-3xl border border-white/10 bg-black/25 p-5"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                            KCSE Certificate
                          </p>

                          <h4 className="mt-2 text-lg font-semibold">
                            Student ID: {doc.user_id}
                          </h4>

                          <p className="mt-1 text-sm text-white/40">
                            Current stage: {doc.verification_stage || "Not set"}
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            Uploaded:{" "}
                            {doc.uploaded_at
                              ? new Date(doc.uploaded_at).toLocaleString()
                              : "Unknown"}
                          </p>
                        </div>

                        <span className="w-fit rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-200">
                          {doc.status || "Pending"}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                          ["Under Review", "Under Review"],
                          ["Sent to KNEC", "Sent to KNEC"],
                          ["Pending KNEC", "Pending KNEC Approval"],
                          ["Verified", "Verified"],
                        ].map(([label, stage]) => (
                          <button
                            key={stage}
                            onClick={() =>
                              updateKcseStatus(doc.id, label, stage)
                            }
                            disabled={savingId === doc.id}
                            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-50 ${
                              doc.verification_stage === stage
                                ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            {savingId === doc.id ? "Saving..." : label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                {pendingKcse.length === 0 && (
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-6 text-sm text-white/50">
                    No KCSE certificates are currently pending.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">Quick actions</h3>

                <div className="mt-5 space-y-3">
                  {[
                    ["Manage universities", "/admin/universities"],
                    ["Review documents", "/admin/documents"],
                    ["Update KCSE status", "/admin/kcse-verification"],
                    ["Message students", "/admin/messages"],
                    ["View applications", "/admin/applications"],
                    ["Manage scholarships", "/admin/scholarships"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65 transition hover:bg-white/[0.06]"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">Operational health</h3>

                <div className="mt-5 space-y-3">
                  {[
                    ["Published universities", String(publishedUniversities.length)],
                    ["Scholarship tracking", String(scholarshipTrackingCount)],
                    ["Conversations", String(conversations.length)],
                    ["Submitted applications", String(submittedApplications.length)],
                    ["Pending KCSE", String(pendingKcse.length)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
                    >
                      <span className="text-sm text-white/55">{label}</span>
                      <span className="text-sm font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">Recent applications</h3>

                <div className="mt-5 space-y-3">
                  {filteredApplications.slice(0, 6).map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="font-medium">
                        {app.university_name || "Unnamed university"}
                      </p>

                      <p className="mt-1 text-sm text-white/40">
                        {app.country || "Country not set"} ·{" "}
                        {app.status || "In progress"}
                      </p>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500"
                          style={{ width: `${app.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {!filteredApplications.length && (
                    <p className="text-sm text-white/45">
                      No applications found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
