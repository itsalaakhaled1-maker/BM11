import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

// خريطة كود الدولة → اسم الدولة
const countryNames: Record<string, string> = {
  "EG": "مصر",
  "SA": "السعودية",
  "AE": "الإمارات",
  "KW": "الكويت",
  "QA": "قطر",
  "BH": "البحرين",
  "OM": "عمان",
  "JO": "الأردن",
  "LB": "لبنان",
  "IQ": "العراق",
  "DZ": "الجزائر",
  "MA": "المغرب",
  "TN": "تونس",
  "LY": "ليبيا",
  "SD": "السودان",
  "SY": "سوريا",
  "YE": "اليمن",
  "PS": "فلسطين",
  "US": "الولايات المتحدة",
  "GB": "المملكة المتحدة",
  "DE": "ألمانيا",
  "FR": "فرنسا",
  "TR": "تركيا",
  "IN": "الهند",
  "PK": "باكستان",
  "BD": "بنجلاديش",
  "ID": "إندونيسيا",
  "MY": "ماليزيا",
  "NG": "نيجيريا",
  "ZA": "جنوب أفريقيا",
  "BR": "البرازيل",
  "CA": "كندا",
  "AU": "أستراليا",
  "RU": "روسيا",
  "CN": "الصين",
  "JP": "اليابان",
  "KR": "كوريا الجنوبية",
};

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
    
    // جيب الدولة من Vercel أولاً (أفضل)
    const countryCode = req.headers.get("x-vercel-ip-country") || 
                        req.headers.get("cf-ipcountry");
    
    // حوّل الكود لاسم الدولة
    let country = "Unknown";
    if (countryCode) {
      country = countryNames[countryCode] || countryCode;
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