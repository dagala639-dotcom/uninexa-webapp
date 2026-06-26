"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Applicant = {
  id: string;
  university_account_id: string;
  application_id: string;
  student_user_id: string;
  status: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at?: string | null;
};

type Application = {
  id: string;
  user_id: string;
  university_name: string | null;
  country: string | null;
  city?: string | null;
  program: string | null;
  application_type?: string | null;
  deadline: string | null;
  status: string | null;
  progress: number | null;
  submitted_at: string | null;
  created_at: string | null;
};

type Profile = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  county: string | null;
  town: string | null;
  high_school_name: string | null;
  kcse_mean_grade: string | null;
  kcse_index_number: string | null;
  year_completed: string | null;
};

type ApplicationForm = {
  id: string;
  application_id: string;
  user_id: string;
  section: string | null;
  answers?: Record<string, unknown> | null;
  form_data?: Record<string, unknown> | null;
  status?: string | null;
  updated_at?: string | null;
};

const decisionOptions = [
  "New applicant",
  "Under review",
  "Interview",
  "Conditional offer",
  "Accepted",
  "Rejected",
];

export default function ApplicantReviewPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const applicantId = String(params.id);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [forms, setForms] = useState<ApplicationForm[]>([]);
  const [notes, setNotes] = useState("");

  async function loadApplicant() {
    setLoading(true);
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      router.push("/university");
      return;
    }

    const { data: applicantData, error: applicantError } = await supabase
      .from("university_applicants")
      .select("*")
      .eq("id", applicantId)
      .maybeSingle();

    if (applicantError || !applicantData) {
      setMessage(applicantError?.message || "Applicant not found.");
      setLoading(false);
      return;
    }

    const { data: applicationData } = await supabase
      .from("applications")
      .select("*")
      .eq("id", applicantData.application_id)
      .maybeSingle();

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", applicantData.student_user_id)
      .maybeSingle();

    const { data: formData } = await supabase
      .from("application_forms")
      .select("*")
      .eq("application_id", applicantData.application_id)
      .eq("user_id", applicantData.student_user_id)
      .order("updated_at", { ascending: false });

    setApplicant(applicantData);
    setApplication(applicationData || null);
    setProfile(profileData || null);
    setForms(formData || []);
    setNotes(applicantData.notes || "");
    setLoading(false);
  }

  useEffect(() => {
    loadApplicant();
  }, []);

  async function updateStatus(status: string) {
    if (!applicant) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("university_applicants")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicant.id);

    if (error) {
      setMessage(error.message);
    } else {
      setApplicant({ ...applicant, status });
      setMessage(`Status updated to ${status}.`);
    }

    setSaving(false);
  }

  async function saveNotes() {
    if (!applicant) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("university_applicants")
      .update({
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", applicant.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Notes saved.");
    }

    setSaving(false);
  }

  const flattenedAnswers = useMemo(() => {
    const output: { section: string; key: string; value: string }[] = [];

    forms.forEach((form) => {
      const data = form.answers || form.form_data || {};
      Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined || String(value).trim() === "") {
          return;
        }

        output.push({
          section: form.section || "Application form",
          key,
          value: typeof value === "object" ? JSON.stringify(value) : String(value),
        });
      });
    });

    return output;
  }, [forms]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading applicant...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl p-6 lg:p-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-fuchsia-300">Applicant Review</p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
              {profile?.full_name || "Unknown student"}
            </h1>

            <p className="mt-3 text-sm text-white/50">
              {application?.program || "Program not specified"} ·{" "}
              {application?.country || "Country not set"}
            </p>
          </div>

          <Link
            href="/university/applicants"
            className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-black"
          >
            Back
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.65fr]">
          <div className="space-y-6">
            <Section title="Student information">
              <Info label="Full name" value={profile?.full_name || "Not set"} />
              <Info label="Email" value={profile?.email || "Not set"} />
              <Info label="Phone" value={profile?.phone || "Not set"} />
              <Info
                label="Location"
                value={`${profile?.county || "County not set"}${
                  profile?.town ? `, ${profile.town}` : ""
                }`}
              />
            </Section>

            <Section title="Application information">
              <Info label="University" value={application?.university_name || "Not set"} />
              <Info label="Program" value={application?.program || "Undecided"} />
              <Info label="Application type" value={application?.application_type || "Not set"} />
              <Info label="Deadline" value={application?.deadline || "Not set"} />
              <Info label="Application status" value={application?.status || "Not set"} />
              <Info
                label="Submitted"
                value={
                  application?.submitted_at
                    ? new Date(application.submitted_at).toLocaleDateString()
                    : "Not submitted"
                }
              />
            </Section>

            <Section title="Academic information">
              <Info label="High school" value={profile?.high_school_name || "Not set"} />
              <Info label="KCSE grade" value={profile?.kcse_mean_grade || "Not set"} />
              <Info label="KCSE index number" value={profile?.kcse_index_number || "Not set"} />
              <Info label="Year completed" value={profile?.year_completed || "Not set"} />
            </Section>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-semibold">Application form answers</h2>
              <p className="mt-2 text-sm text-white/40">
                Answers saved in application_forms.
              </p>

              <div className="mt-6 space-y-4">
                {flattenedAnswers.length > 0 ? (
                  flattenedAnswers.map((item, index) => (
                    <div
                      key={`${item.section}-${item.key}-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">
                        {item.section}
                      </p>
                      <p className="mt-2 text-sm text-white/40">
                        {formatKey(item.key)}
                      </p>
                      <p className="mt-2 break-words text-sm font-medium text-white/80">
                        {item.value}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/45">
                    No form answers found for this application.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-semibold">Internal university notes</h2>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write university review notes..."
                className="mt-5 h-40 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50"
              />

              <button
                type="button"
                onClick={saveNotes}
                disabled={saving}
                className="mt-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-5 py-3 text-sm font-semibold disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save notes"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold">Admission decision</h2>

              <div className="mt-5 space-y-3">
                {decisionOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(status)}
                    disabled={saving}
                    className={`w-full rounded-2xl border px-5 py-4 text-left text-sm transition disabled:opacity-50 ${
                      applicant?.status === status
                        ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                        : "border-white/10 bg-black/20 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/10 to-blue-500/10 p-6">
              <h2 className="text-xl font-semibold">Application progress</h2>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500"
                  style={{ width: `${application?.progress || 0}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-white/50">
                {application?.progress || 0}% completed
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-semibold">Documents</h2>

              <div className="mt-5 space-y-3">
                <Link
                  href={`/university/documents?student=${applicant?.student_user_id}`}
                  className="block rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm transition hover:bg-white/10"
                >
                  View student documents
                </Link>

                <button
                  type="button"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-left text-sm text-white/60"
                >
                  Download application PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
  <h2 className="text-xl font-semibold">Messages</h2>

  <p className="mt-3 text-sm text-white/50">
    Send updates, request missing documents, or invite the student for interview.
  </p>

  <div className="mt-5 space-y-3">
    <Link
      href={`/university/messages?student=${applicant?.student_user_id}`}
      className="block rounded-2xl bg-gradient-to-r from-fuchsia-500 to-blue-500 px-5 py-4 text-center text-sm font-semibold"
    >
      Message student
    </Link>

    <button
      type="button"
      className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-left text-sm"
    >
      Request missing document
    </button>

    <button
      type="button"
      className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-left text-sm"
    >
      Invite to interview
    </button>
  </div>
</div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-white/40">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-white/80">
        {value}
      </p>
    </div>
  );
}

function formatKey(key: string) {
  return key.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
