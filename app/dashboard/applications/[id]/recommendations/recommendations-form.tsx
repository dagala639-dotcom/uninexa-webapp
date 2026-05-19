"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { GraduationCap, User } from "lucide-react";
import { saveRecommendationsDraft } from "./actions";

type Question = {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export default function RecommendationsForm({
  applicationId,
  application,
  questions,
  initialAnswers,
}: {
  applicationId: string;
  application: Record<string, string>;
  questions: Question[];
  initialAnswers: Record<string, string>;
}) {
  const baseQuestions: Question[] = [
    {
      id: "recommender_1_name",
      label: "Full name",
      required: true,
    },
    {
      id: "recommender_1_email",
      label: "Email address",
      type: "email",
      required: true,
    },
    {
      id: "recommender_1_phone",
      label: "Phone number",
    },
    {
      id: "recommender_1_school",
      label: "School / Institution",
    },
    {
      id: "recommender_1_subject",
      label: "Subject taught",
    },
    {
      id: "recommender_1_relationship",
      label: "Relationship",
      type: "select",
      required: true,
      options: [
        "Teacher",
        "School counselor",
        "Principal",
        "Mentor",
        "Employer",
        "Coach",
        "Other",
      ],
    },
    {
      id: "recommender_1_years",
      label: "Years known",
      type: "select",
      options: [
        "Less than 1 year",
        "1 year",
        "2 years",
        "3 years",
        "4+ years",
      ],
    },
    {
      id: "recommendation_strength",
      label: "Recommendation strength",
      type: "radio",
      options: ["Outstanding", "Strong", "Good", "Average"],
    },
    {
      id: "waive_right_to_view",
      label: "Do you waive your right to view recommendation letters?",
      type: "radio",
      required: true,
      options: ["Yes", "No"],
    },
    {
      id: "recommendation_notes",
      label: "Additional notes",
      type: "textarea",
      placeholder: "Add any extra context about your recommenders...",
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
          await saveRecommendationsDraft(applicationId, data);
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

  const recommenderFields = allQuestions.filter((question) =>
    [
      "recommender_1_name",
      "recommender_1_email",
      "recommender_1_phone",
      "recommender_1_school",
      "recommender_1_subject",
      "recommender_1_relationship",
      "recommender_1_years",
      "recommendation_strength",
    ].includes(question.id)
  );

  const notesFields = allQuestions.filter((question) =>
    ["waive_right_to_view", "recommendation_notes"].includes(question.id)
  );

  const extraFields = allQuestions.filter(
    (question) =>
      !recommenderFields.some((item) => item.id === question.id) &&
      !notesFields.some((item) => item.id === question.id)
  );

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-white/50">
          Changes save automatically.
        </p>

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

      <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-fuchsia-300" />

          <div>
            <h3 className="text-2xl font-semibold">Recommender 1</h3>
            <p className="mt-1 text-sm text-white/45">
              Main academic recommender
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {recommenderFields.map((question) => (
            <Field
              key={question.id}
              id={question.id}
              label={question.label}
              type={question.type || "text"}
              required={question.required}
              options={question.options}
              value={formData[question.id] || ""}
              placeholder={question.placeholder}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-blue-300" />

          <div>
            <h3 className="text-2xl font-semibold">Additional Notes</h3>
            <p className="mt-1 text-sm text-white/45">
              Optional recommendation context
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          {notesFields.map((question) => (
            <Field
              key={question.id}
              id={question.id}
              label={question.label}
              type={question.type || "text"}
              required={question.required}
              options={question.options}
              value={formData[question.id] || ""}
              placeholder={question.placeholder}
              onChange={handleChange}
            />
          ))}
        </div>
      </div>

      {extraFields.length > 0 && (
        <div className="mt-6 grid gap-5">
          {extraFields.map((question) => (
            <Field
              key={question.id}
              id={question.id}
              label={question.label}
              type={question.type || "text"}
              required={question.required}
              options={question.options}
              value={formData[question.id] || ""}
              placeholder={question.placeholder}
              onChange={handleChange}
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/dashboard/applications/${applicationId}/documents`}
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
          href={`/dashboard/applications/${applicationId}/billing`}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
        >
          Continue to Billing
        </Link>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  options,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
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
          type={type}
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