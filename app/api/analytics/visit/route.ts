import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

// بيانات دول بسيطة من IP ranges
function getCountryFromIP(ip: string): string {
  // localhost / private IPs
  if (ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
    return "Local Network";
  }
  
  // نستخدم خدمة مجانية أو نخمن من الـ IP
  // للآن نستخدم طريقة بسيطة: نجيب من headers
  return "Unknown";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const page = body.page || "/";
    
    // جيب الـ IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    
    // جيب الدولة من headers (Vercel يضيفها)
    const country = req.headers.get("x-vercel-ip-country") || 
                    req.headers.get("cf-ipcountry") || 
                    getCountryFromIP(ip);

    await prisma.visit.create({
      data: {
        id: randomUUID(),
        ip: ip,
        country: country || "Unknown",
        page: page,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visit tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}