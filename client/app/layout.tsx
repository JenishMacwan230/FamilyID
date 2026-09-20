import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Family ID | Government of Gujarat",
  description: "Unified Family Identity & Scheme Eligibility Portal, Government of Gujarat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
