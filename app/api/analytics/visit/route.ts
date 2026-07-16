import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const country = req.headers.get("cf-ipcountry") || "unknown";
    const page = req.nextUrl.pathname;

    const visit = await prisma.visit.create({
      data: {
        ip,
        country,
        page,
      },
    });

    return NextResponse.json({ success: true, visit });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to log visit" }, { status: 500 });
  }
}