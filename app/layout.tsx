import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BM11 - نظام البحث والمقارنة المعيارية",
  description: "نظام أتمتة البحث العلمي من الفكرة إلى ورقة أكاديمية جاهزة للنشر",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
