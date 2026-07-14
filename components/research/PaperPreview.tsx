"use client";

import { useResearchStore } from "@/hooks/useResearchStore";

export function PaperPreview() {
  const { stageOutputs } = useResearchStore();
  const draft = stageOutputs[17]?.draft || stageOutputs[16]?.outline || "";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4">معاينة الورقة البحثية</h3>
      {draft ? (
        <div className="bg-slate-50 rounded-lg p-4 whitespace-pre-wrap font-mono text-sm text-slate-700 max-h-[500px] overflow-y-auto leading-relaxed">
          {draft}
        </div>
      ) : (
        <p className="text-slate-400 text-center py-8">ستظهر مسودة الورقة هنا بعد اكتمال المراحل</p>
      )}
    </div>
  );
}
