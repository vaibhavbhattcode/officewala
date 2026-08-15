import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://musicwala.life'),
  title: {
    default: "Music Wala | Play • Chill • Connect",
    template: "%s | Music Wala"
  },
  description: "Music Wala is your premium workspace radio station. Stream curated chill beats and focus music for a productive workday.",
  keywords: ["music wala", "workspace radio", "chill beats", "focus music", "lofi radio", "bollywood lofi", "office music"],
  authors: [{ name: "Music Wala" }],
  creator: "Music Wala",
  publisher: "Music Wala",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Music Wala | Play • Chill • Connect",
    description: "Music Wala is your premium workspace radio station. Stream curated chill beats and focus music.",
    url: 'https://musicwala.life',
    siteName: 'Music Wala',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Music Wala | Play • Chill • Connect",
    description: "Your premium workspace radio station. Stream curated chill beats and focus music.",
    creator: '@musicwala',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-0000000000000000';

  return (
    <html lang="en">
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-[var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}


