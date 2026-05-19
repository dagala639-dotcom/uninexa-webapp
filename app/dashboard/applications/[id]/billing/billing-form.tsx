"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { debounce } from "lodash";
import {
  CreditCard,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { saveBillingDraft } from "./actions";

type BillingQuestion = {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

const billingQuestions: BillingQuestion[] = [
  {
    id: "uninexa_platform_fee_status",
    label: "UniNexa $80 platform fee status",
    type: "select",
    required: true,
    options: ["Not paid", "Paid", "Pending verification"],
  },
  {
    id: "university_application_fee_status",
    label: "University application fee status",
    type: "select",
    required: true,
    options: [
      "Not paid",
      "Paid directly to university",
      "Fee waiver requested",
      "Not required",
    ],
  },
  {
    id: "fee_waiver_requested",
    label: "Are you requesting a university fee waiver?",
    type: "radio",
    required: true,
    options: ["Yes", "No"],
  },
  {
    id: "payment_method",
    label: "Preferred payment method",
    type: "select",
    required: true,
    options: [
      "Credit card",
      "Debit card",
      "Bank transfer",
      "M-Pesa",
      "Sponsor payment",
      "Scholarship sponsor",
      "Other",
    ],
  },
  {
    id: "payment_responsibility",
    label: "Who is responsible for payment?",
    type: "select",
    required: true,
    options: [
      "Self",
      "Parent",
      "Guardian",
      "Sponsor",
      "Scholarship",
      "Other",
    ],
  },
  {
    id: "receipt_reference",
    label: "Payment receipt/reference number",
    placeholder: "Add receipt or transaction reference if available",
  },
  {
    id: "sponsor_name",
    label: "Sponsor full name",
  },
  {
    id: "sponsor_relationship",
    label: "Relationship to student",
    type: "select",
    options: [
      "Parent",
      "Guardian",
      "Relative",
      "Organization",
      "Government",
      "Scholarship",
      "Other",
    ],
  },
  {
    id: "sponsor_email",
    label: "Sponsor email",
    type: "email",
  },
  {
    id: "sponsor_phone",
    label: "Sponsor phone number",
  },
  {
    id: "billing_notes",
    label: "Billing notes",
    type: "textarea",
    placeholder:
      "Add fee waiver notes, sponsor details, payment timeline, or receipt information...",
  },
];

export default function BillingForm({
  applicationId,
  initialAnswers,
  universityFee,
  platformFee,
}: {
  applicationId: string;
  initialAnswers: Record<string, string>;
  universityFee: { amount: string; currency: string; source: string };
  platformFee: number;
}) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};

    billingQuestions.forEach((question) => {
      values[question.id] = initialAnswers?.[question.id] || "";
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
          await saveBillingDraft(applicationId, data);
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/50">
          Changes save automatically.
        </p>

        <div
          className={`rounded-full border px-4 py-2 text-sm ${
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

      <div className="mb-6 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6">
        <h3 className="text-2xl font-semibold text-emerald-200">
          Fee Summary
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-white/45">
              UniNexa Platform Fee
            </p>

            <p className="mt-2 text-3xl font-bold">
              USD {platformFee}
            </p>

            <p className="mt-2 text-sm text-white/45">
              Paid to UniNexa for platform processing, application
              organization, and support.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-white/45">
              University Application Fee
            </p>

            <p className="mt-2 text-3xl font-bold">
              {universityFee.currency} {universityFee.amount}
            </p>

            <p className="mt-2 text-sm text-white/45">
              Based on {universityFee.source}. Students should confirm the
              latest fee before payment.
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-white/55">
          Total due may include the UniNexa platform fee plus the university’s
          own application fee. University fees are set by the institution and
          may change.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
        <div className="flex items-center gap-3">
          <DollarSign className="h-6 w-6 text-fuchsia-300" />

          <div>
            <h3 className="text-2xl font-semibold">Fee status</h3>

            <p className="mt-1 text-sm text-white/45">
              Track both UniNexa and university payment requirements.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {billingQuestions.slice(0, 6).map((question) => (
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
          <ShieldCheck className="h-6 w-6 text-blue-300" />

          <div>
            <h3 className="text-2xl font-semibold">
              Sponsor information
            </h3>

            <p className="mt-1 text-sm text-white/45">
              Optional sponsor or financial support details.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {billingQuestions.slice(6, 10).map((question) => (
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
          <CreditCard className="h-6 w-6 text-emerald-300" />

          <div>
            <h3 className="text-2xl font-semibold">
              Additional billing notes
            </h3>

            <p className="mt-1 text-sm text-white/45">
              Optional payment details.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5">
          {billingQuestions.slice(10).map((question) => (
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

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/dashboard/applications/${applicationId}/recommendations`}
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
          href={`/dashboard/applications/${applicationId}/review`}
          className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
        >
          Continue to Review
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