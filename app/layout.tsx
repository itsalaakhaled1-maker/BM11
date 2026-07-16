import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import VisitTracker from "@/components/VisitTracker";  // ← جديد

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "مُفكِر - نظام البحث والمقارنة المعيارية",
  description: "نظام ذكي لإنشاء أبحاث مقارنة معيارية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <Providers>
          <VisitTracker />  {/* ← جديد */}
          {children}
        </Providers>
      </body>
    </html>
  );
}