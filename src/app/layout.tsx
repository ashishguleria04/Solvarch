import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CommandPalette } from "@/components/app/command-palette";
import { buildSearchIndex } from "@/lib/search-index";
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

// Applies the saved theme before first paint so neither theme flashes.
// Mirrors the fallback logic in src/lib/theme.ts: no saved value = dark.
const themeInitScript = `(function(){try{var t=localStorage.getItem("solvarch.theme");var d=t==="light"?false:t==="dark"?true:t==="system"?matchMedia("(prefers-color-scheme: dark)").matches:true;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchIndex = await buildSearchIndex();

  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground">
        {children}
        <CommandPalette items={searchIndex} />
        <Toaster />
      </body>
    </html>
  );
}
