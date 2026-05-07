"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "../logout-button";
import MobileNav from "../mobile-nav";

const documentTemplates = [
  { name: "KCSE Certificate", required: true, special: true },
  { name: "Passport / National ID", required: true },
  { name: "Academic Transcript", required: true },
  { name: "Personal Statement", required: true },
  { name: "Recommendation Letter", required: false },
  { name: "English Test Result", required: false },
  { name: "Birth Certificate", required: false },
  { name: "Sponsor / Bank Statement", required: false },
];

const kcseStages = [
  "Uploaded",
  "Under Review",
  "Sent to KNEC",
  "Pending KNEC Approval",
  "Verified",
];

export default function DocumentsPage() {
  const supabase = createClient();

  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState("");
  const [deleting, setDeleting] = useState("");
  const [message, setMessage] = useState("");

  const loadDocuments = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false });

    if (error) {
      setMessage(error.message);
      return;
    }

    setDocuments(data || []);
  }, [supabase]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  async function uploadDocument(
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(documentType);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in first.");
      setUploading("");
      return;
    }

    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const safeDocumentType = documentType.replace(/[^a-zA-Z0-9-]/g, "-");
    const filePath = `${user.id}/${safeDocumentType}/${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("student-documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      setMessage(uploadError.message);
      setUploading("");
      return;
    }

    const existing = documents.find(
      (doc) => doc.document_type === documentType
    );

    if (existing?.file_path) {
      await supabase.storage
        .from("student-documents")
        .remove([existing.file_path]);
    }

    const payload = {
      user_id: user.id,
      document_type: documentType,
      file_path: filePath,
      status: documentType === "KCSE Certificate" ? "Under Review" : "Uploaded",
      verification_stage:
        documentType === "KCSE Certificate" ? "Uploaded" : "Completed",
      uploaded_at: new Date().toISOString(),
    };

    const { error: dbError } = existing
      ? await supabase.from("documents").update(payload).eq("id", existing.id)
      : await supabase.from("documents").insert(payload);

    if (dbError) {
      setMessage(dbError.message);
      setUploading("");
      return;
    }

    await loadDocuments();

    setMessage(`${documentType} uploaded successfully.`);
    setUploading("");
    e.target.value = "";
  }

  async function deleteDocument(document: any) {
    const confirmed = window.confirm(`Delete ${document.document_type}?`);
    if (!confirmed) return;

    setDeleting(document.id);
    setMessage("");

    if (document.file_path) {
      const { error: storageError } = await supabase.storage
        .from("student-documents")
        .remove([document.file_path]);

      if (storageError) {
        setMessage(storageError.message);
        setDeleting("");
        return;
      }
    }

    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", document.id);

    if (dbError) {
      setMessage(dbError.message);
      setDeleting("");
      return;
    }

    await loadDocuments();

    setMessage(`${document.document_type} deleted.`);
    setDeleting("");
  }

  function getDocument(documentType: string) {
    return documents.find((doc) => doc.document_type === documentType);
  }

  function getKcseProgress(stage?: string) {
    const cleanStage = stage?.trim().toLowerCase();

    if (!cleanStage) return "w-0";
    if (cleanStage === "uploaded") return "w-[20%]";
    if (cleanStage === "under review") return "w-[40%]";
    if (cleanStage === "sent to knec") return "w-[60%]";
    if (cleanStage === "pending knec approval") return "w-[80%]";
    if (cleanStage === "verified") return "w-full";

    return "w-0";
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
                  href === "/dashboard/documents"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="relative flex-1 overflow-hidden p-4 pb-28 sm:p-6 lg:p-10">
          <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute left-1/3 top-80 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">Documents</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl">
                Upload your documents.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
                Securely upload student documents, track verification progress,
                and monitor KCSE approval status.
              </p>
            </div>

            <LogoutButton />
          </div>

          {message && (
            <div className="relative mb-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
              {message}
            </div>
          )}

          <div className="relative mb-8 rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-5 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [String(documents.length), "Uploaded documents"],
                [
                  String(
                    documents.filter(
                      (doc) =>
                        doc.status === "Uploaded" ||
                        doc.status === "Completed" ||
                        doc.verification_stage === "Completed"
                    ).length
                  ),
                  "Completed",
                ],
                [
                  String(
                    documents.filter((doc) => doc.status === "Under Review")
                      .length
                  ),
                  "Under review",
                ],
                [
                  String(
                    documents.filter(
                      (doc) =>
                        doc.verification_stage === "Pending KNEC Approval"
                    ).length
                  ),
                  "Pending KNEC",
                ],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-black/20 p-5"
                >
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="mt-2 text-sm text-white/40">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            {documentTemplates.map((docTemplate) => {
              const document = getDocument(docTemplate.name);

              return (
                <div
                  key={docTemplate.name}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-semibold">
                          {docTemplate.name}
                        </h3>

                        {docTemplate.required ? (
                          <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs text-red-200">
                            Required
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/60">
                            Optional
                          </span>
                        )}

                        {document && (
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                            {document.status}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45">
                        {docTemplate.name === "KCSE Certificate"
                          ? "Your KCSE certificate will be reviewed by UniNexa and later sent to KNEC for verification."
                          : "Upload a clear and valid document file."}
                      </p>

                      {docTemplate.name === "KCSE Certificate" && (
                        <div className="mt-6">
                          <div className="mb-4 grid grid-cols-5 gap-2 text-xs text-white/40">
                            {kcseStages.map((step) => (
                              <span key={step}>{step}</span>
                            ))}
                          </div>

                          <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 ${getKcseProgress(
                                document?.verification_stage
                              )}`}
                            />
                          </div>

                          <p className="mt-4 text-sm text-fuchsia-200">
                            Current stage:{" "}
                            {document?.verification_stage || "Not uploaded"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="w-full lg:w-auto">
                      <label className="flex cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]">
                        {uploading === docTemplate.name
                          ? "Uploading..."
                          : document
                          ? "Replace document"
                          : "Upload document"}

                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          className="hidden"
                          disabled={uploading === docTemplate.name}
                          onChange={(e) => uploadDocument(e, docTemplate.name)}
                        />
                      </label>
                    </div>
                  </div>

                  {document?.file_path && (
                    <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                            ✓
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-emerald-200">
                              Document uploaded successfully
                            </p>
                            <p className="mt-1 text-xs text-white/40">
                              Securely stored in UniNexa cloud storage
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="rounded-full border border-emerald-400/20 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                            Uploaded
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteDocument(document)}
                            disabled={deleting === document.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-sm font-bold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                          >
                            {deleting === document.id ? "…" : "×"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}