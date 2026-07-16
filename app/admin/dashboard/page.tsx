"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  TrendingUp,
  Eye,
  Globe,
  Activity,
} from "lucide-react";

interface Stats {
  totalVisits: number;
  monthVisits: number;
  todayVisits: number;
  uniqueVisits: number;
  countries: { country: string; _count: { country: number } }[];
  totalUsers: number;
  newUsers: number;
  totalResearches: number;
  completedResearches: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics/stats");
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      
      setStats(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => { setError(null); setLoading(true); fetchStats(); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">لا توجد بيانات</p>
      </div>
    );
  }

  const statCards = [
    { title: "إجمالي الزيارات", value: stats.totalVisits || 0, icon: Eye, color: "bg-blue-500" },
    { title: "زيارات اليوم", value: stats.todayVisits || 0, icon: Activity, color: "bg-green-500" },
    { title: "زيارات الشهر", value: stats.monthVisits || 0, icon: TrendingUp, color: "bg-purple-500" },
    { title: "زوار فريدين", value: stats.uniqueVisits || 0, icon: Users, color: "bg-orange-500" },
    { title: "إجمالي المستخدمين", value: stats.totalUsers || 0, icon: Users, color: "bg-indigo-500" },
    { title: "مستخدمين جدد", value: stats.newUsers || 0, icon: Users, color: "bg-pink-500" },
    { title: "إجمالي البحوث", value: stats.totalResearches || 0, icon: BookOpen, color: "bg-cyan-500" },
    { title: "بحوث مكتملة", value: stats.completedResearches || 0, icon: BookOpen, color: "bg-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="مُفكِر" className="w-10 h-10 rounded-xl" />
            <h1 className="text-xl font-bold text-slate-900">لوحة التحكم</h1>
          </div>
          <a href="/" className="text-sm text-blue-600 hover:text-blue-700">العودة للموقع</a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">إحصائيات النظام</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-slate-900">{card.value}</span>
              </div>
              <p className="text-sm text-slate-500">{card.title}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            دول الزوار
          </h3>
          {stats.countries && stats.countries.length > 0 ? (
            <div className="space-y-3">
              {stats.countries.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">{country.country || "غير معروف"}</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {country._count?.country || 0} زيارة
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">لا توجد بيانات دول</p>
          )}
        </div>
      </div>
    </div>
  );
}