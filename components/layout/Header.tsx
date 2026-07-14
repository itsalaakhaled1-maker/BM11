"use client";

import { FlaskConical } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-sm">BM11</h1>
          <p className="text-[10px] text-slate-500">نظام البحث والمقارنة المعيارية</p>
        </div>
      </div>
    </header>
  );
}
