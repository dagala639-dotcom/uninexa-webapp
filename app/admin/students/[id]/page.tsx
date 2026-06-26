import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const profileSections = [
  {
    title: "Personal Information",
    fields: [
      ["Full legal name", "full_name"],
      ["Date of birth", "date_of_birth"],
      ["National ID / Passport number", "national_id"],
      ["Short student bio", "student_bio"],
    ],
  },
  {
    title: "Address",
    fields: [
      ["Country", "country"],
      ["County", "county"],
      ["Town", "town"],
      ["Address", "address"],
    ],
  },
  {
    title: "Contact Details",
    fields: [
      ["Email", "email"],
      ["Phone", "phone"],
      ["Alternative phone", "alternative_phone"],
      ["Emergency contact", "emergency_contact"],
    ],
  },
  {
    title: "Demographics",
    fields: [
      ["Gender", "gender"],
      ["Nationality", "nationality"],
      ["Student type", "student_type"],
      ["Marital status", "marital_status"],
    ],
  },
  {
    title: "Language",
    fields: [
      ["First language", "first_language"],
      ["English level", "english_level"],
      ["Other languages", "other_languages"],
    ],
  },
  {
    title: "Family",
    fields: [
      ["Parent / Guardian name", "guardian_name"],
      ["Relationship", "guardian_relationship"],
      ["Guardian phone", "guardian_phone"],
      ["Sponsor name", "sponsor_name"],
      ["Funding source", "funding_source"],
    ],
  },
  {
    title: "Education",
    fields: [
      ["High school name", "high_school_name"],
      ["KCSE mean grade", "kcse_mean_grade"],
      ["KCSE year", "kcse_year"],
      ["Education level", "education_level"],
      ["Graduation year", "graduation_year"],
    ],
  },
  {
    title: "Testing",
    fields: [
      ["IELTS score", "ielts_score"],
      ["TOEFL score", "toefl_score"],
      ["Duolingo score", "duolingo_score"],
      ["SAT score", "sat_score"],
      ["ACT score", "act_score"],
    ],
  },
  {
    title: "Activities",
    fields: [
      ["Leadership", "leadership"],
      ["Volunteering", "volunteering"],
      ["Work experience", "work_experience"],
      ["Sports / Clubs", "activities"],
      ["Awards", "awards"],
    ],
  },
];

export default async function AdminStudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleData?.role !== "admin") redirect("/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", id)
    .maybeSingle();

  if (!profile) redirect("/admin/students");

  return (
    <main className="min-h-screen bg-[#050816] p-6 text-white lg:p-10">
      <Link
        href="/admin/students"
        className="text-sm text-fuchsia-300 hover:text-fuchsia-200"
      >
        ← Back to students
      </Link>

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
          Read-only student profile
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          {profile.full_name || "Unnamed student"}
        </h1>

        <p className="mt-2 text-white/50">
          {profile.email || "No email"} · {profile.phone || "No phone"}
        </p>

        <p className="mt-2 break-all text-xs text-white/35">
          Student ID: {profile.user_id}
        </p>
      </div>

      <div className="mt-6 grid gap-6">
        {profileSections.map((section) => (
          <div
            key={section.title}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <h2 className="text-2xl font-semibold">{section.title}</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.fields.map(([label, key]) => (
                <Info
                  key={key}
                  label={label}
                  value={profile[key] || "Not set"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-white/80">
        {String(value)}
      </p>
    </div>
  );
}