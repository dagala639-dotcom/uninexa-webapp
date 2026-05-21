"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UniversityAccount = {
  id: string;
  university_name: string;
  contact_email: string | null;
  membership_tier: string | null;
  status: string | null;
};

type UniversitySettings = {
  id: string;
  university_account_id: string;
  receive_applicant_notifications: boolean;
  allow_direct_student_messages: boolean;
  show_profile_publicly: boolean;
  featured_visibility: boolean;
};

export default function UniversitySettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [account, setAccount] = useState<UniversityAccount | null>(null);
  const [settings, setSettings] = useState<UniversitySettings | null>(null);
  const [message, setMessage] = useState("");

  async function loadSettings() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/university");
      return;
    }

    const { data: universityAccount } = await supabase
      .from("university_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!universityAccount) {
      router.push("/university");
      return;
    }

    let { data: universitySettings } = await supabase
      .from("university_settings")
      .select("*")
      .eq("university_account_id", universityAccount.id)
      .maybeSingle();

    if (!universitySettings) {
      const { data: createdSettings } = await supabase
        .from("university_settings")
        .insert({
          university_account_id: universityAccount.id,
          receive_applicant_notifications: true,
          allow_direct_student_messages: false,
          show_profile_publicly: true,
          featured_visibility: false,
        })
        .select()
        .single();

      universitySettings = createdSettings;
    }

    setAccount(universityAccount);
    setSettings(universitySettings);
    setLoading(false);
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function updateSetting(key: keyof UniversitySettings, value: boolean) {
    if (!settings) return;

    setSaving(true);
    setMessage("");

    const updated = {
      ...settings,
      [key]: value,
    };

    setSettings(updated);

    const { error } = await supabase
      .from("university_settings")
      .update({
        [key]: value,
        updated_at: new Date().toISOString(),
      })
      .eq("id", settings.id);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Settings saved successfully.");
    }

    setSaving(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/university");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading settings...
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

            <p className="mt-2 text-sm text-white/40">University Portal</p>
          </div>

          <nav className="space-y-2">
            {[
              ["Dashboard", "/university"],
              ["Applicants", "/university/applicants"],
              ["Documents", "/university/documents"],
              ["Messages", "/university/messages"],
              ["Profile", "/university/profile"],
              ["Settings", "/university/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/university/settings"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-8 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/60 transition hover:bg-white/[0.06]"
          >
            Log out
          </button>
        </aside>

        <section className="relative flex-1 overflow-hidden p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />

          <div className="relative mb-10">
            <p className="text-sm font-medium text-fuchsia-300">
              University Settings
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight lg:text-6xl">
              Portal preferences.
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/50">
              Manage how your institution appears and communicates inside the
              UniNexa university portal.
            </p>
          </div>

          {message && (
            <div className="mb-6 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
              {message}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold">
                Institution account
              </h2>

              <div className="mt-6 space-y-4">
                <Info label="University" value={account?.university_name || "Not set"} />
                <Info label="Contact email" value={account?.contact_email || "Not set"} />
                <Info label="Membership tier" value={account?.membership_tier || "Starter"} />
                <Info label="Status" value={account?.status || "Pending approval"} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-semibold">
                Portal controls
              </h2>

              <p className="mt-2 text-sm text-white/45">
                These preferences are saved directly to Supabase.
              </p>

              <div className="mt-6 space-y-4">
                <Toggle
                  title="Receive applicant notifications"
                  description="Notify your institution when UniNexa routes new applicants to your portal."
                  checked={Boolean(settings?.receive_applicant_notifications)}
                  disabled={saving}
                  onChange={(value) =>
                    updateSetting("receive_applicant_notifications", value)
                  }
                />

                <Toggle
                  title="Allow direct student messages"
                  description="Allow students to send messages directly to your university portal."
                  checked={Boolean(settings?.allow_direct_student_messages)}
                  disabled={saving}
                  onChange={(value) =>
                    updateSetting("allow_direct_student_messages", value)
                  }
                />

                <Toggle
                  title="Show public university profile"
                  description="Allow your university profile to appear on UniNexa student discovery pages."
                  checked={Boolean(settings?.show_profile_publicly)}
                  disabled={saving}
                  onChange={(value) =>
                    updateSetting("show_profile_publicly", value)
                  }
                />

                <Toggle
                  title="Featured visibility"
                  description="Request featured placement across UniNexa discovery and AI recommendation surfaces."
                  checked={Boolean(settings?.featured_visibility)}
                  disabled={saving}
                  onChange={(value) =>
                    updateSetting("featured_visibility", value)
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Toggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-3xl border border-white/10 bg-black/25 p-5">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-white/45">{description}</p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`h-8 w-16 rounded-full p-1 transition disabled:opacity-50 ${
          checked ? "bg-emerald-500" : "bg-white/15"
        }`}
      >
        <span
          className={`block h-6 w-6 rounded-full bg-white transition ${
            checked ? "translate-x-8" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-white/35">{label}</p>
      <p className="mt-2 break-words text-sm text-white/75">{value}</p>
    </div>
  );
}