"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { saveFamilyDraft } from "./actions";

type Question = {
  id: string;
  label?: string;
  question?: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export default function FamilyForm({
  applicationId,
  profile,
  application,
  questions,
  initialAnswers,
}: {
  applicationId: string;
  profile: Record<string, string>;
  application: Record<string, string>;
  questions: Question[];
  initialAnswers: Record<string, string>;
}) {
  const baseQuestions: Question[] = [
    {
      id: "guardian_1_name",
      label: "Parent/Guardian full name",
      type: "text",
      required: true,
    },
    {
      id: "guardian_1_relationship",
      label: "Relationship",
      type: "select",
      required: true,
      options: ["Mother", "Father", "Guardian", "Sponsor", "Other"],
    },
    {
      id: "guardian_1_phone",
      label: "Parent/Guardian phone number",
      type: "text",
      required: true,
    },
    {
      id: "guardian_1_email",
      label: "Parent/Guardian email",
      type: "text",
    },
    {
      id: "guardian_1_occupation",
      label: "Parent/Guardian occupation",
      type: "text",
    },
    {
      id: "guardian_1_education",
      label: "Highest level of education",
      type: "select",
      options: [
        "Primary school",
        "Secondary school",
        "Diploma",
        "Bachelor's degree",
        "Master's degree",
        "Doctorate",
        "Prefer not to say",
      ],
    },
    {
      id: "siblings_applying",
      label: `Are any siblings also applying to ${application.university_name} this year?`,
      type: "radio",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "relatives_attended",
      label: `Do you have any relatives who attended or graduated from ${application.university_name}?`,
      type: "radio",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "relatives_worked",
      label: `Have any relatives ever worked for ${application.university_name}?`,
      type: "radio",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "family_notes",
      label: "Additional family information",
      type: "textarea",
      placeholder: "Add any relevant family or sponsor information...",
    },
  ];

  const allQuestions = [
    ...baseQuestions,
    ...questions.filter(
      (question) =>
        !baseQuestions.some((base) => base.id === question.id)
    ),
  ];

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};

    allQuestions.forEach((question) => {
      values[question.id] =
        initialAnswers?.[question.id] ||
        profile?.[question.id] ||
        application?.[question.id] ||
        "";
    });

    return values;
  });

  const [saveStatus, setSaveStatus] = useState<
    "Saved" | "Saving..." | "Failed to save"
  >("Saved");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
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
        try {
          await saveFamilyDraft(applicationId, data);
          setSaveStatus("Saved");
        } catch {
          setSaveStatus("Failed to save");
        }
      }, 1000),
    [applicationId]
  );

  useEffect(() => {
    autosave(formData);

    return () => {
      autosave.cancel();
    };
  }, [formData, autosave]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-semibold">
            Parent / Guardian Details
          </h3>

          <p className="mt-2 text-sm text-white/45">
            Add at least one parent or guardian contact.
          </p>
        </div>

        <div
          className={`w-fit rounded-full border px-4 py-2 text-sm ${
            saveStatus === "Saved"
              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              : saveStatus === "Saving..."
                ? "border-amber-400/20 bg-amber-500/10 text-amber-300"
                : "border-red-400/20 bg-red-500/10 text-red-300"
          }`}
        >
          {saveStatus}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {allQuestions.map((question) => (
          <Field
            key={question.id}
            id={question.id}
            label={question.label || question.question || ""}
            type={question.type}
            required={question.required}
            options={question.options}
            value={formData[question.id] || ""}
            placeholder={question.placeholder || question.label || question.question}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/dashboard/applications/${applicationId}/activities`}
          className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10"
        >
          Previous
        </Link>

        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/70"
        >
          Saved automatically
        </button>

        <Link
          href={`/dashboard/applications/${applicationId}/documents`}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
        >
          Continue to Documents
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
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  value: string;
  placeholder?: string;
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
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          name={id}
          rows={6}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
        />
      ) : type === "select" ? (
        <select
          name={id}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
        >
          <option value="" className="bg-[#070B14]">
            Select option
          </option>

          {options?.map((option) => (
            <option key={option} value={option} className="bg-[#070B14]">
              {option}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/10 p-4">
          {options?.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 text-sm text-white/70"
            >
              <input
                type="radio"
                name={id}
                value={option}
                checked={value === option}
                onChange={onChange}
                required={required}
              />

              {option}
            </label>
          ))}
        </div>
      ) : (
        <input
          name={id}
          type="text"
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
        />
      )}
    </div>
  );
}