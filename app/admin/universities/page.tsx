"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type University = {
  id: string;
  name: string;
  country: string | null;
  city: string | null;
  website: string | null;
  tuition: string | null;
  application_fee: string | null;
  programs: string[] | null;
  deadline: string | null;
  scholarships_available: boolean;
  accepts_kcse: boolean;
  accepts_duolingo: boolean;
  visa_support: boolean;
  featured: boolean;
  status: string | null;
};

export default function AdminUniversitiesPage() {
  const supabase = createClient();
  const router = useRouter();

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    website: "",
    tuition: "",
    application_fee: "",
    programs: "",
    deadline: "",
    scholarships_available: true,
    accepts_kcse: true,
    accepts_duolingo: false,
    visa_support: true,
    featured: false,
    status: "Published",
  });

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleData?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const { data } = await supabase
      .from("universities")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    setUniversities(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("admin-universities-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "universities",
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function addUniversity(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase.from("universities").insert({
      ...form,
      programs: form.programs
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      setForm({
        name: "",
        country: "",
        city: "",
        website: "",
        tuition: "",
        application_fee: "",
        programs: "",
        deadline: "",
        scholarships_available: true,
        accepts_kcse: true,
        accepts_duolingo: false,
        visa_support: true,
        featured: false,
        status: "Published",
      });

      await loadData();
    }

    setSaving(false);
  }

  async function deleteUniversity(id: string) {
    await supabase.from("universities").delete().eq("id", id);

    await loadData();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading universities...
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

            <p className="mt-2 text-sm text-white/40">
              Admin Console
            </p>
          </div>

          <nav className="space-y-2">
            {[
              ["Overview", "/admin"],
              ["Students", "/admin/students"],
              ["Documents", "/admin/documents"],
              ["Applications", "/admin/applications"],
              ["Universities", "/admin/universities"],
              ["Messages", "/admin/messages"],
              ["Scholarships", "/admin/scholarships"],
              ["Settings", "/admin/settings"],
            ].map(([name, href]) => (
              <Link
                key={href}
                href={href}
                className={`block rounded-2xl px-4 py-3 text-sm transition ${
                  href === "/admin/universities"
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {name}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-6 lg:p-10">
          <div className="mb-10">
            <p className="text-sm font-medium text-fuchsia-300">
              University Management
            </p>

            <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-6xl">
              Manage universities.
            </h2>

            <p className="mt-4 max-w-2xl text-sm text-white/50">
              Universities added here automatically appear inside the
              student Universities page.
            </p>
          </div>

          <form
            onSubmit={addUniversity}
            className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-6 backdrop-blur-2xl"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-semibold">
                Add university
              </h3>

              <p className="mt-2 text-sm text-white/45">
                Create a university listing for UniNexa students.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="University name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />

              <Input
                label="Country"
                value={form.country}
                onChange={(v) => setForm({ ...form, country: v })}
              />

              <Input
                label="City"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
              />

              <Input
                label="Website"
                value={form.website}
                onChange={(v) => setForm({ ...form, website: v })}
              />

              <Input
                label="Tuition range"
                value={form.tuition}
                onChange={(v) => setForm({ ...form, tuition: v })}
              />

              <Input
                label="Application fee"
                value={form.application_fee}
                onChange={(v) =>
                  setForm({ ...form, application_fee: v })
                }
              />

              <Input
                label="Deadline"
                value={form.deadline}
                onChange={(v) => setForm({ ...form, deadline: v })}
              />

              <Input
                label="Programs (comma separated)"
                value={form.programs}
                onChange={(v) => setForm({ ...form, programs: v })}
                full
              />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <Toggle
                label="Scholarships"
                checked={form.scholarships_available}
                onChange={(v) =>
                  setForm({
                    ...form,
                    scholarships_available: v,
                  })
                }
              />

              <Toggle
                label="Accepts KCSE"
                checked={form.accepts_kcse}
                onChange={(v) =>
                  setForm({
                    ...form,
                    accepts_kcse: v,
                  })
                }
              />

              <Toggle
                label="Accepts Duolingo"
                checked={form.accepts_duolingo}
                onChange={(v) =>
                  setForm({
                    ...form,
                    accepts_duolingo: v,
                  })
                }
              />

              <Toggle
                label="Featured"
                checked={form.featured}
                onChange={(v) =>
                  setForm({
                    ...form,
                    featured: v,
                  })
                }
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-8 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
            >
              {saving ? "Adding university..." : "Add university"}
            </button>
          </form>

          <div className="mt-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">
                  Published universities
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  These universities are visible to students.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/60">
                {universities.length} universities
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {universities.map((uni) => (
                <div
                  key={uni.id}
                  className="rounded-[2rem] border border-white/10 bg-black/20 p-5 transition hover:border-fuchsia-400/20 hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-300">
                        {uni.country || "Country"}
                      </p>

                      <h4 className="mt-2 text-2xl font-semibold">
                        {uni.name}
                      </h4>

                      <p className="mt-1 text-sm text-white/40">
                        {uni.city || "City not set"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        uni.featured
                          ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                          : "border border-white/10 bg-white/10 text-white/60"
                      }`}
                    >
                      {uni.featured ? "Featured" : "Published"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <Info
                      label="Tuition"
                      value={uni.tuition || "Not set"}
                    />

                    <Info
                      label="Deadline"
                      value={uni.deadline || "Not set"}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {uni.scholarships_available && (
                      <Badge text="Scholarships" />
                    )}

                    {uni.accepts_kcse && (
                      <Badge text="KCSE accepted" />
                    )}

                    {uni.accepts_duolingo && (
                      <Badge text="Duolingo accepted" />
                    )}

                    {uni.visa_support && (
                      <Badge text="Visa support" />
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-white/40">
                      {uni.programs?.length || 0} programs
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteUniversity(uni.id)}
                      className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 transition hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {!universities.length && (
                <div className="rounded-[2rem] border border-white/10 bg-black/20 p-8 text-center text-white/45 xl:col-span-2">
                  No universities added yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  full = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm text-white/60">
        {label}
      </label>

      <input
        required={!full}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none transition focus:border-fuchsia-400/40"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-2xl border px-4 py-3 text-sm transition ${
        checked
          ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
          : "border-white/10 bg-white/5 text-white/50"
      }`}
    >
      {checked ? "✓ " : ""}
      {label}
    </button>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-200">
      {text}
    </span>
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-white/35">
        {label}
      </p>

      <p className="mt-2 text-sm text-white/75">
        {value}
      </p>
    </div>
  );
}
