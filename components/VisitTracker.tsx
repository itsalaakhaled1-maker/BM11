"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // سجل الزيارة لكل صفحة جديدة
    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {
      // نسكت لو فشل
    });
  }, [pathname]); // ← يشتغل كل ما يتغير المسار

  return null;
}