"use client";

import { useState } from "react";

interface TopicInputProps {
  onSubmit: (data: {
    topic: string;
    initiativeTitle: string;
    initiativeSummary: string;
    localEntity: string;
  }) => void;
}

export function TopicInput({ onSubmit }: TopicInputProps) {
  const [data, setData] = useState({
    topic: "",
    initiativeTitle: "",
    initiativeSummary: "",
    localEntity: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">عنوان المبادرة</label>
        <input
          type="text"
          value={data.initiativeTitle}
          onChange={(e) => setData({ ...data, initiativeTitle: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">نبذة عن المبادرة</label>
        <textarea
          value={data.initiativeSummary}
          onChange={(e) => setData({ ...data, initiativeSummary: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">الجهة المحلية</label>
        <input
          type="text"
          value={data.localEntity}
          onChange={(e) => setData({ ...data, localEntity: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">موضوع البحث التفصيلي</label>
        <textarea
          value={data.topic}
          onChange={(e) => setData({ ...data, topic: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
      >
        متابعة
      </button>
    </form>
  );
}
