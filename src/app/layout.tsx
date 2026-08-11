import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="font-[var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}
