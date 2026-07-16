import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

// خريطة بسيطة لـ IP ranges → دول (للـ private IPs)
function getCountryFromIP(ip: string): string {
  if (ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
    return "Local Network";
  }
  // نستخدم خدمة ipapi.co (مجانية 1000 request/يوم)
  return "Unknown";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const page = body.page || "/";
    
    // جيب الـ IP
    const forwarded = req.headers.get("x-forwarded-for");
    const realIP = req.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0].trim() : 
               realIP ? realIP.trim() : 
               req.headers.get("x-vercel-ip") || "unknown";
    
    // جيب الدولة من خدمة خارجية
    let country = "Unknown";
    try {
      // نجرب نجيب الدولة من ipapi.co
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, { 
        next: { revalidate: 3600 } 
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        country = geoData.country_name || geoData.country || "Unknown";
      }
    } catch {
      // لو فشلت الخدمة، نستخدم headers
      country = req.headers.get("x-vercel-ip-country") || 
                req.headers.get("cf-ipcountry") || 
                "Unknown";
    }

    await prisma.visit.create({
      data: {
        id: randomUUID(),
        ip: ip,
        country: country,
        page: page,
      },
    });

    return NextResponse.json({ success: true, ip, country });
  } catch (error) {
    console.error("Visit tracking error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}