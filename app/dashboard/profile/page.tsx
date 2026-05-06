"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import LogoutButton from "../logout-button";
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

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("Personal Information");
  const [county, setCounty] = useState("Meru");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [manualSchool, setManualSchool] = useState(false);

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

        <section className="flex-1 p-6 lg:p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">Profile</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight">
                Build your student profile.
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Complete your details for university matching and applications.
              </p>
            </div>

            <LogoutButton />
          </div>

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
                  const complete = index < 3;

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

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-8">
                <p className="text-sm text-fuchsia-300">Selected section</p>
                <h3 className="mt-2 text-3xl font-bold">{activeSection}</h3>
              </div>

              {activeSection === "Personal Information" && (
                <FormGrid>
                  <Input label="Full legal name" placeholder="Abednego Dagala" />
                  <Input label="Preferred name" placeholder="Abedy" />
                  <Input label="Date of birth" type="date" />
                  <Select label="Gender" options={["Male", "Female", "Prefer not to say"]} />
                  <Input label="National ID / Passport number" placeholder="38922628" />
                  <Input label="Short student bio" placeholder="Tell universities about yourself" full />
                </FormGrid>
              )}

              {activeSection === "Address" && (
                <FormGrid>
                  <Input label="Country" value="Kenya" disabled />
                  <Select
                    label="County"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    options={counties}
                  />
                  <Select label="Town / City" options={towns} />
                  <Input label="Sub-county" placeholder="Example: Imenti South" />
                  <Input label="Village / Estate / Street" placeholder="Example: Machikine" />
                  <Input label="Postal code" placeholder="60202" />
                  <Input label="Postal address" placeholder="P.O Box 60202, Nkubu" full />
                </FormGrid>
              )}

              {activeSection === "Contact Details" && (
                <FormGrid>
                  <Input label="Email address" type="email" placeholder="you@example.com" />
                  <Input label="Phone number" placeholder="+254 7XX XXX XXX" />
                  <Input label="Alternative phone number" placeholder="+254 7XX XXX XXX" />
                  <Input label="Emergency contact name" placeholder="Guardian name" />
                  <Input label="Emergency contact phone" placeholder="+254 7XX XXX XXX" />
                  <Select label="Preferred contact method" options={["Email", "Phone", "WhatsApp"]} />
                </FormGrid>
              )}

              {activeSection === "Demographics" && (
                <FormGrid>
                  <Select label="Marital status" options={["Single", "Married", "Prefer not to say"]} />
                  <Select label="Do you have a disability?" options={["No", "Yes", "Prefer not to say"]} />
                  <Select label="Are you first generation university student?" options={["Yes", "No", "Not sure"]} />
                  <Select label="Do you need financial aid?" options={["Yes", "No", "Maybe"]} />
                  <Input label="Special circumstances" placeholder="Optional" full />
                </FormGrid>
              )}

              {activeSection === "Language" && (
                <FormGrid>
                  <Select label="Primary language" options={["English", "Kiswahili", "Kimeru", "Kikuyu", "Luo", "Kalenjin", "Other"]} />
                  <Select label="English proficiency" options={["Native", "Fluent", "Intermediate", "Beginner"]} />
                  <Select label="Swahili proficiency" options={["Native", "Fluent", "Intermediate", "Beginner"]} />
                  <Input label="Other languages" placeholder="Example: French, German" />
                </FormGrid>
              )}

              {activeSection === "Family" && (
                <FormGrid>
                  <Input label="Parent / Guardian 1 full name" placeholder="Full name" />
                  <Select label="Relationship" options={["Father", "Mother", "Guardian", "Sponsor", "Other"]} />
                  <Input label="Guardian 1 phone" placeholder="+254 7XX XXX XXX" />
                  <Input label="Guardian 1 occupation" placeholder="Occupation" />
                  <Input label="Parent / Guardian 2 full name" placeholder="Full name" />
                  <Select label="Relationship" options={["Father", "Mother", "Guardian", "Sponsor", "Other"]} />
                  <Input label="Guardian 2 phone" placeholder="+254 7XX XXX XXX" />
                  <Input label="Guardian 2 occupation" placeholder="Occupation" />
                  <Input label="Number of siblings" type="number" />
                  <Select label="Who will sponsor your education?" options={["Parent", "Guardian", "Self", "Scholarship", "Family", "Other"]} />
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
                      <Input label="Manual school name" placeholder="Enter your school name" />
                    )}
                  </div>

                  <FormGrid noButtons>
                    <Select label="School county" options={counties} />
                    <Select label="Curriculum" options={["KCSE", "IGCSE", "A-Level", "IB", "Other"]} />
                    <Input label="Year started" placeholder="2020" />
                    <Input label="Year completed / expected" placeholder="2024" />
                    <Input label="KCSE index number" placeholder="Enter index number" />
                    <Select label="KCSE mean grade" options={["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "E"]} />
                  </FormGrid>

                  <ActionButtons />
                </div>
              )}

              {activeSection === "Testing" && (
                <FormGrid>
                  <Select label="Have you taken any international exam?" options={["Yes", "No", "Planning to"]} />
                  <Select label="Exam type" options={exams} />
                  <Input label="Score / Grade" placeholder="Example: IELTS 7.0, SAT 1350, KCSE B+" />
                  <Input label="Test date" type="date" />
                  <Select label="Do you plan to retake?" options={["No", "Yes", "Not sure"]} />
                  <Input label="Target retake date" type="date" />
                  <Input label="Upload score report" type="file" full />
                </FormGrid>
              )}

              {activeSection === "Activities" && (
                <FormGrid>
                  <Select label="Activity type" options={["Leadership", "Sports", "Clubs", "Volunteering", "Work experience", "Awards", "Projects", "Community service", "Talent / Arts"]} />
                  <Input label="Activity name" placeholder="Example: Debate Club" />
                  <Input label="Role / Position" placeholder="Example: Chairperson" />
                  <Input label="Years involved" placeholder="Example: 2022 - 2024" />
                  <Input label="Description" placeholder="Briefly describe your activity" full />
                </FormGrid>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FormGrid({
  children,
  noButtons = false,
}: {
  children: React.ReactNode;
  noButtons?: boolean;
}) {
  return (
    <form className="grid gap-5 md:grid-cols-2">
      {children}
      {!noButtons && <ActionButtons />}
    </form>
  );
}

function ActionButtons() {
  return (
    <div className="md:col-span-2 flex justify-end gap-3 pt-3">
      <button
        type="button"
        className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10"
      >
        Save draft
      </button>

      <button
        type="button"
        className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]"
      >
        Mark complete
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
        <option className="bg-[#070B14]">Select option</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#070B14]">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}