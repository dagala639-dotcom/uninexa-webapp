import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uninexa.app"),
  title: {
    default: "UniNexa",
    template: "%s | UniNexa",
  },
  description:
    "UniNexa helps Kenyan students manage profiles, documents, scholarships, messaging, and international university applications in one workspace.",
  applicationName: "UniNexa",
  keywords: [
    "UniNexa",
    "study abroad",
    "Kenyan students",
    "university applications",
    "scholarships",
    "Supabase",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
