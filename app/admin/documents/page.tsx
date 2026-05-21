"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type DocumentRow = {
  id: string;
  user_id: string;
  document_type: string | null;
  file_path: string | null;
  status: string | null;
  verification_stage: string | null;
  uploaded_at: string | null;
};

type ProfileRow = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
};

const statusOptions = [
  "Uploaded",
  "Under Review",
  "Sent to KNEC",
  "Pending KNEC Approval",
  "Verified",
  "Rejected",
  "Needs Resubmission",
];

export default function AdminDocumentsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
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

    const { data: docs, error: docsError } = await supabase
      .from("documents")
      .select("*")
      .order("uploaded_at", { ascending: false });

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, full_name, email, phone");

    if (docsError) {
      setMessage(docsError.message);
    }

    if (profileError) {
      setMessage(profileError.message);
    }

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

  async function updateDocumentStatus(documentId: string, status: string) {
    setSavingId(documentId);
    setMessage("");

    const verificationStage =
      status === "Verified"
        ? "Verified"
        : status === "Sent to KNEC"
          ? "Sent to KNEC"
          : status === "Pending KNEC Approval"
            ? "Pending KNEC Approval"
            : status === "Under Review"
              ? "Under Review"
              : status;

    const { error } = await supabase
      .from("documents")
      .update({
        status,
        verification_stage: verificationStage,
      })
      .eq("id", documentId);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Document status updated.");
      await loadData();
    }

    setSavingId("");
  }

  async function getSignedUrl(filePath: string | null) {
    if (!filePath) {
      setMessage("No file path found.");
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

  const documentTypes = useMemo(() => {
    const types = documents
      .map((doc) => doc.document_type)
      .filter(Boolean) as string[];

    return ["All", ...Array.from(new Set(types))];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const term = search.toLowerCase().trim();

    return documents.filter((doc) => {
      const profile = getProfile(doc.user_id);

      const matchesFilter =
        filter === "All" || doc.document_type === filter;

      const matchesSearch =
        !term ||
        doc.document_type?.toLowerCase().includes(term) ||
        doc.status?.toLowerCase().includes(term) ||
        doc.verification_stage?.toLowerCase().includes(term) ||
        doc.user_id.toLowerCase().includes(term) ||
        profile?.full_name?.toLowerCase().includes(term) ||
        profile?.email?.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [documents, profiles, search, filter]);

  const verifiedCount = documents.filter(
    (doc) => doc.status === "Verified" || doc.verification_stage === "Verified"
  ).length;

  const pendingCount = documents.filter(
    (doc) => doc.status !== "Verified" && doc.verification_stage !== "Verified"
  ).length;

  const kcseCount = documents.filter(
    (doc) => doc.document_type === "KCSE Certificate"
  ).length;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          Loading documents...
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
                  href === "/admin/documents"
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
              Documents
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
              Document review center.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              Review student uploads, open secure documents, update verification
              stages, and manage KCSE document workflows.
            </p>
          </div>

          {message && (
            <div className="relative mb-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
              {message}
            </div>
          )}

          <div className="relative mb-8 grid gap-4 md:grid-cols-4">
            {[
              [String(documents.length), "Total documents"],
              [String(verifiedCount), "Verified"],
              [String(pendingCount), "Pending review"],
              [String(kcseCount), "KCSE certificates"],
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
              placeholder="Search by student name, email, document type, status, or student ID..."
              className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none focus:border-fuchsia-400/50"
            >
              {documentTypes.map((type) => (
                <option key={type} value={type} className="bg-[#070B14]">
                  {type}
                </option>
              ))}
            </select>

            <button
              onClick={loadData}
              className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Refresh
            </button>
          </div>

          <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-5 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl sm:p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold">Uploaded documents</h3>
              <p className="mt-2 text-sm text-white/40">
                Connected to Supabase Storage and the documents table.
              </p>
            </div>

            <div className="grid gap-5">
              {filteredDocuments.map((doc) => {
                const profile = getProfile(doc.user_id);

                return (
                  <div
                    key={doc.id}
                    className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                          {doc.document_type || "Document"}
                        </p>

                        <h4 className="mt-2 text-2xl font-semibold">
                          {profile?.full_name || "Unknown student"}
                        </h4>

                        <p className="mt-1 text-sm text-white/45">
                          {profile?.email || "No email"} ·{" "}
                          {profile?.phone || "No phone"}
                        </p>

                        <p className="mt-1 break-all text-xs text-white/30">
                          Student ID: {doc.user_id}
                        </p>
                      </div>

                      <div className="w-fit rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
                        {doc.status || "Pending"}
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                      <Info
                        label="Verification stage"
                        value={doc.verification_stage || "Not set"}
                      />

                      <Info
                        label="Uploaded"
                        value={
                          doc.uploaded_at
                            ? new Date(doc.uploaded_at).toLocaleString()
                            : "Unknown"
                        }
                      />

                      <Info
                        label="File path"
                        value={doc.file_path ? "Stored securely" : "Missing"}
                      />

                      <Info
                        label="Document ID"
                        value={doc.id.slice(0, 8) + "..."}
                      />
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_0.35fr]">
                      <select
                        value={doc.status || ""}
                        onChange={(e) =>
                          updateDocumentStatus(doc.id, e.target.value)
                        }
                        disabled={savingId === doc.id}
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none focus:border-fuchsia-400/50 disabled:opacity-50"
                      >
                        <option value="" className="bg-[#070B14]">
                          Select status
                        </option>

                        {statusOptions.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-[#070B14]"
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => getSignedUrl(doc.file_path)}
                        className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-4 text-sm font-semibold text-white"
                      >
                        Open document
                      </button>
                    </div>
                  </div>
                );
              })}

              {!filteredDocuments.length && (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-8 text-center text-sm text-white/45">
                  No documents found.
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