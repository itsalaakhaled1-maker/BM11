export const dynamic = "force-dynamic";

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
  DollarSign,
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Check if user is admin
    if (session?.user?.email !== "your-admin-email@example.com") {
      router.push("/");
      return;
    }

    fetchStats();
  }, [status, session, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">فشل تحميل الإحصائيات</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "إجمالي الزيارات",
      value: stats.totalVisits,
      icon: Eye,
      color: "bg-blue-500",
    },
    {
      title: "زيارات اليوم",
      value: stats.todayVisits,
      icon: Activity,
      color: "bg-green-500",
    },
    {
      title: "زيارات الشهر",
      value: stats.monthVisits,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "زوار فريدين",
      value: stats.uniqueVisits,
      icon: Users,
      color: "bg-orange-500",
    },
    {
      title: "إجمالي المستخدمين",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      title: "مستخدمين جدد",
      value: stats.newUsers,
      icon: Users,
      color: "bg-pink-500",
    },
    {
      title: "إجمالي البحوث",
      value: stats.totalResearches,
      icon: BookOpen,
      color: "bg-cyan-500",
    },
    {
      title: "بحوث مكتملة",
      value: stats.completedResearches,
      icon: BookOpen,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="مُفكِر"
              className="w-10 h-10 rounded-xl"
            />
            <h1 className="text-xl font-bold text-slate-900">لوحة التحكم</h1>
          </div>
          <a
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700 transition"
          >
            العودة للموقع
          </a>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          إحصائيات النظام
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-slate-900">
                  {card.value}
                </span>
              </div>
              <p className="text-sm text-slate-500">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Countries */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            دول الزوار
          </h3>
          <div className="space-y-3">
            {stats.countries.map((country, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <span className="text-slate-700">{country.country}</span>
                <span className="text-sm font-semibold text-blue-600">
                  {country._count.country} زيارة
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}