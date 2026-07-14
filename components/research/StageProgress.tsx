"use client";

import { getStages } from "@/lib/orchestrator";
import { useResearchStore } from "@/hooks/useResearchStore";

export function StageProgress() {
  const stages = getStages();
  const { currentStage, isRunning } = useResearchStore();

  const progress = Math.min((currentStage / 23) * 100, 100);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700">تقدم البحث</span>
        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {currentStage} / 23
        </span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-700 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      {isRunning && currentStage > 0 && currentStage <= 23 && (
        <p className="text-xs text-blue-600 mt-2">
          المرحلة الحالية: {stages.find(s => s.number === currentStage)?.name}
        </p>
      )}
    </div>
  );
}
