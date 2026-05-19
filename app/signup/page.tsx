"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(formData: FormData) {
    setError("");
    setLoading(true);

    const fullName = String(formData.get("fullName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const confirmEmail = String(formData.get("confirmEmail") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    const studentType = String(formData.get("studentType") || "");
    const dateOfBirth = String(formData.get("dateOfBirth") || "");
    const phone = String(formData.get("phone") || "");
    const county = String(formData.get("county") || "");
    const town = String(formData.get("town") || "");
    const address = String(formData.get("address") || "");

    const dataConsent = Boolean(formData.get("dataConsent"));
    const termsConsent = Boolean(formData.get("termsConsent"));
    const communicationConsent = Boolean(
      formData.get("communicationConsent")
    );
    const guardianConsent = Boolean(formData.get("guardianConsent"));

    if (!fullName) {
      setError("Full name is required.");
      setLoading(false);
      return;
    }

    if (email !== confirmEmail) {
      setError("Email addresses do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!termsConsent || !dataConsent) {
      setError(
        "You must agree to the Terms of Use and data processing consent."
      );
      setLoading(false);
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          student_type: studentType,
          date_of_birth: dateOfBirth,
          phone,
          country: "Kenya",
          county,
          town,
          address,
          data_consent: dataConsent,
          terms_consent: termsConsent,
          communication_consent: communicationConsent,
          guardian_consent: guardianConsent,
          privacy_framework: "Kenya Data Protection Act, 2019",
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: user.id,
            full_name: fullName,
            email,
            student_type: studentType,
            date_of_birth: dateOfBirth,
            phone,
            country: "Kenya",
            county,
            town,
            address,
            data_consent: dataConsent,
            terms_consent: termsConsent,
            communication_consent: communicationConsent,
            guardian_consent: guardianConsent,
            privacy_framework: "Kenya Data Protection Act, 2019",
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070B14] px-4 py-10 text-white sm:px-6">
      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="absolute right-0 top-20 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-4xl rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_0_60px_rgba(168,85,247,0.15)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="mb-8">
          <span className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-lg font-semibold uppercase tracking-[0.35em] text-transparent">
            UniNexa
          </span>
        </div>

        <div className="mb-10">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Create your account.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
            Build your Kenyan student profile, organize your documents, and
            start your international university application journey.
          </p>
        </div>

        <form action={handleSignup} className="space-y-10">
          <Section title="Account information">
            <Input
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              required
            />

            <Input
              name="confirmEmail"
              label="Re-type email address"
              type="email"
              placeholder="you@example.com"
              required
            />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
            />

            <Input
              name="confirmPassword"
              label="Re-type password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </Section>

          <Section title="Student pathway">
            <Select
              name="studentType"
              label="Which best describes you?"
              required
              options={[
                "Applying for undergraduate study abroad",
                "Applying for postgraduate study abroad",
                "Transfer student",
                "Looking for scholarships",
                "Not sure yet",
              ]}
            />
          </Section>

          <Section title="Personal information">
            <Input
              name="fullName"
              label="Full legal name"
              placeholder="John Doe"
              required
            />

            <Input
              name="dateOfBirth"
              label="Date of birth"
              type="date"
              required
            />
          </Section>

          <Section title="Contact details">
            <Input
              name="phone"
              label="Phone number"
              placeholder="+2547..."
              required
            />

            <Input
              name="county"
              label="County"
              placeholder="Nakuru"
              required
            />

            <Input
              name="town"
              label="Town"
              placeholder="Naivasha"
            />

            <Input
              name="address"
              label="Permanent home address"
              placeholder="Estate, road, or location"
            />
          </Section>

          <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5 sm:p-6">
            <h2 className="text-xl font-semibold">
              Privacy policy and preferences
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/60">
              By creating an account, you agree that UniNexa may collect and
              process your personal, academic, contact, document, and
              application information for purposes of creating your student
              profile, supporting study-abroad applications, verifying
              documents, matching you with universities and scholarships, and
              communicating with you about your applications.
            </p>

            <p className="mt-4 text-sm leading-7 text-white/60">
              UniNexa processes personal data in line with the Kenya Data
              Protection Act, 2019, the Data Protection General Regulations,
              2021, and applicable international admissions requirements. You
              may request access, correction, deletion, or limitation of your
              personal data by contacting UniNexa.
            </p>

            <div className="mt-6 space-y-4">
              <Checkbox
                name="termsConsent"
                required
                label="I agree to the UniNexa Terms of Use and Privacy Policy."
              />

              <Checkbox
                name="dataConsent"
                required
                label="I consent to UniNexa processing my data for study-abroad application support."
              />

              <Checkbox
                name="communicationConsent"
                label="I agree to receive application updates, scholarship alerts, and admissions communication."
              />

              <Checkbox
                name="guardianConsent"
                label="If I am under 18, I confirm that my parent or legal guardian has consented."
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-5 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition-all hover:scale-[1.01] hover:shadow-fuchsia-500/40 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-fuchsia-300 transition hover:text-fuchsia-200"
          >
            Log in
          </Link>
        </p>
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
    <section className="rounded-[2rem] border border-white/10 bg-black/20 p-5 sm:p-6">
      <h2 className="mb-5 text-xl font-semibold">{title}</h2>

      <div className="grid gap-5 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition-all placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
      />
    </div>
  );
}

function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
      >
        <option value="" className="bg-[#070B14]">
          Select option
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#070B14]"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Checkbox({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/70">
      <input
        {...props}
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 accent-fuchsia-500"
      />

      <span>{label}</span>
    </label>
  );
}