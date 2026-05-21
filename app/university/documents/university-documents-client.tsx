"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UniversityAccount = {
  id: string;
  user_id: string;
  university_name: string;
};

type ApplicantRow = {
  id: string;
  university_account_id: string;
  application_id: string;
  student_user_id: string;
  status: string | null;
};

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

export default function UniversityDocumentsPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedStudentId = searchParams.get("student");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState<UniversityAccount | null>(null);
  const [applicants, setApplicants] = useState<ApplicantRow[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);

  async function loadData() {
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

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
      setMessage(accountError.message);
      setLoading(false);
      return;
    }

    if (!universityAccount) {
      router.push("/university");
      return;
    }

    const { data: applicantData, error: applicantError } = await supabase
      .from("university_applicants")
      .select("*")
      .eq("university_account_id", universityAccount.id)
      .order("created_at", { ascending: false });

    if (applicantError) {
      setMessage(applicantError.message);
      setLoading(false);
      return;
    }

    const studentIds = Array.from(
      new Set((applicantData || []).map((item) => item.student_user_id))
    );

    let documentData: DocumentRow[] = [];
    let profileData: ProfileRow[] = [];

    if (studentIds.length > 0) {
      const { data: docs, error: docsError } = await supabase
        .from("documents")
        .select("*")
        .in("user_id", studentIds)
        .order("uploaded_at", { ascending: false });

      if (docsError) {
        setMessage(docsError.message);
      }

      documentData = docs || [];

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, phone")
        .in("user_id", studentIds);

      if (profilesError) {
        setMessage(profilesError.message);
      }

      profileData = profiles || [];
    }

    setAccount(universityAccount);
    setApplicants(applicantData || []);
    setDocuments(documentData);
    setProfiles(profileData);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function getProfile(userId: string) {
    return profiles.find((profile) => profile.user_id === userId);
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

  const visibleDocuments = useMemo(() => {
    if (!selectedStudentId) return documents;

    return documents.filter((doc) => doc.user_id === selectedStudentId);
  }, [documents, selectedStudentId]);

  const selectedProfile = selectedStudentId
    ? getProfile(selectedStudentId)
    : null;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading university documents...
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
              ["Messages", "/university/messages"],
              ["Profile", "/university/profile"],
              ["Settings", "/university/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/university/documents"
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

          <div className="relative mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                University Documents
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight lg:text-6xl">
                {selectedProfile?.full_name || account?.university_name}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">
                View uploaded student documents connected to applicants routed
                to your institution.
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
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

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            {[
              [String(applicants.length), "Applicants"],
              [String(documents.length), "All documents"],
              [String(visibleDocuments.length), "Visible documents"],
              [
                String(
                  visibleDocuments.filter(
                    (doc) =>
                      doc.status === "Verified" ||
                      doc.verification_stage === "Verified"
                  ).length
                ),
                "Verified",
              ],
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

          {selectedStudentId && (
            <div className="mb-6 rounded-3xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-5 text-sm text-fuchsia-100">
              Showing documents for:{" "}
              <span className="font-semibold">
                {selectedProfile?.full_name || selectedStudentId}
              </span>
              <Link
                href="/university/documents"
                className="ml-4 text-white underline"
              >
                Clear filter
              </Link>
            </div>
          )}

          <div className="grid gap-5">
            {visibleDocuments.map((doc) => {
              const profile = getProfile(doc.user_id);

              return (
                <div
                  key={doc.id}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                        {doc.document_type || "Document"}
                      </p>

                      <h2 className="mt-2 text-2xl font-semibold">
                        {profile?.full_name || "Unknown student"}
                      </h2>

                      <p className="mt-1 text-sm text-white/45">
                        {profile?.email || "No email"} ·{" "}
                        {profile?.phone || "No phone"}
                      </p>

                      <p className="mt-2 text-xs text-white/30">
                        Student ID: {doc.user_id}
                      </p>
                    </div>

                    <span className="w-fit rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
                      {doc.verification_stage || doc.status || "Uploaded"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <Info
                      label="Uploaded"
                      value={
                        doc.uploaded_at
                          ? new Date(doc.uploaded_at).toLocaleString()
                          : "Unknown"
                      }
                    />
                    <Info
                      label="Status"
                      value={doc.status || "Not set"}
                    />
                    <Info
                      label="Verification"
                      value={doc.verification_stage || "Not set"}
                    />
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => openDocument(doc.file_path)}
                      className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white"
                    >
                      Open document
                    </button>

                    <Link
                      href={`/university/applicants?student=${doc.user_id}`}
                      className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-center text-sm transition hover:bg-white/20"
                    >
                      Back to applicants
                    </Link>
                  </div>
                </div>
              );
            })}

            {!visibleDocuments.length && (
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-center text-white/45">
                No documents found for routed applicants.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-2 break-words text-sm text-white/75">{value}</p>
    </div>
  );
}