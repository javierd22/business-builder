import type { Metadata } from "next";
import BuildInfo from "./_components/BuildInfo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Builder",
  description: "Transform your business ideas into structured plans and professional presentations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[#F4EDE2]">
        {children}
        <BuildInfo />
      </body>
    </html>
  );
}
