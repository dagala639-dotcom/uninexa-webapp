import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboardClient, {
  type AdminDashboardData,
} from "./admin-dashboard-client";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const [{ data: roleData }, { data: universityAccount }] = await Promise.all([
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle(),
    supabase
      .from("university_accounts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (roleData?.role !== "admin") {
    redirect(universityAccount ? "/university" : "/dashboard");
  }

  const [
    { count: studentCount },
    { data: documents },
    { data: applications },
    { data: conversations },
    { data: universities },
    { count: scholarshipTrackingCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*").order("uploaded_at", { ascending: false }),
    supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false }),
    supabase
      .from("universities")
      .select("id, name, status, featured")
      .order("created_at", { ascending: false }),
    supabase
      .from("student_scholarships")
      .select("*", { count: "exact", head: true }),
  ]);

  const initialData: AdminDashboardData = {
    studentCount: studentCount || 0,
    documents: documents || [],
    applications: applications || [],
    conversations: conversations || [],
    universities: universities || [],
    scholarshipTrackingCount: scholarshipTrackingCount || 0,
  };

  return <AdminDashboardClient initialData={initialData} />;
}
