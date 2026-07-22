import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Script from "next/script";
import Footer from "@/components/shared/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "مُفكِر - نظام البحث والمقارنة المعيارية",
  description: "نظام ذكي لإنشاء أبحاث مقارنة معيارية",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "مُفكِر - نظام البحث والمقارنة المعيارية",
    description: "نظام ذكي لإنشاء أبحاث مقارنة معيارية — من الفكرة إلى ورقة أكاديمية جاهزة للنشر!",
    url: "https://www.mufkir.com",
    siteName: "مُفكِر",
    locale: "ar_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4FDSKJSCXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4FDSKJSCXX');
          `}
        </Script>
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Analytics />  {/* ✅ أضف هذا السطر */}
        </Providers>
      </body>
    </html>
  );
}