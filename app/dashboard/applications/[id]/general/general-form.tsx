"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { saveGeneralDraft } from "./actions";

const questions = [
  {
    id: "student_status",
    label: "Student status",
    type: "select",
    required: true,
    options: [
      "First-year undergraduate applicant",
      "Transfer applicant",
      "International undergraduate applicant",
    ],
  },
  {
    id: "preferred_start_term",
    label: "Preferred start term",
    type: "select",
    required: true,
    options: ["Fall 2026", "Spring 2027", "Summer 2027", "Fall 2027"],
  },
  {
    id: "housing_plan",
    label: "Preferred residence during your first year",
    type: "select",
    required: true,
    options: [
      "On-campus housing",
      "Off-campus housing",
      "I have not decided",
      "Not applicable",
    ],
  },
  {
    id: "testing_plan",
    label: "Preferred testing plan",
    type: "select",
    required: true,
    options: [
      "I will submit SAT/ACT scores",
      "I will apply test optional",
      "I have not decided",
    ],
  },
  {
    id: "need_based_financial_aid",
    label: "Do you intend to pursue need-based financial aid?",
    type: "radio",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "religious_preference",
    label: "Religious preference",
    type: "select",
    options: [
      "Prefer not to say",
      "Christian",
      "Muslim",
      "Hindu",
      "Other",
      "No religious preference",
    ],
  },
];

export default function GeneralForm({
  applicationId,
  profile,
  application,
  initialAnswers,
}: {
  applicationId: string;
  profile: Record<string, string>;
  application: Record<string, string>;
  initialAnswers: Record<string, string>;
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
          await saveGeneralDraft(applicationId, data);
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
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-semibold">General information</h3>
          <p className="mt-2 text-sm text-white/45">
            Basic university application preferences.
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

      <div className="space-y-7">
        {questions.map((question) => (
          <Field
            key={question.id}
            id={question.id}
            label={question.label}
            type={question.type}
            required={question.required}
            options={question.options}
            value={formData[question.id] || ""}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="mt-8 flex gap-3 pt-4">
        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/70"
        >
          Saved automatically
        </button>

        <Link
          href={`/dashboard/applications/${applicationId}/academics`}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-6 py-4 text-sm font-semibold"
        >
          Continue to Academics
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
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-white/80">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      {type === "select" ? (
        <select
          name={id}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none"
        >
          <option value="" className="bg-[#070B14]">
            Choose an option
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
            <label key={option} className="flex items-center gap-3 text-white/70">
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
          value={value}
          onChange={onChange}
          required={required}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none"
        />
      )}
    </div>
  );
}