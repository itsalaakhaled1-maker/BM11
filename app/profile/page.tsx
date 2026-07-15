'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Research {
  id: string;
  topic: string;
  initiativeTitle: string;
  status: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [researches, setResearches] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchResearches();
    }
  }, [session]);

  const fetchResearches = async () => {
    try {
      const res = await fetch('/api/user/researches');
      const data = await res.json();
      setResearches(data.researches || []);
    } catch (err) {
      console.error('Error fetching researches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h1>
          <p className="text-gray-600 mb-6">يجب تسجيل الدخول لعرض الملف الشخصي</p>
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* بطاقة المستخدم */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="w-20 h-20 rounded-full border-2 border-blue-100"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {session.user?.name || 'مستخدم'}
              </h1>
              <p className="text-gray-500 mt-1">{session.user?.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  {researches.length} بحث
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                  باحث
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* سجل الأبحاث */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">سجل الأبحاث</h2>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              بحث جديد
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : researches.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد أبحاث حالياً
              </h3>
              <p className="text-gray-500 mb-4">
                ابدأ أول بحث لك الآن
              </p>
              <Link
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إنشاء بحث جديد
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {researches.map((research) => (
                <div
                  key={research.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {research.initiativeTitle}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {research.topic}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          research.status === 'COMPLETED'
                            ? 'bg-green-50 text-green-600'
                            : research.status === 'PENDING'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-gray-50 text-gray-600'
                        }`}>
                          {research.status === 'COMPLETED' ? 'مكتمل'
                            : research.status === 'PENDING' ? 'قيد التنفيذ'
                            : research.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(research.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/research/${research.id}`}
                        className="px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                      >
                        عرض
                      </Link>
                      <button
                        onClick={() => {
                          // تنزيل البحث
                          window.open(`/api/paper/export?runId=${research.id}`, '_blank');
                        }}
                        className="px-3 py-2 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50"
                      >
                        تنزيل
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}