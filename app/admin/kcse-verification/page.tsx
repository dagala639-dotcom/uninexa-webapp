"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type KcseDocument = {
  id: string;
  user_id: string;
  document_type: string | null;
  file_path: string | null;
  status: string | null;
  verification_stage: string | null;
  verification_reference?: string | null;
  verification_notes?: string | null;
  reviewed_at?: string | null;
  knec_submission_date?: string | null;
  verification_completed_at?: string | null;
  uploaded_at: string | null;
};

type Profile = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  high_school_name: string | null;
  kcse_index_number: string | null;
  kcse_mean_grade: string | null;
  year_completed: string | null;
};

const stages = [
  "Uploaded",
  "Under Review",
  "Sent to KNEC",
  "Pending KNEC Approval",
  "Verified",
  "Rejected",
  "Needs Resubmission",
];

export default function AdminKcseVerificationPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<KcseDocument[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState("");
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

    const { data: docs, error } = await supabase
      .from("documents")
      .select("*")
      .eq("document_type", "KCSE Certificate")
      .order("uploaded_at", { ascending: false });

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(
        "user_id, full_name, email, phone, high_school_name, kcse_index_number, kcse_mean_grade, year_completed"
      );

    if (error) setMessage(error.message);
    if (profileError) setMessage(profileError.message);

    setDocuments(docs || []);
    setProfiles(profileData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function getProfile(userId: string) {
    return profiles.find((profile) => profile.user_id === userId);
  }

  async function updateStage(documentId: string, stage: string) {
    setSavingId(documentId);
    setMessage("");

    const payload: Record<string, string> = {
      status: stage,
      verification_stage: stage,
      reviewed_at: new Date().toISOString(),
    };

    if (stage === "Sent to KNEC") {
      payload.knec_submission_date = new Date().toISOString();
    }

    if (stage === "Verified") {
      payload.verification_completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("documents")
      .update(payload)
      .eq("id", documentId);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(`KCSE status updated to ${stage}.`);
      await loadData();
    }

    setSavingId("");
  }

  async function saveNotes(
    documentId: string,
    reference: string,
    notes: string
  ) {
    setSavingId(documentId);
    setMessage("");

    const { error } = await supabase
      .from("documents")
      .update({
        verification_reference: reference,
        verification_notes: notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Verification notes saved.");
      await loadData();
    }

    setSavingId("");
  }

  async function openDocument(filePath: string | null) {
    if (!filePath) {
      setMessage("This document has no file path.");
      return;
    }

    const { data, error } = await supabase.storage
      .from("student-documents")
      .createSignedUrl(filePath, 60);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  }

  const filteredDocuments = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return documents;

    return documents.filter((doc) => {
      const profile = getProfile(doc.user_id);

      return (
        profile?.full_name?.toLowerCase().includes(term) ||
        profile?.email?.toLowerCase().includes(term) ||
        profile?.phone?.toLowerCase().includes(term) ||
        profile?.high_school_name?.toLowerCase().includes(term) ||
        profile?.kcse_index_number?.toLowerCase().includes(term) ||
        profile?.kcse_mean_grade?.toLowerCase().includes(term) ||
        doc.status?.toLowerCase().includes(term) ||
        doc.verification_stage?.toLowerCase().includes(term) ||
        doc.verification_reference?.toLowerCase().includes(term) ||
        doc.user_id.toLowerCase().includes(term)
      );
    });
  }, [documents, profiles, search]);

  const verifiedCount = documents.filter(
    (doc) => doc.verification_stage === "Verified"
  ).length;

  const pendingCount = documents.filter(
    (doc) =>
      doc.verification_stage !== "Verified" &&
      doc.verification_stage !== "Rejected"
  ).length;

  const knecCount = documents.filter(
    (doc) =>
      doc.verification_stage === "Sent to KNEC" ||
      doc.verification_stage === "Pending KNEC Approval"
  ).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          Loading KCSE verification queue...
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
                  href === "/admin/kcse-verification"
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

          <div className="relative mb-8">
            <p className="text-sm font-medium text-fuchsia-300">
              KCSE Verification
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
              KNEC workflow center.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              Manage KCSE certificate review, KNEC submission tracking,
              verification references, resubmission requests, and audit notes.
            </p>
          </div>

          {message && (
            <div className="relative mb-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
              {message}
            </div>
          )}

          <div className="relative mb-8 grid gap-4 md:grid-cols-4">
            {[
              [String(documents.length), "KCSE uploads"],
              [String(pendingCount), "Pending workflow"],
              [String(knecCount), "With KNEC"],
              [String(verifiedCount), "Verified"],
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

          <div className="relative mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl lg:grid-cols-[1fr_0.25fr]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, email, school, KCSE index number, grade, status, reference, or ID..."
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50"
            />

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
              <h3 className="text-2xl font-semibold">
                Verification queue
              </h3>
              <p className="mt-2 text-sm text-white/40">
                UniNexa facilitates and manages KNEC verification workflows.
              </p>
            </div>

            <div className="grid gap-5">
              {filteredDocuments.map((doc) => {
                const profile = getProfile(doc.user_id);

                return (
                  <KcseCard
                    key={doc.id}
                    doc={doc}
                    profile={profile}
                    savingId={savingId}
                    onOpen={() => openDocument(doc.file_path)}
                    onStage={(stage) => updateStage(doc.id, stage)}
                    onSaveNotes={(reference, notes) =>
                      saveNotes(doc.id, reference, notes)
                    }
                  />
                );
              })}

              {!filteredDocuments.length && (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-8 text-center text-sm text-white/45">
                  No KCSE certificates found.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function KcseCard({
  doc,
  profile,
  savingId,
  onOpen,
  onStage,
  onSaveNotes,
}: {
  doc: KcseDocument;
  profile?: Profile;
  savingId: string;
  onOpen: () => void;
  onStage: (stage: string) => void;
  onSaveNotes: (reference: string, notes: string) => void;
}) {
  const [reference, setReference] = useState(doc.verification_reference || "");
  const [notes, setNotes] = useState(doc.verification_notes || "");

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/25 p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
            KCSE Certificate
          </p>

          <h4 className="mt-2 text-2xl font-semibold">
            {profile?.full_name || "Unknown student"}
          </h4>

          <p className="mt-1 text-sm text-white/45">
            {profile?.email || "No email"} · {profile?.phone || "No phone"}
          </p>

          <p className="mt-1 text-xs text-white/30">
            Student ID: {doc.user_id}
          </p>
        </div>

        <span className="w-fit rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
          {doc.verification_stage || doc.status || "Uploaded"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Info label="High school" value={profile?.high_school_name || "Not set"} />
        <Info label="KCSE index" value={profile?.kcse_index_number || "Not set"} />
        <Info label="KCSE grade" value={profile?.kcse_mean_grade || "Not set"} />
        <Info label="Year" value={profile?.year_completed || "Not set"} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {stages.map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() => onStage(stage)}
            disabled={savingId === doc.id}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-50 ${
              doc.verification_stage === stage || doc.status === stage
                ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {savingId === doc.id ? "Saving..." : stage}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-white/60">
            KNEC / internal reference
          </label>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. KNEC-QMIS-2026-001"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/60">
            Verification notes
          </label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes, rejection reason, or KNEC status..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onOpen}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white"
        >
          Open certificate
        </button>

        <button
          type="button"
          onClick={() => onSaveNotes(reference, notes)}
          disabled={savingId === doc.id}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-50"
        >
          {savingId === doc.id ? "Saving..." : "Save notes"}
        </button>
      </div>
    </div>
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
