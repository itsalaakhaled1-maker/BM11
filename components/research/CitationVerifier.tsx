"use client";

import { useState } from "react";
import { verifyCitationAction } from "@/app/actions";
import { Shield, CheckCircle, XCircle, Search } from "lucide-react";

export function CitationVerifier() {
  const [citation, setCitation] = useState({ title: "", doi: "", url: "" });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    const res = await verifyCitationAction(citation);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-green-600" />
        متحقق الاقتباسات
      </h3>
      <div className="space-y-3">
        <input
          placeholder="عنوان الورقة"
          value={citation.title}
          onChange={(e) => setCitation({ ...citation, title: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <input
          placeholder="DOI (اختياري)"
          value={citation.doi}
          onChange={(e) => setCitation({ ...citation, doi: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <input
          placeholder="رابط (اختياري)"
          value={citation.url}
          onChange={(e) => setCitation({ ...citation, url: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <button
          onClick={handleVerify}
          disabled={loading || !citation.title}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
        >
          <Search className="w-4 h-4" />
          {loading ? "جاري التحقق..." : "تحقق من الاقتباس"}
        </button>
      </div>

      {result && (
        <div className="mt-4 space-y-2">
          <div className={`flex items-center gap-2 p-3 rounded-xl ${
            result.overall.verified ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {result.overall.verified ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
            <span className="font-medium">{result.overall.verified ? "تم التحقق بنجاح" : "فشل التحقق"}</span>
            <span className="text-sm mr-auto">({(result.overall.score * 100).toFixed(0)}%)</span>
          </div>
          {result.results.map((r: any, i: number) => (
            <div key={i} className="flex items-start gap-2 text-sm p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              {r.verified ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
              <div>
                <span className="font-medium text-slate-700">{r.layer}:</span>
                <span className="text-slate-500 mr-1">{r.details}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
