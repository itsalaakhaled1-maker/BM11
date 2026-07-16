"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // نسجل الزيارة لكل صفحة جديدة — بدون حظر
    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {});
  }, [pathname]); // ← يشتغل كل ما يتغير المسار

  return null;
}