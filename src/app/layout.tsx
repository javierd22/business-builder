import type { Metadata } from "next";
import BuildInfo from "./_components/BuildInfo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Business Builder",
  description: "Transform your business ideas into structured plans and professional presentations in minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-brand-beige">
        {children}
        <BuildInfo />
      </body>
    </html>
  );
}