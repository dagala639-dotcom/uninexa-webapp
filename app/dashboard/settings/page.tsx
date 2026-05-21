import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "../logout-button";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Student";

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <h1 className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-xl font-bold uppercase tracking-[0.35em] text-transparent">
              UniNexa
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Student Portal
            </p>
          </div>

          <nav className="space-y-2">
            {[
              ["Dashboard", "/dashboard"],
              ["Profile", "/dashboard/profile"],
              ["Applications", "/dashboard/applications"],
              ["Universities", "/dashboard/universities"],
              ["Documents", "/dashboard/documents"],
              ["Scholarships", "/dashboard/scholarships"],
              ["AI Matcher", "/dashboard/ai-matcher"],
              ["Messages", "/dashboard/messages"],
              ["Settings", "/dashboard/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/dashboard/settings"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="relative flex-1 overflow-hidden p-6 lg:p-10">
          <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />

          <div className="absolute left-1/3 top-72 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-fuchsia-300">
                Settings
              </p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
                Control your UniNexa.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
                Manage your account, preferences, notifications,
                security, and study-abroad settings.
              </p>
            </div>

            <LogoutButton />
          </div>

          <div className="relative grid gap-8 xl:grid-cols-[0.75fr_1.4fr_0.85fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <h3 className="text-xl font-semibold">
                Settings menu
              </h3>

              <div className="mt-5 space-y-3">
                {[
                  "Account",
                  "Study Preferences",
                  "Notifications",
                  "Documents",
                  "Security",
                  "AI Assistant",
                  "Subscription",
                ].map((item, index) => (
                  <button
                    key={item}
                    className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      index === 0
                        ? "border-fuchsia-400/30 bg-fuchsia-500/10 text-white"
                        : "border-white/10 bg-black/20 text-white/60 hover:bg-white/[0.06]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.1] via-white/[0.04] to-white/[0.02] p-6 shadow-[0_0_90px_rgba(168,85,247,0.16)] backdrop-blur-2xl">
                <h3 className="text-2xl font-semibold">
                  Account settings
                </h3>

                <p className="mt-2 text-sm text-white/45">
                  Your UniNexa account information.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Input
                    label="Full name"
                    defaultValue={fullName}
                  />

                  <Input
                    label="Email address"
                    defaultValue={user.email || ""}
                  />

                  <Input
                    label="Phone number"
                    placeholder="+254 7XX XXX XXX"
                  />

                  <Select
                    label="Account type"
                    options={[
                      "Student",
                      "Parent / Sponsor",
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold">
                  Study abroad preferences
                </h3>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <Select
                    label="Preferred country"
                    options={[
                      "Canada",
                      "United Kingdom",
                      "United States",
                      "Australia",
                      "Germany",
                      "Hungary",
                    ]}
                  />

                  <Select
                    label="Degree level"
                    options={[
                      "Undergraduate",
                      "Masters",
                      "PhD",
                    ]}
                  />

                  <Select
                    label="Preferred program"
                    options={[
                      "Computer Science",
                      "Medicine",
                      "Engineering",
                      "Business",
                      "Law",
                    ]}
                  />

                  <Select
                    label="Preferred intake"
                    options={[
                      "Fall",
                      "Spring",
                      "Summer",
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold">
                  Notifications
                </h3>

                <div className="mt-6 space-y-4">
                  {[
                    "Application deadline reminders",
                    "Scholarship alerts",
                    "KCSE verification updates",
                    "Advisor messages",
                    "Visa reminders",
                    "Email notifications",
                    "WhatsApp notifications",
                  ].map((item) => (
                    <ToggleRow
                      key={item}
                      label={item}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-2xl font-semibold">
                  AI Assistant settings
                </h3>

                <div className="mt-6 space-y-4">
                  {[
                    "Enable UniNexa AI",
                    "AI scholarship matching",
                    "AI essay feedback",
                    "AI profile scoring",
                  ].map((item) => (
                    <ToggleRow
                      key={item}
                      label={item}
                    />
                  ))}
                </div>
              </div>

              <button className="rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01]">
                Save settings
              </button>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-blue-500/10 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">
                  Account summary
                </h3>

                <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-5">
                  <p className="text-sm text-white/40">
                    Signed in as
                  </p>

                  <p className="mt-2 font-semibold">
                    {fullName}
                  </p>

                  <p className="mt-1 truncate text-sm text-white/45">
                    {user.email}
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    ["Security score", "72%"],
                    ["Profile completion", "30%"],
                    ["Documents uploaded", "0"],
                    ["Applications", "0"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                    >
                      <span className="text-sm text-white/55">
                        {label}
                      </span>

                      <span className="text-sm font-semibold text-fuchsia-200">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">
                  Security
                </h3>

                <div className="mt-5 space-y-3">
                  {[
                    "Change password",
                    "Enable two-factor authentication",
                    "Manage connected devices",
                    "Download my data",
                    "Delete account",
                  ].map((item) => (
                    <button
                      key={item}
                      className="block w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/65 transition hover:bg-white/[0.06]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold">
                  Plan
                </h3>

                <p className="mt-2 text-sm text-white/45">
                  UniNexa free student plan.
                </p>

                <button className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90">
                  Explore premium
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
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
        defaultValue={props.defaultValue || props.value}
        className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/50 focus:bg-white/[0.14]"
      />
    </div>
  );
}

function Select({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </label>

      <select className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-white outline-none transition focus:border-fuchsia-400/50 focus:bg-white/[0.14]">
        <option className="bg-[#050816]">
          Select option
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#050816]"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({
  label,
}: {
  label: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-sm text-white/70">
        {label}
      </p>

      <div className="flex h-7 w-12 items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-blue-500 p-1">
        <div className="h-5 w-5 translate-x-5 rounded-full bg-white" />
      </div>
    </div>
  );
}