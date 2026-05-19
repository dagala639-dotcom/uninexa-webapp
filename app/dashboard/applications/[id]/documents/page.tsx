import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../../logout-button";
import MobileNav from "../../../mobile-nav";
import { getUniversityQuestions } from "../university-questions";
import { saveDocumentsDraft } from "./actions";

export default async function DocumentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const saved = (await searchParams)?.saved;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!application) redirect("/dashboard/applications");

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id);

  const { data: draft } = await supabase
    .from("application_forms")
    .select("*")
    .eq("application_id", id)
    .eq("user_id", user.id)
    .eq("section", "documents")
    .maybeSingle();

  const questions = getUniversityQuestions(application.university_name).documents;
  const answers = draft?.answers || {};
  const saveDraft = saveDocumentsDraft.bind(null, id);

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[320px] shrink-0 border-r border-white/10 bg-[#0A0F1D] p-5 lg:block">
          <Link href="/dashboard/applications" className="text-sm text-fuchsia-300">
            ← Back to applications
          </Link>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
              Apply to
            </p>
            <h1 className="mt-3 text-2xl font-bold">
              {application.university_name}
            </h1>
            <p className="mt-2 text-sm text-white/45">
              {application.country || "Country not set"}
            </p>
          </div>

          <nav className="mt-6 space-y-2">
            {[
              ["Application Information", `/dashboard/applications/${id}`],
              ["General", `/dashboard/applications/${id}/general`],
              ["Academics", `/dashboard/applications/${id}/academics`],
              ["Testing", `/dashboard/applications/${id}/testing`],
              ["Activities", `/dashboard/applications/${id}/activities`],
              ["Family", `/dashboard/applications/${id}/family`],
              ["Documents", `/dashboard/applications/${id}/documents`],
              ["Recommendations", `/dashboard/applications/${id}/recommendations`],
              ["Billing", `/dashboard/applications/${id}/billing`],
              ["Review & Submit", `/dashboard/applications/${id}/review`],
            ].map(([name, href]) => (
              <Link
                key={name}
                href={href}
                className={`block rounded-2xl border px-4 py-4 text-sm transition ${
                  name === "Documents"
                    ? "border-fuchsia-400/40 bg-fuchsia-500/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/55 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-4 pb-28 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">Documents</p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Required documents
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-white/50">
                Review documents required by {application.university_name}. Uploads
                are managed in your UniNexa Documents center.
              </p>
            </div>

            <LogoutButton />
          </div>

          {saved === "1" && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
              Documents draft saved successfully.
            </div>
          )}

          <form
            action={saveDraft}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6"
          >
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Document checklist</h3>
                <p className="mt-2 text-sm text-white/45">
                  Mark each document as uploaded once it exists in your Documents page.
                </p>
              </div>

              <Link
                href="/dashboard/documents"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-5 py-3 text-sm font-semibold"
              >
                <UploadCloud className="h-4 w-4" />
                Upload documents
              </Link>
            </div>

            <div className="grid gap-4">
              {questions.map((question) => {
                const uploaded = documents?.some(
                  (doc) =>
                    doc.document_type === question.label ||
                    doc.document_type === question.id ||
                    doc.file_path
                );

                return (
                  <label
                    key={question.id}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <input
                      type="checkbox"
                      name={question.id}
                      value="completed"
                      defaultChecked={answers[question.id] === "completed" || uploaded}
                      className="mt-1"
                    />

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-fuchsia-300" />
                        <p className="font-semibold">
                          {question.label}
                          {question.required && (
                            <span className="ml-1 text-red-400">*</span>
                          )}
                        </p>
                      </div>

                      <p className="mt-2 text-sm text-white/45">
                        {uploaded
                          ? "Uploaded in your UniNexa documents center."
                          : "Not uploaded yet. Upload this document before final submission."}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        uploaded
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {uploaded ? "Uploaded" : "Pending"}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/dashboard/applications/${id}/family`}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10"
              >
                Previous
              </Link>

              <button
                type="submit"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/10"
              >
                Save Draft
              </button>

              <Link
                href={`/dashboard/applications/${id}/recommendations`}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
              >
                Continue to Recommendations
              </Link>
            </div>
          </form>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}