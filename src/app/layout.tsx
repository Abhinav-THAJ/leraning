import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ITTA Academy | Professional Trading Education",
    template: "%s | ITTA Academy",
  },
  description: "ITTA Academy is a premier institution offering professional financial market education, forex trading, stock market programs, crypto masterclasses, and practical trading mentorship.",
  keywords: ["trading", "forex", "stock market", "crypto", "trading academy", "ITTA", "international trade", "learn trading", "kerala trading academy"],
  authors: [{ name: "ITTA Academy" }],
  creator: "ITTA Academy",
  metadataBase: new URL("https://ittaacademy.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ittaacademy.com",
    siteName: "ITTA Academy",
    title: "ITTA Academy | Professional Trading Education",
    description: "ITTA Academy is a premier institution offering professional financial market education and practical trading mentorship.",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "ITTA Academy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ITTA Academy | Professional Trading Education",
    description: "ITTA Academy is a premier institution offering professional financial market education and practical trading mentorship.",
    images: ["/Logo.png"],
  },
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-[#060B17] text-white selection:bg-brand-purple selection:text-white overflow-x-hidden">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
