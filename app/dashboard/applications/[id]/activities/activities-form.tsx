"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import { PlusCircle } from "lucide-react";
import { saveActivitiesDraft } from "./actions";

type Question = {
  id: string;
  label?: string;
  question?: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

export default function ActivitiesForm({
  applicationId,
  profile,
  application,
  questions,
  initialAnswers,
  locked,
}: {
  applicationId: string;
  profile: Record<string, string>;
  application: Record<string, string>;
  questions: Question[];
  initialAnswers: Record<string, string>;
  locked?: boolean;
}) {
  const baseQuestions: Question[] = [
    {
      id: "activity_type",
      label: "Activity type",
      type: "select",
      required: true,
      options: [
        "Leadership",
        "Community service",
        "Sports",
        "Arts",
        "Work experience",
        "Academic club",
        "Religious activity",
        "Family responsibility",
        "Other",
      ],
    },
    {
      id: "activity_name",
      label: "Activity name",
      type: "text",
      required: true,
      placeholder: "e.g. Debate Club, Football Team, School President",
    },
    {
      id: "role_position",
      label: "Role / Position",
      type: "text",
      required: true,
      placeholder: "e.g. Headboy, Team Captain, Volunteer",
    },
    {
      id: "years_involved",
      label: "Years involved",
      type: "select",
      required: true,
      options: [
        "Less than 1 year",
        "1 year",
        "2 years",
        "3 years",
        "4 years",
        "5+ years",
      ],
    },
    {
      id: "hours_per_week",
      label: "Hours per week",
      type: "text",
      placeholder: "e.g. 3",
    },
    {
      id: "weeks_per_year",
      label: "Weeks per year",
      type: "text",
      placeholder: "e.g. 30",
    },
    {
      id: "activity_description",
      label: "Description",
      type: "textarea",
      required: true,
      placeholder:
        "Briefly describe what you did, your responsibilities, and your impact.",
    },
  ];

  const allQuestions = [
    ...baseQuestions,
    ...questions.filter(
      (question) => !baseQuestions.some((base) => base.id === question.id)
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
    "Saved" | "Saving..." | "Failed to save" | "Submitted — locked"
  >(locked ? "Submitted — locked" : "Saved");

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
          await saveActivitiesDraft(applicationId, data);
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
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-semibold">Activity 1</h3>
          <p className="mt-2 text-sm text-white/45">
            {locked
              ? "This application has been submitted and is now read-only."
              : "Start with your strongest or most meaningful activity."}
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

          <button
            type="button"
            disabled={locked}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PlusCircle className="h-4 w-4" />
            Add activity
          </button>
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
            placeholder={question.placeholder}
            onChange={handleChange}
            disabled={locked}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/dashboard/applications/${applicationId}/testing`}
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
          href={`/dashboard/applications/${applicationId}/family`}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
        >
          Continue to Family
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
  value: string;
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
        {required && <span className="ml-1 text-red-400">*</span>}
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
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-60"
        />
      ) : type === "select" ? (
        <select
          name={id}
          required={required}
          disabled={disabled}
          value={value}
          onChange={onChange}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none focus:border-fuchsia-400/50 focus:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-60"
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
                disabled={disabled}
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
          disabled={disabled}
          value={value}
          onChange={onChange}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-60"
        />
      )}
    </div>
  );
}