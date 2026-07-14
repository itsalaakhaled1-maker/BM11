"use client";

import { Pause, Play, ChevronLeft } from "lucide-react";

interface HitlPanelProps {
  paused: boolean;
  pauseReason: string;
  onResume: () => void;
}

export function HitlPanel({ paused, pauseReason, onResume }: HitlPanelProps) {
  if (!paused) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border-2 border-amber-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Pause className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-amber-800 text-lg">توقف للمراجعة</h3>
            <p className="text-sm text-amber-600">التدخل البشري مطلوب</p>
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 mb-5 border border-amber-200">
          <p className="text-amber-800 text-sm">{pauseReason}</p>
        </div>
        <button
          onClick={onResume}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          متابعة التشغيل
        </button>
      </div>
    </div>
  );
}
