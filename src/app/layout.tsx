import type { Metadata } from "next";
import Link from "next/link";
import BuildInfo from "./_components/BuildInfo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Builder",
  description: "Turn your ideas into structured plans and previews",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen">
        {children}
        <BuildInfo />
      </body>
    </html>
  );
}
