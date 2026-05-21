// app/university/documents/page.tsx

import { Suspense } from "react";
import UniversityDocumentsClient from "./university-documents-client";

export const dynamic = "force-dynamic";

export default function UniversityDocumentsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
          Loading documents...
        </main>
      }
    >
      <UniversityDocumentsClient />
    </Suspense>
  );
}