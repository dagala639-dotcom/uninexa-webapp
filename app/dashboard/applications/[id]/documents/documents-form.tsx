"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { FileText, UploadCloud } from "lucide-react";
import { saveDocumentsDraft } from "./actions";

type Question = {
  id: string;
  label?: string;
  question?: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

type DocumentRecord = {
  id?: string;
  document_type?: string;
  file_path?: string;
  status?: string;
};

export default function DocumentsForm({
  applicationId,
  questions,
  initialAnswers,
  documents,
  locked,
}: {
  applicationId: string;
  questions: Question[];
  initialAnswers: Record<string, string>;
  documents: DocumentRecord[];
  locked?: boolean;
}) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};

    questions.forEach((question) => {
      const title = question.label || question.question || question.id;

      const uploaded = documents.some(
        (doc) =>
          doc.document_type === title ||
          doc.document_type === question.id ||
          Boolean(doc.file_path)
      );

      values[question.id] =
        initialAnswers?.[question.id] || (uploaded ? "completed" : "");
    });

    return values;
  });

  const [saveStatus, setSaveStatus] = useState<
    "Saved" | "Saving..." | "Failed to save" | "Submitted — locked"
  >(locked ? "Submitted — locked" : "Saved");

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (locked) return;

    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked ? "completed" : "",
    }));

    setSaveStatus("Saving...");
  }

  const autosave = useMemo(
    () =>
      debounce(async (data: Record<string, string>) => {
        if (locked) return;

        try {
          await saveDocumentsDraft(applicationId, data);
          setSaveStatus("Saved");
        } catch {
          setSaveStatus("Failed to save");
        }
      }, 1000),
    [applicationId, locked]
  );

  useEffect(() => {
    if (locked) return;

    autosave(formData);

    return () => {
      autosave.cancel();
    };
  }, [formData, autosave, locked]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-2xl font-semibold">
            Document checklist
          </h3>

          <p className="mt-2 text-sm text-white/45">
            {locked
              ? "This application has been submitted and the document checklist is now read-only."
              : "Mark each document as complete once it has been uploaded. Changes save automatically."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div
            className={`rounded-full border px-4 py-2 text-sm ${
              saveStatus === "Saved"
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                : saveStatus === "Saving..."
                  ? "border-amber-400/20 bg-amber-500/10 text-amber-300"
                  : saveStatus === "Submitted — locked"
                    ? "border-orange-400/20 bg-orange-500/10 text-orange-300"
                    : "border-red-400/20 bg-red-500/10 text-red-300"
            }`}
          >
            {saveStatus}
          </div>

          <Link
            href="/dashboard/documents"
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold ${
              locked
                ? "pointer-events-none border border-white/10 bg-white/5 text-white/35"
                : "bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white"
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            Upload documents
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {questions.map((question) => {
          const title = question.label || question.question || question.id;

          const uploaded = documents.some(
            (doc) =>
              doc.document_type === title ||
              doc.document_type === question.id ||
              Boolean(doc.file_path)
          );

          const checked =
            formData[question.id] === "completed" || uploaded;

          return (
            <label
              key={question.id}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <input
                type="checkbox"
                name={question.id}
                value="completed"
                checked={checked}
                disabled={locked}
                onChange={handleCheckboxChange}
                className="mt-1 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-fuchsia-300" />

                  <p className="font-semibold text-white">
                    {title}
                    {question.required && (
                      <span className="ml-1 text-red-400">*</span>
                    )}
                  </p>
                </div>

                <p className="mt-2 text-sm text-white/45">
                  {uploaded
                    ? "Uploaded in your UniNexa documents center."
                    : checked
                      ? "Marked as completed."
                      : "Not uploaded yet. Upload this document before final submission."}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  uploaded || checked
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-amber-500/15 text-amber-300"
                }`}
              >
                {uploaded || checked ? "Completed" : "Pending"}
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/dashboard/applications/${applicationId}/family`}
          className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10"
        >
          Previous
        </Link>

        <button
          type="button"
          disabled
          className={`rounded-2xl border px-6 py-4 text-sm font-semibold ${
            locked
              ? "border-orange-400/20 bg-orange-500/10 text-orange-300"
              : "border-white/10 bg-white/5 text-white/70"
          }`}
        >
          {locked ? "Submitted — locked" : "Saved automatically"}
        </button>

        <Link
          href={`/dashboard/applications/${applicationId}/recommendations`}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
        >
          Continue to Recommendations
        </Link>
      </div>
    </div>
  );
}