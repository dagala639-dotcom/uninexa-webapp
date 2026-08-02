import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import UniversityLogin from "./university-login";
import UniversityPortalClient, {
  type ApplicationRow,
  type ProfileRow,
  type UniversityAccount,
  type UniversityApplicant,
} from "./university-portal-client";

export default async function UniversityPortalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <UniversityLogin />;
  }

  const [{ data: universityAccount }, { data: roleData }] = await Promise.all([
    supabase
      .from("university_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle(),
  ]);

  if (!universityAccount) {
    redirect(roleData?.role === "admin" ? "/admin" : "/dashboard");
  }

  const { data: applicantData } = await supabase
    .from("university_applicants")
    .select("*")
    .eq("university_account_id", universityAccount.id)
    .order("created_at", { ascending: false });

  const applicationIds = applicantData?.map((item) => item.application_id) || [];
  const studentIds = applicantData?.map((item) => item.student_user_id) || [];

  let applications: ApplicationRow[] = [];
  let profiles: ProfileRow[] = [];

  if (applicationIds.length > 0) {
    const { data } = await supabase
      .from("applications")
      .select("*")
      .in("id", applicationIds);

    applications = data || [];
  }

  if (studentIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", studentIds);

    profiles = data || [];
  }

  return (
    <UniversityPortalClient
      initialAccount={universityAccount as UniversityAccount}
      initialApplicants={(applicantData || []) as UniversityApplicant[]}
      initialApplications={applications}
      initialProfiles={profiles}
    />
  );
}
