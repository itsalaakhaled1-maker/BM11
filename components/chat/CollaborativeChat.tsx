"use client";

import { useState } from "react";
import { chatWithAI } from "@/app/actions";
import { MessageSquare, Send, Bot, User } from "lucide-react";

export function CollaborativeChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await chatWithAI([...messages, userMsg]);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى." }]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col h-[500px] shadow-sm overflow-hidden">
      <div className="p-3 border-b border-slate-200 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          المحادثة التفاعلية
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>ابدأ محادثة للتعاون في البحث</p>
            <p className="text-xs mt-1">يمكنك طرح الأسئلة أو توجيه النظام في أي مرحلة</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-tr-sm"
                : "bg-slate-100 text-slate-700 rounded-tl-sm"
            }`}>
              <div className="flex items-center gap-1.5 mb-1 opacity-70">
                {msg.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                <span className="text-[10px] font-medium">{msg.role === "user" ? "أنت" : "المساعد"}</span>
              </div>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-end">
            <div className="bg-slate-100 rounded-tl-none rounded-2xl p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-slate-200 p-3 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="اكتب رسالتك..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
