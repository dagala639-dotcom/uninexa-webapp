"use client";

import { Download } from "lucide-react";
import { downloadApplicationPdf } from "@/lib/download-application-pdf";

export default function DownloadApplicationButton({
  applicationId,
}: {
  applicationId: string;
}) {
  return (
    <button
      type="button"
      onClick={() => downloadApplicationPdf(applicationId)}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-6 py-4 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </button>
  );
}