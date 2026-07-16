import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalVisits = await prisma.visit.count();
    const monthVisits = await prisma.visit.count({ 
      where: { createdAt: { gte: startOfMonth } } 
    });
    const todayVisits = await prisma.visit.count({ 
      where: { createdAt: { gte: startOfDay } } 
    });
    
    // Unique IPs
    const uniqueIPs = await prisma.visit.groupBy({ 
      by: ["ip"], 
      _count: { ip: true } 
    });
    
    // Countries — نجمع الصحيحة فقط
    const countries = await prisma.visit.groupBy({ 
      by: ["country"], 
      _count: { country: true } 
    });

    const totalUsers = await prisma.user.count();
    const newUsers = await prisma.user.count({ 
      where: { createdAt: { gte: startOfMonth } } 
    });
    const totalResearches = await prisma.researchRun.count();
    const completedResearches = await prisma.researchRun.count({ 
      where: { status: "COMPLETED" } 
    });

    return NextResponse.json({
      totalVisits,
      monthVisits,
      todayVisits,
      uniqueVisits: uniqueIPs.length,
      countries: countries.filter(c => c.country && c.country !== "Unknown"),
      totalUsers,
      newUsers,
      totalResearches,
      completedResearches,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}