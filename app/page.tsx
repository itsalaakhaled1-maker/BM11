"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useResearchStore } from "@/hooks/useResearchStore";
import { ResearchRun, HitlMode } from "@/types";
import { BookOpen, FlaskConical, Settings, ArrowLeft, Sparkles, BarChart3, Shield, Users } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { addRun, setCurrentRun } = useResearchStore();
  const [formData, setFormData] = useState({
    topic: "",
    initiativeTitle: "",
    initiativeSummary: "",
    localEntity: "",
    mode: "REVIEW_CRITICAL" as HitlMode,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newRun: ResearchRun = {
      id: crypto.randomUUID(),
      topic: formData.topic,
      initiativeTitle: formData.initiativeTitle,
      initiativeSummary: formData.initiativeSummary,
      localEntity: formData.localEntity,
      status: "PENDING",
      mode: formData.mode,
      stages: [],
      artifacts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addRun(newRun);
    setCurrentRun(newRun);
    router.push(`/research/${newRun.id}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-700/20">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">مُفكِر</h1>
              <p className="text-xs text-slate-500">نظام البحث والمقارنة المعيارية</p>
            </div>
          </div>
          
          {/* زر تسجيل الدخول / الملف الشخصي */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <a
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 transition"
                >
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-8 h-8 rounded-full border border-slate-200"
                    />
                  )}
                  <span className="hidden sm:inline">{session.user?.name}</span>
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                >
                  خروج
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
              >
                تسجيل الدخول
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" />
          إصدار 1.1 - نظام أتمتة البحث العلمي
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
          أنشئ ورقتك البحثية<br />للمقارنة المعيارية
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          من الفكرة إلى ورقة أكاديمية جاهزة للنشر — في 23 مرحلة منظمة وموثقة، مع دعم كامل للغة العربية
        </p>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8 space-y-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-800">بيانات المبادرة البحثية</h3>
          </div>

          <div className="grid gap-5">
            {/* عنوان المبادرة */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                عنوان المبادرة <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.initiativeTitle}
                onChange={(e) => setFormData({ ...formData, initiativeTitle: e.target.value })}
                placeholder="مثال: تقييم أداء نماذج التعلم العميق في معالجة اللغة العربية"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50/50"
              />
            </div>

            {/* نبذة عن المبادرة */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                نبذة عن المبادرة <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.initiativeSummary}
                onChange={(e) => setFormData({ ...formData, initiativeSummary: e.target.value })}
                placeholder="وصف مختصر للمبادرة وأهدافها ونطاقها..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none bg-slate-50/50"
              />
            </div>

            {/* الجهة المحلية */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                الجهة المحلية المنفذة <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.localEntity}
                onChange={(e) => setFormData({ ...formData, localEntity: e.target.value })}
                placeholder="مثال: جامعة الملك سعود - كلية الحاسبات والمعلومات"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-slate-50/50"
              />
            </div>

            {/* موضوع البحث */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                موضوع البحث التفصيلي <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="صف موضوع بحثك بالتفصيل — ما المشكلة؟ ما الهدف؟ ما المتغيرات؟ ما المنهجية المقترحة؟"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none bg-slate-50/50"
              />
            </div>

            {/* وضع التشغيل */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                وضع التشغيل
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value as HitlMode })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
              >
                <option value="FULL_AUTO">تشغيل تلقائي كامل</option>
                <option value="REVIEW_EACH">مراجعة كل مرحلة</option>
                <option value="REVIEW_CRITICAL">مراجعة المراحل الحرجة فقط</option>
                <option value="CHAT_GUIDED">توجيه عبر المحادثة</option>
                <option value="STEP_BY_STEP">خطوة بخطوة</option>
                <option value="MANUAL">يدوي كامل</option>
              </select>
              <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
                {formData.mode === "FULL_AUTO" && "يتم تشغيل جميع المراحل تلقائياً بدون توقف"}
                {formData.mode === "REVIEW_EACH" && "يتوقف النظام بعد كل مرحلة للمراجعة والتأكد"}
                {formData.mode === "REVIEW_CRITICAL" && "يتوقف فقط عند المراحل الحرجة: الفرضيات، المقارنة المعيارية، قرار البحث، مراجعة الورقة"}
                {formData.mode === "CHAT_GUIDED" && "يمكنك التوجيه والتعديل عبر المحادثة التفاعلية في أي وقت"}
                {formData.mode === "STEP_BY_STEP" && "يتوقف بعد كل مرحلة — اضغط متابعة للاستمرار"}
                {formData.mode === "MANUAL" && "أنت تتحكم في كل خطوة يدوياً بالكامل"}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-lg hover:shadow-xl shadow-blue-700/20 text-lg"
          >
            <BookOpen className="w-6 h-6" />
            بدء البحث العلمي
            <ArrowLeft className="w-6 h-6" />
          </button>
        </form>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: BarChart3, title: "23 مرحلة بحثية", desc: "من التهيئة إلى التصدير النهائي بصيغة IMRaD" },
            { icon: Shield, title: "مكافحة الاقتباسات الوهمية", desc: "4 طبقات تحقق من صحة كل مصدر" },
            { icon: Users, title: "مراجعة الأقران", desc: "4 مراجعين افتراضيين لضمان الجودة" },
          ].map((f, i) => (
            <div key={i} className="bg-white/80 backdrop-blur rounded-xl p-5 border border-slate-200/60 text-center hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <f.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}