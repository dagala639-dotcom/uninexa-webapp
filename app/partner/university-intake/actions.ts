"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitUniversityPartnerRequest(formData: FormData) {
  const supabase = await createClient();

  const universityName = String(formData.get("university_name") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const website = String(formData.get("website") || "").trim();

  const admissionsEmail = String(formData.get("admissions_email") || "").trim();
  const admissionsContactName = String(
    formData.get("admissions_contact_name") || ""
  ).trim();

  const programs = String(formData.get("programs") || "").trim();
  const applicationFee = String(formData.get("application_fee") || "").trim();
  const tuitionRange = String(formData.get("tuition_range") || "").trim();
  const deadlines = String(formData.get("deadlines") || "").trim();

  const scholarshipsAvailable = String(
    formData.get("scholarships_available") || ""
  ).trim();

  const englishRequirements = String(
    formData.get("english_requirements") || ""
  ).trim();

  const acceptsKcse = String(formData.get("accepts_kcse") || "").trim();
  const acceptsDuolingo = String(formData.get("accepts_duolingo") || "").trim();
  const visaSupport = String(formData.get("visa_support") || "").trim();

  const recruitmentPartnerships = String(
    formData.get("recruitment_partnerships") || ""
  ).trim();

  const featuredVisibility = String(
    formData.get("featured_visibility") || ""
  ).trim();

  const notes = String(formData.get("notes") || "").trim();

  const file = formData.get("application_file") as File | null;

  let uploadedApplicationForm = "";

  if (file && file.size > 0) {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("university-partner-files")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    uploadedApplicationForm = filePath;
  }

  const { error } = await supabase.from("university_partner_requests").insert({
    university_name: universityName,
    country,
    city,
    website,
    admissions_email: admissionsEmail,
    admissions_contact_name: admissionsContactName,
    programs,
    application_fee: applicationFee,
    tuition_range: tuitionRange,
    deadlines,
    scholarships_available: scholarshipsAvailable,
    english_requirements: englishRequirements,
    accepts_kcse: acceptsKcse,
    accepts_duolingo: acceptsDuolingo,
    visa_support: visaSupport,
    recruitment_partnerships: recruitmentPartnerships,
    featured_visibility: featuredVisibility,
    uploaded_application_form: uploadedApplicationForm,
    notes,
    status: "Pending review",
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/partner/university-intake?submitted=1");
}