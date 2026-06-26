"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { saveAcademicsDraft } from "./actions";

type Question = {
  id: string;
  label?: string;
  question?: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export default function AcademicsForm({
  applicationId,
  profile,
  application,
  questions,
  initialAnswers,
  locked,
}: {
  applicationId: string;
  profile: Record<string, string | null | undefined>;
  application: Record<string, string | null | undefined>;
  questions: Question[];
  initialAnswers: Record<string, string>;
  locked?: boolean;
}) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};

    questions.forEach((question) => {
      values[question.id] =
        initialAnswers?.[question.id] ||
        profile?.[question.id] ||
        application?.[question.id] ||
        "";
    });

    return values;
  });

  const [saveStatus, setSaveStatus] = useState(
    locked ? "Submitted — locked" : "Saved"
  );

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    if (locked) return;

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaveStatus("Saving...");
  }

  const autosave = useMemo(
    () =>
      debounce(async (data: Record<string, string>) => {
        if (locked) return;

        try {
          await saveAcademicsDraft(applicationId, data);

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

    return () => autosave.cancel();
  }, [formData, autosave, locked]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/50">
          {locked
            ? "This application has been submitted and is now read-only."
            : "Changes save automatically."}
        </p>

        <div
          className={`text-sm ${
            locked ? "text-orange-300" : "text-fuchsia-300"
          }`}
        >
          {saveStatus}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {questions.map((question) => (
          <Field
            key={question.id}
            id={question.id}
            label={question.label || question.question || "Question"}
            type={question.type}
            required={question.required}
            options={question.options}
            value={formData[question.id] || ""}
            placeholder={question.placeholder}
            onChange={handleChange}
            disabled={locked}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
          href={`/dashboard/applications/${applicationId}/testing`}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white"
        >
          Continue to Testing
        </Link>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  required,
  options,
  value,
  placeholder,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <div className={type === "textarea" ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}

        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
      </label>

      {type === "textarea" ? (
        <textarea
          name={id}
          rows={6}
          required={required}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      ) : type === "select" ? (
        <select
          name={id}
          required={required}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="" className="bg-[#070B14]">
            Select option
          </option>

          {options?.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#070B14]"
            >
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={id}
          type="text"
          required={required}
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
      )}
    </div>
  );
}
