"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    // سجل الزيارة مرة واحدة لما الصفحة تفتح
    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {
      // نسكت لو فشل
    });
  }, []);

  return null; // ما يرender شيء
}