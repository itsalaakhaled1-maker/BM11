"use client";

import { getStages } from "@/lib/orchestrator";
import { useResearchStore } from "@/hooks/useResearchStore";
import { CheckCircle, Clock } from "lucide-react";

export function Sidebar() {
  const stages = getStages();
  const { currentStage, stageOutputs } = useResearchStore();

  return (
    <aside className="w-80 bg-white border-l border-slate-200 h-screen overflow-y-auto p-4">
      <h2 className="font-semibold text-slate-800 mb-4 text-sm">المراحل البحثية</h2>
      <div className="space-y-1">
        {stages.map((stage) => {
          const completed = stageOutputs[stage.number];
          const active = currentStage === stage.number;

          return (
            <div
              key={stage.number}
              className={`flex items-center gap-2 p-2 rounded-lg transition ${
                active ? "bg-blue-50 border border-blue-200" : completed ? "bg-green-50" : "hover:bg-slate-50"
              }`}
            >
              {completed ? (
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              ) : active ? (
                <Clock className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
              )}
              <span className={`text-sm truncate ${active ? "font-semibold text-blue-700" : "text-slate-600"}`}>
                {stage.number}. {stage.name}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
