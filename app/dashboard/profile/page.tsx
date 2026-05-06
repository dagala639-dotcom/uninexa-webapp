"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LogoutButton from "../logout-button";
import MobileNav from "../mobile-nav";
import { createClient } from "@/lib/supabase/client";
import { kenyanSchools } from "@/lib/data/kenyan-schools";

const counties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
  "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
  "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi",
];

const townsByCounty: Record<string, string[]> = {
  Meru: ["Meru", "Nkubu", "Maua", "Timau", "Mikinduri", "Laare"],
  Nairobi: ["CBD", "Westlands", "Kilimani", "Karen", "Lang'ata", "Embakasi", "Kasarani"],
  Kiambu: ["Kiambu", "Thika", "Ruiru", "Juja", "Kikuyu", "Limuru"],
  Nakuru: ["Nakuru", "Naivasha", "Gilgil", "Molo", "Njoro"],
  Mombasa: ["Mombasa", "Nyali", "Likoni", "Bamburi", "Changamwe"],
  Machakos: ["Machakos", "Athi River", "Mlolongo", "Kangundo", "Tala"],
};

const profileSections = [
  "Personal Information",
  "Address",
  "Contact Details",
  "Demographics",
  "Language",
  "Family",
  "Education",
  "Testing",
  "Activities",
];

const exams = [
  "KCSE",
  "IGCSE",
  "A-Level",
  "IB",
  "SAT",
  "ACT",
  "IELTS",
  "TOEFL iBT",
  "PTE Academic",
  "Duolingo English Test",
  "Cambridge English",
  "GRE",
  "GMAT",
  "MCAT",
  "LSAT",
  "UCAT",
  "BMAT",
  "AP Exams",
];

type Profile = Record<string, any>;

export default function ProfilePage() {
  const supabase = createClient();

  const [activeSection, setActiveSection] = useState("Personal Information");
  const [profile, setProfile] = useState<Profile>({});
  const [county, setCounty] = useState("Meru");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [manualSchool, setManualSchool] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setCounty(data.county || "Meru");
        setSchoolSearch(data.high_school_name || "");
      } else {
        setProfile({
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          country: "Kenya",
        });
      }
    }

    loadProfile();
  }, [supabase]);

  const towns = useMemo(() => {
    return townsByCounty[county] || ["Main Town", "Town Centre", "Other"];
  }, [county]);

  const filteredSchools = useMemo(() => {
    if (!schoolSearch.trim()) return kenyanSchools.slice(0, 12);

    return kenyanSchools
      .filter((school) =>
        school.toLowerCase().includes(schoolSearch.toLowerCase())
      )
      .slice(0, 12);
  }, [schoolSearch]);

  function updateField(field: string, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function completionKey(section: string) {
    return `${section.toLowerCase().replaceAll(" ", "_")}_completed`;
  }

  async function saveProfile(markComplete = false) {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please log in first.");
      setSaving(false);
      return;
    }

    const key = completionKey(activeSection);

    const payload = {
      ...profile,
      user_id: user.id,
      email: profile.email || user.email,
      county,
      high_school_name: schoolSearch || profile.high_school_name,
      country: "Kenya",
      ...(markComplete ? { [key]: true } : {}),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
    } else {
      setProfile(data || payload);
      setMessage(
        markComplete
          ? `${activeSection} saved and marked complete.`
          : `${activeSection} draft saved.`
      );
    }

    setSaving(false);
  }

  function isComplete(section: string) {
    return Boolean(profile?.[completionKey(section)]);
  }

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>
            <p className="mt-2 text-sm text-white/40">Student Portal</p>
          </div>

          <nav className="space-y-2">
            <Link href="/dashboard" className="block rounded-2xl px-4 py-3 text-sm text-white/50 hover:bg-white/5">
              Dashboard
            </Link>

            <Link href="/dashboard/profile" className="block rounded-2xl bg-white/10 px-4 py-3 text-sm text-white">
              Profile
            </Link>

            {[
              ["Applications", "/dashboard/applications"],
              ["Universities", "/dashboard/universities"],
              ["Documents", "/dashboard/documents"],
              ["Scholarships", "/dashboard/scholarships"],
              ["Messages", "/dashboard/messages"],
              ["Settings", "/dashboard/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className="block rounded-2xl px-4 py-3 text-sm text-white/50 hover:bg-white/5"
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-4 pb-28 sm:p-6 lg:p-10">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">Profile</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Build your student profile.
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Complete your details for university matching and applications.
              </p>
            </div>

            <LogoutButton />
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
              {message}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.4fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-6">
                <h3 className="text-xl font-semibold">My UniNexa Profile</h3>
                <p className="mt-1 text-sm text-white/40">
                  Complete every section.
                </p>
              </div>

              <div className="space-y-3">
                {profileSections.map((title, index) => {
                  const complete = isComplete(title);

                  return (
                    <button
                      key={title}
                      onClick={() => setActiveSection(title)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        activeSection === title
                          ? "border-fuchsia-400/40 bg-fuchsia-500/15"
                          : "border-white/10 bg-black/20 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            complete
                              ? "bg-emerald-500 text-white"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {complete ? "✓" : index + 1}
                        </div>

                        <div className="flex-1">
                          <p className="font-medium">{title}</p>
                          <p className="mt-1 text-xs text-white/40">
                            {complete ? "Complete" : "Incomplete"}
                          </p>
                        </div>

                        <span className="text-white/30">›</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="mb-8">
                <p className="text-sm text-fuchsia-300">Selected section</p>
                <h3 className="mt-2 text-3xl font-bold">{activeSection}</h3>
              </div>

              {activeSection === "Personal Information" && (
                <FormGrid>
                  <Input label="Full legal name" value={profile.full_name || ""} onChange={(e) => updateField("full_name", e.target.value)} />
                  <Input label="Preferred name" value={profile.preferred_name || ""} onChange={(e) => updateField("preferred_name", e.target.value)} />
                  <Input label="Date of birth" type="date" value={profile.date_of_birth || ""} onChange={(e) => updateField("date_of_birth", e.target.value)} />
                  <Select label="Gender" value={profile.gender || ""} onChange={(e) => updateField("gender", e.target.value)} options={["Male", "Female", "Prefer not to say"]} />
                  <Input label="National ID / Passport number" value={profile.passport_number || ""} onChange={(e) => updateField("passport_number", e.target.value)} />
                  <Input label="Short student bio" value={profile.bio || ""} onChange={(e) => updateField("bio", e.target.value)} full />
                </FormGrid>
              )}

              {activeSection === "Address" && (
                <FormGrid>
                  <Input label="Country" value="Kenya" disabled />
                  <Select label="County" value={county} onChange={(e) => setCounty(e.target.value)} options={counties} />
                  <Select label="Town / City" value={profile.town || ""} onChange={(e) => updateField("town", e.target.value)} options={towns} />
                  <Input label="Sub-county" value={profile.sub_county || ""} onChange={(e) => updateField("sub_county", e.target.value)} />
                  <Input label="Village / Estate / Street" value={profile.village || ""} onChange={(e) => updateField("village", e.target.value)} />
                  <Input label="Postal code" value={profile.postal_code || ""} onChange={(e) => updateField("postal_code", e.target.value)} />
                  <Input label="Postal address" value={profile.postal_address || ""} onChange={(e) => updateField("postal_address", e.target.value)} full />
                </FormGrid>
              )}

              {activeSection === "Contact Details" && (
                <FormGrid>
                  <Input label="Email address" type="email" value={profile.email || ""} onChange={(e) => updateField("email", e.target.value)} />
                  <Input label="Phone number" value={profile.phone || ""} onChange={(e) => updateField("phone", e.target.value)} />
                  <Input label="Alternative phone number" value={profile.alternative_phone || ""} onChange={(e) => updateField("alternative_phone", e.target.value)} />
                  <Input label="Emergency contact name" value={profile.emergency_contact_name || ""} onChange={(e) => updateField("emergency_contact_name", e.target.value)} />
                  <Input label="Emergency contact phone" value={profile.emergency_contact_phone || ""} onChange={(e) => updateField("emergency_contact_phone", e.target.value)} />
                  <Select label="Preferred contact method" value={profile.preferred_contact_method || ""} onChange={(e) => updateField("preferred_contact_method", e.target.value)} options={["Email", "Phone", "WhatsApp"]} />
                </FormGrid>
              )}

              {activeSection === "Demographics" && (
                <FormGrid>
                  <Select label="Marital status" value={profile.marital_status || ""} onChange={(e) => updateField("marital_status", e.target.value)} options={["Single", "Married", "Prefer not to say"]} />
                  <Select label="Do you have a disability?" value={profile.disability || ""} onChange={(e) => updateField("disability", e.target.value)} options={["No", "Yes", "Prefer not to say"]} />
                  <Select label="Are you first generation university student?" value={profile.first_generation || ""} onChange={(e) => updateField("first_generation", e.target.value)} options={["Yes", "No", "Not sure"]} />
                  <Select label="Do you need financial aid?" value={profile.financial_aid_need || ""} onChange={(e) => updateField("financial_aid_need", e.target.value)} options={["Yes", "No", "Maybe"]} />
                  <Input label="Special circumstances" value={profile.special_circumstances || ""} onChange={(e) => updateField("special_circumstances", e.target.value)} full />
                </FormGrid>
              )}

              {activeSection === "Language" && (
                <FormGrid>
                  <Select label="Primary language" value={profile.primary_language || ""} onChange={(e) => updateField("primary_language", e.target.value)} options={["English", "Kiswahili", "Kimeru", "Kikuyu", "Luo", "Kalenjin", "Other"]} />
                  <Select label="English proficiency" value={profile.english_proficiency || ""} onChange={(e) => updateField("english_proficiency", e.target.value)} options={["Native", "Fluent", "Intermediate", "Beginner"]} />
                  <Select label="Swahili proficiency" value={profile.swahili_proficiency || ""} onChange={(e) => updateField("swahili_proficiency", e.target.value)} options={["Native", "Fluent", "Intermediate", "Beginner"]} />
                  <Input label="Other languages" value={profile.other_languages || ""} onChange={(e) => updateField("other_languages", e.target.value)} />
                </FormGrid>
              )}

              {activeSection === "Family" && (
                <FormGrid>
                  <Input label="Parent / Guardian 1 full name" value={profile.guardian_1_name || ""} onChange={(e) => updateField("guardian_1_name", e.target.value)} />
                  <Select label="Relationship" value={profile.guardian_1_relationship || ""} onChange={(e) => updateField("guardian_1_relationship", e.target.value)} options={["Father", "Mother", "Guardian", "Sponsor", "Other"]} />
                  <Input label="Guardian 1 phone" value={profile.guardian_1_phone || ""} onChange={(e) => updateField("guardian_1_phone", e.target.value)} />
                  <Input label="Guardian 1 occupation" value={profile.guardian_1_occupation || ""} onChange={(e) => updateField("guardian_1_occupation", e.target.value)} />
                  <Input label="Parent / Guardian 2 full name" value={profile.guardian_2_name || ""} onChange={(e) => updateField("guardian_2_name", e.target.value)} />
                  <Select label="Relationship" value={profile.guardian_2_relationship || ""} onChange={(e) => updateField("guardian_2_relationship", e.target.value)} options={["Father", "Mother", "Guardian", "Sponsor", "Other"]} />
                  <Input label="Guardian 2 phone" value={profile.guardian_2_phone || ""} onChange={(e) => updateField("guardian_2_phone", e.target.value)} />
                  <Input label="Guardian 2 occupation" value={profile.guardian_2_occupation || ""} onChange={(e) => updateField("guardian_2_occupation", e.target.value)} />
                  <Input label="Number of siblings" type="number" value={profile.siblings || ""} onChange={(e) => updateField("siblings", e.target.value)} />
                  <Select label="Who will sponsor your education?" value={profile.education_sponsor || ""} onChange={(e) => updateField("education_sponsor", e.target.value)} options={["Parent", "Guardian", "Self", "Scholarship", "Family", "Other"]} />
                </FormGrid>
              )}

              {activeSection === "Education" && (
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      High school name
                    </label>

                    {!manualSchool ? (
                      <div className="relative">
                        <input
                          value={schoolSearch}
                          onChange={(e) => setSchoolSearch(e.target.value)}
                          placeholder="Search your high school..."
                          className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/50"
                        />

                        <div className="mt-3 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-2">
                          {filteredSchools.map((school) => (
                            <button
                              key={school}
                              type="button"
                              onClick={() => setSchoolSearch(school)}
                              className="block w-full rounded-xl px-4 py-3 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white"
                            >
                              {school}
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => setManualSchool(true)}
                            className="mt-2 block w-full rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-3 text-left text-sm text-fuchsia-200"
                          >
                            My school is not listed — add manually
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Input label="Manual school name" value={schoolSearch} onChange={(e) => setSchoolSearch(e.target.value)} />
                    )}
                  </div>

                  <FormGrid>
                    <Select label="School county" value={profile.school_county || ""} onChange={(e) => updateField("school_county", e.target.value)} options={counties} />
                    <Select label="Curriculum" value={profile.curriculum || ""} onChange={(e) => updateField("curriculum", e.target.value)} options={["KCSE", "IGCSE", "A-Level", "IB", "Other"]} />
                    <Input label="Year started" value={profile.year_started || ""} onChange={(e) => updateField("year_started", e.target.value)} />
                    <Input label="Year completed / expected" value={profile.year_completed || ""} onChange={(e) => updateField("year_completed", e.target.value)} />
                    <Input label="KCSE index number" value={profile.kcse_index_number || ""} onChange={(e) => updateField("kcse_index_number", e.target.value)} />
                    <Select label="KCSE mean grade" value={profile.kcse_mean_grade || ""} onChange={(e) => updateField("kcse_mean_grade", e.target.value)} options={["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"]} />
                  </FormGrid>
                </div>
              )}

              {activeSection === "Testing" && (
                <FormGrid>
                  <Select label="Have you taken any international exam?" value={profile.international_exam_status || ""} onChange={(e) => updateField("international_exam_status", e.target.value)} options={["Yes", "No", "Planning to"]} />
                  <Select label="Exam type" value={profile.exam_type || ""} onChange={(e) => updateField("exam_type", e.target.value)} options={exams} />
                  <Input label="Score / Grade" value={profile.exam_score || ""} onChange={(e) => updateField("exam_score", e.target.value)} />
                  <Input label="Test date" type="date" value={profile.test_date || ""} onChange={(e) => updateField("test_date", e.target.value)} />
                  <Select label="Do you plan to retake?" value={profile.retake_plan || ""} onChange={(e) => updateField("retake_plan", e.target.value)} options={["No", "Yes", "Not sure"]} />
                  <Input label="Target retake date" type="date" value={profile.target_retake_date || ""} onChange={(e) => updateField("target_retake_date", e.target.value)} />
                </FormGrid>
              )}

              {activeSection === "Activities" && (
                <FormGrid>
                  <Select label="Activity type" value={profile.activity_type || ""} onChange={(e) => updateField("activity_type", e.target.value)} options={["Leadership", "Sports", "Clubs", "Volunteering", "Work experience", "Awards", "Projects", "Community service", "Talent / Arts"]} />
                  <Input label="Activity name" value={profile.activity_name || ""} onChange={(e) => updateField("activity_name", e.target.value)} />
                  <Input label="Role / Position" value={profile.activity_role || ""} onChange={(e) => updateField("activity_role", e.target.value)} />
                  <Input label="Years involved" value={profile.activity_years || ""} onChange={(e) => updateField("activity_years", e.target.value)} />
                  <Input label="Description" value={profile.activity_description || ""} onChange={(e) => updateField("activity_description", e.target.value)} full />
                </FormGrid>
              )}

              <ActionButtons
                saving={saving}
                onSave={() => saveProfile(false)}
                onComplete={() => saveProfile(true)}
              />
            </div>
          </div>
        </section>
      </div>

      <MobileNav />
    </main>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

function ActionButtons({
  saving,
  onSave,
  onComplete,
}: {
  saving: boolean;
  onSave: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col justify-end gap-3 pt-3 sm:flex-row">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save draft"}
      </button>

      <button
        type="button"
        onClick={onComplete}
        disabled={saving}
        className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save & Mark Complete"}
      </button>
    </div>
  );
}

function Input({
  label,
  full = false,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14] disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/50"
      />
    </div>
  );
}

function Select({
  label,
  options,
  full = false,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>
      <select
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
      >
        <option value="" className="bg-[#070B14]">
          Select option
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#070B14]">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}