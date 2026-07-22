"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="مُفكِر"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white">مُفكِر</p>
              <p className="text-xs text-slate-500">
                © 2026 HAKIM. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>

          {/* Center: HAKIM Link */}
          <a
            href="https://www.hakim1.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-400 transition-colors"
          >
            <span>من حكيم</span>
            <span className="font-bold text-blue-400">by HAKIM</span>
            <span className="text-xs">™</span>
          </a>

          {/* Right: Links */}
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            <Link
              href="/privacy"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <Link
              href="/terms"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              الشروط والأحكام
            </Link>
            <Link
              href="/refund"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              سياسة الاسترداد
            </Link>
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}