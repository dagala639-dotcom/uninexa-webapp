"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UniversityIntakePage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    university_name: "",
    country: "",
    city: "",
    website: "",
    admissions_email: "",
    admissions_contact_name: "",
    programs: "",
    application_fee: "",
    tuition_range: "",
    deadlines: "",
    scholarships_available: "",
    english_requirements: "",
    accepts_kcse: "",
    accepts_duolingo: "",
    visa_support: "",
    recruitment_partnerships: "",
    featured_visibility: "",
    notes: "",
  });

  const [applicationFile, setApplicationFile] =
    useState<File | null>(null);

  function updateField(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    let uploadedFilePath = "";

    try {
      if (applicationFile) {
        const fileName = `${Date.now()}-${applicationFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from("university-partner-files")
          .upload(fileName, applicationFile);

        if (uploadError) {
          alert(uploadError.message);
          setLoading(false);
          return;
        }

        uploadedFilePath = fileName;
      }

      const { error } = await supabase
        .from("university_partner_requests")
        .insert({
          ...form,
          uploaded_application_form: uploadedFilePath,
          created_at: new Date().toISOString(),
        });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setSuccess(true);

      setForm({
        university_name: "",
        country: "",
        city: "",
        website: "",
        admissions_email: "",
        admissions_contact_name: "",
        programs: "",
        application_fee: "",
        tuition_range: "",
        deadlines: "",
        scholarships_available: "",
        english_requirements: "",
        accepts_kcse: "",
        accepts_duolingo: "",
        visa_support: "",
        recruitment_partnerships: "",
        featured_visibility: "",
        notes: "",
      });

      setApplicationFile(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="mb-12">
          <p className="text-sm font-medium text-fuchsia-300">
            UniNexa Partner Network
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight lg:text-6xl">
            University partnership intake.
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/50">
            UniNexa is an AI-powered international admissions
            infrastructure platform built for African students.
            Universities can onboard to expand visibility, connect
            with qualified applicants, and participate in the
            UniNexa global student ecosystem.
          </p>
        </div>

        {success && (
          <div className="mb-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 text-emerald-200">
            Thank you for your submission. The UniNexa partnerships
            team will review your information shortly.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_100px_rgba(168,85,247,0.12)] backdrop-blur-2xl sm:p-8"
        >
          {/* UNIVERSITY DETAILS */}
          <div>
            <h2 className="text-2xl font-semibold">
              University Information
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input
                label="University name"
                value={form.university_name}
                onChange={(v) =>
                  updateField("university_name", v)
                }
              />

              <Input
                label="Country"
                value={form.country}
                onChange={(v) => updateField("country", v)}
              />

              <Input
                label="City"
                value={form.city}
                onChange={(v) => updateField("city", v)}
              />

              <Input
                label="Official website"
                value={form.website}
                onChange={(v) => updateField("website", v)}
              />

              <Input
                label="Admissions contact name"
                value={form.admissions_contact_name}
                onChange={(v) =>
                  updateField("admissions_contact_name", v)
                }
              />

              <Input
                label="Admissions email"
                value={form.admissions_email}
                onChange={(v) =>
                  updateField("admissions_email", v)
                }
              />
            </div>
          </div>

          {/* ADMISSIONS */}
          <div>
            <h2 className="text-2xl font-semibold">
              Admissions & International Students
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input
                label="Programs available"
                value={form.programs}
                onChange={(v) => updateField("programs", v)}
              />

              <Input
                label="Application deadlines"
                value={form.deadlines}
                onChange={(v) => updateField("deadlines", v)}
              />

              <Input
                label="Application fee"
                value={form.application_fee}
                onChange={(v) =>
                  updateField("application_fee", v)
                }
              />

              <Input
                label="Estimated tuition range"
                value={form.tuition_range}
                onChange={(v) =>
                  updateField("tuition_range", v)
                }
              />

              <Select
                label="Do you accept KCSE students?"
                value={form.accepts_kcse}
                onChange={(v) =>
                  updateField("accepts_kcse", v)
                }
              />

              <Select
                label="Do you accept Duolingo English Test?"
                value={form.accepts_duolingo}
                onChange={(v) =>
                  updateField("accepts_duolingo", v)
                }
              />

              <Select
                label="Scholarships available?"
                value={form.scholarships_available}
                onChange={(v) =>
                  updateField(
                    "scholarships_available",
                    v
                  )
                }
              />

              <Select
                label="Visa support available?"
                value={form.visa_support}
                onChange={(v) =>
                  updateField("visa_support", v)
                }
              />

              <Select
                label="Do you work with recruitment partners?"
                value={form.recruitment_partnerships}
                onChange={(v) =>
                  updateField(
                    "recruitment_partnerships",
                    v
                  )
                }
              />

              <Select
                label="Interested in featured visibility on UniNexa?"
                value={form.featured_visibility}
                onChange={(v) =>
                  updateField("featured_visibility", v)
                }
              />
            </div>

            <div className="mt-5">
              <Textarea
                label="English language requirements"
                value={form.english_requirements}
                onChange={(v) =>
                  updateField(
                    "english_requirements",
                    v
                  )
                }
              />
            </div>
          </div>

          {/* FILE UPLOAD */}
          <div>
            <h2 className="text-2xl font-semibold">
              Application Materials
            </h2>

            <p className="mt-2 text-sm text-white/45">
              Please upload your international admissions
              application form, brochure, or requirements PDF.
            </p>

            <div className="mt-5 rounded-3xl border border-dashed border-white/15 bg-black/20 p-6">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setApplicationFile(
                    e.target.files?.[0] || null
                  )
                }
                className="text-sm text-white/70"
              />
            </div>
          </div>

          {/* NOTES */}
          <div>
            <Textarea
              label="Additional notes"
              value={form.notes}
              onChange={(v) => updateField("notes", v)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-8 py-5 text-sm font-semibold text-white shadow-[0_0_60px_rgba(168,85,247,0.4)] transition hover:scale-[1.01] disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : "Submit university partnership request"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/60">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/40"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/60">
        {label}
      </label>

      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-3xl border border-white/10 bg-black/20 p-5 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/40"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/60">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none focus:border-fuchsia-400/40"
      >
        <option value="" className="bg-[#070B14]">
          Select
        </option>

        <option value="Yes" className="bg-[#070B14]">
          Yes
        </option>

        <option value="No" className="bg-[#070B14]">
          No
        </option>

        <option value="Case-by-case" className="bg-[#070B14]">
          Case-by-case
        </option>
      </select>
    </div>
  );
}