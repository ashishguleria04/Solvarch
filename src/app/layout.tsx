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
    "Solvarch is a free, open platform to master DSA, System Design, and CS fundamentals — with an integrated code editor, a real judge, and a curated interview question bank. No sign-up, no paywall.",
  keywords: [
    "interview preparation",
    "DSA",
    "system design",
    "coding interview",
    "leetcode alternative",
    "free coding practice",
  ],
  openGraph: {
    title: "Solvarch — Master the Tech Interview",
    description:
      "Free, open interview prep — master DSA, System Design, and CS fundamentals with an integrated editor and a real judge. No sign-up, no paywall.",
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
