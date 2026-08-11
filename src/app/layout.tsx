import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Office Radio — Workspace Music Station",
  description:
    "Your private corporate music station. Good work starts with good music. Stream curated playlists in your office environment.",
  keywords: ["office radio", "workspace music", "corporate station", "focus music"],
  openGraph: {
    title: "Office Radio — Workspace Music Station",
    description: "Your private corporate music station. Good work starts with good music.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-[var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}
