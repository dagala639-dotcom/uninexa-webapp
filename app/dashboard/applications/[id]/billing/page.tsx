import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  CreditCard,
  DollarSign,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../../../logout-button";
import MobileNav from "../../../mobile-nav";
import { saveBillingDraft } from "./actions";

const UNINEXA_PLATFORM_FEE = 80;

const universityFees: Record<
  string,
  { amount: string; currency: string; source: string }
> = {
  "Arizona State University": {
    amount: "85",
    currency: "USD",
    source: "official ASU admissions website",
  },
  "University of Manchester": {
    amount: "UCAS / course dependent",
    currency: "GBP",
    source: "official Manchester / UCAS website",
  },
  "University of Toronto": {
    amount: "application route dependent",
    currency: "CAD",
    source: "official U of T / OUAC website",
  },
  "University of Melbourne": {
    amount: "course dependent",
    currency: "AUD",
    source: "official University of Melbourne website",
  },
};

export default async function BillingPage({
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

  const { data: draft } = await supabase
    .from("application_forms")
    .select("*")
    .eq("application_id", id)
    .eq("user_id", user.id)
    .eq("section", "billing")
    .maybeSingle();

  const answers = draft?.answers || {};

  const saveDraft = saveBillingDraft.bind(null, id);

  const universityFee = universityFees[application.university_name] || {
    amount: "To be confirmed",
    currency: "USD",
    source: "official university website",
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[320px] shrink-0 border-r border-white/10 bg-[#0A0F1D] p-5 lg:block">
          <Link
            href="/dashboard/applications"
            className="text-sm text-fuchsia-300"
          >
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
              [
                "Recommendations",
                `/dashboard/applications/${id}/recommendations`,
              ],
              ["Billing", `/dashboard/applications/${id}/billing`],
              ["Review & Submit", `/dashboard/applications/${id}/review`],
            ].map(([name, href]) => (
              <Link
                key={name}
                href={href}
                className={`block rounded-2xl border px-4 py-4 text-sm transition ${
                  name === "Billing"
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
              <p className="text-sm font-medium text-fuchsia-300">Billing</p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Payment & billing
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-white/50">
                Manage UniNexa platform fees, university application fees,
                sponsors, and payment information for{" "}
                {application.university_name}.
              </p>
            </div>

            <LogoutButton />
          </div>

          {saved === "1" && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
              Billing draft saved successfully.
            </div>
          )}

          <form
            action={saveDraft}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-6"
          >
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
                    USD {UNINEXA_PLATFORM_FEE}
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
                Total due may include the UniNexa platform fee plus the
                university’s own application fee. University fees are set by the
                institution and may change.
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
                <Field
                  id="uninexa_platform_fee_status"
                  label="UniNexa $80 platform fee status"
                  type="select"
                  required
                  options={["Not paid", "Paid", "Pending verification"]}
                  defaultValue={answers.uninexa_platform_fee_status || ""}
                />

                <Field
                  id="university_application_fee_status"
                  label="University application fee status"
                  type="select"
                  required
                  options={[
                    "Not paid",
                    "Paid directly to university",
                    "Fee waiver requested",
                    "Not required",
                  ]}
                  defaultValue={answers.university_application_fee_status || ""}
                />

                <Field
                  id="fee_waiver_requested"
                  label="Are you requesting a university fee waiver?"
                  type="radio"
                  required
                  options={["Yes", "No"]}
                  defaultValue={answers.fee_waiver_requested || ""}
                />

                <Field
                  id="payment_method"
                  label="Preferred payment method"
                  type="select"
                  required
                  options={[
                    "Credit card",
                    "Debit card",
                    "Bank transfer",
                    "M-Pesa",
                    "Sponsor payment",
                    "Scholarship sponsor",
                    "Other",
                  ]}
                  defaultValue={answers.payment_method || ""}
                />

                <Field
                  id="payment_responsibility"
                  label="Who is responsible for payment?"
                  type="select"
                  required
                  options={[
                    "Self",
                    "Parent",
                    "Guardian",
                    "Sponsor",
                    "Scholarship",
                    "Other",
                  ]}
                  defaultValue={answers.payment_responsibility || ""}
                />

                <Field
                  id="receipt_reference"
                  label="Payment receipt/reference number"
                  defaultValue={answers.receipt_reference || ""}
                  placeholder="Add receipt or transaction reference if available"
                />
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
                <Field
                  id="sponsor_name"
                  label="Sponsor full name"
                  defaultValue={answers.sponsor_name || ""}
                />

                <Field
                  id="sponsor_relationship"
                  label="Relationship to student"
                  type="select"
                  options={[
                    "Parent",
                    "Guardian",
                    "Relative",
                    "Organization",
                    "Government",
                    "Scholarship",
                    "Other",
                  ]}
                  defaultValue={answers.sponsor_relationship || ""}
                />

                <Field
                  id="sponsor_email"
                  label="Sponsor email"
                  type="email"
                  defaultValue={answers.sponsor_email || ""}
                />

                <Field
                  id="sponsor_phone"
                  label="Sponsor phone number"
                  defaultValue={answers.sponsor_phone || ""}
                />
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
                <Field
                  id="billing_notes"
                  label="Billing notes"
                  type="textarea"
                  defaultValue={answers.billing_notes || ""}
                  placeholder="Add fee waiver notes, sponsor details, payment timeline, or receipt information..."
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/dashboard/applications/${id}/recommendations`}
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
                href={`/dashboard/applications/${id}/review`}
                className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
              >
                Continue to Review
              </Link>
            </div>
          </form>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}

function Field({
  id,
  label,
  type = "text",
  required,
  options,
  defaultValue,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
  placeholder?: string;
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
          defaultValue={defaultValue}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
        />
      ) : type === "select" ? (
        <select
          name={id}
          required={required}
          defaultValue={defaultValue || ""}
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
                required={required}
                defaultChecked={defaultValue === option}
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
          defaultValue={defaultValue}
          placeholder={placeholder || label}
          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
        />
      )}
    </div>
  );
}