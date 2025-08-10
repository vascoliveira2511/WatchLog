import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WatchLog - Track Your Movies & TV Shows",
  description: "A free, open-source app for tracking your movie and TV show watching history with detailed statistics and social features.",
  keywords: "movie tracker, tv show tracker, watchlist, statistics, free",
  authors: [{ name: "WatchLog Team" }],
  creator: "WatchLog",
  publisher: "WatchLog",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "WatchLog - Track Your Movies & TV Shows",
    description: "A free, open-source app for tracking your movie and TV show watching history",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WatchLog - Track Your Movies & TV Shows",
    description: "A free, open-source app for tracking your movie and TV show watching history",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}