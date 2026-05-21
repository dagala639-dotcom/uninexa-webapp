"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  county: string | null;
  town: string | null;
  high_school_name: string | null;
  kcse_mean_grade: string | null;
  student_type: string | null;
  updated_at: string | null;
};

type Application = {
  id: string;
  user_id: string;
  university_name: string | null;
  country: string | null;
  status: string | null;
  progress: number | null;
};

type DocumentRow = {
  id: string;
  user_id: string;
  document_type: string | null;
  status: string | null;
};

export default function AdminStudentsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const [students, setStudents] = useState<Profile[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);

  async function loadData() {
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleData?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false });

    const { data: apps, error: appsError } = await supabase
      .from("applications")
      .select("*");

    const { data: docs, error: docsError } = await supabase
      .from("documents")
      .select("*");

    if (profilesError) setMessage(profilesError.message);
    if (appsError) setMessage(appsError.message);
    if (docsError) setMessage(docsError.message);

    setStudents(profiles || []);
    setApplications(apps || []);
    setDocuments(docs || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return students;

    return students.filter((student) => {
      return (
        student.full_name?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.phone?.toLowerCase().includes(term) ||
        student.county?.toLowerCase().includes(term) ||
        student.town?.toLowerCase().includes(term) ||
        student.high_school_name?.toLowerCase().includes(term) ||
        student.kcse_mean_grade?.toLowerCase().includes(term) ||
        student.user_id?.toLowerCase().includes(term)
      );
    });
  }, [students, search]);

  function countApplications(userId: string) {
    return applications.filter((app) => app.user_id === userId).length;
  }

  function countDocuments(userId: string) {
    return documents.filter((doc) => doc.user_id === userId).length;
  }

  function studentReadiness(student: Profile) {
    let score = 0;

    if (student.full_name) score += 15;
    if (student.email) score += 15;
    if (student.phone) score += 10;
    if (student.county) score += 10;
    if (student.high_school_name) score += 15;
    if (student.kcse_mean_grade) score += 15;
    if (countDocuments(student.user_id) > 0) score += 10;
    if (countApplications(student.user_id) > 0) score += 10;

    return Math.min(score, 100);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          Loading students...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>
            <p className="mt-2 text-sm text-white/40">Admin Console</p>
          </div>

          <nav className="space-y-2">
            {[
              ["Overview", "/admin"],
              ["Students", "/admin/students"],
              ["Documents", "/admin/documents"],
              ["KCSE Verification", "/admin/kcse-verification"],
              ["Applications", "/admin/applications"],
              ["Messages", "/admin/messages"],
              ["Scholarships", "/admin/scholarships"],
              ["Universities", "/admin/universities"],
              ["Settings", "/admin/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/admin/students"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard"
            className="mt-8 block rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.06]"
          >
            Back to student portal
          </Link>
        </aside>

        <section className="relative flex-1 overflow-hidden p-4 pb-20 sm:p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute left-1/3 top-72 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8">
            <p className="text-sm font-medium text-fuchsia-300">Students</p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
              Student intelligence center.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              View student profiles, readiness, applications, documents, KCSE
              data, and progress.
            </p>
          </div>

          {message && (
            <div className="relative mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-200">
              {message}
            </div>
          )}

          <div className="relative mb-8 grid gap-4 md:grid-cols-4">
            {[
              [String(students.length), "Total students"],
              [String(applications.length), "Applications"],
              [String(documents.length), "Documents"],
              [
                String(
                  students.filter((student) => studentReadiness(student) >= 70)
                    .length
                ),
                "High readiness",
              ],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <p className="text-3xl font-bold">{value}</p>
                <p className="mt-2 text-sm text-white/40">{label}</p>
              </div>
            ))}
          </div>

          <div className="relative mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl lg:grid-cols-[1fr_0.25fr]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, county, school, KCSE grade, or student ID..."
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50"
            />

            <button
              type="button"
              onClick={loadData}
              className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Refresh
            </button>
          </div>

          <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-5 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl sm:p-6">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Student records</h3>
                <p className="mt-2 text-sm text-white/40">
                  Connected directly to Supabase profiles, applications, and
                  documents.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              {filteredStudents.map((student) => {
                const readiness = studentReadiness(student);
                const appCount = countApplications(student.user_id);
                const docCount = countDocuments(student.user_id);

                return (
                  <div
                    key={student.user_id}
                    className="rounded-[2rem] border border-white/10 bg-black/25 p-5"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                          Student
                        </p>

                        <h4 className="mt-2 text-2xl font-semibold">
                          {student.full_name || "Unnamed student"}
                        </h4>

                        <p className="mt-1 text-sm text-white/45">
                          {student.email || "No email"} ·{" "}
                          {student.phone || "No phone"}
                        </p>

                        <p className="mt-1 text-sm text-white/35">
                          {student.county || "County not set"}
                          {student.town ? `, ${student.town}` : ""}
                        </p>
                      </div>

                      <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                        {readiness}% ready
                      </div>
                    </div>

                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
                        style={{ width: `${readiness}%` }}
                      />
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                      <Info
                        label="Student type"
                        value={student.student_type || "Not set"}
                      />

                      <Info
                        label="High school"
                        value={student.high_school_name || "Not set"}
                      />

                      <Info
                        label="KCSE grade"
                        value={student.kcse_mean_grade || "Not set"}
                      />

                      <Info label="Applications" value={String(appCount)} />

                      <Info label="Documents" value={String(docCount)} />

                      <Info
                        label="Country"
                        value={student.country || "Kenya"}
                      />

                      <Info
                        label="Updated"
                        value={
                          student.updated_at
                            ? new Date(student.updated_at).toLocaleDateString()
                            : "Unknown"
                        }
                      />

                      <Info
                        label="User ID"
                        value={student.user_id.slice(0, 8) + "..."}
                      />
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/admin/students/${student.user_id}`}
                        className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-3 text-center text-sm font-semibold text-white"
                      >
                        View full profile
                      </Link>

                      <Link
                        href="/admin/applications"
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white/65 hover:bg-white/10"
                      >
                        View applications
                      </Link>

                      <Link
                        href="/admin/documents"
                        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white/65 hover:bg-white/10"
                      >
                        View documents
                      </Link>
                    </div>
                  </div>
                );
              })}

              {!filteredStudents.length && (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-8 text-center text-sm text-white/45">
                  No students found.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-2 break-words text-sm text-white/75">{value}</p>
    </div>
  );
}