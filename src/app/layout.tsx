import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Solvarch — Master the Tech Interview",
    template: "%s · Solvarch",
  },
  description:
    "Solvarch is the all-in-one platform to master DSA, System Design, and CS fundamentals — with an integrated code editor, AI mock interviews, and curated content.",
  keywords: [
    "interview preparation",
    "DSA",
    "system design",
    "coding interview",
    "leetcode alternative",
    "mock interview",
  ],
  openGraph: {
    title: "Solvarch — Master the Tech Interview",
    description:
      "Master DSA, System Design, and CS fundamentals with an integrated editor and AI mock interviews.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
