"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();
  const hasTracked = useRef(false);

  useEffect(() => {
    // نسجل مرة واحدة لكل صفحة
    if (hasTracked.current) return;
    hasTracked.current = true;

    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
    })
    .then(r => r.json())
    .then(data => console.log("Visit tracked:", data))
    .catch(err => console.error("Visit error:", err));

    // نعيد السماح لما يتغير المسار
    return () => {
      hasTracked.current = false;
    };
  }, [pathname]);

  return null;
}