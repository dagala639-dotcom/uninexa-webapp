import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminApplicationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleData?.role !== "admin") redirect("/dashboard");

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (!application) redirect("/admin/applications");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", application.user_id)
    .maybeSingle();

  const { data: forms } = await supabase
    .from("application_forms")
    .select("*")
    .eq("application_id", id)
    .order("section", { ascending: true });

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", application.user_id)
    .order("uploaded_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#050816] p-6 text-white lg:p-10">
      <Link
        href="/admin/applications"
        className="text-sm text-fuchsia-300 hover:text-fuchsia-200"
      >
        ← Back to admin applications
      </Link>

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
          Admin read-only review
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          {application.university_name}
        </h1>

        <p className="mt-2 text-white/50">
          {application.country || "Country not set"} ·{" "}
          {application.program || "Program not selected"}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Info label="Status" value={application.status || "Submitted"} />
          <Info label="Progress" value={`${application.progress || 0}%`} />
          <Info label="Deadline" value={application.deadline || "Not set"} />
          <Info
            label="Submitted"
            value={
              application.submitted_at
                ? new Date(application.submitted_at).toLocaleDateString()
                : "Not submitted"
            }
          />
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-semibold">Student profile</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Info label="Name" value={profile?.full_name || "Not set"} />
          <Info label="Email" value={profile?.email || "Not set"} />
          <Info label="Phone" value={profile?.phone || "Not set"} />
          <Info label="County" value={profile?.county || "Not set"} />
          <Info
            label="KCSE grade"
            value={profile?.kcse_mean_grade || "Not set"}
          />
          <Info
            label="High school"
            value={profile?.high_school_name || "Not set"}
          />
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-semibold">Application answers</h2>

        <div className="mt-5 grid gap-5">
          {(forms || []).map((form) => {
            const answers = (form.answers || {}) as Record<string, string>;

            return (
              <div
                key={form.id}
                className="rounded-2xl border border-white/10 bg-black/25 p-5"
              >
                <h3 className="text-xl font-semibold capitalize">
                  {form.section}
                </h3>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {Object.entries(answers).map(([key, value]) => (
                    <Info
                      key={key}
                      label={key.replaceAll("_", " ")}
                      value={String(value || "Not answered")}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {!forms?.length && (
            <p className="text-sm text-white/45">
              No application answers found.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-2xl font-semibold">Uploaded documents</h2>

        <div className="mt-5 grid gap-4">
          {(documents || []).map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <p className="font-semibold">
                {doc.document_type || "Document"}
              </p>

              <p className="mt-2 text-sm text-white/45">
                Status: {doc.status || "Pending"} · Stage:{" "}
                {doc.verification_stage || "Not set"}
              </p>
            </div>
          ))}

          {!documents?.length && (
            <p className="text-sm text-white/45">
              No uploaded documents found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs capitalize text-white/35">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-white/80">
        {value}
      </p>
    </div>
  );
}
