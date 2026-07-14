'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold text-blue-600">
          BM11
        </Link>
        <span className="text-sm text-gray-500 hidden sm:inline">
          نظام البحث والمقارنة المعيارية
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {session ? (
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="hidden sm:inline">{session.user?.name}</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
            >
              خروج
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </header>
  );
}